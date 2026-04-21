"use client";

import { Button } from "@/components/ui/button";
import MoneyCounter from "@/components/ui/MoneyCounter";
import Link from "next/link";
import { createTotalAtom, tillQuantitiesAtom } from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import React from "react";
import router from "next/router";
import { useAtom } from "jotai";

export default function Till() {
  const totalTillAtom = React.useMemo(
    () => createTotalAtom([tillQuantitiesAtom], denominations),
    [],
  );

  const [totalTill] = useAtom(totalTillAtom);

  const handleNext = () => {
    if (totalTill < 500) {
      alert(
        "The total in the till should be at least $500. Please recount and adjust the quantities.",
      );
    } else {
      router.push("/bank-takings");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center \\ sm:items-start">
        <h1 className="my-8 text-4xl font-bold">Till</h1>
        <MoneyCounter
          denominations={denominations}
          quantitiesAtom={tillQuantitiesAtom}
        />
        <Button size="lg" className="my-8" onClick={handleNext}>
          Next
        </Button>
      </main>
    </div>
  );
}
