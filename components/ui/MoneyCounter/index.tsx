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
    <div className="bg-custom-cream rounded-2xl w-sm p-4 space-y-4">
      {/* Header Row: aligned with columns */}
      <div className="flex text-white rounded-md bg-custom-peach py-1 items-center mb-2 font-semibold">
        <div className="w-10 mx-2"></div>
        <div className="w-28 text-center mx-4">Loose</div>
        <div className="w-28 text-center mx-4">{rollsAtom ? "Rolls" : ""}</div>
      </div>

      {/* Dynamic rows for each denomination */}
      {denominations.map(({ label, rollSize }) => (
        <div key={label} className="flex items-center my-4">
          {/* Denomination label */}
          <div className="w-10 text-right mx-2">{label}</div>

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
              <div className="w-32" /> // Keep alignment with placeholder
            )}
          </div>
        </div>
      ))}

      {/* Total value display */}
      <div className="mt-5 font-semibold text-lg text-center">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
