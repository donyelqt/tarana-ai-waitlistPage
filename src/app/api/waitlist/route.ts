import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const jsonFilePath = path.resolve(process.cwd(), "waitlist.json");

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
      const fileContent = await fs.readFile(jsonFilePath, "utf-8");
      waitlist = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist, it's fine, we'll create it.
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error("Error reading waitlist file:", error);
        throw error;
      }
    }

    waitlist.push({
      name,
      email,
      userType,
      joinedAt: new Date().toISOString(),
    });

    await fs.writeFile(jsonFilePath, JSON.stringify(waitlist, null, 2));

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