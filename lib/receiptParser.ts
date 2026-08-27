export interface ReceiptTotals {
  cash: string | null;
  totalNet: string | null;
  totalGross: string | null;
}

function extractAmountAfter(
  text: string,
  labelPattern: RegExp,
  windowChars = 40,
): string | null {
  const match = labelPattern.exec(text);
  if (!match) return null;

  const start = match.index + match[0].length;
  const window = text.slice(start, start + windowChars);
  const amountMatch = window.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
  return amountMatch ? amountMatch[1].replace(/,/g, "") : null;
}

export function parseReceiptTotals(text: string): ReceiptTotals {
  return {
    cash: extractAmountAfter(text, /\bcash\b/i),
    totalNet: extractAmountAfter(text, /\btotal\s+net\b/i),
    totalGross: extractAmountAfter(text, /\btotal\s+gross\b/i),
  };
}
