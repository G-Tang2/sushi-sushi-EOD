"use client";

import { useAtom } from "jotai";
import {
  createTotalAtom,
  handrollCountAtom,
  pettyCashAtom,
  safeQuantitiesAtom,
  safeRollsAtom,
  tillQuantitiesAtom,
  totalFloat,
  totalSalesAtom,
  wastageAtom,
} from "@/state/moneyAtoms";
import { denominations } from "@/lib/denominations";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type Step = "idle" | "saving" | "saved" | "done";

export default function SaveButton() {
  const [step, setStep] = useState<Step>("idle");

  const totalCashAtom = useMemo(
    () =>
      createTotalAtom(
        [safeQuantitiesAtom, tillQuantitiesAtom],
        denominations,
        safeRollsAtom,
      ),
    [],
  );

  const [handRoll] = useAtom(handrollCountAtom);
  const [totalSales] = useAtom(totalSalesAtom);
  const [totalCash] = useAtom(totalCashAtom);
  const [totalWastage] = useAtom(wastageAtom);
  const [totalPettyCash] = useAtom(pettyCashAtom);

  const netSales = totalSales.totalNetSales.toFixed(2);
  const grossSales = totalSales.totalGrossSales.toFixed(2);
  const cashToBank = (totalCash - totalFloat).toFixed(2);
  const cashRead = totalSales.totalCashReading.toFixed(2);
  const wastage = parseFloat(totalWastage);
  const pettyCash = parseFloat(totalPettyCash);

  const handleSave = async () => {
    setStep("saving");

    const snapshot = {
      netSales,
      grossSales,
      cashToBank,
      cashRead,
      handRoll,
      wastage,
      pettyCash,
    };

    try {
      await fetch("/api/save-eod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(snapshot),
      });

      setStep("saved");

      setTimeout(() => {
        setStep("done");
      }, 2000);
    } catch (err) {
      console.error(err);
      setStep("idle");
    }
  };

  if (step === "done") {
    return (
      <Button
        size="lg"
        className="my-8"
        onClick={() => (window.location.href = "/")}
      >
        Go Home
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="my-8"
      onClick={handleSave}
      disabled={step === "saving" || step === "saved"}
    >
      {step === "saving" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {step === "saved" ? "Saved!" : "Save"}
    </Button>
  );
}
