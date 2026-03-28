import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const sessionId = randomUUID();
    // FormData fica no cliente — servidor não precisa armazenar
    const baseUrl = process.env.KIWIFY_CHECKOUT_URL || "https://pay.kiwify.com.br/ozv3KzP";
    const checkoutUrl = `${baseUrl}?passthrough=${sessionId}`;
    return NextResponse.json({ sessionId, checkoutUrl });
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    return NextResponse.json({ error: "Erro ao criar sessão" }, { status: 500 });
  }
}
