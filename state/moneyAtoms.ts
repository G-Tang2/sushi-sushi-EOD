import { atom, PrimitiveAtom } from "jotai";
import { denominations } from "@/lib/denominations";
import { atomWithStorage } from "jotai/utils";

export const safeFloat = 500.0;
export const totalFloat = 1000;

export interface SalesState {
  netSales: string;
  grossSales: string;
  cashReading: string;
}

const initialTillQuantities = denominations.reduce(
  (acc, { label }) => {
    acc[label] = 0;
    return acc;
  },
  {} as Record<string, number>,
);

export const createTotalAtom = (
  quantitiesAtoms: PrimitiveAtom<Record<string, number>>[],
  denominations: { label: string; value: number; rollSize?: number }[],
  rollsAtom?: PrimitiveAtom<Record<string, number>> | undefined,
) =>
  atom((get) => {
    // Aggregate quantities from all quantity atoms by summing corresponding keys
    const aggregatedQuantities = quantitiesAtoms.reduce(
      (acc, qa) => {
        const quantities = get(qa);
        for (const label in quantities) {
          acc[label] = (acc[label] || 0) + quantities[label];
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const rolls = rollsAtom ? get(rollsAtom) : {};

    return denominations.reduce((acc, { label, value, rollSize }) => {
      const looseQty = aggregatedQuantities[label] || 0;
      const rollQty = rolls[label] || 0;
      const rollValue = rollSize ? rollSize * value : 0;
      return acc + looseQty * value + rollQty * rollValue;
    }, 0);
  });

export const createEODReportState = (
  initial?: Partial<SalesState>,
): SalesState => {
  return {
    netSales: initial?.netSales || "",
    grossSales: initial?.grossSales || "",
    cashReading: initial?.cashReading || "",
  };
};

export const safeQuantitiesAtom = atomWithStorage(
  "safeQuantities",
  <Record<string, number>>{},
);
export const safeRollsAtom = atomWithStorage(
  "safeRolls",
  <Record<string, number>>{},
);
export const tillQuantitiesAtom = atomWithStorage(
  "tillQuantities",
  initialTillQuantities,
);
export const bankTakingQuantitiesAtom = atomWithStorage(
  "bankTakingQuantities",
  <Record<string, number>>{},
);
export const handrollCountAtom = atomWithStorage("handrollCount", <string>"");
export const wastageAtom = atomWithStorage("wastage", <string>"");
export const pettyCashAtom = atomWithStorage("pettyCash", <string>"");
export const salesAtom = atomWithStorage("sales", <SalesState[]>[
  createEODReportState(),
]);
export const reportInProgressAtom = atomWithStorage(
  "reportInProgress",
  <boolean>false,
);

export const totalSalesAtom = atom((get) => {
  const sales = get(salesAtom);
  return sales.reduce(
    (acc, sale) => {
      acc.totalNetSales += parseFloat(sale.netSales) || 0;
      acc.totalGrossSales += parseFloat(sale.grossSales) || 0;
      acc.totalCashReading += parseFloat(sale.cashReading) || 0;
      return acc;
    },
    { totalNetSales: 0, totalGrossSales: 0, totalCashReading: 0 },
  );
});

export const safeValidAtom = atom<boolean>((get) => {
  const safeTotalAtom = createTotalAtom(
    [safeQuantitiesAtom],
    denominations,
    safeRollsAtom,
  );
  const total = get(safeTotalAtom);

  return total === safeFloat;
});

export const bankTakingValidAtom = atom((get) => {
  const bankTaking = get(bankTakingQuantitiesAtom);
  const till = get(tillQuantitiesAtom);
  return denominations.every(
    ({ label }) => (bankTaking[label] || 0) <= (till[label] || 0),
  );
});
