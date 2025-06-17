import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

interface WaitlistUser {
  name: string;
  email: string;
  userType: string;
  joinedAt: string;
}

const LOCK_FILE = "waitlist.lock";
const MAX_RETRIES = 5;
const RETRY_DELAY = 300; // 300ms

async function acquireLock() {
  console.log("Attempting to acquire lock...");
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await put(LOCK_FILE, "", {
        access: "public",
        addRandomSuffix: false,
        contentType: "text/plain",
      });
      console.log("Lock acquired successfully.");
      return true;
    } catch (error) {
      if ((error as { status?: number })?.status === 409) {
        console.log(`Lock conflict. Retrying... (Attempt ${i + 1})`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error("Error acquiring lock:", error);
        throw error;
      }
    }
  }
  console.log("Failed to acquire lock after multiple retries.");
  return false;
}

async function releaseLock() {
  try {
    console.log("Releasing lock...");
    await del(LOCK_FILE);
    console.log("Lock released successfully.");
  } catch (error) {
    console.error("Failed to release lock:", error);
  }
}

export async function POST(request: Request) {
  console.log("POST /api/waitlist request received.");
  const lockAcquired = await acquireLock();
  if (!lockAcquired) {
    console.error("Could not acquire lock, returning 503.");
    return new NextResponse(
      JSON.stringify({
        message: "Server is busy, please try again later.",
      }),
      { status: 503 }
    );
  }

  try {
    console.log("Processing waitlist request.");
    const data = await request.json();
    const { name, email, userType } = data;

    if (!name || !email || !userType) {
      console.error("Request missing required fields.");
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }
    console.log(`Received data for user: ${email}`);

    let waitlist: WaitlistUser[] = [];
    try {
      console.log("Checking for existing waitlist.json blob.");
      const blobList = await list({ prefix: "waitlist.json", limit: 1 });
      if (blobList.blobs.length > 0) {
        const waitlistBlob = blobList.blobs[0];
        console.log(`Found waitlist.json, URL: ${waitlistBlob.url}`);
        const response = await fetch(waitlistBlob.url, { cache: "no-store" });
        if (response.ok) {
          const content = await response.text();
          if (content) {
            console.log("Parsing waitlist content.");
            waitlist = JSON.parse(content);
            console.log(
              `Successfully parsed waitlist. Current count: ${waitlist.length}`
            );
          } else {
            console.log("waitlist.json is empty. Initializing new list.");
          }
        } else {
          console.error(
            "Failed to fetch waitlist blob content, status:",
            response.status
          );
        }
      } else {
        console.log("No waitlist.json found. Initializing new list.");
      }
    } catch (error) {
      console.error(
        "Error retrieving or parsing waitlist from Vercel Blob:",
        error
      );
    }

    const newUser = {
      name,
      email,
      userType,
      joinedAt: new Date().toISOString(),
    };

    if (!Array.isArray(waitlist)) {
      console.warn(
        "Retrieved waitlist data is not an array. Resetting to a new array with the current user."
      );
      waitlist = [newUser];
    } else {
      waitlist.push(newUser);
    }
    console.log(`New waitlist count: ${waitlist.length}`);

    console.log("Uploading updated waitlist.json.");
    await put("waitlist.json", JSON.stringify(waitlist, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    console.log("Successfully uploaded waitlist.json.");

    return new NextResponse(
      JSON.stringify({ message: "Successfully joined waitlist" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred in POST handler:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await releaseLock();
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