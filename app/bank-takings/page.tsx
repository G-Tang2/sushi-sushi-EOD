"use client";

import {
  safeQuantitiesAtom,
  safeRollsAtom,
  tillQuantitiesAtom,
  bankTakingQuantitiesAtom,
  totalFloat,
  bankTakingValidAtom,
} from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import { createTotalAtom } from "@/state/moneyAtoms";
import { useAtom } from "jotai";
import React from "react";
import MoneyCounter from "@/components/ui/MoneyCounter";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Takings() {
  const router = useRouter();
  const totalAtom = React.useMemo(
    () =>
      createTotalAtom(
        [safeQuantitiesAtom, tillQuantitiesAtom],
        denominations,
        safeRollsAtom,
      ),
    [],
  );
  const totalTillAtom = React.useMemo(
    () => createTotalAtom([tillQuantitiesAtom], denominations),
    [],
  );

  const bankTakingTotalAtom = React.useMemo(
    () => createTotalAtom([bankTakingQuantitiesAtom], denominations),
    [],
  );

  const [totalTill] = useAtom(totalTillAtom);
  const [total] = useAtom(totalAtom);
  const [bankTakingValid] = useAtom(bankTakingValidAtom);

  const [bankTakingTotal] = useAtom(bankTakingTotalAtom);
  const bankTakingTarget = total - totalFloat;

  const amountValid =
    Math.round(bankTakingTotal * 100) / 100 ===
    Math.round(bankTakingTarget * 100) / 100;

  const handleNext = () => {
    if (amountValid) {
      router.push("/eod-report");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">Bank Takings</h1>
        {/* Total value display */}
        <div className="bg-slate-50 w-sm py-4 px-6 mb-2 rounded-2xl">
          <p>Total POS count = ${totalTill.toFixed(2)}</p>
          <p>Total cash to be banked: ${bankTakingTarget.toFixed(2)}</p>
        </div>
        <MoneyCounter
          denominations={denominations}
          quantitiesAtom={bankTakingQuantitiesAtom}
          target={bankTakingTarget}
          limit={true}
        />
        <div className="my-8 flex flex-col items-center gap-2">
          {!bankTakingValid && (
            <p className="text-red-500 text-sm">Exceeds available quantities.</p>
          )}
          <Button
            size="lg"
            disabled={!bankTakingValid || !amountValid}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
