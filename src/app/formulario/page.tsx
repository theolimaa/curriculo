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
  formacao: [{ instituicao: "", curso: "", ano: "" }],
  habilidades: "",
};

export default function Formulario() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [paymentId, setPaymentId] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [error, setError] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (step !== "payment") return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (step !== "payment" || !paymentId) return;
    pollingRef.current = setInterval(async () => {
      const res = await fetch(`/api/check-payment?paymentId=${paymentId}`);
      const data = await res.json();
      if (data.approved) { clearInterval(pollingRef.current!); handleGenerateCV(); }
    }, 5000);
    return () => clearInterval(pollingRef.current!);
  }, [step, paymentId]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleSubmitForm = async () => {
    if (!formData.nome || !formData.telefone) { setError("Preencha seu nome e telefone!"); return; }
    setError("");
    try {
      const res = await fetch("/api/create-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPaymentId(data.paymentId); setPixQr(data.pixQrCode); setPixCode(data.pixCopyPaste);
      setStep("payment");
    } catch { setError("Erro ao gerar pagamento. Tente novamente."); }
  };

  const handleGenerateCV = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/generate-cv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCvData(data.cvData); setStep("edit");
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
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .field input, .field textarea {
          width: 100%; padding: 12px 14px; border: 1.5px solid #ddd;
          border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 15px;
          color: ${DARK}; background: #fff; transition: border-color 0.2s;
        }
        .field input:focus, .field textarea:focus { outline: none; border-color: ${RED}; }
        .field textarea { resize: vertical; min-height: 80px; }
        .field label { display: block; font-size: 12px; font-weight: 800; color: #555; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
        .btn-main { width: 100%; padding: 16px; background: ${DARK}; color: #fff; border: 2px solid ${DARK}; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 16px; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; }
        .btn-main:hover { background: ${RED}; border-color: ${RED}; transform: translateY(-1px); }
        .btn-ghost { width: 100%; padding: 12px; background: transparent; color: #888; border: 1.5px dashed #ccc; border-radius: 4px; font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-ghost:hover { border-color: ${RED}; color: ${RED}; }
        .copy-btn { background: rgba(255,255,255,0.15); color: #fff; border: none; border-radius: 4px; padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Barlow', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; }
        .copy-btn:hover { background: rgba(255,255,255,0.25); }
        .upsell-btn { width: 100%; padding: 14px; background: #f59e0b; border: none; border-radius: 4px; color: #fff; font-weight: 900; cursor: pointer; font-size: 15px; font-family: 'Barlow', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; }
        .upsell-btn:hover { background: #d97706; transform: translateY(-1px); }
      `}</style>

      {/* NAV */}
      <nav style={{ background: CREAM, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${DARK}` }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <Logo />
        </a>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {stepLabels.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: stepIndex >= i ? RED : "#ddd", color: stepIndex >= i ? "#fff" : "#999", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, transition: "all 0.3s" }}>{i + 1}</div>
              <span style={{ color: stepIndex >= i ? DARK : "#aaa", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
              {i < 3 && <div style={{ width: "20px", height: "1.5px", background: "#ddd" }} />}
            </div>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {error && (
          <div style={{ background: "#fff0ee", border: `1.5px solid ${RED}`, borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", color: RED, fontSize: "14px", fontWeight: 700 }}>
            {error}
          </div>
        )}

        {/* ===== FORM ===== */}
        {step === "form" && (
          <div className="fade-up">
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 8px" }}>Seus dados</h1>
            <p style={{ color: "#888", fontSize: "15px", margin: "0 0 36px" }}>Preencha abaixo — nosso método monta tudo para você.</p>

            <SectionLabel>Informações Pessoais</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <Field label="Nome completo *" value={formData.nome} onChange={(v) => setFormData({ ...formData, nome: v })} placeholder="Ex: Maria Silva" />
              <Field label="WhatsApp / Telefone *" value={formData.telefone} onChange={(v) => setFormData({ ...formData, telefone: v })} placeholder="(11) 99999-9999" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <Field label="E-mail" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="email@gmail.com" />
              <Field label="Cidade / Estado" value={formData.cidade} onChange={(v) => setFormData({ ...formData, cidade: v })} placeholder="São Paulo - SP" />
            </div>
            <FieldArea label="Objetivo profissional (opcional)" value={formData.objetivo} onChange={(v) => setFormData({ ...formData, objetivo: v })} placeholder="Ex: Busco vaga como auxiliar administrativo..." />

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "28px 0" }} />

            <SectionLabel>Experiências Profissionais</SectionLabel>
            {formData.experiencias.map((exp, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${RED}` }}>
                <p style={{ fontSize: "11px", fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>Experiência {i + 1}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <Field label="Empresa" value={exp.empresa} onChange={(v) => { const e = [...formData.experiencias]; e[i].empresa = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Nome da empresa" />
                  <Field label="Cargo" value={exp.cargo} onChange={(v) => { const e = [...formData.experiencias]; e[i].cargo = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Ex: Vendedor, Auxiliar..." />
                </div>
                <Field label="Período" value={exp.periodo} onChange={(v) => { const e = [...formData.experiencias]; e[i].periodo = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Jan/2022 - Dez/2023" />
                <FieldArea label="O que você fazia?" value={exp.descricao} onChange={(v) => { const e = [...formData.experiencias]; e[i].descricao = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Descreva suas atividades..." />
              </div>
            ))}
            <button className="btn-ghost" onClick={() => setFormData({ ...formData, experiencias: [...formData.experiencias, { empresa: "", cargo: "", periodo: "", descricao: "" }] })} style={{ marginBottom: "28px" }}>
              + Adicionar experiência
            </button>

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "0 0 28px" }} />

            <SectionLabel>Formação Escolar</SectionLabel>
            {formData.formacao.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${DARK}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: "12px" }}>
                  <Field label="Escola / Faculdade" value={f.instituicao} onChange={(v) => { const fm = [...formData.formacao]; fm[i].instituicao = v; setFormData({ ...formData, formacao: fm }); }} placeholder="Nome da instituição" />
                  <Field label="Curso / Nível" value={f.curso} onChange={(v) => { const fm = [...formData.formacao]; fm[i].curso = v; setFormData({ ...formData, formacao: fm }); }} placeholder="Ensino Médio..." />
                  <Field label="Ano" value={f.ano} onChange={(v) => { const fm = [...formData.formacao]; fm[i].ano = v; setFormData({ ...formData, formacao: fm }); }} placeholder="2020" />
                </div>
              </div>
            ))}

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "16px 0 28px" }} />

            <SectionLabel>Habilidades</SectionLabel>
            <FieldArea label="Liste suas habilidades" value={formData.habilidades} onChange={(v) => setFormData({ ...formData, habilidades: v })} placeholder="Pacote Office, Atendimento ao cliente, CNH B..." />

            <div style={{ marginTop: "32px" }}>
              <button className="btn-main" onClick={handleSubmitForm}>Continuar para pagamento →</button>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Seus dados são privados e seguros</p>
            </div>
          </div>
        )}

        {/* ===== PAYMENT ===== */}
        {step === "payment" && (
          <div className="fade-up">
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 8px" }}>Pagamento</h1>
            <p style={{ color: "#888", fontSize: "15px", margin: "0 0 32px" }}>Pague via Pix e seu currículo é gerado na hora.</p>

            <div style={{ background: DARK, borderRadius: "8px", padding: "32px", textAlign: "center", marginBottom: "20px" }}>
              {/* Promoção */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", padding: "8px 16px", marginBottom: "20px" }}>
                <span style={{ fontSize: "14px", color: "#666", textDecoration: "line-through", fontWeight: 600 }}>R$ 29,90</span>
                <span style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>por apenas</span>
                <span style={{ fontSize: "28px", fontWeight: 900, color: RED }}>R$ 5,00</span>
              </div>

              {pixQr ? (
                <div style={{ background: "#fff", borderRadius: "6px", padding: "14px", display: "inline-block", marginBottom: "20px" }}>
                  <img src={`data:image/png;base64,${pixQr}`} alt="QR Code Pix" style={{ width: "160px", height: "160px", display: "block" }} />
                </div>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "6px", padding: "48px", marginBottom: "20px" }}>
                  <p style={{ color: "#555", fontSize: "13px" }}>Gerando QR Code...</p>
                </div>
              )}

              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", padding: "14px", marginBottom: "16px", textAlign: "left" }}>
                <p style={{ color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Código Pix copia e cola</p>
                <p style={{ color: "#aaa", fontSize: "11px", fontFamily: "monospace", wordBreak: "break-all", marginBottom: "10px" }}>
                  {pixCode ? pixCode.substring(0, 60) + "..." : "Aguardando..."}
                </p>
                <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(pixCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                  {copied ? "✓ Copiado!" : "Copiar código"}
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }} />
                <span style={{ color: "#666", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Aguardando pagamento... {fmt(countdown)}</span>
              </div>
            </div>

            <button className="btn-main" onClick={handleGenerateCV}>Já paguei — gerar meu currículo</button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>O pagamento é verificado automaticamente</p>
          </div>
        )}

        {/* ===== LOADING ===== */}
        {step === "loading" && (
          <div className="fade-up" style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: "56px", height: "56px", border: `4px solid #e0dbd4`, borderTopColor: RED, borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 8px" }}>Montando seu currículo...</h2>
            <p style={{ color: "#888", fontSize: "15px" }}>Isso leva apenas alguns segundos</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" }}>
              {["Analisando dados", "Estruturando", "Formatando"].map((t) => (
                <span key={t} style={{ background: "#fff", border: `1.5px solid #e0dbd4`, borderRadius: "2px", padding: "4px 12px", fontSize: "11px", color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* ===== EDIT ===== */}
        {step === "edit" && cvData && (
          <div className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <div style={{ width: "36px", height: "36px", background: RED, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 900 }}>✓</div>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px", margin: 0 }}>Currículo gerado!</h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>Revise e edite antes de baixar</p>
              </div>
            </div>

            <SectionLabel>Dados Pessoais</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <Field label="Nome" value={cvData.nome} onChange={(v) => setCvData({ ...cvData, nome: v })} />
              <Field label="Telefone" value={cvData.telefone} onChange={(v) => setCvData({ ...cvData, telefone: v })} />
              <Field label="E-mail" value={cvData.email} onChange={(v) => setCvData({ ...cvData, email: v })} />
              <Field label="Cidade" value={cvData.cidade} onChange={(v) => setCvData({ ...cvData, cidade: v })} />
            </div>
            <FieldArea label="Objetivo" value={cvData.objetivo} onChange={(v) => setCvData({ ...cvData, objetivo: v })} />

            {cvData.experiencias?.filter((e) => e.empresa).length > 0 && (
              <>
                <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
                <SectionLabel>Experiências</SectionLabel>
                {cvData.experiencias.filter((e) => e.empresa).map((exp, i) => (
                  <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${RED}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                      <Field label="Empresa" value={exp.empresa} onChange={(v) => updateExp(i, "empresa", v)} />
                      <Field label="Cargo" value={exp.cargo} onChange={(v) => updateExp(i, "cargo", v)} />
                    </div>
                    <Field label="Período" value={exp.periodo} onChange={(v) => updateExp(i, "periodo", v)} />
                    <FieldArea label="Atividades" value={exp.descricao} onChange={(v) => updateExp(i, "descricao", v)} />
                  </div>
                ))}
              </>
            )}

            {cvData.formacao?.filter((f) => f.curso).length > 0 && (
              <>
                <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
                <SectionLabel>Formação</SectionLabel>
                {cvData.formacao.filter((f) => f.curso).map((f, i) => (
                  <div key={i} style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "20px", marginBottom: "12px", borderLeft: `3px solid ${DARK}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: "12px" }}>
                      <Field label="Instituição" value={f.instituicao} onChange={(v) => updateForm(i, "instituicao", v)} />
                      <Field label="Curso" value={f.curso} onChange={(v) => updateForm(i, "curso", v)} />
                      <Field label="Ano" value={f.ano} onChange={(v) => updateForm(i, "ano", v)} />
                    </div>
                  </div>
                ))}
              </>
            )}

            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
            <SectionLabel>Habilidades</SectionLabel>
            <FieldArea label="Habilidades" value={cvData.habilidades} onChange={(v) => setCvData({ ...cvData, habilidades: v })} />

            <div style={{ marginTop: "32px" }}>
              <button className="btn-main" onClick={() => { if (cvData) generatePDF(cvData); setStep("download"); }}>
                Gerar e baixar PDF
              </button>
            </div>
          </div>
        )}

        {/* ===== DOWNLOAD ===== */}
        {step === "download" && (
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: RED, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "32px", color: "#fff", fontWeight: 900 }}>✓</div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 8px" }}>Currículo baixado!</h1>
            <p style={{ color: "#888", fontSize: "15px", margin: "0 0 32px" }}>Profissional, formatado e pronto para enviar.</p>

            <div style={{ background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: "4px", padding: "24px", marginBottom: "24px", textAlign: "left" }}>
              {[["Nome", cvData?.nome], ["Experiências", `${cvData?.experiencias?.filter((e) => e.empresa).length || 0} emprego(s)`], ["Status", "Pronto para envio"]].map(([k, v]) => (
                <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ebe5" }}>
                  <span style={{ fontSize: "13px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>{k}</span>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: k === "Status" ? RED : DARK }}>{v}</span>
                </div>
              ))}
            </div>

            <button className="btn-main" onClick={() => cvData && generatePDF(cvData)} style={{ marginBottom: "16px" }}>
              Baixar novamente
            </button>

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
