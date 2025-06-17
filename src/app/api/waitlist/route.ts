import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, userType } = data;

    if (!name || !email || !userType) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    let waitlist = [];
    try {
      const blobList = await list({ prefix: "waitlist.json", limit: 1 });
      if (blobList.blobs.length > 0) {
        const waitlistBlob = blobList.blobs[0];
        const response = await fetch(waitlistBlob.url);
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
    const response = await fetch(waitlistBlob.url);

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