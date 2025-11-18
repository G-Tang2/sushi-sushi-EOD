"use client";

import { useState } from "react";

interface Denomination {
  label: string;
  value: number;
  rollSize?: number;
}

interface MoneyCounterProps {
  denominations: Denomination[];
}

export default function MoneyCounter({ denominations }: MoneyCounterProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [rolls, setRolls] = useState<Record<string, number>>({});

  const handleChange = (
    setState: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    label: string,
    qty: number
  ) => {
    const value = Math.max(0, qty);
    setState((prev) => ({ ...prev, [label]: value }));
  };

  const increment = (
    setState: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    label: string
  ) => {
    setState((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
  };

  const decrement = (
    setState: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    label: string
  ) => {
    setState((prev) => ({
      ...prev,
      [label]: Math.max((prev[label] || 0) - 1, 0),
    }));
  };

  const total = denominations.reduce((acc, { label, value, rollSize }) => {
    const looseQty = quantities[label] || 0;
    const rollQty = rolls[label] || 0;
    const rollValue = rollSize ? rollSize * value : 0;
    return acc + looseQty * value + rollQty * rollValue;
  }, 0);

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Header labels for columns */}
      <div className="flex items-center justify-between mb-2 gap-4 font-semibold">
        <span className="w-16">Denomination</span>
        <span className="w-36 text-center">Loose</span>
        <span className="w-36 text-center">Rolls</span>
      </div>

      {/* Denominations list */}
      <div>
        {denominations.map(({ label, rollSize }) => (
          <div
            key={label}
            className="flex items-center mb-2 gap-4"
          >
            <span className="w-16">{label}</span>

            {/* Loose quantity controls */}
            <div className="flex items-center gap-1 w-36 justify-center">
              <button
                onClick={() => decrement(setQuantities, label)}
                className="px-2 py-1 bg-gray-200 rounded"
                disabled={!quantities[label] || quantities[label] <= 0}
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={quantities[label] || ""}
                onChange={(e) =>
                  handleChange(setQuantities, label, Number(e.target.value))
                }
                className="border p-1 w-16 text-center"
                aria-label={`${label} loose quantity`}
              />
              <button
                onClick={() => increment(setQuantities, label)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            {/* Rolls quantity controls */}
            {rollSize ? <div className="flex items-center gap-1 w-36 justify-center">
              <button
                onClick={() => decrement(setRolls, label)}
                className="px-2 py-1 bg-gray-200 rounded"
                disabled={!rolls[label] || rolls[label] <= 0}
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={rolls[label] || ""}
                onChange={(e) =>
                  handleChange(setRolls, label, Number(e.target.value))
                }
                className="border p-1 w-16 text-center"
                aria-label={`${label} rolls quantity`}
              />
              <button
                onClick={() => increment(setRolls, label)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div> : <></>}
          </div>
        ))}
      </div>

      <div className="mt-4 font-semibold text-lg">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
