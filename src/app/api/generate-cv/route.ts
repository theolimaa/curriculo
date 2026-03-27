import { NextRequest, NextResponse } from "next/server";
import { isApproved, getPayment } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!isApproved(sessionId)) {
      return NextResponse.json({ error: "Pagamento não confirmado" }, { status: 402 });
    }

    const payment = getPayment(sessionId);
    if (!payment) {
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
    }

    const f = payment.formData;

    // Se tiver chave da Anthropic, usa a IA para melhorar os textos
    if (process.env.ANTHROPIC_API_KEY) {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const prompt = `
Você é um especialista em RH brasileiro. Melhore e profissionalize os dados abaixo para um currículo.
Retorne APENAS um JSON válido, sem markdown, sem explicações.

Dados:
- Nome: ${f.nome}
- Telefone: ${f.telefone}
- Email: ${f.email || ""}
- Cidade: ${f.cidade || ""}
- Objetivo: ${f.objetivo || ""}
- Habilidades: ${f.habilidades || ""}
- Experiências: ${JSON.stringify(f.experiencias)}
- Formação: ${JSON.stringify(f.formacao)}

Formato de retorno:
{
  "nome": "string",
  "telefone": "string",
  "email": "string",
  "cidade": "string",
  "objetivo": "string (reescreva de forma profissional, 2-3 linhas)",
  "experiencias": [{ "empresa": "string", "cargo": "string", "periodo": "string", "descricao": "string" }],
  "formacao": [{ "instituicao": "string", "curso": "string", "ano": "string" }],
  "habilidades": "string"
}`;

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";
      const clean = text.replace(/```json|```/g, "").trim();
      const cvData = JSON.parse(clean);
      return NextResponse.json({ cvData });
    }

    // Sem chave da API — usa os dados como vieram (modo teste)
    const cvData = {
      nome: f.nome,
      telefone: f.telefone,
      email: f.email || "",
      cidade: f.cidade || "",
      objetivo: f.objetivo || `Profissional com experiência na área, buscando oportunidade de crescimento e desenvolvimento em empresa de destaque no mercado.`,
      experiencias: (f.experiencias || []).filter((e: any) => e.empresa),
      formacao: (f.formacao || []).filter((fm: any) => fm.curso),
      habilidades: Array.isArray(f.habilidades) ? f.habilidades.filter((h: any) => h.nome) : (f.habilidades ? [{ nome: f.habilidades, nivel: "intermediario" }] : []),
    };

    return NextResponse.json({ cvData });
  } catch (error) {
    console.error("Erro ao gerar currículo:", error);
    return NextResponse.json({ error: "Erro ao gerar currículo" }, { status: 500 });
  }
}
