"use client";

import { Button } from "@/components/ui/button";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { safeQuantitiesAtom, safeRollsAtom } from "@/state/moneyAtoms";

const denominations = [
  { label: "$100", value: 100, rollSize: undefined },
  { label: "$50", value: 50, rollSize: undefined },
  { label: "$20", value: 20, rollSize: undefined },
  { label: "$10", value: 10, rollSize: undefined },
  { label: "$5", value: 5, rollSize: undefined },
  { label: "$2", value: 2, rollSize: 25 },
  { label: "$1", value: 1, rollSize: 25 },
  { label: "50c", value: 0.5, rollSize: 20 },
  { label: "20c", value: 0.2, rollSize: 20 },
  { label: "10c", value: 0.1, rollSize: 40 },
  { label: "5c", value: 0.05, rollSize: 40 },
];

export default function Safe() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center bg-white sm:items-start">
        <h1 className="mb-8 text-4xl font-bold text-zinc-800">Safe</h1>
        {/* <div className="flex gap-4">
          <div className="flex-1 p-4">
            {denominations.map(({ label }) => (
              <div key={label} className="flex items-center mb-2 gap-4">
                <span className="w-16">{label}</span>
              </div>
            ))}l
          </div> */}
          <div className="flex-1 p-4">
            <MoneyCounter
              denominations={denominations}
              quantitiesAtom={safeQuantitiesAtom}
              rollsAtom={safeRollsAtom}
            />
          </div>
        {/* </div> */}
        <Link href="/till" passHref>
          <Button variant="outline" size="lg" className="mb-8">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
