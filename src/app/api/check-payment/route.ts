import { NextRequest, NextResponse } from "next/server";
import { isApproved } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ approved: false });
  const approved = await isApproved(sessionId);
  return NextResponse.json({ approved });
}
