"use client";

import { useState, useEffect } from "react";

const RED = "#d0290a";
const DARK = "#111111";
const CREAM = "#f5f0eb";

export default function LandingPage() {
  const [count, setCount] = useState(1247);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3)), 8000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { q: "Como o método garante um currículo profissional?", a: "O método foi desenvolvido com base nos padrões usados por recrutadores das maiores empresas do Brasil. Cada campo, seção e formatação segue critérios técnicos validados — desde a ordem das informações até o vocabulário adequado para cada área." },
    { q: "Preciso ter experiência profissional para usar?", a: "Não. O método funciona tanto para quem está buscando o primeiro emprego quanto para profissionais com anos de experiência. Basta preencher com o que você tem — o sistema organiza e valoriza cada informação da melhor forma." },
    { q: "O currículo fica pronto para enviar imediatamente?", a: "Sim. Ao final do processo você baixa um PDF formatado, pronto para anexar em qualquer vaga. Você ainda pode revisar e editar qualquer campo antes de baixar." },
    { q: "Funciona pelo celular?", a: "Sim, o processo foi desenvolvido para funcionar perfeitamente no celular. Você preenche, revisa e baixa o PDF tudo pelo navegador, sem precisar instalar nada." },
    { q: "Quanto tempo leva para ficar pronto?", a: "Em média 2 minutos. O tempo depende apenas de quanto você precisa digitar. O processamento e geração do PDF são quase instantâneos após o pagamento." },
    { q: "Meus dados ficam salvos?", a: "Seus dados são usados exclusivamente para montar o currículo durante a sessão. Não armazenamos informações pessoais após a entrega do arquivo." },
  ];

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: CREAM, color: DARK, overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .btn-primary { background: ${DARK}; color: #fff; border: 2px solid ${DARK}; border-radius: 4px; font-family: 'Barlow', sans-serif; font-weight: 900; font-size: 16px; cursor: pointer; letter-spacing: 0.3px; transition: all 0.22s ease; text-transform: uppercase; padding: 16px 36px; }
        .btn-primary:hover { background: ${RED}; border-color: ${RED}; transform: translateY(-2px); }
        .btn-outline { background: transparent; color: ${DARK}; border: 2px solid ${DARK}; border-radius: 4px; font-family: 'Barlow', sans-serif; font-weight: 900; font-size: 13px; cursor: pointer; letter-spacing: 0.5px; transition: all 0.22s ease; text-transform: uppercase; padding: 10px 24px; }
        .btn-outline:hover { background: ${RED}; border-color: ${RED}; color: #fff; }
        .btn-inv { background: #fff; color: ${DARK}; border: 2px solid #fff; border-radius: 4px; font-family: 'Barlow', sans-serif; font-weight: 900; font-size: 17px; cursor: pointer; letter-spacing: 0.3px; transition: all 0.22s ease; text-transform: uppercase; padding: 18px 48px; }
        .btn-inv:hover { background: ${RED}; border-color: ${RED}; color: #fff; transform: translateY(-2px); }
        .step-card { background: #1a1a1a; border: 1px solid #2a2a2a; padding: 32px 24px; transition: all 0.25s ease; }
        .step-card:hover { background: ${RED}; }
        .step-card:hover .step-desc { color: rgba(255,255,255,0.8) !important; }
        .step-card:hover .step-num { color: rgba(255,255,255,0.45) !important; }
        .cv-compare-grid { grid-template-columns: 1fr auto 1fr; }
        @media (max-width: 768px) {
          .cv-compare-grid { grid-template-columns: 1fr !important; }
          .cv-arrow { display: none !important; }
          .cv-compare-grid > div:nth-child(2) { display: none; }
          .hero-grid, .problem-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
          nav { padding: 14px 16px !important; }
        }
        .card-white { background: #fff; border: 1.5px solid #e0dbd4; padding: 32px 28px; transition: all 0.25s ease; }
        .card-white:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: ${RED}; }
        .faq-btn { width: 100%; background: transparent; border: none; text-align: left; padding: 24px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; font-family: 'Barlow', sans-serif; font-size: 17px; font-weight: 800; color: ${DARK}; transition: color 0.2s; }
        .faq-btn:hover { color: ${RED}; }
        .faq-icon { width: 28px; height: 28px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; line-height: 1; transition: all 0.2s; }
        @media (max-width: 768px) {
          .hero-grid, .problem-grid { grid-template-columns: 1fr !important; }
          .steps-grid, .cards-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid, .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* BARRA TOPO */}
      <div style={{ background: RED, padding: "10px 20px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "80px", animation: "ticker 22s linear infinite", width: "max-content" }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              PROMOCAO LIMITADA — De R$29,90 por R$5,00 — {count.toLocaleString("pt-BR")} curriculos entregues — Metodo validado por recrutadores
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{ background: CREAM, padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${DARK}` }}>
        <Logo />
        <button className="btn-outline" onClick={() => window.location.href = "/formulario"}>Gerar meu currículo</button>
      </nav>

      {/* HERO */}
      <section style={{ padding: "80px 40px 120px", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="hero-grid fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: `1.5px solid ${DARK}`, borderRadius: "2px", padding: "5px 14px", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: RED }} />
              Método validado por recrutadores
            </div>
            <h1 style={{ fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 20px" }}>
              Currículo<br />profissional<br />
              <span style={{ color: RED, fontStyle: "italic" }}>em 2 minutos.</span>
            </h1>
            <p style={{ fontSize: "17px", color: "#555", lineHeight: 1.7, margin: "0 0 20px", maxWidth: "440px" }}>
              Você preenche seus dados, nosso método organiza e profissionaliza tudo seguindo os padrões usados pelos maiores recrutadores do Brasil.
            </p>
            {/* Promoção */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "16px", background: "#fff", border: `1.5px solid #e0dbd4`, borderRadius: "6px", padding: "14px 20px", marginBottom: "28px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Promoção por tempo limitado</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px", color: "#bbb", textDecoration: "line-through", fontWeight: 600 }}>R$ 29,90</span>
                  <span style={{ fontSize: "28px", fontWeight: 900, color: RED, letterSpacing: "-0.5px" }}>R$ 5,00</span>
                </div>
              </div>
              <div style={{ width: "1px", height: "40px", background: "#e0dbd4" }} />
              <div style={{ fontSize: "12px", color: "#888", fontWeight: 600, lineHeight: 1.5 }}>Pagamento<br />único via Pix</div>
            </div>
            <div>
              <button className="btn-primary" onClick={() => window.location.href = "/formulario"}>
                Quero meu currículo — R$ 5,00
              </button>
              <p style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>Sem assinatura. Sem cadastro. PDF imediato.</p>
            </div>
          </div>
          {/* Mockup */}
          <div style={{ position: "relative", paddingBottom: "30px" }}>
            <div style={{ background: "#fff", border: `1.5px solid #ddd`, borderRadius: "8px", padding: "28px", boxShadow: `8px 8px 0 ${DARK}` }}>
              <div style={{ borderBottom: `3px solid ${RED}`, paddingBottom: "16px", marginBottom: "16px" }}>
                <div style={{ height: "18px", background: DARK, borderRadius: "2px", width: "58%", marginBottom: "8px" }} />
                <div style={{ height: "10px", background: "#ddd", borderRadius: "2px", width: "78%", marginBottom: "5px" }} />
                <div style={{ height: "10px", background: "#ddd", borderRadius: "2px", width: "48%" }} />
              </div>
              {["OBJETIVO", "EXPERIÊNCIA", "FORMAÇÃO", "HABILIDADES"].map((s, i) => (
                <div key={s} style={{ marginBottom: "14px" }}>
                  <div style={{ height: "8px", background: RED, borderRadius: "2px", width: "30%", marginBottom: "8px" }} />
                  <div style={{ height: "7px", background: "#eee", borderRadius: "2px", width: `${72 + i * 7}%`, marginBottom: "5px" }} />
                  <div style={{ height: "7px", background: "#eee", borderRadius: "2px", width: `${52 + i * 4}%` }} />
                </div>
              ))}
              <div style={{ position: "absolute", top: "12px", right: "12px", background: RED, borderRadius: "4px", padding: "4px 10px" }}>
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Profissional</span>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "0px", right: "-16px", background: DARK, color: "#fff", borderRadius: "8px", padding: "14px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: "11px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Economia de 84%</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "#555", textDecoration: "line-through" }}>R$29,90</span>
                <span style={{ fontSize: "22px", fontWeight: 900, color: RED }}>R$5,00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <div style={{ height: "80px", background: `linear-gradient(to bottom, ${CREAM}, ${DARK})` }} />
      <section style={{ background: DARK, padding: "60px 40px" }}>
          <div className="stats-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { num: `${count.toLocaleString("pt-BR")}+`, label: "Currículos entregues" },
              { num: "2 min", label: "Tempo médio de entrega" },
              { num: "R$ 5,00", label: "Preço único, sem mensalidade" },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: "20px 40px", borderRight: i < 2 ? "1px solid #2a2a2a" : "none", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: RED, letterSpacing: "-1px" }}>{s.num}</div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "6px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

      {/* ANTES E DEPOIS */}
      <div style={{ height: "80px", background: `linear-gradient(to bottom, ${DARK}, ${CREAM})` }} />
      <section style={{ background: CREAM, padding: "80px 40px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-block", border: `1.5px solid ${DARK}`, borderRadius: "2px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>Transformação real</div>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px" }}>
              Veja a diferença<br />
              <span style={{ color: RED, fontStyle: "italic" }}>na prática.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "#777", marginTop: "16px", maxWidth: "520px", margin: "16px auto 0", lineHeight: 1.6 }}>
              Recrutadores levam menos de 10 segundos para descartar um currículo. O seu precisa impressionar desde o primeiro olhar.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "32px", alignItems: "start" }} className="cv-compare-grid">

            {/* ANTES */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: "#e0e0e0", color: "#999", borderRadius: "3px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Antes</div>
                <span style={{ fontSize: "13px", color: "#aaa", fontWeight: 600 }}>Currículo comum — descartado</span>
              </div>
              <div style={{ background: "#fff", border: "1.5px solid #ddd", borderRadius: "6px", padding: "24px", fontFamily: "Arial, sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
                {/* Marca d'agua */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-30deg)", fontSize: "48px", fontWeight: 900, color: "rgba(0,0,0,0.04)", letterSpacing: "-2px", whiteSpace: "nowrap", pointerEvents: "none" }}>DESCARTADO</div>

                {/* Cabeçalho bagunçado */}
                <div style={{ borderBottom: "1px solid #eee", paddingBottom: "12px", marginBottom: "12px" }}>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#333", margin: "0 0 4px" }}>JOAO DA SILVA</p>
                  <p style={{ fontSize: "10px", color: "#999", margin: 0 }}>joaosilva123@hotmail.com | (11)987654321</p>
                </div>

                {/* Objetivo sem sentido */}
                <div style={{ marginBottom: "10px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#555", margin: "0 0 4px", textTransform: "uppercase" }}>Objetivo</p>
                  <p style={{ fontSize: "10px", color: "#888", lineHeight: 1.5, fontStyle: "italic" }}>
                    "Trabalhar em uma empresa boa onde eu possa crescer profissionalmente e aprender mais coisas novas na minha área."
                  </p>
                </div>

                {/* Experiencia mal escrita */}
                <div style={{ marginBottom: "10px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#555", margin: "0 0 6px", textTransform: "uppercase" }}>Experiencia</p>
                  <div style={{ marginBottom: "8px" }}>
                    <p style={{ fontSize: "10px", color: "#333", margin: "0 0 2px" }}>Mercado bom preco - vendedor - 2019 até 2022</p>
                    <p style={{ fontSize: "9px", color: "#aaa", lineHeight: 1.4 }}>
                      fazia atendimento ao cliente, organizava prateleiras, ajudava a fazer inventario e outras coisas
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", color: "#333", margin: "0 0 2px" }}>padaria do zé - caixa - algum tempo</p>
                    <p style={{ fontSize: "9px", color: "#aaa", lineHeight: 1.4 }}>
                      operava o caixa e fazia troco
                    </p>
                  </div>
                </div>

                {/* Formacao */}
                <div style={{ marginBottom: "10px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#555", margin: "0 0 4px", textTransform: "uppercase" }}>Formação</p>
                  <p style={{ fontSize: "9px", color: "#888" }}>ensino medio - escola estadual - 2017</p>
                </div>

                {/* Habilidades aleatórias */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#555", margin: "0 0 4px", textTransform: "uppercase" }}>Habilidades</p>
                  <p style={{ fontSize: "9px", color: "#888", lineHeight: 1.6 }}>
                    word, excel mais ou menos, internet, proativo, comunicativo, trabalho em equipe, responsavel
                  </p>
                </div>

                {/* Problemas sinalizados */}
                <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["Sem formatação", "Objetivo genérico", "Erros de português", "Datas imprecisas", "Texto informal"].map((p) => (
                    <span key={p} style={{ background: "#fff0ee", border: "1px solid #fcc", borderRadius: "2px", padding: "2px 8px", fontSize: "9px", color: RED, fontWeight: 700 }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* SETA */}
            <div className="cv-arrow" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "48px", gap: "8px" }}>
              <div style={{ width: "48px", height: "48px", background: DARK, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", lineHeight: 1.4 }}>nosso<br/>método</span>
            </div>

            {/* DEPOIS */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: RED, color: "#fff", borderRadius: "3px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Depois</div>
                <span style={{ fontSize: "13px", color: "#888", fontWeight: 600 }}>Currículo profissional — aprovado</span>
              </div>

              {/* CV com design moderno de duas colunas */}
              <div style={{ boxShadow: `6px 6px 0 ${RED}`, border: `2px solid ${DARK}`, borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                <div style={{ display: "grid", gridTemplateColumns: "38% 62%" }}>

                  {/* Coluna esquerda — escura */}
                  <div style={{ background: DARK, padding: "20px 16px" }}>
                    {/* Avatar inicial */}
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                      <span style={{ color: "#fff", fontSize: "18px", fontWeight: 900, fontFamily: "Arial, sans-serif" }}>J</span>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 900, color: "#fff", margin: "0 0 2px", fontFamily: "Arial, sans-serif", letterSpacing: "-0.3px", lineHeight: 1.2 }}>João<br/>da Silva</p>
                    <p style={{ fontSize: "8px", color: RED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "6px 0 16px" }}>Vendas · Varejo</p>

                    {/* Contato */}
                    <div style={{ marginBottom: "16px" }}>
                      <p style={{ fontSize: "8px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px", fontFamily: "Arial, sans-serif" }}>Contato</p>
                      {[
                        { icon: "✉", text: "joao.silva@gmail.com" },
                        { icon: "☎", text: "(11) 98765-4321" },
                        { icon: "⊙", text: "São Paulo — SP" },
                      ].map((c) => (
                        <div key={c.text} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "5px" }}>
                          <span style={{ fontSize: "8px", color: RED, marginTop: "1px" }}>{c.icon}</span>
                          <p style={{ fontSize: "8px", color: "#aaa", margin: 0, fontFamily: "Arial, sans-serif", lineHeight: 1.4 }}>{c.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Habilidades */}
                    <div style={{ marginBottom: "16px" }}>
                      <p style={{ fontSize: "8px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px", fontFamily: "Arial, sans-serif" }}>Habilidades</p>
                      {["Atendimento ao cliente", "Controle de estoque", "Pacote Office", "Trabalho em equipe", "Comunicação"].map((h) => (
                        <div key={h} style={{ marginBottom: "5px" }}>
                          <p style={{ fontSize: "8px", color: "#ccc", margin: "0 0 2px", fontFamily: "Arial, sans-serif" }}>{h}</p>
                          <div style={{ height: "3px", background: "#333", borderRadius: "2px" }}>
                            <div style={{ height: "3px", background: RED, borderRadius: "2px", width: `${Math.floor(Math.random() * 30) + 65}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Formação */}
                    <div>
                      <p style={{ fontSize: "8px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px", fontFamily: "Arial, sans-serif" }}>Formação</p>
                      <p style={{ fontSize: "8px", fontWeight: 700, color: "#fff", margin: "0 0 2px", fontFamily: "Arial, sans-serif" }}>Ensino Médio Completo</p>
                      <p style={{ fontSize: "7px", color: "#888", margin: "0 0 1px", fontFamily: "Arial, sans-serif" }}>EE Prof. Álvaro Guião</p>
                      <p style={{ fontSize: "7px", color: RED, fontWeight: 700, fontFamily: "Arial, sans-serif" }}>2017</p>
                    </div>
                  </div>

                  {/* Coluna direita — clara */}
                  <div style={{ background: "#fff", padding: "20px 16px" }}>

                    {/* Objetivo */}
                    <div style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #f0ebe5" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <div style={{ width: "16px", height: "2px", background: RED }} />
                        <p style={{ fontSize: "8px", fontWeight: 800, color: DARK, textTransform: "uppercase", letterSpacing: "1.5px", margin: 0, fontFamily: "Arial, sans-serif" }}>Objetivo</p>
                      </div>
                      <p style={{ fontSize: "8px", color: "#555", lineHeight: 1.6, margin: 0, fontFamily: "Arial, sans-serif" }}>
                        Profissional de vendas com 4 anos de experiência no varejo. Busca posição para aplicar expertise em atendimento ao cliente e gestão de ponto de venda em empresa de médio ou grande porte.
                      </p>
                    </div>

                    {/* Experiências */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                        <div style={{ width: "16px", height: "2px", background: RED }} />
                        <p style={{ fontSize: "8px", fontWeight: 800, color: DARK, textTransform: "uppercase", letterSpacing: "1.5px", margin: 0, fontFamily: "Arial, sans-serif" }}>Experiência</p>
                      </div>

                      {[
                        {
                          cargo: "Vendedor",
                          empresa: "Mercado Bom Preço",
                          periodo: "Jan/2019 — Dez/2022",
                          desc: "Atendimento ao cliente, controle de estoque e reposição. Treinamento de novos colaboradores e participação em inventários mensais."
                        },
                        {
                          cargo: "Operador de Caixa",
                          empresa: "Padaria São José",
                          periodo: "Mar/2018 — Dez/2018",
                          desc: "Operação de caixa, controle de pagamentos em dinheiro, cartão e Pix. Fechamento e conciliação de caixa diário."
                        }
                      ].map((exp, i) => (
                        <div key={i} style={{ marginBottom: "10px", paddingLeft: "8px", borderLeft: `2px solid ${i === 0 ? RED : "#ddd"}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                            <p style={{ fontSize: "9px", fontWeight: 800, color: DARK, margin: 0, fontFamily: "Arial, sans-serif" }}>{exp.cargo}</p>
                            <p style={{ fontSize: "7px", color: "#bbb", margin: 0, fontFamily: "Arial, sans-serif", whiteSpace: "nowrap" }}>{exp.periodo}</p>
                          </div>
                          <p style={{ fontSize: "8px", color: RED, fontWeight: 700, margin: "0 0 3px", fontFamily: "Arial, sans-serif" }}>{exp.empresa}</p>
                          <p style={{ fontSize: "7.5px", color: "#777", lineHeight: 1.5, margin: 0, fontFamily: "Arial, sans-serif" }}>{exp.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Selos de aprovação */}
                <div style={{ background: "#f8f8f8", borderTop: "1px solid #eee", padding: "8px 16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["Design moderno", "Duas colunas", "Linguagem profissional", "Datas precisas"].map((p) => (
                    <span key={p} style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "2px", padding: "2px 8px", fontSize: "8px", color: "#16a34a", fontWeight: 700 }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* CTA abaixo */}
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <button className="btn-primary" onClick={() => window.location.href = "/formulario"}>
              Quero o meu assim — R$ 5,00
            </button>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <div style={{ height: "80px", background: `linear-gradient(to bottom, ${CREAM}, ${DARK})` }} />
      <section style={{ background: DARK, color: "#fff", padding: "80px 40px 100px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "20px" }}>
              <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1 }}>Como funciona?</h2>
              <p style={{ color: "#666", fontSize: "15px", maxWidth: "320px", lineHeight: 1.6 }}>Quatro passos. Do zero ao currículo profissional em menos de 2 minutos.</p>
            </div>
            <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
              {[
                { n: "01", title: "Preencha seus dados", desc: "Nome, experiências, formação e habilidades. Simples, direto no celular." },
                { n: "02", title: "Pague R$ 5,00 no Pix", desc: "Instantâneo e seguro. Sem cartão, sem cadastro, sem burocracia." },
                { n: "03", title: "O método organiza tudo", desc: "Padrão profissional, estrutura validada, linguagem de mercado." },
                { n: "04", title: "Revise e baixe o PDF", desc: "Edite o que quiser. Baixe e envie para as vagas na hora." },
              ].map((s) => (
                <div key={s.n} className="step-card">
                  <div className="step-num" style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "40px" }}>{s.n}</div>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.3 }}>{s.title}</h3>
                  <p className="step-desc" style={{ fontSize: "13px", color: "#666", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* PARA QUEM */}
      <div style={{ height: "80px", background: `linear-gradient(to bottom, ${DARK}, ${CREAM})` }} />
      <section style={{ background: CREAM, padding: "80px 40px 100px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ marginBottom: "60px" }}>
              <div style={{ display: "inline-block", border: `1.5px solid ${DARK}`, borderRadius: "2px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>Para quem é</div>
              <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
                Se você se encaixa<br />em um desses perfis,<br /><span style={{ color: RED, fontStyle: "italic" }}>esse método é pra você.</span>
              </h2>
            </div>
            <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
              {[
                { title: "Primeiro emprego", desc: "Nunca trabalhou com carteira assinada e não sabe por onde começar." },
                { title: "Recolocação", desc: "Foi demitido e precisa se reposicionar rápido no mercado." },
                { title: "Mudança de área", desc: "Quer migrar de setor mas não sabe como valorizar sua experiência." },
                { title: "Sem tempo", desc: "Trabalha o dia todo e não tem horas para ficar montando currículo." },
                { title: "Sem computador", desc: "Só tem o celular e precisa de uma solução que funcione nele." },
                { title: "Currículo antigo", desc: "Tem um currículo desatualizado que está atrapalhando sua carreira." },
              ].map((c) => (
                <div key={c.title} className="card-white">
                  <div style={{ width: "32px", height: "3px", background: RED, marginBottom: "20px" }} />
                  <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 10px" }}>{c.title}</h3>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* DEPOIMENTOS */}
      <div style={{ height: "80px", background: `linear-gradient(to bottom, ${CREAM}, ${DARK})` }} />
      <section style={{ background: DARK, color: "#fff", padding: "80px 40px 100px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-1.5px", margin: "0 0 60px", lineHeight: 1.1 }}>
              Quem usou,<br /><span style={{ color: RED, fontStyle: "italic" }}>aprovou.</span>
            </h2>
            <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
              {[
                { nome: "Fernanda S.", cidade: "São Paulo — SP", texto: "Nunca soube fazer currículo e sempre pedia ajuda pra alguém. Fiz sozinha em 5 minutos e já fui chamada pra entrevista na semana seguinte.", destaque: false },
                { nome: "Carlos M.", cidade: "Fortaleza — CE", texto: "Tava desempregado há 4 meses. Refiz meu currículo aqui e em 1 semana já tava com proposta em mão. Vale muito mais do que R$ 5,00.", destaque: true },
                { nome: "Juliana R.", cidade: "Belo Horizonte — MG", texto: "Minha filha usou para conseguir o primeiro emprego. O currículo ficou muito profissional, parece que foi feito por especialista de RH.", destaque: false },
              ].map((d) => (
                <div key={d.nome} style={{ background: d.destaque ? RED : "#1a1a1a", padding: "36px 28px", borderLeft: "1px solid #2a2a2a" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                    {[...Array(5)].map((_, j) => <div key={j} style={{ width: "10px", height: "10px", background: d.destaque ? "rgba(255,255,255,0.6)" : RED, borderRadius: "50%" }} />)}
                  </div>
                  <p style={{ fontSize: "15px", color: d.destaque ? "rgba(255,255,255,0.9)" : "#ccc", lineHeight: 1.7, margin: "0 0 24px", fontStyle: "italic" }}>"{d.texto}"</p>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>{d.nome}</div>
                  <div style={{ fontSize: "11px", color: d.destaque ? "rgba(255,255,255,0.5)" : "#555", letterSpacing: "0.5px", marginTop: "2px" }}>{d.cidade}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* CTA FINAL */}
      <div style={{ height: "80px", background: `linear-gradient(to bottom, ${DARK}, ${RED})` }} />
      <section style={{ background: RED, padding: "100px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>Promoção por tempo limitado</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "clamp(20px, 3vw, 30px)", color: "rgba(255,255,255,0.45)", textDecoration: "line-through", fontWeight: 700 }}>R$ 29,90</span>
            <h2 style={{ fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 900, color: "#fff", letterSpacing: "-3px", lineHeight: 1 }}>R$ 5,00</h2>
          </div>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", margin: "0 0 40px", lineHeight: 1.6 }}>Pagamento único via Pix.<br />Currículo profissional em 2 minutos.</p>
          <button className="btn-inv" onClick={() => window.location.href = "/formulario"}>Gerar meu currículo agora</button>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
            {["Pagamento seguro via Pix", "Entrega imediata", "Funciona no celular"].map((t) => (
              <span key={t} style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div style={{ height: "80px", background: `linear-gradient(to bottom, ${RED}, ${CREAM})` }} />
      <section style={{ background: CREAM, padding: "80px 40px 100px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div style={{ display: "inline-block", border: `1.5px solid ${DARK}`, borderRadius: "2px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>Dúvidas frequentes</div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, margin: "0 0 48px" }}>
              Perguntas sobre<br /><span style={{ color: RED, fontStyle: "italic" }}>o método.</span>
            </h2>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1.5px solid #e0dbd4` }}>
                <button className="faq-btn" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-icon">{faqOpen === i ? "−" : "+"}</span>
                </button>
                {faqOpen === i && (
                  <div style={{ paddingBottom: "24px", fontSize: "15px", color: "#555", lineHeight: 1.75, animation: "fadeUp 0.25s ease forwards" }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

      {/* RODAPÉ */}
      <footer style={{ background: DARK, padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <Logo light />
        <p style={{ fontSize: "12px", color: "#555" }}>© 2026 Currículo Pro — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <span style={{ fontWeight: 900, fontSize: "17px", letterSpacing: "-0.5px", color: light ? "#fff" : "#111" }}>
        CURRÍCULO <span style={{ color: "#d0290a" }}>PRO</span>
      </span>
    </div>
  );
}
