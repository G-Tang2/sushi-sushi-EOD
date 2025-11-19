"use client"

import { Button } from "@/components/ui/button";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { tillQuantitiesAtom } from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";

export default function Till() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center bg-white sm:items-start">
          <h1 className="mb-8 text-4xl font-bold text-zinc-800">
            Till
          </h1>
          <MoneyCounter denominations={denominations} quantitiesAtom={tillQuantitiesAtom}/>
          <Link href="/bank-takings" passHref>
            <Button variant="outline" size="lg" className="mb-8">
                Next
            </Button>
          </Link>
      </main>
    </div>
  );
}
