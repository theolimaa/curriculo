"use client";

import { useState, useEffect, useRef } from "react";
import { FormData, CVData } from "@/lib/types";
import { generatePDF } from "@/lib/generatePDF";

const RED = "#d0290a";
const DARK = "#111111";
const CREAM = "#f5f0eb";

type Step = "form" | "payment" | "loading" | "edit" | "download";

const emptyForm: FormData = {
  nome: "", telefone: "", email: "", cidade: "", objetivo: "",
  experiencias: [{ empresa: "", cargo: "", periodo: "", descricao: "" }],
  formacao: [{ instituicao: "", curso: "", grau: "", periodoInicio: "", periodoFim: "", presente: false, descricao: "" }],
  habilidades: [{ nome: "", nivel: "intermediario" as "basico" | "intermediario" | "avancado" }],
  estilo: "vermelho" as "vermelho" | "azul" | "verde" | "preto",
};

export default function Formulario() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [semExperiencia, setSemExperiencia] = useState(false);
  const [cropModal, setCropModal] = useState(false);
  const [cropOffset, setCropOffset] = useState({ x: 50, y: 50 });
  const [cropZoom, setCropZoom] = useState(100);
  const [error, setError] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (step !== "payment" || !sessionId) return;
    pollingRef.current = setInterval(async () => {
      const res = await fetch(`/api/check-payment?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.approved) { clearInterval(pollingRef.current!); handleGenerateCV(sessionId); }
    }, 5000);
    return () => clearInterval(pollingRef.current!);
  }, [step, sessionId]);

  const handleSubmitForm = async () => {
    if (!formData.nome || !formData.telefone) { setError("Preencha seu nome e telefone!"); return; }
    setError("");
    try {
      const res = await fetch("/api/create-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSessionId(data.sessionId);
      setCheckoutUrl(data.checkoutUrl);
      setStep("payment");
    } catch { setError("Erro ao iniciar pagamento. Tente novamente."); }
  };

  // Recover from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("curriculo_cv");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nome) {
          setCvData(parsed);
          setStep("edit");
        }
      }
    } catch {}
  }, []);

  // Warn before leaving when on edit/download step
  useEffect(() => {
    if (step !== "edit" && step !== "download") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [step]);

  const handleGenerateCV = async (sid?: string) => {
    const id = sid || sessionId;
    setStep("loading");
    try {
      // Envia formData junto — servidor não precisa armazenar
      const payload = { sessionId: id, formData };
      const res = await fetch("/api/generate-cv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const cv = { ...data.cvData, foto: formData.foto, estilo: formData.estilo, fotoOffset: cropOffset };
      setCvData(cv);
      try { localStorage.setItem("curriculo_cv", JSON.stringify(cv)); } catch {}
      setStep("edit");
    } catch { setError("Erro ao gerar currículo. Entre em contato."); setStep("payment"); }
  };


  const updateExp = (i: number, field: string, val: string) => {
    if (!cvData) return;
    const exps = [...cvData.experiencias]; (exps[i] as any)[field] = val;
    setCvData({ ...cvData, experiencias: exps });
  };

  const updateForm = (i: number, field: string, val: string) => {
    if (!cvData) return;
    const forms = [...cvData.formacao]; (forms[i] as any)[field] = val;
    setCvData({ ...cvData, formacao: forms });
  };

  const stepLabels = ["Dados", "Pagamento", "Revisar", "Baixar"];
  const stepIndex = { form: 0, payment: 1, loading: 2, edit: 2, download: 3 }[step];

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", minHeight: "100vh", background: CREAM, color: DARK }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .field input, .field textarea { width: 100%; padding: 12px 14px; border: 1.5px solid #ddd; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 15px; color: ${DARK}; background: #fff; transition: border-color 0.2s; }
        .field input:focus, .field textarea:focus { outline: none; border-color: ${RED}; }
        .field textarea { resize: vertical; min-height: 80px; }
        .field label { display: block; font-size: 12px; font-weight: 800; color: #555; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
        .btn-main { width: 100%; padding: 16px; background: ${DARK}; color: #fff; border: 2px solid ${DARK}; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 16px; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; }
        .btn-main:hover { background: ${RED}; border-color: ${RED}; transform: translateY(-1px); }
        .btn-ghost { width: 100%; padding: 12px; background: transparent; color: #888; border: 1.5px dashed #ccc; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-ghost:hover { border-color: ${RED}; color: ${RED}; }
        .btn-kiwify { width: 100%; padding: 18px; background: ${RED}; color: #fff; border: 2px solid ${RED}; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 17px; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; text-decoration: none; display: block; text-align: center; }
        .btn-kiwify:hover { background: #b02008; border-color: #b02008; transform: translateY(-1px); }
        .btn-secondary { width: 100%; padding: 13px; background: transparent; color: #aaa; border: 1.5px solid #ddd; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; margin-top: 10px; }
        .btn-secondary:hover { border-color: ${DARK}; color: ${DARK}; }
        .btn-test { width: 100%; padding: 13px; background: transparent; color: #f59e0b; border: 1.5px solid #f59e0b; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; margin-top: 10px; }
        .btn-test:hover { background: #f59e0b; color: #fff; }
        .upsell-btn { width: 100%; padding: 14px; background: #f59e0b; border: none; border-radius: 4px; color: #fff; font-weight: 900; cursor: pointer; font-size: 15px; font-family: 'Barlow', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; }
        .upsell-btn:hover { background: #d97706; transform: translateY(-1px); }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 80px; gap: 12px; }
        .hab-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; margin-bottom: 10px; }
        .hab-nivels { display: flex; gap: 4px; }
        .foto-row { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 12px; }
        .foto-fields { flex: 1; display: flex; flex-direction: column; gap: 12px; }
        .step-nav { display: flex; gap: 6px; align-items: center; }
        .step-label { display: inline; }
        @media (max-width: 600px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr 1fr !important; }
          .grid-3 .ano-field { grid-column: span 2; }
          .hab-row { grid-template-columns: 1fr !important; }
          .hab-nivels { justify-content: stretch; }
          .hab-nivels button { flex: 1; }
          .foto-row { flex-direction: column; align-items: center; }
          .foto-fields { width: 100%; }
          .step-label { display: none !important; }
          .step-nav { gap: 4px; }
        }
      `}</style>

      <nav style={{ background: CREAM, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${DARK}` }}>
        <a href="/" style={{ textDecoration: "none" }}><Logo /></a>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {stepLabels.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: stepIndex >= i ? RED : "#ddd", color: stepIndex >= i ? "#fff" : "#999", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, transition: "all 0.3s" }}>{i + 1}</div>
              <span className="step-label" style={{ color: stepIndex >= i ? DARK : "#aaa" }}>{label}</span>
              {i < 3 && <div style={{ width: "20px", height: "1.5px", background: "#ddd" }} />}
            </div>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {error && (
          <div style={{ background: "#fff0ee", border: `1.5px solid ${RED}`, borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", color: RED, fontSize: "14px", fontWeight: 700 }}>
            {error}
          </div>
        )}

        {step === "form" && (
          <div className="fade-up">
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 8px" }}>Seus dados</h1>
            <p style={{ color: "#888", fontSize: "15px", margin: "0 0 36px" }}>Preencha abaixo — nosso método monta tudo para você.</p>

            <SectionLabel>Informações Pessoais</SectionLabel>
            <div className="foto-row">
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontSize: "12px", fontWeight: 800, color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Foto (opcional)</p>
                <label style={{ cursor: "pointer", display: "block" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: `2px dashed ${formData.foto ? RED : "#ccc"}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: formData.foto ? "transparent" : "#fafafa" }}>
                    {formData.foto ? <img src={formData.foto} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${cropOffset.x}% ${cropOffset.y}%`, transform: `scale(${cropZoom/100})`, transformOrigin: `${cropOffset.x}% ${cropOffset.y}%` }} /> : (
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: "20px", marginBottom: "2px" }}>📷</div><div style={{ fontSize: "9px", color: "#aaa", fontWeight: 700, textTransform: "uppercase" }}>Enviar</div></div>
                    )}
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => setFormData({ ...formData, foto: ev.target?.result as string }); reader.readAsDataURL(file); }} />
                </label>
                {formData.foto && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
                    <button onClick={() => setFormData({ ...formData, foto: undefined })} style={{ width: "80px", background: "transparent", border: "none", color: "#aaa", fontSize: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, textTransform: "uppercase" }}>Remover</button>
                    <button onClick={() => setCropModal(true)} style={{ width: "80px", background: "transparent", border: `1px solid ${RED}`, borderRadius: "4px", color: RED, fontSize: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, textTransform: "uppercase", padding: "3px 0" }}>Ajustar</button>
                  </div>
                )}
              </div>
              <div className="foto-fields">
                <Field label="Nome completo *" value={formData.nome} onChange={(v) => setFormData({ ...formData, nome: v })} placeholder="Ex: Maria Silva" />
                <Field label="WhatsApp / Telefone *" value={formData.telefone} onChange={(v) => setFormData({ ...formData, telefone: v })} placeholder="(11) 99999-9999" />
              </div>
            </div>
            <div className="grid-2">
              <Field label="E-mail" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="email@gmail.com" />
              <Field label="Cidade / Estado" value={formData.cidade} onChange={(v) => setFormData({ ...formData, cidade: v })} placeholder="São Paulo - SP" />
            </div>
            <FieldArea label="Objetivo profissional (opcional)" value={formData.objetivo} onChange={(v) => setFormData({ ...formData, objetivo: v })} placeholder="Ex: Busco vaga como auxiliar administrativo..." />

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "28px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "1.5px", margin: 0 }}>Experiências Profissionais</p>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#888", fontWeight: 600 }}>
                <input type="checkbox" checked={semExperiencia} onChange={(e) => setSemExperiencia(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: RED, cursor: "pointer" }} />
                Sem experiência
              </label>
            </div>
            {!semExperiencia && (
              <>
                {formData.experiencias.map((exp, i) => (
                  <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${RED}`, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Experiência {i + 1}</p>
                      {formData.experiencias.length > 1 && (
                        <button onClick={() => { const e = formData.experiencias.filter((_, idx) => idx !== i); setFormData({ ...formData, experiencias: e }); }}
                          style={{ background: "transparent", border: "none", color: "#ccc", fontSize: "18px", cursor: "pointer", padding: "0 4px", lineHeight: 1, fontFamily: "inherit" }}>×</button>
                      )}
                    </div>
                    <div className="grid-2" style={{ marginBottom: "12px" }}>
                      <Field label="Empresa" value={exp.empresa} onChange={(v) => { const e = [...formData.experiencias]; e[i].empresa = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Nome da empresa" />
                      <Field label="Cargo" value={exp.cargo} onChange={(v) => { const e = [...formData.experiencias]; e[i].cargo = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Ex: Vendedor, Auxiliar..." />
                    </div>
                    <Field label="Período" value={exp.periodo} onChange={(v) => { const e = [...formData.experiencias]; e[i].periodo = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Jan/2022 - Dez/2023" />
                    <FieldArea label="O que você fazia?" value={exp.descricao} onChange={(v) => { const e = [...formData.experiencias]; e[i].descricao = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Descreva suas atividades..." />
                  </div>
                ))}
                <button className="btn-ghost" onClick={() => setFormData({ ...formData, experiencias: [...formData.experiencias, { empresa: "", cargo: "", periodo: "", descricao: "" }] })} style={{ marginBottom: "28px" }}>+ Adicionar experiência</button>
              </>
            )}

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "0 0 28px" }} />
            <SectionLabel>Formação Escolar</SectionLabel>
            {formData.formacao.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${DARK}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Formação {i + 1}</p>
                  {formData.formacao.length > 1 && (
                    <button onClick={() => { const fm = formData.formacao.filter((_, idx) => idx !== i); setFormData({ ...formData, formacao: fm }); }}
                      style={{ background: "transparent", border: "none", color: "#ccc", fontSize: "18px", cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>×</button>
                  )}
                </div>
                {/* Grau selector */}
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 800, color: "#555", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Grau</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {["Ensino Médio","Técnico","Superior Incompleto","Superior Completo","Pós-Graduação","MBA","Mestrado"].map((grau) => (
                      <button key={grau} type="button"
                        onClick={() => { const fm = [...formData.formacao]; fm[i].curso = grau; setFormData({ ...formData, formacao: fm }); }}
                        style={{ padding: "6px 12px", border: `1.5px solid ${f.curso === grau ? RED : "#ddd"}`, borderRadius: "4px", background: f.curso === grau ? RED : "#fff", color: f.curso === grau ? "#fff" : "#888", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                        {grau}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="Escola / Faculdade" value={f.instituicao} onChange={(v) => { const fm = [...formData.formacao]; fm[i].instituicao = v; setFormData({ ...formData, formacao: fm }); }} placeholder="Nome da instituição" />
                <Field label="Curso" value={(f as any).grau2 || ""} onChange={(v) => { const fm = [...formData.formacao]; (fm[i] as any).grau2 = v; setFormData({ ...formData, formacao: fm }); }} placeholder="Ex: Administração, Informática, Letras..." />
                <div className="grid-2">
                  <Field label="Início" value={(f as any).periodoInicio || ""} onChange={(v) => { const fm = [...formData.formacao]; (fm[i] as any).periodoInicio = v; setFormData({ ...formData, formacao: fm }); }} placeholder="2020" />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 800, color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Conclusão</p>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div className="field" style={{ flex: 1, margin: 0, opacity: (f as any).presente ? 0.4 : 1 }}>
                        <input value={(f as any).presente ? "" : ((f as any).periodoFim || "")} disabled={(f as any).presente} onChange={(e) => { const fm = [...formData.formacao]; (fm[i] as any).periodoFim = e.target.value; setFormData({ ...formData, formacao: fm }); }} placeholder="2024" />
                      </div>
                      <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", whiteSpace: "nowrap", fontSize: "12px", color: "#888", fontWeight: 700 }}>
                        <input type="checkbox" checked={(f as any).presente || false} onChange={(e) => { const fm = [...formData.formacao]; (fm[i] as any).presente = e.target.checked; setFormData({ ...formData, formacao: fm }); }} style={{ accentColor: RED, width: "14px", height: "14px" }} />
                        Presente
                      </label>
                    </div>
                  </div>
                </div>
                <FieldArea label="Atividades / descrição (opcional)" value={(f as any).descricao || ""} onChange={(v) => { const fm = [...formData.formacao]; (fm[i] as any).descricao = v; setFormData({ ...formData, formacao: fm }); }} placeholder="Ex: Cursando, principais disciplinas, projetos..." />
              </div>
            ))}
            <button className="btn-ghost" onClick={() => setFormData({ ...formData, formacao: [...formData.formacao, { instituicao: "", curso: "", grau: "", periodoInicio: "", periodoFim: "", presente: false, descricao: "" }] })} style={{ marginBottom: "8px" }}>+ Adicionar formação</button>

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "16px 0 28px" }} />
            <SectionLabel>Habilidades</SectionLabel>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "14px" }}>Adicione suas habilidades e escolha o nível de cada uma.</p>
            {formData.habilidades.map((hab, i) => (
              <div key={i} className="hab-row">
                <div className="field" style={{ margin: 0 }}>
                  <input value={hab.nome} onChange={(e) => { const h = [...formData.habilidades]; h[i].nome = e.target.value; setFormData({ ...formData, habilidades: h }); }} placeholder={`Ex: Pacote Office, Excel, Atendimento...`} />
                </div>
                <div className="hab-nivels">
                  {(["basico","intermediario","avancado"] as const).map((n) => (
                    <button key={n} type="button" onClick={() => { const h = [...formData.habilidades]; h[i].nivel = n; setFormData({ ...formData, habilidades: h }); }}
                      style={{ padding: "8px 10px", border: `1.5px solid ${hab.nivel === n ? "#d0290a" : "#ddd"}`, borderRadius: "4px", background: hab.nivel === n ? "#d0290a" : "#fff", color: hab.nivel === n ? "#fff" : "#aaa", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                      {n === "basico" ? "Básico" : n === "intermediario" ? "Médio" : "Avançado"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn-ghost" onClick={() => setFormData({ ...formData, habilidades: [...formData.habilidades, { nome: "", nivel: "intermediario" as const }] })} style={{ marginBottom: "8px" }}>
              + Adicionar habilidade
            </button>



            <div style={{ marginTop: "32px" }}>
              <button className="btn-main" onClick={handleSubmitForm}>Continuar para pagamento →</button>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Seus dados são privados e seguros</p>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="fade-up">
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 8px" }}>Pagamento</h1>
            <p style={{ color: "#888", fontSize: "15px", margin: "0 0 32px" }}>Clique no botão abaixo para pagar com segurança.</p>

            <div style={{ background: DARK, borderRadius: "8px", padding: "32px", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#666", marginBottom: "12px" }}>Promoção por tempo limitado</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "28px" }}>
                <span style={{ fontSize: "20px", color: "#555", textDecoration: "line-through", fontWeight: 600 }}>R$ 29,90</span>
                <span style={{ fontSize: "52px", fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>R$ 5,00</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
                {["Pix", "Cartão"].map((m) => (
                  <div key={m} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", padding: "10px", fontSize: "12px", color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{m}</div>
                ))}
              </div>
              <a className="btn-kiwify" href={checkoutUrl} target="_blank" rel="noopener noreferrer">Pagar agora — R$ 5,00</a>
              <p style={{ color: "#555", fontSize: "12px", marginTop: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pagamento processado com segurança pela Kiwify</p>
            </div>

            <div style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fbbf24", animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Aguardando confirmação do pagamento...</span>
              </div>
              <p style={{ fontSize: "12px", color: "#aaa" }}>Após pagar, essa página atualiza automaticamente.</p>
            </div>

          </div>
        )}

        {step === "loading" && (
          <div className="fade-up" style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: "56px", height: "56px", border: `4px solid #e0dbd4`, borderTopColor: RED, borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 8px" }}>Montando seu currículo...</h2>
            <p style={{ color: "#888", fontSize: "15px" }}>Isso leva apenas alguns segundos</p>
          </div>
        )}

        {step === "edit" && cvData && (
          <div className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "36px", height: "36px", background: RED, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 900 }}>✓</div>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px", margin: 0 }}>Currículo gerado!</h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>Revise e edite antes de baixar</p>
              </div>
            </div>
            <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: "4px", padding: "10px 14px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>💾</span>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#166534" }}>Salvo automaticamente</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#15803d" }}>Se fechar a página, seu currículo estará aqui quando voltar.</p>
              </div>
            </div>
            <SectionLabel>Dados Pessoais</SectionLabel>
            <div className="grid-2">
              <Field label="Nome" value={cvData.nome} onChange={(v) => setCvData({ ...cvData, nome: v })} />
              <Field label="Telefone" value={cvData.telefone} onChange={(v) => setCvData({ ...cvData, telefone: v })} />
              <Field label="E-mail" value={cvData.email} onChange={(v) => setCvData({ ...cvData, email: v })} />
              <Field label="Cidade" value={cvData.cidade} onChange={(v) => setCvData({ ...cvData, cidade: v })} />
            </div>
            <FieldArea label="Objetivo" value={cvData.objetivo} onChange={(v) => setCvData({ ...cvData, objetivo: v })} />
            {cvData.experiencias?.filter((e) => e.empresa).length > 0 && (<>
              <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
              <SectionLabel>Experiências</SectionLabel>
              {cvData.experiencias.filter((e) => e.empresa).map((exp, i) => (
                <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${RED}` }}>
                  <div className="grid-2" style={{ marginBottom: "12px" }}>
                    <Field label="Empresa" value={exp.empresa} onChange={(v) => updateExp(i, "empresa", v)} />
                    <Field label="Cargo" value={exp.cargo} onChange={(v) => updateExp(i, "cargo", v)} />
                  </div>
                  <Field label="Período" value={exp.periodo} onChange={(v) => updateExp(i, "periodo", v)} />
                  <FieldArea label="Atividades" value={exp.descricao} onChange={(v) => updateExp(i, "descricao", v)} />
                </div>
              ))}
            </>)}
            {cvData.formacao?.filter((f) => f.curso).length > 0 && (<>
              <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
              <SectionLabel>Formação</SectionLabel>
              {cvData.formacao.filter((f) => f.curso).map((f, i) => (
                <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${DARK}` }}>
                  <div className="grid-3">
                    <Field label="Instituição" value={f.instituicao} onChange={(v) => updateForm(i, "instituicao", v)} />
                    <Field label="Curso" value={f.curso} onChange={(v) => updateForm(i, "curso", v)} />
                    <Field label="Ano" value={f.ano} onChange={(v) => updateForm(i, "ano", v)} />
                  </div>
                </div>
              ))}
            </>)}
            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
            <SectionLabel>Habilidades</SectionLabel>
            {(cvData.habilidades as any[]).map((hab: any, i: number) => (
              <div key={i} className="hab-row">
                <div className="field" style={{ margin: 0 }}>
                  <input value={hab.nome} onChange={(e) => { const h = [...(cvData.habilidades as any[])]; h[i].nome = e.target.value; setCvData({ ...cvData, habilidades: h }); }} placeholder="Nome da habilidade" />
                </div>
                <div className="hab-nivels">
                  {(["basico","intermediario","avancado"] as const).map((n) => (
                    <button key={n} type="button" onClick={() => { const h = [...(cvData.habilidades as any[])]; h[i].nivel = n; setCvData({ ...cvData, habilidades: h }); }}
                      style={{ padding: "8px 10px", border: `1.5px solid ${hab.nivel === n ? "#d0290a" : "#ddd"}`, borderRadius: "4px", background: hab.nivel === n ? "#d0290a" : "#fff", color: hab.nivel === n ? "#fff" : "#aaa", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                      {n === "basico" ? "Básico" : n === "intermediario" ? "Médio" : "Avançado"}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
            <SectionLabel>Estilo do Currículo</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {([
                { id: "vermelho", label: "Vermelho", cor: "#d0290a" },
                { id: "azul",     label: "Azul",     cor: "#1a56db" },
                { id: "verde",    label: "Verde",    cor: "#047857" },
                { id: "preto",    label: "Preto",    cor: "#111111" },
              ] as const).map((e) => (
                <div key={e.id} onClick={() => setCvData({ ...cvData!, estilo: e.id })}
                  style={{ border: `2px solid ${cvData?.estilo === e.id ? e.cor : "#e0dbd4"}`, borderRadius: "6px", padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", background: cvData?.estilo === e.id ? `${e.cor}08` : "#fff", transition: "all 0.15s" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: e.cor, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#111" }}>{e.label}</span>
                  {cvData?.estilo === e.id && (
                    <div style={{ marginLeft: "auto", width: "16px", height: "16px", borderRadius: "50%", background: e.cor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: 900 }}>✓</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px" }}>
              <button className="btn-main" onClick={() => { if (cvData) { generatePDF(cvData); try { localStorage.removeItem("curriculo_cv"); } catch {} } setStep("download"); }}>Gerar e baixar PDF</button>
            </div>
          </div>
        )}

        {step === "download" && (
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: RED, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#fff", fontWeight: 900, fontSize: "28px" }}>✓</div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 8px" }}>Currículo baixado!</h1>
            <p style={{ color: "#888", fontSize: "15px", margin: "0 0 32px" }}>Profissional, formatado e pronto para enviar.</p>
            <button className="btn-main" onClick={() => cvData && generatePDF(cvData)} style={{ marginBottom: "16px" }}>Baixar novamente</button>
            <div style={{ background: "#fff", border: `1.5px solid #e0dbd4`, borderRadius: "4px", padding: "24px", borderLeft: `3px solid #f59e0b`, textAlign: "left" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Oferta especial</p>
              <p style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>Carta de Apresentação personalizada</p>
              <p style={{ fontSize: "14px", color: "#888", margin: "0 0 16px", lineHeight: 1.5 }}>Aumente suas chances com uma carta profissional feita para a vaga.</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "14px", color: "#bbb", textDecoration: "line-through" }}>R$ 9,90</span>
                <span style={{ fontSize: "22px", fontWeight: 900, color: DARK }}>R$ 2,90</span>
              </div>
              <button className="upsell-btn">Quero a carta de apresentação</button>
            </div>
          </div>
        )}
      </div>

      {/* CROP MODAL */}
      {cropModal && formData.foto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "24px", width: "100%", maxWidth: "360px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 900, margin: "0 0 16px", color: DARK }}>Ajustar enquadramento</h3>
            <div style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px", border: `3px solid ${RED}` }}>
              <img src={formData.foto} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${cropOffset.x}% ${cropOffset.y}%`, transform: `scale(${cropZoom/100})`, transformOrigin: `${cropOffset.x}% ${cropOffset.y}%` }} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Horizontal</p>
              <input type="range" min="0" max="100" value={cropOffset.x} onChange={(e) => setCropOffset({ ...cropOffset, x: Number(e.target.value) })}
                style={{ width: "100%", accentColor: RED }} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Vertical</p>
              <input type="range" min="0" max="100" value={cropOffset.y} onChange={(e) => setCropOffset({ ...cropOffset, y: Number(e.target.value) })}
                style={{ width: "100%", accentColor: RED }} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Zoom ({cropZoom}%)</p>
              <input type="range" min="80" max="200" value={cropZoom} onChange={(e) => setCropZoom(Number(e.target.value))}
                style={{ width: "100%", accentColor: RED }} />
            </div>
            <button className="btn-main" onClick={() => setCropModal(false)}>Confirmar</button>
          </div>
        </div>
      )}

    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="8" fill="#d0290a" />
        <rect x="14" y="14" width="36" height="4" rx="2" fill="#fff" />
        <rect x="14" y="22" width="26" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
        <rect x="14" y="30" width="36" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="14" y="35" width="30" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="14" y="40" width="36" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="14" y="45" width="24" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <circle cx="46" cy="46" r="12" fill="#111" />
        <path d="M41 46l3.5 3.5L51 41" stroke="#d0290a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px", color: "#111" }}>
        CURRÍCULO <span style={{ color: "#d0290a" }}>PRO</span>
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "11px", fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>{children}</p>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="field" style={{ marginBottom: "12px" }}>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function FieldArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="field" style={{ marginBottom: "12px" }}>
      <label>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
