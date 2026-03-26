import jsPDF from "jspdf";
import { CVData } from "./types";

export function generatePDF(cv: CVData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const leftColWidth = 70;
  const rightColStart = leftColWidth + 8;
  const rightColWidth = pageWidth - rightColStart - 12;
  const pageHeight = 297;
  let leftY = 0;
  let rightY = 0;

  // ── COLUNA ESQUERDA (escura) ──────────────────────────────
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, leftColWidth, pageHeight, "F");

  // Foto ou avatar
  if (cv.foto) {
    try {
      doc.addImage(cv.foto, "JPEG", 10, 12, 30, 30, undefined, "FAST");
      // Borda circular simulada
      doc.setDrawColor(208, 41, 10);
      doc.setLineWidth(1);
      doc.circle(25, 27, 15);
    } catch {
      drawAvatar(doc, cv.nome, 10, 12);
    }
  } else {
    drawAvatar(doc, cv.nome, 10, 12);
  }

  leftY = 50;

  // Nome
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  const nomeLines = doc.splitTextToSize(cv.nome || "", leftColWidth - 14);
  doc.text(nomeLines, 7, leftY);
  leftY += nomeLines.length * 6 + 2;

  // Área/cargo (extraído do primeiro cargo)
  const primeiroCargoExp = cv.experiencias?.find(e => e.cargo);
  if (primeiroCargoExp) {
    doc.setTextColor(208, 41, 10);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    const areaLines = doc.splitTextToSize(primeiroCargoExp.cargo.toUpperCase(), leftColWidth - 14);
    doc.text(areaLines, 7, leftY);
    leftY += areaLines.length * 4 + 8;
  } else {
    leftY += 8;
  }

  // Contato
  sectionTitleLeft(doc, "CONTATO", 7, leftY);
  leftY += 7;

  const contatos = [
    cv.telefone && { icon: "T", text: cv.telefone },
    cv.email && { icon: "E", text: cv.email },
    cv.cidade && { icon: "L", text: cv.cidade },
  ].filter(Boolean) as { icon: string; text: string }[];

  for (const c of contatos) {
    doc.setFillColor(208, 41, 10);
    doc.circle(10, leftY - 1, 1.5, "F");
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(c.text, leftColWidth - 20);
    doc.text(lines, 14, leftY);
    leftY += lines.length * 4 + 2;
  }
  leftY += 6;

  // Habilidades
  if (cv.habilidades) {
    sectionTitleLeft(doc, "HABILIDADES", 7, leftY);
    leftY += 7;
    const habs = cv.habilidades.split(/[,;]/).map(h => h.trim()).filter(Boolean);
    for (const hab of habs.slice(0, 8)) {
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text(hab, 14, leftY);
      // barra
      doc.setFillColor(50, 50, 50);
      doc.roundedRect(7, leftY + 2, leftColWidth - 16, 2.5, 1, 1, "F");
      doc.setFillColor(208, 41, 10);
      const pct = 0.6 + Math.random() * 0.35;
      doc.roundedRect(7, leftY + 2, (leftColWidth - 16) * pct, 2.5, 1, 1, "F");
      leftY += 10;
    }
    leftY += 4;
  }

  // Formação
  const forms = cv.formacao?.filter(f => f.curso);
  if (forms?.length) {
    sectionTitleLeft(doc, "FORMAÇÃO", 7, leftY);
    leftY += 7;
    for (const f of forms) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      const cursoLines = doc.splitTextToSize(f.curso, leftColWidth - 14);
      doc.text(cursoLines, 7, leftY);
      leftY += cursoLines.length * 4;
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      if (f.instituicao) doc.text(f.instituicao, 7, leftY); leftY += 4;
      if (f.ano) { doc.setTextColor(208, 41, 10); doc.text(f.ano, 7, leftY); leftY += 6; }
    }
  }

  // ── COLUNA DIREITA (clara) ────────────────────────────────
  rightY = 16;

  // Objetivo
  if (cv.objetivo) {
    sectionTitleRight(doc, "OBJETIVO PROFISSIONAL", rightColStart, rightY);
    rightY += 7;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const objLines = doc.splitTextToSize(cv.objetivo, rightColWidth);
    doc.text(objLines, rightColStart, rightY);
    rightY += objLines.length * 4.5 + 10;
  }

  // Experiências
  const exps = cv.experiencias?.filter(e => e.empresa);
  if (exps?.length) {
    sectionTitleRight(doc, "EXPERIÊNCIA PROFISSIONAL", rightColStart, rightY);
    rightY += 7;
    for (const exp of exps) {
      // Linha vermelha lateral
      doc.setFillColor(208, 41, 10);
      doc.rect(rightColStart, rightY - 3, 2, 18, "F");

      doc.setTextColor(17, 17, 17);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(exp.cargo || "", rightColStart + 5, rightY);

      doc.setTextColor(208, 41, 10);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(exp.empresa || "", rightColStart + 5, rightY + 4.5);

      doc.setTextColor(180, 180, 180);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      if (exp.periodo) {
        const periodoW = doc.getTextWidth(exp.periodo);
        doc.text(exp.periodo, pageWidth - 12 - periodoW, rightY);
      }

      if (exp.descricao) {
        doc.setTextColor(90, 90, 90);
        doc.setFontSize(8);
        const descLines = doc.splitTextToSize(exp.descricao, rightColWidth - 8);
        doc.text(descLines, rightColStart + 5, rightY + 9);
        rightY += 9 + descLines.length * 4 + 8;
      } else {
        rightY += 20;
      }
    }
  }

  // Rodapé sutil
  doc.setFillColor(208, 41, 10);
  doc.rect(0, pageHeight - 3, pageWidth, 3, "F");

  doc.save(`curriculo-${(cv.nome || "profissional").replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

function drawAvatar(doc: jsPDF, nome: string, x: number, y: number) {
  doc.setFillColor(208, 41, 10);
  doc.circle(x + 15, y + 15, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const inicial = (nome || "?")[0].toUpperCase();
  doc.text(inicial, x + 15 - doc.getTextWidth(inicial) / 2, y + 19);
}

function sectionTitleLeft(doc: jsPDF, title: string, x: number, y: number) {
  doc.setTextColor(208, 41, 10);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(title, x, y);
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.3);
  doc.line(x, y + 1.5, 63, y + 1.5);
}

function sectionTitleRight(doc: jsPDF, title: string, x: number, y: number) {
  doc.setTextColor(17, 17, 17);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(title, x, y);
  doc.setDrawColor(208, 41, 10);
  doc.setLineWidth(0.8);
  doc.line(x, y + 1.5, x + 60, y + 1.5);
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(x + 60, y + 1.5, 198, y + 1.5);
}
