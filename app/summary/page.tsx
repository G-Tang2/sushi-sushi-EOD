"use client";

import { Button } from "@/components/ui/button";
import { denominations } from "@/lib/denominations";
import {
  tillQuantitiesAtom,
  handrollCountAtom,
  pettyCashAtom,
  createTotalAtom,
  safeQuantitiesAtom,
  safeRollsAtom,
  salesAtom,
  SalesState,
  wastageAtom,
  totalSalesAtom,
} from "@/state/moneyAtoms";
import { PrimitiveAtom, useAtom } from "jotai";
import Link from "next/link";
import React from "react";

function SingleSales({
  salesAtom,
  index,
}: {
  salesAtom: PrimitiveAtom<SalesState>;
  index: number;
}) {
  const [sales] = useAtom(salesAtom);
  return (
    <p>
      Cash read POS {index + 1}: ${sales.cashReading.toFixed(2)}
    </p>
  );
}

export default function Home() {
  const FLOAT = 1000;
  const [handRollCount] = useAtom(handrollCountAtom);
  const [wastage] = useAtom(wastageAtom);
  const [pettyCash] = useAtom(pettyCashAtom);
  const [tillQuantities] = useAtom(tillQuantitiesAtom);
  const [sales] = useAtom(salesAtom);
  const [totalSales] = useAtom(totalSalesAtom);
  const now = new Date();
  const dateString = now.toLocaleDateString("en-GB");
  const dayName = now.toLocaleString(undefined, { weekday: "short" });

  const totalCashAtom = React.useMemo(
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
  const [totalCash] = useAtom(totalCashAtom);
  const [totalTill] = useAtom(totalTillAtom);

  const variance = totalCash - FLOAT - totalSales.totalCashReading;
  const formattedVariance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(variance);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-8 text-4xl font-bold text-zinc-800">Summary</h1>
          <p className="mb-8 text-sm text-zinc-500">
            {dateString} {dayName}
          </p>
          <div className="mb-4 text-lg text-right flex flex-col gap-6">
            <div>
              {denominations.map(({ label, value }) => (
                <div key={label} className="flex items-center my-2 gap-2">
                  <div className="w-10">{label}</div>
                  <div>x</div>
                  <div className="w-8 text-right">{value}</div>
                  <div>=</div>
                  <div className="flex">
                    <p>$</p>
                    <div className="w-13 flex-1">
                      {(tillQuantities[label] * value).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p>Total POS Count: ${totalTill.toFixed(2)}</p>
            </div>
          </div>
          <div>
            {sales.map((atom, index) => (
              <SingleSales key={index} salesAtom={atom} index={index} />
            ))}
          </div>
          <div>
            <p>Total Cash Read: ${totalSales.totalCashReading.toFixed(2)}</p>
            <p>Cash to Bank: ${(totalCash - FLOAT).toFixed(2)}</p>
            <p>Variance: {formattedVariance}</p>
            <p>Wastage: ${wastage.toFixed(2)}</p>
            <p>Hand Roll: {handRollCount}</p>
            <p>Petty Cash: ${pettyCash.toFixed(2)}</p>
            <p>Net Sale: ${totalSales.totalNetSales.toFixed(2)}</p>
            <p>Gross Sale: ${totalSales.totalGrossSales.toFixed(2)}</p>
          </div>
        </div>
        <Link href="/" passHref>
          <Button variant="outline" size="lg">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
