import { NextRequest, NextResponse } from "next/server";
import { savePayment, approvePayment } from "@/lib/storage";
import { randomUUID } from "crypto";

// Rota de teste — só funciona quando TEST_MODE=true nas variáveis de ambiente
// NUNCA deixe isso ativo em produção sem a variável de controle

export async function POST(req: NextRequest) {
  if (process.env.TEST_MODE !== "true") {
    return NextResponse.json({ error: "Não disponível" }, { status: 403 });
  }

  const formData = await req.json();
  const sessionId = randomUUID();

  savePayment(sessionId, formData);
  approvePayment(sessionId); // Aprova na hora sem pagamento

  return NextResponse.json({ sessionId, approved: true });
}
