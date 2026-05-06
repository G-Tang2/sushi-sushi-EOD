export function toNullableFloat(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;

  const parsed = parseFloat(String(value));
  return Number.isNaN(parsed) ? null : parsed;
}

export function toNullableInt(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;

  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}