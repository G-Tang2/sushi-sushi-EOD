import { atom, PrimitiveAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { denominations } from "@/lib/denominations";

export interface SalesState {
  netSales: number;
  grossSales: number;
  cashReading: number;
}

const initialTillQuantities = denominations.reduce((acc, { label }) => {
  acc[label] = 0;
  return acc;
}, {} as Record<string, number>);

export const createTotalAtom = (
  quantitiesAtoms: PrimitiveAtom<Record<string, number>>[],
  denominations: { label: string; value: number; rollSize?: number }[],
  rollsAtom?: PrimitiveAtom<Record<string, number>> | undefined
) =>
  atom((get) => {
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

// Use sessionStorage for persistence
const storage = createJSONStorage(() => sessionStorage);

export const safeQuantitiesAtom = atomWithStorage<Record<string, number>>(
  "safeQuantitiesAtom",
  {},
  storage
);
export const safeRollsAtom = atomWithStorage<Record<string, number>>(
  "safeRollsAtom",
  {},
  storage
);
export const tillQuantitiesAtom = atomWithStorage<Record<string, number>>(
  "tillQuantitiesAtom",
  initialTillQuantities,
  storage
);
export const bankTakingQuantitiesAtom = atomWithStorage<Record<string, number>>(
  "bankTakingQuantitiesAtom",
  {},
  storage
);
export const handrollCountAtom = atomWithStorage<number>(
  "handrollCountAtom",
  0,
  storage
);
export const wastageAtom = atomWithStorage<number>(
  "wastageAtom",
  0,
  storage
);
export const pettyCashAtom = atomWithStorage<number>(
  "pettyCashAtom",
  0,
  storage
);

export const salesAtom = atomWithStorage<PrimitiveAtom<SalesState>[]>(
  "salesAtom",
  [createEODReportAtom()],
  storage
);

export const totalSalesAtom = atom((get) => {
  const sales = get(salesAtom);
  return sales.reduce(
    (acc, saleAtom) => {
      const sale = get(saleAtom);
      acc.totalNetSales += sale.netSales;
      acc.totalGrossSales += sale.grossSales;
      acc.totalCashReading += sale.cashReading;
      return acc;
    },
    { totalNetSales: 0, totalGrossSales: 0, totalCashReading: 0 }
  );
});
