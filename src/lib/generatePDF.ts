import jsPDF from "jspdf";
import { CVData, Habilidade } from "./types";

const temas: Record<string, { rgb: [number,number,number]; darkRgb: [number,number,number] }> = {
  vermelho: { rgb: [208,41,10],  darkRgb: [17,17,17] },
  azul:     { rgb: [26,86,219],  darkRgb: [15,23,42] },
  verde:    { rgb: [4,120,87],   darkRgb: [5,46,22] },
  preto:    { rgb: [40,40,40],   darkRgb: [17,17,17] },
};

const nivelPct: Record<string, number> = { basico: 35, intermediario: 68, avancado: 92 };

export function generatePDF(cv: CVData): void {
  const t = temas[cv.estilo || "vermelho"];
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const [r,g,b] = t.rgb;
  const [dr,dg,db] = t.darkRgb;

  const SIDEBAR_W = 68;
  const CONTENT_X = SIDEBAR_W + 10;
  const CONTENT_W = W - CONTENT_X - 10;

  // ── SIDEBAR ESCURA ───────────────────────────────────────
  doc.setFillColor(dr, dg, db);
  doc.rect(0, 0, SIDEBAR_W, H, "F");

  // Borda colorida esquerda
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, 4, H, "F");

  // Avatar círculo
  const avatarY = 22;
  if (cv.foto) {
    try {
      // círculo via clip — simulado com quadrado e depois círculo branco sobreposto
      doc.addImage(cv.foto, "JPEG", 14, avatarY, 40, 40, undefined, "FAST");
      // borda colorida
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(1.5);
      doc.circle(34, avatarY + 20, 20, "S");
    } catch {}
  } else {
    doc.setFillColor(r, g, b);
    doc.circle(34, avatarY + 20, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text((cv.nome || "?")[0].toUpperCase(), 34, avatarY + 25, { align: "center" });
  }

  // Nome GIGANTE no sidebar
  const partes = (cv.nome || "").split(" ");
  const primeiro = partes[0] || "";
  const sobrenome = partes.slice(1).join(" ");

  let nameY = avatarY + 50;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const nomeLines = doc.splitTextToSize(primeiro.toUpperCase(), SIDEBAR_W - 12);
  doc.text(nomeLines, 8, nameY);
  nameY += nomeLines.length * 8;

  const [sr, sg, sb2] = (cv.estilo === "preto") ? [180, 180, 180] : [r, g, b];
  doc.setTextColor(sr, sg, sb2);
  doc.setFontSize(15);
  const sobLines = doc.splitTextToSize(sobrenome.toUpperCase(), SIDEBAR_W - 12);
  doc.text(sobLines, 8, nameY);
  nameY += sobLines.length * 7;

  // Cargo
  const exp0 = cv.experiencias?.find(e => e.cargo);
  if (exp0) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(r, g, b);
    doc.text((exp0.cargo + " — " + (exp0.empresa || "")).toUpperCase().slice(0, 28), 8, nameY + 4);
    nameY += 10;
  }

  // Linha divisória
  let sY = nameY + 6;
  const divLine = () => {
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.3);
    doc.line(8, sY, SIDEBAR_W - 4, sY);
    sY += 6;
  };

  // Contato
  divLine();
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(r, g, b);
  doc.text("CONTATO", 8, sY);
  sY += 5;

  const contatos = [
    { icon: "✉", val: cv.email },
    { icon: "☎", val: cv.telefone },
    { icon: "⚑", val: cv.cidade },
  ].filter(c => c.val);

  contatos.forEach(c => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    const lines = doc.splitTextToSize(c.val!, SIDEBAR_W - 16);
    doc.text(lines, 10, sY);
    sY += lines.length * 4.5 + 1;
  });
  sY += 2;

  // Habilidades
  const habs = Array.isArray(cv.habilidades)
    ? cv.habilidades.filter((h: any) => h.nome)
    : [];

  if (habs.length) {
    divLine();
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(r, g, b);
    doc.text("HABILIDADES", 8, sY);
    sY += 5;

    habs.slice(0, 7).forEach((h: Habilidade) => {
      const pct = nivelPct[h.nivel] || 68;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      doc.text(h.nome, 8, sY);
      sY += 3;
      // Barra fundo
      doc.setFillColor(40, 40, 40);
      doc.roundedRect(8, sY, SIDEBAR_W - 16, 2.5, 1, 1, "F");
      // Barra preenchida
      doc.setFillColor(r, g, b);
      doc.roundedRect(8, sY, (SIDEBAR_W - 16) * (pct / 100), 2.5, 1, 1, "F");
      sY += 6;
    });
    sY += 2;
  }

  // Formação no sidebar
  const forms = cv.formacao?.filter(f => f.curso || f.grau) || [];
  if (forms.length) {
    divLine();
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(r, g, b);
    doc.text("FORMAÇÃO", 8, sY);
    sY += 5;

    forms.forEach(f => {
      const grauLabel = f.curso || f.grau || "";
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      const gl = doc.splitTextToSize(grauLabel, SIDEBAR_W - 16);
      doc.text(gl, 8, sY);
      sY += gl.length * 4.5;

      if (f.instituicao) {
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        const il = doc.splitTextToSize(f.instituicao, SIDEBAR_W - 16);
        doc.text(il, 8, sY);
        sY += il.length * 4;
      }

      // Período
      const periodo = f.presente
        ? `${f.periodoInicio || ""} — Presente`
        : f.periodoFim
          ? `${f.periodoInicio || ""} — ${f.periodoFim}`
          : f.ano || "";
      if (periodo.trim()) {
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r, g, b);
        doc.text(periodo, 8, sY);
        sY += 4;
      }
      sY += 4;
    });
  }

  // ── CONTEÚDO DIREITO ─────────────────────────────────────
  let cY = 18;

  // Objetivo
  if (cv.objetivo) {
    cY = secRight(doc, "OBJETIVO", CONTENT_X, cY, [r,g,b], CONTENT_W);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const ol = doc.splitTextToSize(cv.objetivo, CONTENT_W);
    doc.text(ol, CONTENT_X, cY);
    cY += ol.length * 4.8 + 10;
  }

  // Experiências
  const exps = cv.experiencias?.filter(e => e.empresa) || [];
  if (exps.length) {
    cY = secRight(doc, "EXPERIÊNCIA", CONTENT_X, cY, [r,g,b], CONTENT_W);

    exps.forEach(exp => {
      // Cargo bold
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 17, 17);
      doc.text(exp.cargo || "", CONTENT_X, cY);

      // Período (direita)
      if (exp.periodo) {
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        const pw = doc.getTextWidth(exp.periodo);
        doc.text(exp.periodo, CONTENT_X + CONTENT_W - pw, cY);
      }
      cY += 5;

      // Empresa em vermelho
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(r, g, b);
      doc.text(exp.empresa || "", CONTENT_X, cY);
      cY += 5;

      // Descrição
      if (exp.descricao) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const dl = doc.splitTextToSize(exp.descricao, CONTENT_W);
        doc.text(dl, CONTENT_X, cY);
        cY += dl.length * 4.2 + 7;
      } else {
        cY += 4;
      }
    });
  }

  // ── RODAPÉ COLORIDO ──────────────────────────────────────
  doc.setFillColor(r, g, b);
  doc.rect(0, H - 8, W, 8, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text("Gerado por Currículo Pro", W / 2, H - 3.5, { align: "center" });

  // ── BORDA EXTERNA ────────────────────────────────────────
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(1);
  doc.rect(0, 0, W, H, "S");

  // Save
  const filename = `curriculo-${(cv.nome || "pro").replace(/\s+/g, "-").toLowerCase()}.pdf`;
  const isMobile = typeof window !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } else {
    doc.save(filename);
  }
}

function secRight(
  doc: jsPDF, title: string, x: number, y: number,
  rgb: [number,number,number], w: number
): number {
  // Traço vermelho + título
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  doc.rect(x, y - 2, 4, 5, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 17, 17);
  doc.text(title, x + 7, y + 1);
  // Linha cinza
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(x + 7 + doc.getTextWidth(title) + 3, y, x + w, y);
  return y + 10;
}
