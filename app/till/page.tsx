"use client"

import { Button } from "@/components/ui/button";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { tillQuantitiesAtom } from "@/state/moneyAtoms";

const denominations = [
  { label: "$100", value: 100},
  { label: "$50", value: 50},
  { label: "$20", value: 20},
  { label: "$10", value: 10},
  { label: "$5", value: 5},
  { label: "$2", value: 2},
  { label: "$1", value: 1},
  { label: "50c", value: 0.5},
  { label: "20c", value: 0.2},
  { label: "10c", value: 0.1},
  { label: "5c", value: 0.05}
]


export default function Till() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center bg-white sm:items-start">
          <h1 className="mb-8 text-4xl font-bold text-zinc-800">
            Till
          </h1>
          <MoneyCounter denominations={denominations} quantitiesAtom={tillQuantitiesAtom}/>
          <Link href="/till" passHref>
            <Button variant="outline" size="lg" className="mb-8">
                Next
            </Button>
          </Link>
      </main>
    </div>
  );
}
