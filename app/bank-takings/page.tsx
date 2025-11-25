"use client";

import {
  safeQuantitiesAtom,
  safeRollsAtom,
  tillQuantitiesAtom,
  bankTakingQuantitiesAtom,
} from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import { createTotalAtom } from "@/state/moneyAtoms";
import { useAtom } from "jotai";
import React from "react";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Takings() {
  const FLOAT = 1000;
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

  const [totalTill] = useAtom(totalTillAtom);
  const [total] = useAtom(totalAtom);

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">Bank Takings</h1>
        {/* Total value display */}
        <div className="bg-custom-cream w-sm py-4 px-6 mb-2 rounded-2xl">
          <p>Total POS count = ${totalTill.toFixed(2)}</p>
          <p>Total cash to be banked: ${(total - FLOAT).toFixed(2)}</p>
        </div>
        <MoneyCounter
          denominations={denominations}
          quantitiesAtom={bankTakingQuantitiesAtom}
        />
        <Link href="/eod-report" passHref>
          <Button size="lg" className="my-8">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
