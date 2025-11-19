"use client";

import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";

interface Denomination {
  label: string;
  rollSize?: number;
}

interface RollsCounterProps {
  denominations: Denomination[];
  rollsAtom: PrimitiveAtom<Record<string, number>>;
}

export default function RollMoneyCounter({
  denominations,
  rollsAtom,
}: RollsCounterProps) {
  const [rolls, setRolls] = useAtom(rollsAtom);

  const handleChange = (label: string, qty: number) => {
    const value = Math.max(0, qty);
    setRolls((prev) => ({ ...prev, [label]: value }));
  };

  const increment = (label: string) => {
    setRolls((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
  };

  const decrement = (label: string) => {
    setRolls((prev) => ({
      ...prev,
      [label]: Math.max((prev[label] || 0) - 1, 0),
    }));
  };

  return (
    <>
      {denominations.map(({ label, rollSize }) =>
        rollSize ? (
          <div
            key={label}
            className="flex items-center justify-center gap-1 w-36"
          >
            <button
              onClick={() => decrement(label)}
              className="px-2 py-1 bg-gray-200 rounded"
              disabled={!rolls[label] || rolls[label] <= 0}
            >
              -
            </button>
            <input
              type="number"
              min="0"
              value={rolls[label] || ""}
              onChange={(e) => handleChange(label, Number(e.target.value))}
              className="no-spinner border p-1 w-16 text-center h-8 box-border leading-none"
              aria-label={`${label} rolls quantity`}
            />
            <button
              onClick={() => increment(label)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        ) : (
          <div key={label} className="w-36" /> // Space reserved for alignment (no rollSize)
        )
      )}
    </>
  );
}
