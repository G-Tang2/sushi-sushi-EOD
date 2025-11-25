"use client";

import { Button } from "@/components/ui/button";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { tillQuantitiesAtom } from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";

export default function Till() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center \\ sm:items-start">
        <h1 className="my-8 text-4xl font-bold">Till</h1>
        <MoneyCounter
          denominations={denominations}
          quantitiesAtom={tillQuantitiesAtom}
        />
        <Link href="/bank-takings" passHref>
          <Button size="lg" className="my-8">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
