import { useState, useCallback } from "react";
import type { ProcessingStatus } from "@/data/mock-data";

interface ProcessingResult {
  status: ProcessingStatus;
  progress: number;
  hash: string | null;
  category: string | null;
  extractedFields: Record<string, string> | null;
  errors: string[];
}

const SUPPORTED_MIMES = [
  "application/pdf",
  "image/jpeg", "image/png", "image/heic", "image/tiff",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function classifyByFilename(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes("durc")) return "DURC";
  if (lower.includes("pos")) return "POS";
  if (lower.includes("idoneita") || lower.includes("idoneità")) return "Idoneità Sanitaria";
  if (lower.includes("attestato")) return "Attestato Sicurezza";
  if (lower.includes("polizza")) return "Polizza RC";
  if (lower.includes("visura")) return "Visura Camerale";
  if (lower.includes("libretto")) return "Libretto";
  if (lower.includes("collaudo")) return "Collaudo";
  if (lower.includes("assicurazione")) return "Assicurazione";
  if (lower.includes("dvr")) return "DVR";
  if (lower.includes("psc")) return "PSC";
  return null;
}

function mockExtractFields(category: string): Record<string, string> | null {
  switch (category) {
    case "DURC":
      return { ragione_sociale: "(da verificare)", p_iva: "(da verificare)", data_emissione: "(da verificare)", data_scadenza: "(da verificare)" };
    case "POS":
      return { revisione: "(da verificare)", coordinatore: "(da verificare)", data_approvazione: "(da verificare)" };
    case "Idoneità Sanitaria":
      return { esito: "(da verificare)", medico: "(da verificare)" };
    case "Attestato Sicurezza":
      return { corso: "(da verificare)", ore: "(da verificare)", ente: "(da verificare)" };
    default:
      return null;
  }
}

async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function compressImage(file: File, maxDim = 2048): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxDim && img.height <= maxDim) {
        resolve(file);
        return;
      }
      const scale = maxDim / Math.max(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file);
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

export function validateFile(file: File): string[] {
  const errors: string[] = [];
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File troppo grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 50MB.`);
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const validExts = ["pdf", "jpg", "jpeg", "png", "heic", "tiff", "tif", "doc", "docx", "dwg", "dxf"];
  if (!validExts.includes(ext)) {
    errors.push(`Formato .${ext} non supportato.`);
  }
  return errors;
}

export function useDocumentProcessing() {
  const [results, setResults] = useState<Map<string, ProcessingResult>>(new Map());

  const processFile = useCallback(async (file: File, fileId: string) => {
    const update = (partial: Partial<ProcessingResult>) => {
      setResults(prev => {
        const next = new Map(prev);
        const current = next.get(fileId) || { status: "uploaded" as ProcessingStatus, progress: 0, hash: null, category: null, extractedFields: null, errors: [] };
        next.set(fileId, { ...current, ...partial });
        return next;
      });
    };

    // Validate
    const errors = validateFile(file);
    if (errors.length > 0) {
      update({ status: "uploaded", progress: 0, errors });
      return;
    }

    update({ status: "processing", progress: 10 });

    // Compress if image
    let processedFile = file;
    if (file.type.startsWith("image/")) {
      processedFile = await compressImage(file);
      update({ progress: 30 });
    } else {
      update({ progress: 30 });
    }

    // Hash
    try {
      const hash = await computeSHA256(processedFile);
      update({ hash, progress: 50 });
    } catch {
      update({ hash: "hash-error", progress: 50 });
    }

    // Classify
    const category = classifyByFilename(file.name);
    update({ category, progress: 70 });

    // Extract fields (mock)
    await new Promise(r => setTimeout(r, 500));
    const extractedFields = category ? mockExtractFields(category) : null;
    update({ extractedFields, progress: 90 });

    // Validate rules
    await new Promise(r => setTimeout(r, 300));
    update({ status: "validated", progress: 100 });
  }, []);

  const getResult = useCallback((fileId: string) => results.get(fileId), [results]);

  const clearResults = useCallback(() => setResults(new Map()), []);

  return { processFile, getResult, results, clearResults };
}
