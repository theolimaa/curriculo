import jsPDF from "jspdf";
import { CVData } from "./types";

const temas: Record<string, { rgb: [number,number,number]; darkRgb: [number,number,number] }> = {
  vermelho: { rgb: [208,41,10],   darkRgb: [17,17,17] },
  azul:     { rgb: [26,86,219],   darkRgb: [15,23,42] },
  verde:    { rgb: [4,120,87],    darkRgb: [5,46,22] },
  preto:    { rgb: [30,30,30],    darkRgb: [17,17,17] },
};

export function generatePDF(cv: CVData): void {
  const tema = temas[cv.estilo || "vermelho"];
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297;

  // ── HEADER ──────────────────────────────────────────────
  doc.setFillColor(...tema.darkRgb);
  doc.rect(0, 0, W, 54, "F");

  // Faixa colorida topo
  doc.setFillColor(...tema.rgb);
  doc.rect(0, 0, W, 4, "F");

  // Foto
  if (cv.foto) {
    try {
      doc.addImage(cv.foto, "JPEG", W - 52, 8, 38, 40, undefined, "FAST");
      doc.setDrawColor(...tema.rgb);
      doc.setLineWidth(1.5);
      doc.rect(W - 52, 8, 38, 40);
    } catch {}
  } else {
    doc.setFillColor(...tema.rgb);
    doc.rect(W - 52, 8, 38, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(((cv.nome || "?")[0]).toUpperCase(), W - 33, 33, { align: "center" });
  }

  // Nome
  const partes = (cv.nome || "").split(" ");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text((partes[0] || "").toUpperCase(), 14, 22);
  doc.setFontSize(17);
  doc.setTextColor(tema.rgb[0], tema.rgb[1], tema.rgb[2]);
  doc.text(partes.slice(1).join(" ").toUpperCase(), 14, 31);

  // Cargo
  const exp0 = cv.experiencias?.find(e => e.cargo);
  if (exp0) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(170, 170, 170);
    doc.text(exp0.cargo.toUpperCase(), 14, 40);
  }

  // Linha contatos
  const cts = [cv.telefone, cv.email, cv.cidade].filter(Boolean) as string[];
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  let cx = 14;
  cts.forEach((c, i) => {
    if (i > 0) {
      doc.setTextColor(...tema.rgb);
      doc.text("•", cx - 4, 49);
      doc.setTextColor(150, 150, 150);
    }
    doc.text(c, cx, 49);
    cx += doc.getTextWidth(c) + 8;
  });

  // ── COLUNAS ──────────────────────────────────────────────
  const xL = 14, xR = 120;
  const wL = 97, wR = 80;
  let yL = 64, yR = 64;

  // ── ESQ: OBJETIVO ────────────────────────────────────────
  if (cv.objetivo) {
    yL = titulo(doc, "PERFIL PROFISSIONAL", xL, yL, tema, wL);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const ls = doc.splitTextToSize(cv.objetivo, wL);
    doc.text(ls, xL, yL);
    yL += ls.length * 4.5 + 10;
  }

  // ── ESQ: EXPERIÊNCIAS ────────────────────────────────────
  const exps = cv.experiencias?.filter(e => e.empresa) || [];
  if (exps.length) {
    yL = titulo(doc, "EXPERIÊNCIA PROFISSIONAL", xL, yL, tema, wL);
    exps.forEach((exp) => {
      // Bolinha timeline
      doc.setFillColor(...tema.rgb);
      doc.circle(xL + 1.5, yL, 2, "F");
      // Linha vertical
      doc.setDrawColor(...tema.rgb);
      doc.setLineWidth(0.3);
      doc.line(xL + 1.5, yL + 2, xL + 1.5, yL + 20);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 17, 17);
      doc.text(exp.cargo || "", xL + 6, yL + 1);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...tema.rgb);
      doc.text(exp.empresa || "", xL + 6, yL + 6);

      if (exp.periodo) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(140, 140, 140);
        const pw = doc.getTextWidth(exp.periodo);
        doc.text(exp.periodo, xL + wL - pw, yL + 6);
      }

      if (exp.descricao) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const dl = doc.splitTextToSize(exp.descricao, wL - 8);
        doc.text(dl, xL + 6, yL + 11);
        yL += 11 + dl.length * 4.2 + 8;
      } else {
        yL += 18;
      }
    });
    yL += 4;
  }

  // ── DIR: HABILIDADES ─────────────────────────────────────
  if (cv.habilidades) {
    yR = titulo(doc, "HABILIDADES", xR, yR, tema, wR);
    const habs = cv.habilidades.split(/[,;\n]/).map(h => h.trim()).filter(Boolean);
    const pcts = [92, 85, 78, 88, 72, 80, 90, 75];
    habs.slice(0, 8).forEach((hab, i) => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(hab, xR, yR);
      // Barra fundo
      doc.setFillColor(225, 225, 225);
      doc.roundedRect(xR, yR + 1.5, wR, 2.5, 1, 1, "F");
      // Barra preenchida
      doc.setFillColor(...tema.rgb);
      doc.roundedRect(xR, yR + 1.5, wR * (pcts[i % pcts.length] / 100), 2.5, 1, 1, "F");
      yR += 10;
    });
    yR += 6;
  }

  // ── DIR: FORMAÇÃO ────────────────────────────────────────
  const forms = cv.formacao?.filter(f => f.curso) || [];
  if (forms.length) {
    yR = titulo(doc, "FORMAÇÃO ACADÊMICA", xR, yR, tema, wR);
    forms.forEach(f => {
      doc.setFillColor(...tema.rgb);
      doc.rect(xR, yR - 1, 3, 3, "F");

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
        doc.setTextColor(...tema.rgb);
        doc.text(f.ano, xR + 6, yR);
        yR += 8;
      }
    });
  }

  // ── DIVISÓRIA ENTRE COLUNAS ──────────────────────────────
  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(xR - 5, 60, xR - 5, Math.max(yL, yR) + 4);

  // ── RODAPÉ ───────────────────────────────────────────────
  doc.setFillColor(...tema.rgb);
  doc.rect(0, H - 8, W, 8, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text("Gerado por Currículo Pro", W / 2, H - 3.5, { align: "center" });

  doc.save(`curriculo-${(cv.nome || "pro").replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

function titulo(doc: jsPDF, txt: string, x: number, y: number, tema: any, w: number): number {
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 17, 17);
  doc.text(txt, x, y);
  doc.setFillColor(...tema.rgb);
  doc.rect(x, y + 1.5, 18, 1, "F");
  doc.setFillColor(220, 220, 220);
  doc.rect(x + 19, y + 1.5, w - 19, 0.5, "F");
  return y + 10;
}
