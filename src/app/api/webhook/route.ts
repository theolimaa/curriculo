import { NextRequest, NextResponse } from "next/server";
import { approvePayment } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const status = body?.order_status;
    const sessionId = body?.passthrough || body?.order?.passthrough;
    console.log("Webhook FULL body:", JSON.stringify(body));
    console.log("status:", status, "sessionId:", sessionId);
    if (sessionId && status === "paid") {
      await approvePayment(sessionId);
      console.log("✅ APROVADO:", sessionId);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook erro:", error);
    return NextResponse.json({ ok: true });
  }
}
