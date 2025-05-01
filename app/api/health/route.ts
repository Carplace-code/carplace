import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("Health check endpoint hit from:", request.headers.get("user-agent"));
  return NextResponse.json({ status: "ok" });
}
