import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

interface WaitlistUser {
  name: string;
  email: string;
  userType: string;
  joinedAt: string;
}

const LOCK_FILE = "waitlist.lock";
const WAITLIST_FILE = "waitlist.json";
const MAX_RETRIES = 5;
const RETRY_DELAY = 300; // 300ms
const LOCK_TIMEOUT_MS = 10000; // 10 seconds

interface LockData {
  timestamp: number;
  id: string;
}

interface WaitlistOperationResult {
  success: boolean;
  data?: WaitlistUser[];
  error?: string;
}

async function readWaitlistFile(): Promise<WaitlistOperationResult> {
  try {
    console.log("Attempting to read waitlist.json...");
    const blobList = await list({ prefix: WAITLIST_FILE, limit: 1 });
    
    if (blobList.blobs.length === 0) {
      console.log("No waitlist.json found, returning empty array");
      return { success: true, data: [] };
    }

    const waitlistBlob = blobList.blobs[0];
    console.log(`Found waitlist.json, URL: ${waitlistBlob.url}`);
    
    const response = await fetch(waitlistBlob.url, { cache: "no-store" });
    if (!response.ok) {
      return { 
        success: false, 
        error: `Failed to fetch waitlist blob: ${response.status} ${response.statusText}` 
      };
    }

    const content = await response.text();
    if (!content.trim()) {
      console.log("waitlist.json is empty, returning empty array");
      return { success: true, data: [] };
    }

    const waitlist = JSON.parse(content);
    if (!Array.isArray(waitlist)) {
      return { 
        success: false, 
        error: "Waitlist data is corrupted (not an array)" 
      };
    }

    console.log(`Successfully read waitlist with ${waitlist.length} entries`);
    return { success: true, data: waitlist };
  } catch (error) {
    console.error("Error reading waitlist file:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error reading waitlist" 
    };
  }
}

