import { createWorker, PSM } from "tesseract.js";
import { parseReceiptTotals } from "@/lib/receiptParser";
import {
  collectWords,
  cropAndUpscale,
  cropRectForWord,
  findAmountWord,
  findLabelWords,
  parseAmountFromText,
  FIELD_LABEL_PATTERNS,
  type ReceiptField,
} from "@/lib/receiptWordLocator";

export interface ScanReceiptResult {
  rawText: string;
  cash: string | null;
  totalNet: string | null;
  totalGross: string | null;
}

async function preprocessImage(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/image", {
    method: "POST",
    body: formData,
  });

  return res.blob();
}

// Locates each field's amount word from a first whole-page OCR pass, then
// crops tightly around just that word and re-recognizes it in isolation
// (digit-only whitelist, single-word mode). Isolating the crop consistently
// out-performs reading the whole page in one pass for this receipt's font,
// where a misread currency symbol can otherwise fuse into the digits.
// Falls back to whole-page label-anchored text search when a field can't be
// geometrically located (e.g. an unfamiliar receipt layout).
export async function scanReceiptImage(
  file: File,
): Promise<ScanReceiptResult> {
  const worker = await createWorker("eng");

  try {
    const processedBlob = await preprocessImage(file);
    const bitmap = await createImageBitmap(processedBlob);

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      tessedit_char_whitelist: "",
    });
    const { data: pageData } = await worker.recognize(
      processedBlob,
      {},
      { text: true, blocks: true },
    );

    const words = collectWords(pageData.blocks);
    const fallback = parseReceiptTotals(pageData.text);

    const fields: ReceiptField[] = ["cash", "totalNet", "totalGross"];
    const result: ScanReceiptResult = {
      rawText: pageData.text,
      cash: null,
      totalNet: null,
      totalGross: null,
    };

    for (const field of fields) {
      const labelWords = findLabelWords(words, FIELD_LABEL_PATTERNS[field]);
      const amountWord = labelWords
        ? findAmountWord(words, labelWords)
        : null;
      const rect = amountWord
        ? cropRectForWord(amountWord.bbox, bitmap.width, bitmap.height)
        : null;

      let value: string | null = null;

      if (rect) {
        const cropBlob = await cropAndUpscale(bitmap, rect, 3);
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.SINGLE_WORD,
          tessedit_char_whitelist: "0123456789.,$",
        });
        const { data: cropData } = await worker.recognize(cropBlob);
        value = parseAmountFromText(cropData.text);
        await worker.setParameters({ tessedit_char_whitelist: "" });
      }

      result[field] = value ?? fallback[field] ?? null;
    }

    bitmap.close();
    return result;
  } finally {
    await worker.terminate();
  }
}
