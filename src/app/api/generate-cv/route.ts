import { NextRequest, NextResponse } from "next/server";
import { isApproved } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, formData: f } = await req.json();

    if (!await isApproved(sessionId)) {
      return NextResponse.json({ error: "Pagamento não confirmado" }, { status: 402 });
    }
    if (!f) return NextResponse.json({ error: "Dados não encontrados" }, { status: 400 });

    if (process.env.ANTHROPIC_API_KEY) {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const prompt = `Você é especialista em RH brasileiro. Melhore os dados abaixo para um currículo profissional.
Retorne APENAS JSON válido, sem markdown, sem explicações.
Dados: Nome: ${f.nome}, Tel: ${f.telefone}, Email: ${f.email || ""}, Cidade: ${f.cidade || ""}, Objetivo: ${f.objetivo || ""}
Experiências: ${JSON.stringify(f.experiencias)}, Formação: ${JSON.stringify(f.formacao)}, Habilidades: ${JSON.stringify(f.habilidades)}
Formato de retorno:
{"nome":"","telefone":"","email":"","cidade":"","objetivo":"string profissional 2-3 linhas","experiencias":[{"empresa":"","cargo":"","periodo":"","descricao":""}],"formacao":[{"instituicao":"","curso":"","ano":""}],"habilidades":[{"nome":"","nivel":"basico|intermediario|avancado"}]}`;
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });
      const text = message.content[0].type === "text" ? message.content[0].text : "";
      const cvData = JSON.parse(text.replace(/```json|```/g, "").trim());
      return NextResponse.json({ cvData });
    }

    // Sem API — usa dados diretos
    const cvData = {
      nome: f.nome, telefone: f.telefone, email: f.email || "",
      cidade: f.cidade || "", objetivo: f.objetivo || "Profissional buscando oportunidade de crescimento e desenvolvimento.",
      experiencias: (f.experiencias || []).filter((e: any) => e.empresa),
      formacao: (f.formacao || []).filter((fm: any) => fm.curso || fm.grau),
      habilidades: Array.isArray(f.habilidades) ? f.habilidades.filter((h: any) => h.nome) : [],
    };
    return NextResponse.json({ cvData });
  } catch (error) {
    console.error("Erro ao gerar currículo:", error);
    return NextResponse.json({ error: "Erro ao gerar currículo" }, { status: 500 });
  }
}
