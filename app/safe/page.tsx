"use client";

import { Button } from "@/components/ui/button";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { safeQuantitiesAtom, safeRollsAtom } from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";

export default function Safe() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center bg-white sm:items-start">
        <h1 className="mb-8 text-4xl font-bold text-zinc-800">Safe</h1>
        <div className="flex-1 p-4">
          <MoneyCounter
            denominations={denominations}
            quantitiesAtom={safeQuantitiesAtom}
            rollsAtom={safeRollsAtom}
          />
        </div>
        <Link href="/till" passHref>
          <Button variant="outline" size="lg" className="mb-8">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
