import { NextRequest, NextResponse } from "next/server";
import MercadoPago from "mercadopago";
import { savePayment } from "@/lib/storage";

const client = new MercadoPago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    const payment = new MercadoPago.Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: 4.9,
        description: "Currículo Profissional com IA",
        payment_method_id: "pix",
        payer: {
          email: formData.email || "cliente@curriculo-ia.com",
          first_name: formData.nome?.split(" ")[0] || "Cliente",
          last_name: formData.nome?.split(" ").slice(1).join(" ") || "",
        },
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
      },
    });

    const paymentId = String(result.id);
    const pixData = result.point_of_interaction?.transaction_data;

    // Salva os dados do formulário associados ao pagamento
    savePayment(paymentId, formData);

    return NextResponse.json({
      paymentId,
      pixQrCode: pixData?.qr_code_base64,
      pixCopyPaste: pixData?.qr_code,
    });
  } catch (error: any) {
    console.error("Erro ao criar pagamento:", error);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
