import { NextRequest, NextResponse } from "next/server";
import { approvePayment } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    // Valida o token da Kiwify
    const token = req.headers.get("x-kiwify-token") || req.nextUrl.searchParams.get("token");
    const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;

    if (expectedToken && token !== expectedToken) {
      console.warn("Webhook com token inválido:", token);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const status = body?.order_status;
    const sessionId = body?.passthrough || body?.order?.passthrough;

    if (!sessionId) {
      console.log("Webhook sem sessionId:", JSON.stringify(body));
      return NextResponse.json({ ok: true });
    }

    if (status === "paid") {
      approvePayment(sessionId);
      console.log(`✅ Pagamento Kiwify aprovado: ${sessionId}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro no webhook Kiwify:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
