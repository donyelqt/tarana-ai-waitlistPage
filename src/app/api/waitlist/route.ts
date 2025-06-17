import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

const LOCK_FILE = "waitlist.lock";
const MAX_RETRIES = 5;
const RETRY_DELAY = 300; // 300ms

async function acquireLock() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await put(LOCK_FILE, "", {
        access: "public",
        addRandomSuffix: false,
        contentType: "text/plain",
      });
      return true;
    } catch (error: any) {
      if (error.status === 409) {
        // Conflict, lock exists
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw error;
      }
    }
  }
  return false;
}

async function releaseLock() {
  try {
    await del(`${process.env.BLOB_URL}/${LOCK_FILE}`);
  } catch (error) {
    console.error("Failed to release lock:", error);
  }
}

export async function POST(request: Request) {
  const lockAcquired = await acquireLock();
  if (!lockAcquired) {
    return new NextResponse(
      JSON.stringify({
        message: "Server is busy, please try again later.",
      }),
      { status: 503 }
    );
  }

  try {
    const data = await request.json();
    const { name, email, userType } = data;

    if (!name || !email || !userType) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    let waitlist: any[] = [];
    try {
      const blobList = await list({ prefix: "waitlist.json", limit: 1 });
      if (blobList.blobs.length > 0) {
        const waitlistBlob = blobList.blobs[0];
        const response = await fetch(waitlistBlob.url, { cache: "no-store" });
        if (response.ok) {
          const content = await response.text();
          if (content) {
            waitlist = JSON.parse(content);
          }
        } else {
          console.error(
            "Failed to fetch waitlist blob content, status:",
            response.status
          );
        }
      }
    } catch (error) {
      console.error("Error retrieving waitlist from Vercel Blob:", error);
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

    await put("waitlist.json", JSON.stringify(waitlist, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return new NextResponse(
      JSON.stringify({ message: "Successfully joined waitlist" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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