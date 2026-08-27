import type { Block } from "tesseract.js";

export interface Bbox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface OcrWord {
  text: string;
  bbox: Bbox;
}

export const FIELD_LABEL_PATTERNS = {
  cash: [/cash/i],
  totalNet: [/total/i, /net/i],
  totalGross: [/total/i, /gross/i],
} as const;

export type ReceiptField = keyof typeof FIELD_LABEL_PATTERNS;

export function collectWords(blocks: Block[] | null): OcrWord[] {
  const words: OcrWord[] = [];
  for (const block of blocks ?? []) {
    for (const para of block.paragraphs ?? []) {
      for (const line of para.lines ?? []) {
        for (const word of line.words ?? []) {
          words.push({ text: word.text, bbox: word.bbox });
        }
      }
    }
  }
  return words;
}

// Finds a run of consecutive words (in reading order) matching the given patterns.
export function findLabelWords(
  words: OcrWord[],
  patterns: readonly RegExp[],
): OcrWord[] | null {
  for (let i = 0; i <= words.length - patterns.length; i++) {
    let ok = true;
    for (let j = 0; j < patterns.length; j++) {
      if (!patterns[j].test(words[i + j].text)) {
        ok = false;
        break;
      }
    }
    if (ok) return words.slice(i, i + patterns.length);
  }
  return null;
}

// Finds the rightmost word, vertically aligned with the label, that looks like an amount.
// Matching by vertical proximity (rather than Tesseract's own line grouping) because a
// shadow or skew can split a label and its amount into separate detected lines.
export function findAmountWord(
  words: OcrWord[],
  labelWords: OcrWord[],
): OcrWord | null {
  const first = labelWords[0];
  const last = labelWords[labelWords.length - 1];
  const rowHeight = last.bbox.y1 - last.bbox.y0;
  const yCenter = (first.bbox.y0 + last.bbox.y1) / 2;
  const tolerance = rowHeight * 0.8;

  let best: OcrWord | null = null;
  for (const word of words) {
    const wordYCenter = (word.bbox.y0 + word.bbox.y1) / 2;
    if (Math.abs(wordYCenter - yCenter) > tolerance) continue;
    if (word.bbox.x0 <= last.bbox.x1) continue; // must sit to the right of the label
    if (!/\d/.test(word.text)) continue; // must look numeric
    if (word.text.length < 3) continue; // real amounts are never 1-2 chars; filters stray noise
    if (!best || word.bbox.x1 > best.bbox.x1) best = word;
  }
  return best;
}

export interface CropRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function cropRectForWord(
  bbox: Bbox,
  imageWidth: number,
  imageHeight: number,
  padX = 10,
  padY = 8,
): CropRect | null {
  const left = Math.max(0, Math.floor(bbox.x0 - padX));
  const top = Math.max(0, Math.floor(bbox.y0 - padY));
  const width = Math.min(
    imageWidth - left,
    Math.ceil(bbox.x1 - bbox.x0 + padX * 2),
  );
  const height = Math.min(
    imageHeight - top,
    Math.ceil(bbox.y1 - bbox.y0 + padY * 2),
  );
  if (width <= 0 || height <= 0) return null;
  return { left, top, width, height };
}

export async function cropAndUpscale(
  source: ImageBitmap,
  rect: CropRect,
  scale = 3,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(rect.width * scale));
  canvas.height = Math.max(1, Math.round(rect.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    source,
    rect.left,
    rect.top,
    rect.width,
    rect.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}

export function parseAmountFromText(text: string): string | null {
  const match = text.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
  return match ? match[1].replace(/,/g, "") : null;
}