async function writeWaitlistFile(waitlist: WaitlistUser[]): Promise<WaitlistOperationResult> {
  try {
    console.log(`Attempting to write ${waitlist.length} entries to waitlist.json...`);
    await put(WAITLIST_FILE, JSON.stringify(waitlist, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    console.log("Successfully wrote waitlist.json");
    return { success: true, data: waitlist };
  } catch (error) {
    console.error("Error writing waitlist file:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error writing waitlist" 
    };
  }
}

async function checkLockAge(): Promise<boolean> {
  try {
    const blobList = await list({ prefix: LOCK_FILE, limit: 1 });
    if (blobList.blobs.length === 0) return false;

    const lockBlob = blobList.blobs[0];
    const response = await fetch(lockBlob.url, { cache: "no-store" });
    if (!response.ok) return false;

    const lockData = await response.json() as LockData;
    const age = Date.now() - lockData.timestamp;
    console.log(`Lock age: ${age}ms`);
    
    return age > LOCK_TIMEOUT_MS;
  } catch (error) {
    console.error("Error checking lock age:", error);
    return false;
  }
}

async function acquireLock(): Promise<{ success: boolean; lockId?: string }> {
  console.log("Attempting to acquire lock...");
  const lockId = Math.random().toString(36).substring(2);

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // Check if lock file exists
      const blobList = await list({ prefix: LOCK_FILE, limit: 1 });
      let canCreateLock = true;
      if (blobList.blobs.length > 0) {
        // Lock file exists, check if it's stale
        const lockBlob = blobList.blobs[0];
        const response = await fetch(lockBlob.url, { cache: "no-store" });
        if (response.ok) {
          const lockData = await response.json() as LockData;
          const age = Date.now() - lockData.timestamp;
          console.log(`Lock file exists. Age: ${age}ms`);
          if (age > LOCK_TIMEOUT_MS) {
            console.log("Found stale lock, attempting to remove it...");
            await del(LOCK_FILE);
          } else {
            // Lock is not stale, wait and retry
            console.log(`Lock is not stale. Retrying in ${RETRY_DELAY}ms (Attempt ${i + 1})`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            canCreateLock = false;
          }
        } else {
          // Could not fetch lock blob, treat as if we can try to create
          console.log("Could not fetch lock blob, proceeding to create lock.");
        }
      }
      if (!canCreateLock) continue;

      const lockData: LockData = {
        timestamp: Date.now(),
        id: lockId
      };

      await put(LOCK_FILE, JSON.stringify(lockData), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        allowOverwrite: false, // Explicitly do not overwrite
      });
      console.log(`Lock acquired successfully with ID: ${lockId}`);
      return { success: true, lockId };
    } catch (error: any) {
      // Vercel Blob returns status 409 for already exists
      if (error?.status === 409 || (error?.message && error.message.includes('already exists'))) {
        console.log(`Lock conflict (409). Retrying in ${RETRY_DELAY}ms (Attempt ${i + 1})`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error("Error acquiring lock:", error);
        throw error;
      }
    }
  }
  console.log("Failed to acquire lock after multiple retries.");
  return { success: false };
}

async function releaseLock(lockId: string) {
  try {
    console.log(`Attempting to release lock with ID: ${lockId}`);
    
    // Verify we own the lock before releasing
    const blobList = await list({ prefix: LOCK_FILE, limit: 1 });
    if (blobList.blobs.length > 0) {
      const lockBlob = blobList.blobs[0];
      const response = await fetch(lockBlob.url, { cache: "no-store" });
      if (response.ok) {
        const lockData = await response.json() as LockData;
        if (lockData.id !== lockId) {
          console.log("Lock ID mismatch, not releasing lock");
          return;
        }
      }
    }
    
    const result = await del(LOCK_FILE);
    console.log("Lock deletion result:", result);
    console.log("Lock released successfully.");
  } catch (error) {
    console.error("Failed to release lock:", error);
    throw error; // Propagate the error for better error handling
  }
}

export async function POST(request: Request) {
  console.log("POST /api/waitlist request received.");
  const { success, lockId } = await acquireLock();
  if (!success) {
    console.error("Could not acquire lock, returning 503.");
    return new NextResponse(
      JSON.stringify({
        message: "Server is busy, please try again later.",
        error: "Failed to acquire lock"
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    console.log("Processing waitlist request.");
    const data = await request.json();
    const { name, email, userType } = data;

    if (!name || !email || !userType) {
      console.error("Request missing required fields:", { name, email, userType });
      return new NextResponse(
        JSON.stringify({ 
          message: "Missing required fields",
          details: {
            name: !name ? "missing" : "ok",
            email: !email ? "missing" : "ok",
            userType: !userType ? "missing" : "ok"
          }
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log(`Received data for user: ${email}`);

    const readResult = await readWaitlistFile();
    if (!readResult.success) {
      throw new Error(`Failed to read waitlist: ${readResult.error}`);
    }

    const waitlist = readResult.data!;
    const newUser = {
      name,
      email,
      userType,
      joinedAt: new Date().toISOString(),
    };

    waitlist.push(newUser);
    console.log(`New waitlist count: ${waitlist.length}`);

    const writeResult = await writeWaitlistFile(waitlist);
    if (!writeResult.success) {
      throw new Error(`Failed to write waitlist: ${writeResult.error}`);
    }

    return new NextResponse(
      JSON.stringify({ 
        message: "Successfully joined waitlist",
        position: waitlist.length 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("An unexpected error occurred in POST handler:", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (lockId) {
      try {
        await releaseLock(lockId);
      } catch (error) {
        console.error("Failed to release lock in finally block:", error);
      }
    }
  }
}

// Admin endpoint to force-delete the lock file
export async function DELETE(request: Request) {
  try {
    // Basic auth check - you should replace this with proper auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Force-deleting lock file...");
    await del(LOCK_FILE);
    
    return new NextResponse(
      JSON.stringify({ message: "Lock file deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error force-deleting lock:", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Failed to delete lock",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    const blobList = await list({ prefix: "waitlist.json", limit: 1 });
    if (blobList.blobs.length === 0) {
      return new NextResponse(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const waitlistBlob = blobList.blobs[0];
    const response = await fetch(waitlistBlob.url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to fetch waitlist: ${response.statusText}`);
    }

    const waitlist = await response.json();

    return new NextResponse(JSON.stringify(waitlist), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function HEAD() {
  try {
    const blobList = await list({ prefix: LOCK_FILE, limit: 1 });
    if (blobList.blobs.length === 0) {
      return new NextResponse(null, { status: 404 });
    }

    const lockBlob = blobList.blobs[0];
    const response = await fetch(lockBlob.url, { cache: "no-store" });
    if (!response.ok) {
      return new NextResponse(null, { status: 500 });
    }

    const lockData = await response.json() as LockData;
    const age = Date.now() - lockData.timestamp;
    
    return new NextResponse(null, { 
      status: 200,
      headers: { 
        'X-Lock-Age': age.toString(),
        'X-Lock-Id': lockData.id
      }
    });
  } catch (error) {
    console.error("Error checking lock status:", error);
    return new NextResponse(null, { status: 500 });
  }
} 