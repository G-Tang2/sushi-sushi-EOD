"use client";

import { Button } from "@/components/ui/button";
import MoneyCounter from "@/components/ui/MoneyCounter";
import {
  safeQuantitiesAtom,
  safeRollsAtom,
  safeValidAtom,
} from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

export default function Safe() {
  const SAFE_FLOAT_AMOUNT = 500.0;
  const isValid = useAtomValue(safeValidAtom);
  const router = useRouter();

  const handleNext = () => {
    if (isValid) {
      router.push("/till");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">Safe</h1>
        <MoneyCounter
          denominations={denominations}
          quantitiesAtom={safeQuantitiesAtom}
          rollsAtom={safeRollsAtom}
          target={SAFE_FLOAT_AMOUNT}
        />
        <Button
          size="lg"
          className="my-8"
          disabled={!isValid}
          onClick={handleNext}
        >
          Next
        </Button>
      </main>
    </div>
  );
}
