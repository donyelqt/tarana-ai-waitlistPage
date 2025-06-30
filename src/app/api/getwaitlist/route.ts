import { NextResponse } from "next/server";
import { put, head } from "@vercel/blob";
import { convertToCsv } from "@/lib/utils";

export async function POST(request: Request) {
  const { name, email, userType } = await request.json();

  if (!name || !email || !userType) {
    return new NextResponse(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const blobPath = "waitlist.json";
  let waitlist = [];

  try {
    // Check if the blob exists and get its content
    const blobInfo = await head(blobPath);
    const blobContent = await fetch(blobInfo.url);
    waitlist = await blobContent.json();
  } catch (error: unknown) {
    // A 404 error means the blob doesn't exist yet, which is fine.
    // We'll proceed with an empty array.
    const status =
      error && typeof error === "object" && "status" in error
        ? (error as { status: unknown }).status
        : undefined;

    if (status !== 404) {
      console.error("Error fetching existing blob:", error);
      // If it's another error, we might want to stop.
      return new NextResponse(
        JSON.stringify({ message: "Could not access waitlist storage." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Add the new user to the list
  waitlist.push({
    name,
    email,
    userType,
    joinedAt: new Date().toISOString(),
  });

  try {
    // Upload the updated waitlist back to Vercel Blob
    const blob = await put(blobPath, JSON.stringify(waitlist, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });
    console.log("Blob updated at:", blob.url);

    // Also upload as CSV
    const csvData = convertToCsv(waitlist);
    const csvBlob = await put("waitlist.csv", csvData, {
      access: "public",
      contentType: "text/csv",
      allowOverwrite: true,
    });
    console.log("CSV Blob updated at:", csvBlob.url);
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return new NextResponse(
      JSON.stringify({ message: "Could not update waitlist." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const waitlistId = process.env.GETWAITLIST_WAITLIST_ID;

  if (!waitlistId) {
    console.error("GETWAITLIST_WAITLIST_ID environment variable is not set.");
    return new NextResponse(
      JSON.stringify({ message: "Server configuration error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await fetch(
      `https://api.getwaitlist.com/api/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          waitlist_id: parseInt(waitlistId, 10),
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const contentType = response.headers.get("content-type");
      let errorData;
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        errorData = { message: "Unexpected error from GetWaitlist API.", details: text };
      }
      console.error("GetWaitlist API error:", errorData);
      return new NextResponse(JSON.stringify(errorData), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("An error occurred while contacting GetWaitlist:", error);
    return new NextResponse(
      JSON.stringify({
        message: "An unexpected error occurred.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 