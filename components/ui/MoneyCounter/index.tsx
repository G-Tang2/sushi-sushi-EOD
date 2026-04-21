"use client";

import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import LooseCounter from "./LooseMoneyCounter";
import RollsCounter from "./RollMoneyCounter";
import { createTotalAtom, tillQuantitiesAtom } from "@/state/moneyAtoms";

interface Denomination {
  label: string;
  value: number;
  rollSize?: number | undefined;
}

interface MoneyCounterProps {
  denominations: Denomination[];
  quantitiesAtom: PrimitiveAtom<Record<string, number>>;
  rollsAtom?: PrimitiveAtom<Record<string, number>> | undefined;
  target?: number;
  limit?: boolean;
}

export default function MoneyCounter({
  denominations,
  quantitiesAtom,
  rollsAtom,
  target,
  limit,
}: MoneyCounterProps) {
  const totalAtom = React.useMemo(
    () => createTotalAtom([quantitiesAtom], denominations, rollsAtom),
    [quantitiesAtom, rollsAtom, denominations],
  );
  const [total] = useAtom(totalAtom);
  const [tillQuantities] = useAtom(tillQuantitiesAtom);

  return (
    <div className="bg-slate-50 rounded-2xl w-sm p-4 space-y-4">
      {/* Header Row */}
      <div className="flex text-white rounded-md bg-neutral-800 py-1 items-center mb-2 font-semibold">
        <div className="w-14 shrink-0"></div>
        <div className="w-36 shrink-0 text-center">Loose</div>
        {rollsAtom && <div className="w-36 shrink-0 text-center">Rolls</div>}
        {limit && (
          <div className="w-36 shrink-0 text-center">Available</div>
        )}
      </div>

      {/* Denomination rows */}
      {denominations.map(({ label, rollSize }) => (
        <div key={label} className="flex items-center my-4">
          <div className="w-14 shrink-0 text-right pr-2">{label}</div>

          <div className="w-36 shrink-0">
            <LooseCounter
              denominations={[{ label }]}
              quantitiesAtom={quantitiesAtom}
              limit={limit ? tillQuantities[label] : 999}
            />
          </div>

          {rollsAtom && (
            <div className="w-36 shrink-0">
              <RollsCounter
                denominations={[{ label, rollSize }]}
                rollsAtom={rollsAtom}
              />
            </div>
          )}

          {limit && (
            <div className="w-36 shrink-0 text-center">
              <div>{tillQuantities[label]}</div>
            </div>
          )}
        </div>
      ))}

      {target ? (
        <div className="mt-5 mb-0 text-sm text-center text-gray-600">
          Target: ${target.toFixed(2)}
        </div>
      ) : null}
      {/* Total value display */}
      <div className="font-semibold text-lg text-center">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
