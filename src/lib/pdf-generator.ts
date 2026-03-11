import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";
import { mockDocumentiFirma, mockFirmatari, mockCampiFirma, type DocumentoFirma, type Firmatario, type CampoFirma } from "@/data/mock-firma";

const MOCK_HASH = "a3f9c2e1b4d7890abcdef1234567890abcdef1234567890abcdef1234567890a";

// Mock signature drawing as a simple SVG-to-PNG (simulated base64)
function createMockSignatureImage(): string {
  // Create a canvas-based mock signature
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 100;
  const ctx = canvas.getContext("2d")!;
  
  ctx.strokeStyle = "#1C1917";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  // Draw a wavy signature-like line
  ctx.beginPath();
  ctx.moveTo(20, 60);
  ctx.bezierCurveTo(50, 20, 80, 80, 120, 40);
  ctx.bezierCurveTo(140, 20, 160, 70, 200, 50);
  ctx.bezierCurveTo(220, 40, 240, 60, 270, 45);
  ctx.stroke();
  
  // Add a small underline
  ctx.beginPath();
  ctx.moveTo(30, 75);
  ctx.lineTo(260, 75);
  ctx.strokeStyle = "#1C191740";
  ctx.lineWidth = 1;
  ctx.stroke();
  
  return canvas.toDataURL("image/png");
}

async function embedSignatureImage(page: PDFPage, pdfDoc: PDFDocument, x: number, y: number, w: number, h: number) {
  const dataUrl = createMockSignatureImage();
  const base64 = dataUrl.split(",")[1];
  const imageBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const pngImage = await pdfDoc.embedPng(imageBytes);
  page.drawImage(pngImage, { x, y, width: w, height: h });
}

