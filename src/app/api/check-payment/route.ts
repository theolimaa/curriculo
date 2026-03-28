import { NextRequest, NextResponse } from "next/server";
import { isApprovedByEmail } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ approved: false });
  const approved = await isApprovedByEmail(email);
  return NextResponse.json({ approved });
}
