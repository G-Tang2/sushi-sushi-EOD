"use client";

import { useAtom, useAtomValue } from "jotai";
import {
  createTotalAtom,
  handrollCountAtom,
  pettyCashAtom,
  safeQuantitiesAtom,
  safeRollsAtom,
  tillQuantitiesAtom,
  totalFloat,
  totalSalesAtom,
  wastageAtom,
} from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import React from "react";
import { Button } from "./ui/button";

export default function SaveButton() {
  const totalCashAtom = React.useMemo(
    () =>
      createTotalAtom(
        [safeQuantitiesAtom, tillQuantitiesAtom],
        denominations,
        safeRollsAtom,
      ),
    [],
  );

  const [handRoll] = useAtomValue(handrollCountAtom);
  const [totalSales] = useAtom(totalSalesAtom);
  const [totalCash] = useAtom(totalCashAtom);
  const [totalWastage] = useAtomValue(wastageAtom);
  const [totalPettyCash] = useAtomValue(pettyCashAtom);

  const netSales = totalSales.totalNetSales.toFixed(2);
  const grossSales = totalSales.totalGrossSales.toFixed(2);
  const cashToBank = (totalCash - totalFloat).toFixed(2);
  const cashRead = totalSales.totalCashReading.toFixed(2);
  const wastage = parseFloat(totalWastage);
  const pettyCash = parseFloat(totalPettyCash);

  const handleSave = async () => {
    const snapshot = {
      netSales,
      grossSales,
      cashToBank,
      cashRead,
      handRoll,
      wastage,
      pettyCash,
    };

    await fetch("/api/save-eod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snapshot),
    });
  };

  return (
    <Button size="lg" className="my-8" onClick={handleSave}>
      Save
    </Button>
  );
}
