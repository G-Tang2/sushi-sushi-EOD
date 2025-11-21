"use client";

import { Button } from "@/components/ui/button";
import { denominations } from "@/lib/denominations";
import { tillQuantitiesAtom, handrollCountAtom, pettyCashAtom } from "@/state/moneyAtoms";
import { useAtom } from "jotai";
import Link from "next/link";

export default function Home() {
  const [hrCount, setHrCount] = useAtom(handrollCountAtom);
  const [pettyCash, setPettyCash] = useAtom(pettyCashAtom);
  const [tillQuantities, setTillQuantities] = useAtom(tillQuantitiesAtom);
  const now = new Date();
  const dateString = now.toLocaleDateString('en-GB');
  const dayName = now.toLocaleString(undefined, { weekday: 'short' });

  // Convert tillQuantities to entries array
  const entries = Object.entries(tillQuantities);
  const midpoint = Math.floor(entries.length / 2);
  const firstHalf = denominations.slice(0, midpoint);
  const secondHalf = denominations.slice(midpoint);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-8 text-4xl font-bold text-zinc-800">Summary</h1>
          <p className="mb-8 text-sm text-zinc-500">{dateString} {dayName}</p>
          <div className="mb-4 text-lg text-right flex gap-6">
            <div>
              {denominations.map(({label, value}) => (
                <div key={label} className="flex items-center my-2 gap-2">
                  <div className="w-10">{label}</div>
                  <div>x</div>
                  <div className="w-8 text-right">{value}</div>
                  <div>=</div>
                  <div className="flex">
                    <p>$</p>
                    <div className="w-10 flex-1">{Number((tillQuantities[label] * value).toFixed(2))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href="/safe" passHref>
          <Button variant="outline" size="lg">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
