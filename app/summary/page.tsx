"use client";

// import { Button } from "@/components/ui/button";
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
import { useAtom } from "jotai";
// import Link from "next/link";
import React from "react";

function SingleSales({ sales, index }: { sales: SalesState; index: number }) {
  return (
    <div className="flex justify-between">
      Cash read POS {index + 1}: <p>${sales.cashReading.toFixed(2)}</p>
    </div>
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
        safeRollsAtom,
      ),
    [],
  );

  const totalTillAtom = React.useMemo(
    () => createTotalAtom([tillQuantitiesAtom], denominations),
    [],
  );
  const [totalCash] = useAtom(totalCashAtom);
  const [totalTill] = useAtom(totalTillAtom);

  const variance = totalCash - FLOAT - totalSales.totalCashReading;
  const displayedVariance = Math.abs(variance) < 0.01 ? 0 : variance;

  const formattedVariance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(displayedVariance);

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">Summary</h1>
        <p className="font-medium text-lg">
          {dateString} {dayName}
        </p>
        <div className="bg-slate-50 rounded-2xl w-sm p-4 m-4 space-y-4">
          <div className="flex flex-col justify-between items-center">
            {Object.entries(tillQuantities).map(([label, value]) => {
              const denom = denominations.find((d) => d.label === label);
              const amount = denom ? denom.value * value : 0;

              return (
                <div key={label} className="flex items-center my-2 gap-2 ">
                  <div className="w-10">{label}</div>
                  <div>x</div>
                  <div className="w-8 text-right">{value}</div>
                  <div className="mx-2">=</div>
                  <div className="flex">
                    <p className="pr-1">$</p>
                    <div className="w-12 text-right">{amount.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center justify-center font-semibold">
            Total POS Count: ${totalTill.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl w-sm px-12 py-4 m-4 space-y-4">
          {sales.map((atom, index) => (
            <SingleSales key={index} sales={atom} index={index} />
          ))}
          <div className="flex justify-between">
            Total Cash Read: <p>${totalSales.totalCashReading.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            Cash to Bank: <p>${(totalCash - FLOAT).toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            Petty Cash: <p>${pettyCash.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            Variance: <p>{formattedVariance}</p>
          </div>
          <div className="flex justify-between">
            Wastage: <p>${wastage.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl w-sm px-12 py-4 m-4 space-y-4">
          <div className="flex justify-between">
            Net Sale: <p>${totalSales.totalNetSales.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            Gross Sale: <p>${totalSales.totalGrossSales.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            Hand Roll: <p>{handRollCount}</p>
          </div>
        </div>

        {/* <Link href="/" passHref>
          <Button size="lg" className="my-8">
            Next
          </Button>
        </Link> */}
      </main>
    </div>
  );
}
