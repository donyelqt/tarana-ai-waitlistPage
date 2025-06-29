import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, userType } = await request.json();

  if (!name || !email || !userType) {
    return new NextResponse(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
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