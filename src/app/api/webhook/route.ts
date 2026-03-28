import { NextRequest, NextResponse } from "next/server";
import { approvePayment } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get("x-kiwify-token") 
      || req.nextUrl.searchParams.get("token")
      || body?.token;
    const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;

    // Só bloqueia se tiver token configurado E vier errado
    if (expectedToken && token && token !== expectedToken) {
      console.warn("Webhook token inválido:", token);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = body?.order_status;
    const sessionId = body?.passthrough || body?.order?.passthrough;

    console.log("Webhook recebido:", { status, sessionId, token });

    if (!sessionId) {
      console.log("Sem sessionId no body:", JSON.stringify(body).slice(0, 200));
      return NextResponse.json({ ok: true });
    }

    if (status === "paid") {
      await approvePayment(sessionId);
      console.log(`✅ Aprovado: ${sessionId}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
