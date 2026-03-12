import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { DocumentoFiscale, AnagraficaAzienda } from '@/types/fatturazione';
import { MODALITA_PAGAMENTO_LABELS } from '@/types/fatturazione';

const fmtMoney = (n: number) => n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d?: string) => {
  if (!d) return '—';
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
};

const tipoLabel: Record<string, string> = {
  fattura: 'FATTURA',
  nota_credito: 'NOTA DI CREDITO',
  fattura_pa: 'FATTURA PA',
  parcella: 'PARCELLA',
};

export async function downloadPDF(documento: DocumentoFiscale, azienda: AnagraficaAzienda): Promise<void> {
  const pdfBytes = await buildPDF(documento, azienda);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${documento.numero.replace(/\//g, '-')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function uploadAndSavePDF(documento: DocumentoFiscale, azienda: AnagraficaAzienda): Promise<string> {
  const pdfBytes = await buildPDF(documento, azienda);
  // TODO: Upload to Supabase Storage when backend connected
  // const path = `${azienda.id}/${documento.id}/fattura.pdf`;
  // const { data } = await supabase.storage.from('documenti-fiscali').upload(path, pdfBytes);
  // await supabase.from('documenti_fiscali').update({ pdf_url: path }).eq('id', documento.id);
  
  // For now, save as blob in localStorage reference
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  console.log('[PDF] Generated and available at:', url);
  return url;
}

async function buildPDF(doc: DocumentoFiscale, az: AnagraficaAzienda): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const margin = 42;
  let y = height - margin;
  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);
  const lightGray = rgb(0.6, 0.6, 0.6);

  // Parse primary color
  const primaryColor = rgb(0.93, 0.45, 0.13); // fallback orange

  const drawText = (text: string, x: number, yPos: number, options: { font?: typeof font, size?: number, color?: typeof black } = {}) => {
    page.drawText(text, {
      x, y: yPos,
      font: options.font || font,
      size: options.size || 8,
      color: options.color || black,
    });
  };

  // ═══ HEADER ═══
  drawText(az.ragione_sociale, margin, y, { font: fontBold, size: 12 });
  y -= 14;
  drawText(az.forma_giuridica, margin, y, { size: 7, color: gray });
  y -= 10;
  drawText(az.indirizzo.via, margin, y, { size: 7, color: gray });
  y -= 10;
  drawText(`${az.indirizzo.cap} ${az.indirizzo.citta} (${az.indirizzo.provincia})`, margin, y, { size: 7, color: gray });
  y -= 10;
  drawText(`P.IVA ${az.p_iva}`, margin, y, { font: fontMono, size: 7, color: gray });
  y -= 10;
  drawText(`PEC: ${az.pec}`, margin, y, { size: 7, color: gray });
  y -= 10;
  if (az.codice_rea) {
    drawText(`REA: ${az.codice_rea}`, margin, y, { size: 7, color: gray });
    y -= 10;
  }

  // Right side: document type and number
  const rightX = width - margin;
  const labelText = tipoLabel[doc.tipo] || 'DOCUMENTO';
  const labelWidth = fontBold.widthOfTextAtSize(labelText, 10);
  // Badge background
  page.drawRectangle({
    x: rightX - labelWidth - 16,
    y: height - margin - 4,
    width: labelWidth + 16,
    height: 18,
    color: primaryColor,
    borderColor: primaryColor,
    borderWidth: 0,
  });
  drawText(labelText, rightX - labelWidth - 8, height - margin, { font: fontBold, size: 10, color: rgb(1, 1, 1) });

  const numText = `N° ${doc.numero}`;
  const numWidth = fontMono.widthOfTextAtSize(numText, 12);
  drawText(numText, rightX - numWidth, height - margin - 24, { font: fontMono, size: 12 });

  drawText(`Data: ${fmtDate(doc.data_emissione)}`, rightX - 100, height - margin - 40, { size: 7, color: gray });
  if (doc.data_scadenza) {
    drawText(`Scadenza: ${fmtDate(doc.data_scadenza)}`, rightX - 100, height - margin - 52, { size: 7, color: gray });
  }

  y -= 20;

  // ═══ CLIENT BOX ═══
  page.drawRectangle({
    x: margin, y: y - 70, width: width - margin * 2, height: 70,
    color: rgb(0.97, 0.97, 0.98), borderColor: rgb(0.85, 0.85, 0.88), borderWidth: 0.5,
  });
  drawText('Destinatario', margin + 8, y - 10, { size: 6, color: lightGray });
  drawText(doc.cliente_snapshot.ragione_sociale, margin + 8, y - 22, { font: fontBold, size: 9 });
  let cy = y - 34;
  if (doc.cliente_snapshot.p_iva) {
    drawText(`P.IVA ${doc.cliente_snapshot.p_iva}`, margin + 8, cy, { font: fontMono, size: 7, color: gray });
    cy -= 10;
  }
  drawText(`${doc.cliente_snapshot.indirizzo.via}`, margin + 8, cy, { size: 7, color: gray });
  cy -= 10;
  drawText(`${doc.cliente_snapshot.indirizzo.cap} ${doc.cliente_snapshot.indirizzo.citta} (${doc.cliente_snapshot.indirizzo.provincia})`, margin + 8, cy, { size: 7, color: gray });

  y -= 85;

  // ═══ ITEMS TABLE ═══
  const cols = [margin, margin + 25, margin + 280, margin + 320, margin + 365, margin + 405, margin + 440, margin + 480];
  const headers = ['#', 'Descrizione', 'Q.tà', 'U.M.', 'Prezzo', 'Sc.%', 'IVA', 'Importo'];

  // Header row
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1.5, color: rgb(0.2, 0.25, 0.34) });
  y -= 10;
  headers.forEach((h, i) => {
    drawText(h, cols[i], y, { font: fontBold, size: 6, color: lightGray });
  });
  y -= 6;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });

  // Rows
  doc.righe.forEach((riga, idx) => {
    y -= 14;
    if (idx % 2 === 1) {
      page.drawRectangle({ x: margin, y: y - 4, width: width - margin * 2, height: 16, color: rgb(0.97, 0.97, 0.98) });
    }
    drawText(String(riga.numero_linea), cols[0], y, { size: 7, color: lightGray });
    // Truncate description to fit
    const descText = riga.descrizione.length > 50 ? riga.descrizione.slice(0, 47) + '...' : riga.descrizione;
    drawText(descText, cols[1], y, { size: 8 });
    if (riga.codice) {
      drawText(riga.codice, cols[1], y - 9, { font: fontMono, size: 6, color: lightGray });
    }
    drawText(String(riga.quantita), cols[2], y, { size: 7 });
    drawText(riga.unita_misura, cols[3], y, { size: 7, color: gray });
    drawText(`€ ${fmtMoney(riga.prezzo_unitario)}`, cols[4], y, { font: fontMono, size: 7 });
    drawText(riga.sconto_percentuale ? `${riga.sconto_percentuale}%` : '', cols[5], y, { size: 7 });
    drawText(riga.aliquota_iva > 0 ? `${riga.aliquota_iva}%` : (riga.natura || '0%'), cols[6], y, { size: 7 });
    drawText(`€ ${fmtMoney(riga.importo)}`, cols[7], y, { font: fontMono, size: 8 });

    if (riga.codice) y -= 9;
  });

  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });

  // ═══ TOTALS ═══
  y -= 20;
  const totX = width - margin - 180;

  const drawTotalLine = (label: string, value: string, bold = false, accent = false) => {
    drawText(label, totX, y, { font: bold ? fontBold : font, size: bold ? 10 : 8, color: accent ? primaryColor : black });
    const vWidth = (bold ? fontMono : fontMono).widthOfTextAtSize(value, bold ? 10 : 8);
    drawText(value, width - margin - vWidth, y, { font: fontMono, size: bold ? 10 : 8, color: accent ? primaryColor : black });
    y -= bold ? 16 : 12;
  };

  drawTotalLine('Imponibile', `€ ${fmtMoney(doc.totali.imponibile)}`);
  drawTotalLine('IVA', `€ ${fmtMoney(doc.totali.totale_iva)}`);
  page.drawLine({ start: { x: totX, y: y + 6 }, end: { x: width - margin, y: y + 6 }, thickness: 1.5, color: primaryColor });
  drawTotalLine('TOTALE', `€ ${fmtMoney(doc.totali.totale_documento)}`, true, true);
  if (doc.totali.ritenuta_acconto && doc.totali.ritenuta_acconto > 0) {
    drawTotalLine(`Ritenuta (${doc.totali.ritenuta_aliquota}%)`, `-€ ${fmtMoney(doc.totali.ritenuta_acconto)}`);
    drawTotalLine('Netto a pagare', `€ ${fmtMoney(doc.totali.netto_a_pagare)}`, true);
  }

  // ═══ PAYMENT ═══
  y -= 10;
  page.drawRectangle({
    x: margin, y: y - 50, width: width - margin * 2, height: 50,
    color: rgb(0.97, 0.97, 0.98), borderColor: rgb(0.85, 0.85, 0.88), borderWidth: 0.5,
  });
  drawText('Modalità di pagamento', margin + 8, y - 10, { size: 6, color: lightGray });
  drawText(`Metodo: ${MODALITA_PAGAMENTO_LABELS[doc.pagamento.modalita]}`, margin + 8, y - 22, { size: 7, color: gray });
  if (doc.pagamento.iban) {
    drawText(`IBAN: ${doc.pagamento.iban}`, margin + 8, y - 34, { font: fontMono, size: 7 });
  }
  if (doc.pagamento.istituto_finanziario) {
    drawText(`Banca: ${doc.pagamento.istituto_finanziario}`, margin + 200, y - 34, { size: 7, color: gray });
  }

  // ═══ FOOTER ═══
  const footerY = 30;
  page.drawLine({ start: { x: margin, y: footerY + 8 }, end: { x: width - margin, y: footerY + 8 }, thickness: 0.5, color: primaryColor });
  drawText(`${az.ragione_sociale} — P.IVA ${az.p_iva}`, margin, footerY, { size: 6, color: lightGray });
  const footerRight = 'Documento generato da Cantiere in Cloud';
  const frWidth = font.widthOfTextAtSize(footerRight, 6);
  drawText(footerRight, width - margin - frWidth, footerY, { size: 6, color: primaryColor });

  return pdfDoc.save();
}
