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
  estilo: "vermelho" as "vermelho" | "azul" | "verde" | "preto",
};

export default function Formulario() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
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

  const handleGenerateCV = async (sid?: string) => {
    const id = sid || sessionId;
    setStep("loading");
    try {
      const res = await fetch("/api/generate-cv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: id }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCvData({ ...data.cvData, foto: formData.foto, estilo: formData.estilo });
      setStep("edit");
    } catch { setError("Erro ao gerar currículo. Entre em contato."); setStep("payment"); }
  };

  const handleTestPayment = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/test-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const res2 = await fetch("/api/generate-cv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: data.sessionId }) });
      const data2 = await res2.json();
      if (data2.error) throw new Error(data2.error);
      setCvData({ ...data2.cvData, foto: formData.foto, estilo: formData.estilo });
      setStep("edit");
    } catch { setError("Erro no teste."); setStep("form"); }
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
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

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
      `}</style>

      <nav style={{ background: CREAM, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${DARK}` }}>
        <a href="/" style={{ textDecoration: "none" }}><Logo /></a>
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
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontSize: "12px", fontWeight: 800, color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Foto (opcional)</p>
                <label style={{ cursor: "pointer", display: "block" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: `2px dashed ${formData.foto ? RED : "#ccc"}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: formData.foto ? "transparent" : "#fafafa" }}>
                    {formData.foto ? <img src={formData.foto} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: "20px", marginBottom: "2px" }}>📷</div><div style={{ fontSize: "9px", color: "#aaa", fontWeight: 700, textTransform: "uppercase" }}>Enviar</div></div>
                    )}
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => setFormData({ ...formData, foto: ev.target?.result as string }); reader.readAsDataURL(file); }} />
                </label>
                {formData.foto && <button onClick={() => setFormData({ ...formData, foto: undefined })} style={{ marginTop: "6px", width: "80px", background: "transparent", border: "none", color: "#aaa", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, textTransform: "uppercase" }}>Remover</button>}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                <Field label="Nome completo *" value={formData.nome} onChange={(v) => setFormData({ ...formData, nome: v })} placeholder="Ex: Maria Silva" />
                <Field label="WhatsApp / Telefone *" value={formData.telefone} onChange={(v) => setFormData({ ...formData, telefone: v })} placeholder="(11) 99999-9999" />
              </div>
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
            <button className="btn-ghost" onClick={() => setFormData({ ...formData, experiencias: [...formData.experiencias, { empresa: "", cargo: "", periodo: "", descricao: "" }] })} style={{ marginBottom: "28px" }}>+ Adicionar experiência</button>

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

            <button className="btn-secondary" onClick={() => handleGenerateCV()}>Já paguei — verificar agora</button>
            {isTestMode && (
              <button className="btn-test" onClick={handleTestPayment}>Modo teste — gerar sem pagar</button>
            )}
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
            {cvData.experiencias?.filter((e) => e.empresa).length > 0 && (<>
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
            </>)}
            {cvData.formacao?.filter((f) => f.curso).length > 0 && (<>
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
            </>)}
            <div style={{ height: "1.5px", background: "#e0dbd4", margin: "24px 0" }} />
            <SectionLabel>Habilidades</SectionLabel>
            <FieldArea label="Habilidades" value={cvData.habilidades} onChange={(v) => setCvData({ ...cvData, habilidades: v })} />

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
              <button className="btn-main" onClick={() => { if (cvData) generatePDF(cvData); setStep("download"); }}>Gerar e baixar PDF</button>
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
