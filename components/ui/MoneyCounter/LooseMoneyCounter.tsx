"use client";

import { PrimitiveAtom, useAtom } from "jotai";
import { Minus, Plus } from "lucide-react";

interface Denomination {
  label: string;
}

interface LooseCounterProps {
  denominations: Denomination[];
  quantitiesAtom: PrimitiveAtom<Record<string, number>>;
}

export default function LooseMoneyCounter({
  denominations,
  quantitiesAtom,
}: LooseCounterProps) {
  const [quantities, setQuantities] = useAtom(quantitiesAtom);

  const handleChange = (label: string, qty: number) => {
    const value = Math.max(0, qty);
    setQuantities((prev) => ({ ...prev, [label]: value }));
  };

  const increment = (label: string) => {
    setQuantities((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
  };

  const decrement = (label: string) => {
    setQuantities((prev) => ({
      ...prev,
      [label]: Math.max((prev[label] || 0) - 1, 0),
    }));
  };

  return (
    <>
      {denominations.map(({ label }) => (
        <div
          key={label}
          className="flex items-center justify-center gap-1 w-36"
        >
          <button
            onClick={() => decrement(label)}
            className="bg-gray-200 rounded h-8 w-8 flex items-center justify-center"
            disabled={!quantities[label] || quantities[label] <= 0}
          >
            <Minus />
          </button>
          <input
            type="number"
            min="0"
            value={quantities[label] || ""}
            onChange={(e) => handleChange(label, Number(e.target.value))}
            className="no-spinner border p-1 w-14 text-center h-8 box-border leading-none"
            aria-label={`${label} loose quantity`}
          />
          <button
            onClick={() => increment(label)}
            className="bg-gray-200 rounded h-8 w-8 flex items-center justify-center"
          >
            <Plus />
          </button>
        </div>
      ))}
    </>
  );
}
