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
        safeRollsAtom,
        denominations
      ),
    []
  );
  const [total] = useAtom(totalAtom);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center bg-white sm:items-start">
        <h1 className="mb-8 text-4xl font-bold text-zinc-800">Bank Takings</h1>
        {/* Total value display */}
        <div className="mt-4 text-lg text-right">
          Total POS count = ${total.toFixed(2)}
        </div>
        <div className="mt-4 text-lg text-right">
          Total cash to be banked: ${(total - FLOAT).toFixed(2)}
        </div>
        <MoneyCounter
          denominations={denominations}
          quantitiesAtom={bankTakingQuantitiesAtom}
        />
        <Link href="/bank-takings" passHref>
          <Button variant="outline" size="lg" className="mb-8">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
