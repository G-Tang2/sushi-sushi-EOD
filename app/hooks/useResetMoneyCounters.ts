// hooks/useResetMoneyCounters.ts
"use client";

import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
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
  const setSafe = useSetAtom(safeQuantitiesAtom);
  const setRolls = useSetAtom(safeRollsAtom);
  const setTill = useSetAtom(tillQuantitiesAtom);
  const setBankTaking = useSetAtom(bankTakingQuantitiesAtom);
  const setHandrollCount = useSetAtom(handrollCountAtom);
  const setWastage = useSetAtom(wastageAtom);
  const setPettyCash = useSetAtom(pettyCashAtom);
  const setSales = useSetAtom(salesAtom);

  return () => {
    setSafe(RESET);
    setRolls(RESET);
    setTill(RESET);
    setBankTaking(RESET);
    setHandrollCount(RESET);
    setWastage(RESET);
    setPettyCash(RESET);
    setSales(RESET);
  };
}
