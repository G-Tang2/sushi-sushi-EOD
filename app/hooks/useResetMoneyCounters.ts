// hooks/useResetMoneyCounters.ts
"use client";

import { useResetAtom } from "jotai/utils";
import {
  safeQuantitiesAtom,
  safeRollsAtom,
  tillQuantitiesAtom,
  bankTakingQuantitiesAtom,
  handrollCountAtom,
  wastageAtom,
  pettyCashAtom,
  salesAtom,
} from "@/state/moneyAtoms";

export default function useResetMoneyCounters() {
  const resetSafe = useResetAtom(safeQuantitiesAtom);
  const resetRolls = useResetAtom(safeRollsAtom);
  const resetTill = useResetAtom(tillQuantitiesAtom);
  const resetBankTaking = useResetAtom(bankTakingQuantitiesAtom);
  const resetHandrollCount = useResetAtom(handrollCountAtom);
  const resetWastage = useResetAtom(wastageAtom);
  const resetPettyCash = useResetAtom(pettyCashAtom);
  const resetSales = useResetAtom(salesAtom);

  return () => {
    resetSafe();
    resetRolls();
    resetTill();
    resetBankTaking();
    resetHandrollCount();
    resetWastage();
    resetPettyCash();
    resetSales();
  };
}
