import { NextRequest, NextResponse } from "next/server";
import { isApproved } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json({ error: "paymentId obrigatório" }, { status: 400 });
  }

  return NextResponse.json({ approved: isApproved(paymentId) });
}
