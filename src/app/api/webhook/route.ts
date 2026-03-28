import { NextRequest, NextResponse } from "next/server";
import { approveByEmail } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = body?.order || body;
    const status = order?.order_status;
    const email = order?.Customer?.email;

    console.log("Webhook:", { status, email });

    if (status === "paid" && email) {
      await approveByEmail(email);
      console.log(`✅ Aprovado: ${email}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook erro:", error);
    return NextResponse.json({ ok: true });
  }
}
