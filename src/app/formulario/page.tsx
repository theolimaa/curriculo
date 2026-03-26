"use client";

import { useState, useEffect, useRef } from "react";
import { FormData, CVData } from "@/lib/types";
import { generatePDF } from "@/lib/generatePDF";

const PRICE = "4,90";
type Step = "form" | "payment" | "loading" | "edit" | "download";

const emptyForm: FormData = {
  nome: "",
  telefone: "",
  email: "",
  cidade: "",
  objetivo: "",
  experiencias: [{ empresa: "", cargo: "", periodo: "", descricao: "" }],
  formacao: [{ instituicao: "", curso: "", ano: "" }],
  habilidades: "",
};

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [paymentId, setPaymentId] = useState<string>("");
  const [pixQr, setPixQr] = useState<string>("");
  const [pixCode, setPixCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [error, setError] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer na tela de pagamento
  useEffect(() => {
    if (step !== "payment") return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Polling para checar pagamento a cada 5s
  useEffect(() => {
    if (step !== "payment" || !paymentId) return;

    pollingRef.current = setInterval(async () => {
      const res = await fetch(`/api/check-payment?paymentId=${paymentId}`);
      const data = await res.json();
      if (data.approved) {
        clearInterval(pollingRef.current!);
        handleGenerateCV();
      }
    }, 5000);

    return () => clearInterval(pollingRef.current!);
  }, [step, paymentId]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // PASSO 1 → 2: Cria o Pix
  const handleSubmitForm = async () => {
    if (!formData.nome || !formData.telefone) {
      setError("Preencha seu nome e telefone!");
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPaymentId(data.paymentId);
      setPixQr(data.pixQrCode);
      setPixCode(data.pixCopyPaste);
      setStep("payment");
    } catch (e: any) {
      setError("Erro ao gerar pagamento. Tente novamente.");
    }
  };

  // PASSO 2 → 3: Confirma pagamento e gera currículo
  const handleGenerateCV = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCvData(data.cvData);
      setStep("edit");
    } catch (e) {
      setError("Erro ao gerar currículo. Entre em contato.");
      setStep("payment");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (cvData) generatePDF(cvData);
    setStep("download");
  };

  const updateExp = (i: number, field: string, val: string) => {
    if (!cvData) return;
    const exps = [...cvData.experiencias];
    (exps[i] as any)[field] = val;
    setCvData({ ...cvData, experiencias: exps });
  };

  const updateForm = (i: number, field: string, val: string) => {
    if (!cvData) return;
    const forms = [...cvData.formacao];
    (forms[i] as any)[field] = val;
    setCvData({ ...cvData, formacao: forms });
  };

  const steps = ["Dados", "Pagamento", "Revisar", "Baixar"];
  const stepIndex = { form: 0, payment: 1, loading: 2, edit: 2, download: 3 }[step];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "50px", padding: "6px 16px", marginBottom: "12px" }}>
            <span style={{ fontSize: "18px" }}>📄</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px", letterSpacing: "1px" }}>CURRÍCULO COM IA</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 900, margin: "0 0 6px", lineHeight: 1.2 }}>
            Currículo Profissional<br /><span style={{ color: "#4ade80" }}>em 2 Minutos</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px" }}>Preencha · IA monta · Baixe o PDF</p>
        </div>

        {/* STEP INDICATOR */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: stepIndex >= i ? "#4ade80" : "rgba(255,255,255,0.15)", color: stepIndex >= i ? "#0f2027" : "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, transition: "all 0.3s" }}>{i + 1}</div>
              <span style={{ color: stepIndex >= i ? "#4ade80" : "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 700 }}>{s}</span>
              {i < steps.length - 1 && <div style={{ width: "14px", height: "2px", background: "rgba(255,255,255,0.15)" }} />}
            </div>
          ))}
        </div>

        {/* CARD */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} className="animate-fadeIn">

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#dc2626", fontSize: "13px", fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {/* ========== STEP 1: FORMULÁRIO ========== */}
          {step === "form" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 800, color: "#0f2027" }}>Seus Dados</h2>

              <Section title="Informações Pessoais">
                <Input label="Nome completo *" value={formData.nome} onChange={(v) => setFormData({ ...formData, nome: v })} placeholder="Ex: Maria Silva" />
                <Input label="WhatsApp / Telefone *" value={formData.telefone} onChange={(v) => setFormData({ ...formData, telefone: v })} placeholder="(11) 99999-9999" />
                <Input label="E-mail" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="email@gmail.com" />
                <Input label="Cidade / Estado" value={formData.cidade} onChange={(v) => setFormData({ ...formData, cidade: v })} placeholder="São Paulo - SP" />
                <Textarea label="Objetivo profissional (opcional)" value={formData.objetivo} onChange={(v) => setFormData({ ...formData, objetivo: v })} placeholder="Ex: Busco vaga como auxiliar administrativo..." />
              </Section>

              <Section title="Experiências Profissionais">
                {formData.experiencias.map((exp, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
                    <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Experiência {i + 1}</p>
                    <Input label="Empresa" value={exp.empresa} onChange={(v) => { const e = [...formData.experiencias]; e[i].empresa = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Nome da empresa" />
                    <Input label="Cargo" value={exp.cargo} onChange={(v) => { const e = [...formData.experiencias]; e[i].cargo = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Ex: Vendedor, Auxiliar, Operador..." />
                    <Input label="Período" value={exp.periodo} onChange={(v) => { const e = [...formData.experiencias]; e[i].periodo = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Jan/2022 - Dez/2023" />
                    <Textarea label="O que você fazia?" value={exp.descricao} onChange={(v) => { const e = [...formData.experiencias]; e[i].descricao = v; setFormData({ ...formData, experiencias: e }); }} placeholder="Descreva suas atividades..." />
                  </div>
                ))}
                <button onClick={() => setFormData({ ...formData, experiencias: [...formData.experiencias, { empresa: "", cargo: "", periodo: "", descricao: "" }] })}
                  style={{ width: "100%", padding: "10px", border: "2px dashed #cbd5e1", borderRadius: "10px", background: "transparent", color: "#64748b", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                  + Adicionar experiência
                </button>
              </Section>

              <Section title="Formação Escolar">
                {formData.formacao.map((f, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
                    <Input label="Escola / Faculdade" value={f.instituicao} onChange={(v) => { const fm = [...formData.formacao]; fm[i].instituicao = v; setFormData({ ...formData, formacao: fm }); }} placeholder="Nome da instituição" />
                    <Input label="Curso / Nível" value={f.curso} onChange={(v) => { const fm = [...formData.formacao]; fm[i].curso = v; setFormData({ ...formData, formacao: fm }); }} placeholder="Ensino Médio, Técnico em TI..." />
                    <Input label="Ano de conclusão" value={f.ano} onChange={(v) => { const fm = [...formData.formacao]; fm[i].ano = v; setFormData({ ...formData, formacao: fm }); }} placeholder="2020" />
                  </div>
                ))}
              </Section>

              <Section title="Habilidades">
                <Textarea label="Liste suas habilidades" value={formData.habilidades} onChange={(v) => setFormData({ ...formData, habilidades: v })} placeholder="Pacote Office, Atendimento ao cliente, CNH B..." />
              </Section>

              <PrimaryButton onClick={handleSubmitForm}>Continuar para Pagamento →</PrimaryButton>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "10px" }}>🔒 Seus dados são privados e seguros</p>
            </div>
          )}

          {/* ========== STEP 2: PAGAMENTO ========== */}
          {step === "payment" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>💚</div>
              <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 900, color: "#0f2027" }}>Pague com Pix</h2>
              <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>Aprovação instantânea · Seguro e rápido</p>

              <div style={{ background: "linear-gradient(135deg, #0f2027, #2c5364)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 4px" }}>VALOR A PAGAR</p>
                <p style={{ color: "#4ade80", fontSize: "44px", fontWeight: 900, margin: "0 0 16px" }}>R$ {PRICE}</p>

                {pixQr ? (
                  <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", display: "inline-block", marginBottom: "16px" }}>
                    <img src={`data:image/png;base64,${pixQr}`} alt="QR Code Pix" style={{ width: "160px", height: "160px" }} />
                  </div>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "40px", marginBottom: "16px" }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Gerando QR Code...</p>
                  </div>
                )}

                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "0 0 6px" }}>CÓDIGO COPIA E COLA</p>
                  <p style={{ color: "#fff", fontSize: "11px", wordBreak: "break-all", margin: "0 0 8px", fontFamily: "monospace", opacity: 0.8 }}>
                    {pixCode ? pixCode.substring(0, 60) + "..." : "Aguardando..."}
                  </p>
                  <button onClick={handleCopy} style={{ background: copied ? "#4ade80" : "rgba(255,255,255,0.2)", color: copied ? "#0f2027" : "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                    {copied ? "✓ Copiado!" : "📋 Copiar código"}
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24", animation: "pulse 1s infinite" }} />
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Aguardando pagamento... {formatTime(countdown)}</span>
                </div>
              </div>

              <PrimaryButton onClick={handleGenerateCV}>✅ Já paguei! Gerar meu currículo</PrimaryButton>
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "10px" }}>O pagamento é verificado automaticamente</p>
            </div>
          )}

          {/* ========== LOADING ========== */}
          {step === "loading" && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: "52px", marginBottom: "16px", display: "inline-block", animation: "spin 2s linear infinite" }}>⚙️</div>
              <h3 style={{ color: "#0f2027", fontWeight: 800, margin: "0 0 8px", fontSize: "18px" }}>A IA está montando seu currículo...</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Isso leva apenas alguns segundos</p>
              <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {["Analisando dados", "Melhorando textos", "Formatando currículo"].map((t) => (
                  <span key={t} style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "20px", padding: "4px 10px", fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* ========== STEP 3: EDITAR ========== */}
          {step === "edit" && cvData && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ background: "#4ade80", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>✓</div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f2027" }}>Currículo gerado com sucesso!</h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Revise e edite o que quiser antes de baixar</p>
                </div>
              </div>

              <Section title="Dados Pessoais">
                <Input label="Nome" value={cvData.nome} onChange={(v) => setCvData({ ...cvData, nome: v })} />
                <Input label="Telefone" value={cvData.telefone} onChange={(v) => setCvData({ ...cvData, telefone: v })} />
                <Input label="E-mail" value={cvData.email} onChange={(v) => setCvData({ ...cvData, email: v })} />
                <Input label="Cidade" value={cvData.cidade} onChange={(v) => setCvData({ ...cvData, cidade: v })} />
                <Textarea label="Objetivo" value={cvData.objetivo} onChange={(v) => setCvData({ ...cvData, objetivo: v })} />
              </Section>

              {cvData.experiencias?.filter((e) => e.empresa).length > 0 && (
                <Section title="Experiências">
                  {cvData.experiencias.filter((e) => e.empresa).map((exp, i) => (
                    <div key={i} style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
                      <Input label="Empresa" value={exp.empresa} onChange={(v) => updateExp(i, "empresa", v)} />
                      <Input label="Cargo" value={exp.cargo} onChange={(v) => updateExp(i, "cargo", v)} />
                      <Input label="Período" value={exp.periodo} onChange={(v) => updateExp(i, "periodo", v)} />
                      <Textarea label="Atividades" value={exp.descricao} onChange={(v) => updateExp(i, "descricao", v)} />
                    </div>
                  ))}
                </Section>
              )}

              {cvData.formacao?.filter((f) => f.curso).length > 0 && (
                <Section title="Formação">
                  {cvData.formacao.filter((f) => f.curso).map((f, i) => (
                    <div key={i} style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
                      <Input label="Instituição" value={f.instituicao} onChange={(v) => updateForm(i, "instituicao", v)} />
                      <Input label="Curso" value={f.curso} onChange={(v) => updateForm(i, "curso", v)} />
                      <Input label="Ano" value={f.ano} onChange={(v) => updateForm(i, "ano", v)} />
                    </div>
                  ))}
                </Section>
              )}

              <Section title="Habilidades">
                <Textarea label="Habilidades" value={cvData.habilidades} onChange={(v) => setCvData({ ...cvData, habilidades: v })} />
              </Section>

              <PrimaryButton onClick={handleDownload}>📄 Gerar e Baixar PDF</PrimaryButton>
            </div>
          )}

          {/* ========== STEP 4: DOWNLOAD ========== */}
          {step === "download" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
              <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 900, color: "#0f2027" }}>Currículo baixado!</h2>
              <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px" }}>Profissional, formatado e pronto para enviar</p>

              <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: "16px", padding: "18px", marginBottom: "20px", textAlign: "left" }}>
                {[["Nome", cvData?.nome], ["Experiências", `${cvData?.experiencias?.filter((e) => e.empresa).length || 0} emprego(s)`], ["Status", "✓ Pronto para envio"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>{k}:</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: k === "Status" ? "#16a34a" : "#0f2027" }}>{v}</span>
                  </div>
                ))}
              </div>

              <PrimaryButton onClick={() => cvData && generatePDF(cvData)}>⬇️ Baixar novamente</PrimaryButton>

              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "18px", marginTop: "16px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 800, color: "#92400e" }}>🚀 Oferta especial</p>
                <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#78350f" }}>Adicione uma <strong>Carta de Apresentação</strong> personalizada pela IA</p>
                <p style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: 900, color: "#0f2027" }}>R$ 2,90</p>
                <button style={{ width: "100%", padding: "12px", background: "#f59e0b", border: "none", borderRadius: "10px", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "14px" }}>
                  Quero a Carta de Apresentação!
                </button>
              </div>
            </div>
          )}

        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "16px" }}>
          🔒 Pagamento seguro via Mercado Pago · Seus dados são privados
        </p>
      </div>
    </div>
  );
}

// ---- Components ----

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</p>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#0f2027", background: "#fff", boxSizing: "border-box" as const }} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#0f2027", resize: "vertical" as const, background: "#fff", boxSizing: "border-box" as const, fontFamily: "inherit" }} />
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #0f2027, #2c5364)", color: "#4ade80", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: "pointer", letterSpacing: "0.3px" }}>
      {children}
    </button>
  );
}
