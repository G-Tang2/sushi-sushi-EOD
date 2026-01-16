import { atom, PrimitiveAtom } from "jotai";
import { denominations } from "@/lib/denominations";
import { atomWithStorage } from "jotai/utils";

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

export const safeQuantitiesAtom = atomWithStorage('safeQuantities', <Record<string, number>>({}));
export const safeRollsAtom = atomWithStorage('safeRolls', <Record<string, number>>({}));
export const tillQuantitiesAtom = atomWithStorage('tillQuantities', initialTillQuantities);
export const bankTakingQuantitiesAtom = atomWithStorage('bankTakingQuantities', <Record<string, number>>({}));
export const handrollCountAtom = atomWithStorage('handrollCount', <number>(0));
export const wastageAtom = atomWithStorage('wastage', <number>(0));
export const pettyCashAtom = atomWithStorage('pettyCash', <number>(0));
export const salesAtom = atomWithStorage('sales',<PrimitiveAtom<SalesState>[]>([
  createEODReportAtom(),
]));
export const reportInProgressAtom = atomWithStorage('reportInProgress', <boolean>(false));

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

export const safeValidAtom = atom<boolean>((get) => {
  const safeTotalAtom = createTotalAtom(
    [safeQuantitiesAtom],
    denominations,
    safeRollsAtom
  );
  const total = get(safeTotalAtom);

  return total === 500;
});
