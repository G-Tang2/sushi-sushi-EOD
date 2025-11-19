import { atom, PrimitiveAtom } from "jotai";

export interface SalesState {
  netSales: number;
  grossSales: number;
  cashReading: number;
}

export const safeQuantitiesAtom = atom<Record<string, number>>({});
export const safeRollsAtom = atom<Record<string, number>>({});
export const tillQuantitiesAtom = atom<Record<string, number>>({});
export const bankTakingQuantitiesAtom = atom<Record<string, number>>({});
export const handrollCountAtom = atom<number>(0);
export const pettyCashAtom = atom<number>(0);

export const createTotalAtom = (
  quantitiesAtoms: PrimitiveAtom<Record<string, number>>[],
  rollsAtom: PrimitiveAtom<Record<string, number>> | undefined,
  denominations: { label: string; value: number; rollSize?: number }[]
) =>
  atom((get) => {
    // Aggregate quantities from all quantity atoms by summing corresponding keys
    const aggregatedQuantities = quantitiesAtoms.reduce((acc, qa) => {
      const quantities = get(qa);
      for (const label in quantities) {
        acc[label] = (acc[label] || 0) + quantities[label];
      }
      return acc;
    }, {} as Record<string, number>);

    const rolls = rollsAtom ? get(rollsAtom) : {};

    return denominations.reduce((acc, { label, value, rollSize }) => {
      const looseQty = aggregatedQuantities[label] || 0;
      const rollQty = rolls[label] || 0;
      const rollValue = rollSize ? rollSize * value : 0;
      return acc + looseQty * value + rollQty * rollValue;
    }, 0);
  });

export const createEODReportAtom = (
  initial?: Partial<SalesState>
): PrimitiveAtom<SalesState> => {
  return atom<SalesState>({
    netSales: initial?.netSales || 0,
    grossSales: initial?.grossSales || 0,
    cashReading: initial?.cashReading || 0,
  });
};
