import jsPDF from "jspdf";
import { CVData, Habilidade } from "./types";

const temas: Record<string, { rgb: [number,number,number]; darkRgb: [number,number,number] }> = {
  vermelho: { rgb: [208,41,10],  darkRgb: [17,17,17] },
  azul:     { rgb: [26,86,219],  darkRgb: [15,23,42] },
  verde:    { rgb: [4,120,87],   darkRgb: [5,46,22] },
  preto:    { rgb: [30,30,30],   darkRgb: [17,17,17] },
};

const nivelPct: Record<string, number> = {
  basico: 35,
  intermediario: 68,
  avancado: 92,
};

const nivelLabel: Record<string, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function generatePDF(cv: CVData): void {
  const t = temas[cv.estilo || "vermelho"];
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const [r,g,b] = t.rgb;
  const [dr,dg,db] = t.darkRgb;

  // ── HEADER ESCURO ────────────────────────────────────────
  doc.setFillColor(dr, dg, db);
  doc.rect(0, 0, W, 58, "F");

  // Faixa colorida topo
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, W, 5, "F");

  // Nome GIGANTE (estilo bold)
  const partes = (cv.nome || "").split(" ");
  const primeiro = partes[0] || "";
  const sobrenome = partes.slice(1).join(" ");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(primeiro.toUpperCase(), 14, 28);

  // Sobrenome: usa cor de destaque, mas no tema preto usa branco para contraste
  const [sr, sg, sb] = (cv.estilo === "preto") ? [200, 200, 200] : [r, g, b];
  doc.setTextColor(sr, sg, sb);
  doc.setFontSize(24);
  doc.text(sobrenome.toUpperCase(), 14, 40);

  // Cargo
  const exp0 = cv.experiencias?.find(e => e.cargo);
  if (exp0) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    doc.text(exp0.cargo.toUpperCase(), 14, 50);
  }

  // Foto (canto direito do header)
  if (cv.foto) {
    try {
      doc.addImage(cv.foto, "JPEG", W - 56, 5, 44, 46, undefined, "FAST");
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(2);
      doc.rect(W - 56, 5, 44, 46);
    } catch {}
  } else {
    doc.setFillColor(r, g, b);
    doc.rect(W - 56, 5, 44, 46, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text((cv.nome || "?")[0].toUpperCase(), W - 34, 33, { align: "center" });
  }

  // Faixa contatos (linha vermelha abaixo do header)
  doc.setFillColor(r, g, b);
  doc.rect(0, 58, W, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const cts = [cv.telefone, cv.email, cv.cidade].filter(Boolean) as string[];
  let cx = 14;
  cts.forEach((c, i) => {
    if (i > 0) {
      doc.setTextColor(255, 255, 255);
      doc.text("·", cx - 5, 64);
    }
    doc.text(c, cx, 64);
    cx += doc.getTextWidth(c) + 10;
  });

  // ── CORPO — DUAS COLUNAS ─────────────────────────────────
  const xL = 14, xR = 122;
  const wL = 99, wR = 78;
  let yL = 80, yR = 80;

  // ── ESQ: PERFIL ──────────────────────────────────────────
  if (cv.objetivo) {
    yL = titulo(doc, "PERFIL PROFISSIONAL", xL, yL, t.rgb, wL);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80, 80, 80);
    const ls = doc.splitTextToSize(cv.objetivo, wL);
    doc.text(ls, xL, yL);
    yL += ls.length * 4.8 + 10;
  }

  // ── ESQ: EXPERIÊNCIAS ────────────────────────────────────
  const exps = cv.experiencias?.filter(e => e.empresa) || [];
  if (exps.length) {
    yL = titulo(doc, "EXPERIÊNCIA PROFISSIONAL", xL, yL, t.rgb, wL);
    exps.forEach((exp, idx) => {
      // Borda esquerda colorida no primeiro, cinza nos demais
      doc.setFillColor(idx === 0 ? r : 200, idx === 0 ? g : 200, idx === 0 ? b : 200);
      doc.rect(xL, yL - 2, 2, 22, "F");

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 17, 17);
      doc.text(exp.cargo || "", xL + 6, yL + 1);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(r, g, b);
      doc.text(exp.empresa || "", xL + 6, yL + 6.5);

      if (exp.periodo) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 160, 160);
        const pw = doc.getTextWidth(exp.periodo);
        doc.text(exp.periodo, xL + wL - pw, yL + 6.5);
      }

      if (exp.descricao) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(90, 90, 90);
        const dl = doc.splitTextToSize(exp.descricao, wL - 8);
        doc.text(dl, xL + 6, yL + 12);
        yL += 12 + dl.length * 4.2 + 8;
      } else {
        yL += 20;
      }
    });
  }

  // ── DIR: HABILIDADES ─────────────────────────────────────
  const habs = Array.isArray(cv.habilidades)
    ? cv.habilidades.filter((h: any) => h.nome)
    : [];

  if (habs.length) {
    yR = titulo(doc, "HABILIDADES", xR, yR, t.rgb, wR);

    habs.slice(0, 8).forEach((h: Habilidade) => {
      const pct = nivelPct[h.nivel] || 68;
      const label = nivelLabel[h.nivel] || "Intermediário";

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(h.nome, xR, yR);

      // Label nível (direita)
      doc.setFontSize(6.5);
      doc.setTextColor(r, g, b);
      doc.setFont("helvetica", "bold");
      const lw = doc.getTextWidth(label);
      doc.text(label, xR + wR - lw, yR);

      // Barra fundo
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(xR, yR + 1.5, wR, 3, 1, 1, "F");
      // Barra preenchida
      doc.setFillColor(r, g, b);
      doc.roundedRect(xR, yR + 1.5, wR * (pct / 100), 3, 1, 1, "F");

      yR += 11;
    });
    yR += 6;
  }

  // ── DIR: FORMAÇÃO ─────────────────────────────────────────
  const forms = cv.formacao?.filter(f => f.curso) || [];
  if (forms.length) {
    yR = titulo(doc, "FORMAÇÃO ACADÊMICA", xR, yR, t.rgb, wR);
    forms.forEach(f => {
      doc.setFillColor(r, g, b);
      doc.rect(xR, yR - 1, 3, 12, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 17, 17);
      const cl = doc.splitTextToSize(f.curso, wR - 6);
      doc.text(cl, xR + 6, yR);
      yR += cl.length * 4.5;

      if (f.instituicao) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(f.instituicao, xR + 6, yR);
        yR += 4.5;
      }
      if (f.ano) {
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r, g, b);
        doc.text(f.ano, xR + 6, yR);
        yR += 8;
      }
    });
  }

  // ── LINHA DIVISÓRIA COLUNAS ──────────────────────────────
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(xR - 6, 76, xR - 6, Math.max(yL, yR) + 4);

  // ── RODAPÉ ───────────────────────────────────────────────
  doc.setFillColor(r, g, b);
  doc.rect(0, H - 8, W, 8, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text("Gerado por Currículo Pro", W / 2, H - 3.5, { align: "center" });

  doc.save(`curriculo-${(cv.nome || "pro").replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

function titulo(doc: jsPDF, txt: string, x: number, y: number, rgb: [number,number,number], w: number): number {
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 17, 17);
  doc.text(txt, x, y);
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  doc.rect(x, y + 1.5, 20, 1.2, "F");
  doc.setFillColor(220, 220, 220);
  doc.rect(x + 21, y + 1.5, w - 21, 0.5, "F");
  return y + 11;
}
