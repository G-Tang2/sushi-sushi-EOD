"use client";

import {
  safeQuantitiesAtom,
  safeRollsAtom,
  tillQuantitiesAtom,
  bankTakingQuantitiesAtom,
  totalFloatAtom,
} from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import { createTotalAtom } from "@/state/moneyAtoms";
import { useAtom } from "jotai";
import React from "react";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Takings() {
  const totalAtom = React.useMemo(
    () =>
      createTotalAtom(
        [safeQuantitiesAtom, tillQuantitiesAtom],
        denominations,
        safeRollsAtom
      ),
    []
  );
  const totalTillAtom = React.useMemo(
    () => createTotalAtom([tillQuantitiesAtom], denominations),
    []
  );

  const bankTakingTotalAtom = React.useMemo(
    () => createTotalAtom([bankTakingQuantitiesAtom], denominations),
    []
  );

  const [totalTill] = useAtom(totalTillAtom);
  const [total] = useAtom(totalAtom);
  const [totalFloat] = useAtom(totalFloatAtom)
  const [bankTakingTotal] = useAtom(bankTakingTotalAtom);
  const bankTakingTarget = total - totalFloat;

  const isValid = Math.round(bankTakingTotal * 100) / 100 === Math.round(bankTakingTarget * 100) / 100;

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
        />
        <Link href="/eod-report" passHref>
          <Button size="lg" className="my-8" disabled={!isValid}>
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
