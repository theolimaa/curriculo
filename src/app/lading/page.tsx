"use client";

import { useState, useEffect } from "react";

export default function LandingPage() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: "#f5f0eb", color: "#111", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .cta-btn:hover { background: #111 !important; color: #f5f0eb !important; border-color: #111 !important; }
        .cta-btn-inv:hover { background: #f5f0eb !important; color: #111 !important; border-color: #f5f0eb !important; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .card-hover { transition: all 0.25s ease; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .cards-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* BARRA TOPO */}
      <div style={{ background: "#d0290a", padding: "10px 20px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "80px", animation: "ticker 20s linear infinite", width: "max-content" }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {count.toLocaleString("pt-BR")} currículos gerados — Pagamento via Pix — PDF em minutos — Aprovado por recrutadores
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{ background: "#f5f0eb", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #111" }}>
        <div style={{ fontWeight: 900, fontSize: "18px", letterSpacing: "-0.5px" }}>
          CURRÍCULO <span style={{ color: "#d0290a" }}>IA</span>
        </div>
        <button className="cta-btn" onClick={() => window.location.href = "/"}
          style={{ background: "#d0290a", color: "#fff", border: "2px solid #d0290a", borderRadius: "4px", padding: "10px 24px", fontWeight: 800, fontSize: "13px", letterSpacing: "0.5px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s" }}>
          Gerar meu currículo
        </button>
      </nav>

      {/* HERO */}
      <section style={{ padding: "80px 40px 0", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="hero-grid fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "end" }}>
          <div>
            <div style={{ display: "inline-block", border: "1.5px solid #111", borderRadius: "2px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px" }}>
              Inteligência Artificial
            </div>
            <h1 style={{ fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 24px" }}>
              Currículo<br />
              profissional<br />
              <span style={{ color: "#d0290a", fontStyle: "italic" }}>em 2 minutos.</span>
            </h1>
            <p style={{ fontSize: "17px", color: "#444", lineHeight: 1.65, margin: "0 0 36px", maxWidth: "420px" }}>
              Você preenche seus dados, a IA organiza e profissionaliza tudo, você revisa e baixa o PDF pronto para enviar.
            </p>
            <button className="cta-btn" onClick={() => window.location.href = "/"}
              style={{ background: "#d0290a", color: "#fff", border: "2px solid #d0290a", borderRadius: "4px", padding: "16px 36px", fontWeight: 900, fontSize: "16px", cursor: "pointer", letterSpacing: "0.3px", transition: "all 0.2s", textTransform: "uppercase" }}>
              Quero meu currículo — R$ 4,90
            </button>
            <p style={{ fontSize: "12px", color: "#888", marginTop: "12px", letterSpacing: "0.3px" }}>
              Pagamento único via Pix. Sem assinatura.
            </p>
          </div>

          {/* MOCKUP */}
          <div style={{ position: "relative", paddingBottom: "40px" }}>
            <div style={{ background: "#fff", border: "1.5px solid #ddd", borderRadius: "8px", padding: "28px", boxShadow: "8px 8px 0 #111", position: "relative", zIndex: 2 }}>
              <div style={{ borderBottom: "3px solid #d0290a", paddingBottom: "16px", marginBottom: "16px" }}>
                <div style={{ height: "18px", background: "#111", borderRadius: "2px", width: "60%", marginBottom: "8px" }} />
                <div style={{ height: "10px", background: "#ddd", borderRadius: "2px", width: "80%", marginBottom: "6px" }} />
                <div style={{ height: "10px", background: "#ddd", borderRadius: "2px", width: "50%" }} />
              </div>
              {["OBJETIVO", "EXPERIÊNCIA", "FORMAÇÃO", "HABILIDADES"].map((s, i) => (
                <div key={s} style={{ marginBottom: "14px" }}>
                  <div style={{ height: "9px", background: "#d0290a", borderRadius: "2px", width: "35%", marginBottom: "8px" }} />
                  <div style={{ height: "8px", background: "#eee", borderRadius: "2px", width: `${70 + i * 8}%`, marginBottom: "5px" }} />
                  <div style={{ height: "8px", background: "#eee", borderRadius: "2px", width: `${50 + i * 5}%` }} />
                </div>
              ))}
              <div style={{ position: "absolute", top: "12px", right: "12px", background: "#d0290a", borderRadius: "4px", padding: "4px 10px" }}>
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Profissional</span>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "20px", right: "-10px", background: "#111", color: "#fff", borderRadius: "6px", padding: "12px 18px", zIndex: 3 }}>
              <div style={{ fontSize: "20px", fontWeight: 900, color: "#d0290a" }}>R$ 4,90</div>
              <div style={{ fontSize: "10px", color: "#999", letterSpacing: "0.5px" }}>pagamento único</div>
            </div>
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section style={{ background: "#111", margin: "60px 0 0", padding: "48px 40px" }}>
        <div className="stats-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
          {[
            { num: `${count.toLocaleString("pt-BR")}+`, label: "Currículos gerados" },
            { num: "2 min", label: "Tempo médio de entrega" },
            { num: "R$ 4,90", label: "Preço único, sem mensalidade" },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: "20px 40px", borderRight: i < 2 ? "1px solid #333" : "none", textAlign: "center" }}>
              <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: "#d0290a", letterSpacing: "-1px" }}>{s.num}</div>
              <div style={{ fontSize: "13px", color: "#888", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ padding: "100px 40px", maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 24px" }}>
            Você perdeu vagas<br />por causa do<br />
            <span style={{ color: "#d0290a", fontStyle: "italic" }}>seu currículo.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.7, margin: "0 0 16px" }}>
            Recrutadores levam menos de 10 segundos para descartar um currículo. Formatação ruim, objetivo genérico, experiências mal escritas — e você nem sabe por que não é chamado.
          </p>
          <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.7 }}>
            A IA analisa seus dados e entrega um currículo com linguagem profissional, estrutura correta e formatação que chama atenção.
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ background: "#fff", border: "1.5px solid #ddd", borderRadius: "8px", padding: "20px", opacity: 0.45, marginBottom: "-30px", position: "relative", zIndex: 1 }}>
            <div style={{ height: "12px", background: "#ccc", borderRadius: "2px", width: "45%", marginBottom: "20px" }} />
            {[60, 80, 40, 70].map((w, i) => (
              <div key={i} style={{ height: "8px", background: "#e5e5e5", borderRadius: "2px", width: `${w}%`, marginBottom: "8px" }} />
            ))}
            <div style={{ position: "absolute", top: "10px", right: "10px", background: "#e5e5e5", borderRadius: "3px", padding: "3px 8px", fontSize: "9px", fontWeight: 800, color: "#999", textTransform: "uppercase" }}>Descartado</div>
          </div>
          <div style={{ background: "#fff", border: "2px solid #111", borderRadius: "8px", padding: "20px", boxShadow: "6px 6px 0 #d0290a", position: "relative", zIndex: 2, marginLeft: "30px" }}>
            <div style={{ height: "14px", background: "#111", borderRadius: "2px", width: "55%", marginBottom: "8px" }} />
            <div style={{ height: "8px", background: "#ddd", borderRadius: "2px", width: "75%", marginBottom: "16px" }} />
            {[85, 65, 90, 70].map((w, i) => (
              <div key={i} style={{ height: "8px", background: i % 2 === 0 ? "#f0d0cc" : "#e5e5e5", borderRadius: "2px", width: `${w}%`, marginBottom: "8px" }} />
            ))}
            <div style={{ position: "absolute", top: "10px", right: "10px", background: "#d0290a", borderRadius: "3px", padding: "3px 8px", fontSize: "9px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>Aprovado</div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA — DARK */}
      <section style={{ background: "#111", color: "#fff", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Como funciona?
            </h2>
            <p style={{ color: "#666", fontSize: "15px", maxWidth: "320px", lineHeight: 1.6 }}>
              Quatro passos simples. Do zero ao currículo profissional em menos de 2 minutos.
            </p>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
            {[
              { n: "01", title: "Preencha seus dados", desc: "Nome, experiências, formação e habilidades. Direto no celular." },
              { n: "02", title: "Pague R$ 4,90 no Pix", desc: "Instantâneo e seguro. Sem cartão, sem burocracia." },
              { n: "03", title: "A IA monta tudo", desc: "Linguagem profissional, estrutura correta, formatação impecável." },
              { n: "04", title: "Revise e baixe o PDF", desc: "Edite o que quiser. Baixe e envie para as vagas." },
            ].map((s, i) => (
              <div key={s.n} className="card-hover" style={{ background: i === 0 ? "#d0290a" : "#1a1a1a", border: "1px solid #2a2a2a", padding: "32px 24px" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: i === 0 ? "rgba(255,255,255,0.6)" : "#555", textTransform: "uppercase", marginBottom: "40px" }}>{s.n}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: i === 0 ? "rgba(255,255,255,0.75)" : "#666", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section style={{ padding: "100px 40px", background: "#f5f0eb" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <div style={{ display: "inline-block", border: "1.5px solid #111", borderRadius: "2px", padding: "4px 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>
              Para quem é
            </div>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Se você se encaixa<br />em um desses perfis,<br />
              <span style={{ color: "#d0290a", fontStyle: "italic" }}>esse produto é pra você.</span>
            </h2>
          </div>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
            {[
              { title: "Primeiro emprego", desc: "Nunca trabalhou com carteira assinada e não sabe por onde começar." },
              { title: "Recolocação", desc: "Foi demitido e precisa se reposicionar rápido no mercado." },
              { title: "Mudança de área", desc: "Quer migrar de setor mas não sabe como valorizar sua experiência." },
              { title: "Sem tempo", desc: "Trabalha o dia todo e não tem horas para ficar montando currículo." },
              { title: "Sem computador", desc: "Só tem o celular e precisa de uma solução que funcione nele." },
              { title: "Currículo antigo", desc: "Tem um currículo desatualizado e feio que está atrapalhando sua carreira." },
            ].map((c) => (
              <div key={c.title} className="card-hover" style={{ background: "#fff", border: "1.5px solid #ddd", padding: "32px 28px" }}>
                <div style={{ width: "32px", height: "3px", background: "#d0290a", marginBottom: "20px" }} />
                <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 10px" }}>{c.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS — DARK */}
      <section style={{ background: "#111", color: "#fff", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-1.5px", margin: "0 0 60px", lineHeight: 1.1 }}>
            Quem usou,<br />
            <span style={{ color: "#d0290a", fontStyle: "italic" }}>aprovou.</span>
          </h2>
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
            {[
              { nome: "Fernanda S.", cidade: "São Paulo — SP", texto: "Nunca soube fazer currículo e sempre pedia ajuda pra alguém. Fiz sozinha em 5 minutos e já fui chamada pra entrevista na semana seguinte.", destaque: false },
              { nome: "Carlos M.", cidade: "Fortaleza — CE", texto: "Tava desempregado há 4 meses. Refiz meu currículo aqui e em 1 semana já tava com proposta em mão. Vale muito mais do que R$ 4,90.", destaque: true },
              { nome: "Juliana R.", cidade: "Belo Horizonte — MG", texto: "Minha filha usou para conseguir o primeiro emprego. O currículo ficou muito profissional, parece que foi feito por um especialista de RH.", destaque: false },
            ].map((d) => (
              <div key={d.nome} style={{ background: d.destaque ? "#d0290a" : "#1a1a1a", padding: "36px 28px", borderLeft: "1px solid #2a2a2a" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} style={{ width: "10px", height: "10px", background: d.destaque ? "rgba(255,255,255,0.6)" : "#d0290a", borderRadius: "50%" }} />
                  ))}
                </div>
                <p style={{ fontSize: "15px", color: d.destaque ? "rgba(255,255,255,0.9)" : "#ccc", lineHeight: 1.7, margin: "0 0 24px", fontStyle: "italic" }}>
                  "{d.texto}"
                </p>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>{d.nome}</div>
                  <div style={{ fontSize: "11px", color: d.destaque ? "rgba(255,255,255,0.5)" : "#555", letterSpacing: "0.5px", marginTop: "2px" }}>{d.cidade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL — VERMELHO */}
      <section style={{ background: "#d0290a", padding: "100px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>
            Oferta
          </div>
          <h2 style={{ fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 900, color: "#fff", letterSpacing: "-3px", lineHeight: 1, margin: "0 0 16px" }}>
            R$ 4,90
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", margin: "0 0 40px", lineHeight: 1.6 }}>
            Pagamento único via Pix.<br />Currículo profissional em 2 minutos.
          </p>
          <button className="cta-btn-inv" onClick={() => window.location.href = "/"}
            style={{ background: "#fff", color: "#d0290a", border: "2px solid #fff", borderRadius: "4px", padding: "18px 48px", fontWeight: 900, fontSize: "17px", cursor: "pointer", letterSpacing: "0.3px", transition: "all 0.2s", textTransform: "uppercase" }}>
            Gerar meu currículo agora
          </button>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
            {["Pagamento seguro via Pix", "Entrega imediata", "Funciona no celular"].map((t) => (
              <span key={t} style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer style={{ background: "#111", padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px", color: "#fff" }}>
          CURRÍCULO <span style={{ color: "#d0290a" }}>IA</span>
        </div>
        <p style={{ fontSize: "12px", color: "#555" }}>
          © 2026 Currículo IA — Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
