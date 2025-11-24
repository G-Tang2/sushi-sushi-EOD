"use client";

import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import LooseCounter from "./LooseMoneyCounter";
import RollsCounter from "./RollMoneyCounter";
import { createTotalAtom } from "@/state/moneyAtoms";

interface Denomination {
  label: string;
  value: number;
  rollSize?: number | undefined;
}

interface MoneyCounterProps {
  denominations: Denomination[];
  quantitiesAtom: PrimitiveAtom<Record<string, number>>;
  rollsAtom?: PrimitiveAtom<Record<string, number>> | undefined;
}

export default function MoneyCounter({
  denominations,
  quantitiesAtom,
  rollsAtom,
}: MoneyCounterProps) {
  const totalAtom = React.useMemo(
    () => createTotalAtom([quantitiesAtom], denominations, rollsAtom),
    [quantitiesAtom, rollsAtom, denominations]
  );
  const [total] = useAtom(totalAtom);

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Header Row: aligned with columns */}
      <div className="flex items-center mb-2 gap-4 font-semibold">
        <div className="w-16 text-right pr-2">Denominations</div>
        <div className="w-36 text-center">Loose</div>
        <div className="w-36 text-center">{rollsAtom ? "Rolls" : ""}</div>
      </div>

      {/* Dynamic rows for each denomination */}
      {denominations.map(({ label, rollSize }) => (
        <div key={label} className="flex items-center my-4 gap-4">
          {/* Denomination label */}
          <div className="w-16 text-right pr-2">{label}</div>

          {/* Loose counter */}
          <div className="w-36">
            <LooseCounter
              denominations={[{ label }]}
              quantitiesAtom={quantitiesAtom}
            />
          </div>

          {/* Rolls counter or placeholder */}
          <div className="w-36">
            {rollsAtom ? (
              <RollsCounter
                denominations={[{ label, rollSize }]}
                rollsAtom={rollsAtom}
              />
            ) : (
              <div className="w-36" /> // Keep alignment with placeholder
            )}
          </div>
        </div>
      ))}

      {/* Total value display */}
      <div className="mt-4 font-semibold text-lg text-right">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
