import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isApproved, getPayment } from "@/lib/storage";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json();

    // Verifica se o pagamento foi aprovado
    if (!isApproved(paymentId)) {
      return NextResponse.json({ error: "Pagamento não confirmado" }, { status: 402 });
    }

    const payment = getPayment(paymentId);
    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
    }

    const formData = payment.formData;

    // Monta o prompt para o Claude
    const prompt = `
Você é um especialista em RH brasileiro. Melhore e profissionalize os dados abaixo para um currículo.
Retorne APENAS um JSON válido, sem markdown, sem explicações.

Dados do candidato:
- Nome: ${formData.nome}
- Telefone: ${formData.telefone}
- Email: ${formData.email || "não informado"}
- Cidade: ${formData.cidade || "não informada"}
- Objetivo declarado: ${formData.objetivo || "não informado"}
- Habilidades: ${formData.habilidades || "não informadas"}
- Experiências: ${JSON.stringify(formData.experiencias)}
- Formação: ${JSON.stringify(formData.formacao)}

Retorne no formato:
{
  "nome": "string",
  "telefone": "string",
  "email": "string",
  "cidade": "string",
  "objetivo": "string (reescreva de forma profissional, 2-3 linhas)",
  "experiencias": [
    {
      "empresa": "string",
      "cargo": "string",
      "periodo": "string",
      "descricao": "string (reescreva as atividades de forma profissional)"
    }
  ],
  "formacao": [
    {
      "instituicao": "string",
      "curso": "string",
      "ano": "string"
    }
  ],
  "habilidades": "string (liste de forma clara e profissional)"
}
`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Remove possíveis backticks do JSON
    const clean = text.replace(/```json|```/g, "").trim();
    const cvData = JSON.parse(clean);

    return NextResponse.json({ cvData });
  } catch (error: any) {
    console.error("Erro ao gerar currículo:", error);
    return NextResponse.json({ error: "Erro ao gerar currículo" }, { status: 500 });
  }
}