function drawOtpSignature(page: PDFPage, font: PDFFont, signer: Firmatario, x: number, y: number, w: number, h: number) {
  // Draw border
  page.drawRectangle({
    x, y, width: w, height: h,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 0.5,
    color: rgb(0.97, 0.97, 0.97),
  });
  
  const name = `${signer.nome} ${signer.cognome}`;
  const timestamp = signer.data_firma 
    ? new Date(signer.data_firma).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })
    : "";
  
  const fontSize = Math.min(10, w / (name.length * 0.6));
  page.drawText(name, { x: x + 4, y: y + h - 14, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("Firma OTP verificata", { x: x + 4, y: y + h - 26, size: 7, font, color: rgb(0.4, 0.4, 0.4) });
  if (timestamp) {
    page.drawText(timestamp, { x: x + 4, y: y + 4, size: 6, font, color: rgb(0.5, 0.5, 0.5) });
  }
}

function addCertificatePage(pdfDoc: PDFDocument, doc: DocumentoFirma, signers: Firmatario[], font: PDFFont, boldFont: PDFFont) {
  const page = pdfDoc.addPage([595, 842]); // A4
  const pw = 595;
  let cy = 790;

  // Header
  page.drawText("CANTIERE IN CLOUD", { x: 50, y: cy, size: 14, font: boldFont, color: rgb(0.96, 0.45, 0.13) });
  cy -= 30;
  page.drawText("CERTIFICATO DI FIRMA DIGITALE", { x: 50, y: cy, size: 16, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
  cy -= 8;
  page.drawLine({ start: { x: 50, y: cy }, end: { x: pw - 50, y: cy }, thickness: 1.5, color: rgb(0.96, 0.45, 0.13) });
  cy -= 30;

  // Document info
  const infoLines = [
    ["Documento:", doc.nome],
    ["Cantiere:", doc.cantiere_nome],
    ["Data creazione:", new Date(doc.data_creazione).toLocaleDateString("it-IT")],
    ["Hash SHA-256:", MOCK_HASH],
  ];

  for (const [label, value] of infoLines) {
    page.drawText(label, { x: 50, y: cy, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) });
    const labelWidth = label === "Hash SHA-256:" ? 160 : 160;
    if (label === "Hash SHA-256:") {
      page.drawText(value, { x: 160, y: cy, size: 7, font, color: rgb(0.2, 0.2, 0.2) });
    } else {
      page.drawText(value, { x: 160, y: cy, size: 9, font, color: rgb(0.1, 0.1, 0.1) });
    }
    cy -= 18;
  }

  cy -= 10;
  page.drawLine({ start: { x: 50, y: cy }, end: { x: pw - 50, y: cy }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  cy -= 25;

  // Signers table header
  page.drawText("FIRMATARI", { x: 50, y: cy, size: 11, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
  cy -= 20;

  const cols = [50, 180, 280, 370, 460];
  const headers = ["Nome", "Ruolo", "Metodo", "Timestamp", "IP"];
  
  page.drawRectangle({ x: 45, y: cy - 4, width: pw - 90, height: 18, color: rgb(0.95, 0.95, 0.95) });
  headers.forEach((h, i) => {
    page.drawText(h, { x: cols[i], y: cy, size: 8, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
  });
  cy -= 20;

  const signedSigners = signers.filter(s => s.stato === "firmato");
  for (const s of signedSigners) {
    const name = `${s.nome} ${s.cognome}`;
    const method = s.metodo_preferito === "disegno" ? "Disegno" : "OTP";
    const ts = s.data_firma ? new Date(s.data_firma).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";
    const ip = s.ip_address || "—";

    page.drawText(name, { x: cols[0], y: cy, size: 8, font, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(s.ruolo_descrizione.substring(0, 16), { x: cols[1], y: cy, size: 7, font, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(method, { x: cols[2], y: cy, size: 8, font, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(ts, { x: cols[3], y: cy, size: 7, font, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(ip, { x: cols[4], y: cy, size: 7, font, color: rgb(0.4, 0.4, 0.4) });
    cy -= 16;
  }

  cy -= 20;
  page.drawLine({ start: { x: 50, y: cy }, end: { x: pw - 50, y: cy }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  cy -= 30;

  // Verification info
  page.drawText("Verifica autenticità:", { x: 50, y: cy, size: 9, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
  cy -= 16;
  page.drawText(`${window.location.origin}/verifica/${MOCK_HASH}`, { x: 50, y: cy, size: 8, font, color: rgb(0.96, 0.45, 0.13) });
  cy -= 30;

  // Footer
  page.drawText("Documento generato da Cantiere in Cloud — cantiereincloud.it", { x: 50, y: 40, size: 7, font, color: rgb(0.6, 0.6, 0.6) });
  page.drawText("Firma digitale ai sensi del D.Lgs. 82/2005 (Codice dell'Amministrazione Digitale)", { x: 50, y: 28, size: 6, font, color: rgb(0.7, 0.7, 0.7) });
}

export async function generateSignedPdf(documentoId: string): Promise<Uint8Array> {
  const doc = mockDocumentiFirma.find(d => d.id === documentoId);
  if (!doc) throw new Error("Documento non trovato");

  const signers = mockFirmatari.filter(f => f.documento_id === documentoId);
  const fields = mockCampiFirma.filter(c => c.documento_id === documentoId);

  // Create a mock PDF with content pages
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Create mock content pages (simulating the original document)
  const maxPage = Math.max(1, ...fields.map(f => f.pagina));
  const pages: PDFPage[] = [];
  
  for (let p = 1; p <= maxPage; p++) {
    const page = pdfDoc.addPage([595, 842]);
    pages.push(page);
    
    // Add mock document content
    page.drawText(doc.nome.toUpperCase(), { x: 50, y: 780, size: 14, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(`Cantiere: ${doc.cantiere_nome}`, { x: 50, y: 758, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(`Pagina ${p} di ${maxPage}`, { x: 480, y: 780, size: 8, font, color: rgb(0.6, 0.6, 0.6) });
    
    // Mock body text
    const loremLines = [
      "Il presente documento attesta l'avvenuta verifica e conformità delle opere",
      "eseguite nell'ambito del cantiere sopra indicato, in accordo con il progetto",
      "esecutivo approvato e le normative tecniche vigenti.",
      "",
      "Le verifiche sono state condotte secondo i protocolli standard di settore,",
      "con particolare attenzione alla sicurezza strutturale e alla conformità",
      "impiantistica come previsto dal D.Lgs. 81/2008.",
      "",
      "Di seguito i dettagli delle ispezioni effettuate e le relative risultanze.",
    ];
    
    let ty = 720;
    for (const line of loremLines) {
      if (line) page.drawText(line, { x: 50, y: ty, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      ty -= 16;
    }
  }

  // Embed signatures on fields
  for (const field of fields) {
    const pageIndex = field.pagina - 1;
    if (pageIndex >= pages.length) continue;
    const page = pages[pageIndex];
    const { width: pw, height: ph } = page.getSize();

    // Convert percentage coordinates to absolute
    const x = (field.x / 100) * pw;
    const y = ph - ((field.y / 100) * ph) - ((field.altezza / 100) * ph);
    const w = (field.larghezza / 100) * pw;
    const h = (field.altezza / 100) * ph;

    const signer = signers.find(s => s.id === field.firmatario_id);
    if (!signer) continue;

    if (field.stato === "firmato") {
      if (signer.metodo_preferito === "disegno") {
        // Draw border
        page.drawRectangle({
          x, y, width: w, height: h,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
        });
        await embedSignatureImage(page, pdfDoc, x + 2, y + 2, w - 4, h - 4);
      } else {
        drawOtpSignature(page, font, signer, x, y, w, h);
      }
    } else if (field.stato === "in_attesa") {
      // Draw empty placeholder
      page.drawRectangle({
        x, y, width: w, height: h,
        borderColor: rgb(0.85, 0.75, 0.4),
        borderWidth: 0.5,
        color: rgb(1, 0.98, 0.9),
      });
      page.drawText("In attesa di firma", { x: x + 4, y: y + h / 2 - 4, size: 7, font, color: rgb(0.6, 0.5, 0.3) });
    } else if (field.stato === "rifiutato") {
      page.drawRectangle({
        x, y, width: w, height: h,
        borderColor: rgb(0.9, 0.3, 0.3),
        borderWidth: 0.5,
        color: rgb(1, 0.95, 0.95),
      });
      page.drawText("RIFIUTATO", { x: x + 4, y: y + h / 2 - 4, size: 8, font: boldFont, color: rgb(0.8, 0.2, 0.2) });
    }
  }

  // Add certificate page
  addCertificatePage(pdfDoc, doc, signers, font, boldFont);

  return pdfDoc.save();
}

export async function downloadSignedPdf(documentoId: string) {
  const doc = mockDocumentiFirma.find(d => d.id === documentoId);
  const pdfBytes = await generateSignedPdf(documentoId);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc?.nome || "documento"}-firmato.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}