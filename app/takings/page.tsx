"use client"

import {
  safeQuantitiesAtom,
  safeRollsAtom,
  tillQuantitiesAtom,
} from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import { createTotalAtom } from "@/state/moneyAtoms";
import { useAtom } from "jotai";
import React from "react";

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
      </main>
    </div>
  );
}
