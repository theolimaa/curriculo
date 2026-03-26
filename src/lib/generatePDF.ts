import jsPDF from "jspdf";
import { CVData } from "./types";

export function generatePDF(cv: CVData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // --- HEADER ---
  doc.setFillColor(15, 32, 39); // cor escura
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(74, 222, 128); // verde
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(cv.nome || "Seu Nome", margin, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const contactParts = [cv.telefone, cv.email, cv.cidade].filter(Boolean);
  doc.text(contactParts.join("  |  "), margin, 30);

  y = 55;

  // --- OBJETIVO ---
  if (cv.objetivo) {
    doc.setTextColor(15, 32, 39);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("OBJETIVO PROFISSIONAL", margin, y);

    doc.setDrawColor(74, 222, 128);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const objetivoLines = doc.splitTextToSize(cv.objetivo, contentWidth);
    doc.text(objetivoLines, margin, y);
    y += objetivoLines.length * 5 + 8;
  }

  // --- EXPERIÊNCIAS ---
  const exps = cv.experiencias?.filter((e) => e.empresa);
  if (exps && exps.length > 0) {
    doc.setTextColor(15, 32, 39);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("EXPERIÊNCIA PROFISSIONAL", margin, y);

    doc.setDrawColor(74, 222, 128);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 8;

    for (const exp of exps) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 32, 39);
      doc.text(exp.cargo || "", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`${exp.empresa}  •  ${exp.periodo}`, margin, y + 5);

      if (exp.descricao) {
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(exp.descricao, contentWidth);
        doc.text(lines, margin, y + 11);
        y += 11 + lines.length * 5 + 6;
      } else {
        y += 14;
      }
    }
    y += 4;
  }

  // --- FORMAÇÃO ---
  const forms = cv.formacao?.filter((f) => f.curso);
  if (forms && forms.length > 0) {
    doc.setTextColor(15, 32, 39);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("FORMAÇÃO ACADÊMICA", margin, y);

    doc.setDrawColor(74, 222, 128);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 8;

    for (const f of forms) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 32, 39);
      doc.text(f.curso || "", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`${f.instituicao}  •  ${f.ano}`, margin, y + 5);
      y += 13;
    }
    y += 4;
  }

  // --- HABILIDADES ---
  if (cv.habilidades) {
    doc.setTextColor(15, 32, 39);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("HABILIDADES", margin, y);

    doc.setDrawColor(74, 222, 128);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(cv.habilidades, contentWidth);
    doc.text(lines, margin, y);
  }

  // --- RODAPÉ ---
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text("Gerado por Currículo IA · curriculo-ia.vercel.app", margin, 285);

  doc.save(`curriculo-${cv.nome?.replace(/\s+/g, "-").toLowerCase() || "profissional"}.pdf`);
}
