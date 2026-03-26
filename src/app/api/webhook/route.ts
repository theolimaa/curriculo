import { NextRequest, NextResponse } from "next/server";
import MercadoPago from "mercadopago";
import { approvePayment } from "@/lib/storage";

const client = new MercadoPago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mercado Pago envia notificações de vários tipos
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = String(body.data?.id);

    // Consulta o status real do pagamento
    const paymentAPI = new MercadoPago.Payment(client);
    const result = await paymentAPI.get({ id: paymentId });

    if (result.status === "approved") {
      approvePayment(paymentId);
      console.log(`✅ Pagamento aprovado: ${paymentId}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
