"use client";

import { PrimitiveAtom, useAtom } from "jotai";
import { Minus, Plus } from "lucide-react";
import { useEffect } from "react";

interface Denomination {
  label: string;
}

interface LooseCounterProps {
  denominations: Denomination[];
  quantitiesAtom: PrimitiveAtom<Record<string, number>>;
  limit?: number;
}

export default function LooseMoneyCounter({
  denominations,
  quantitiesAtom,
  limit,
}: LooseCounterProps) {
  const [quantities, setQuantities] = useAtom(quantitiesAtom);

  const handleChange = (label: string, qty: number) => {
    const value = Math.max(0, qty);
    setQuantities((prev) => ({ ...prev, [label]: value }));
  };

  const checkLimit = (label: string) => {
    if (limit === undefined) return true;
    const qty = quantities[label] || 0;
    return qty <= limit;
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

  // const verifyLimits = () => {
  //   if (limit === undefined) return;
  //   for (const { label } of denominations) {
  //     if ((quantities[label] || 0) > limit) {
  //       setQuantities((prev) => ({ ...prev, [label]: limit }));
  //     }
  //   }
  // };

  // useEffect(() => {
  //   verifyLimits();
  // })

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
            className={`no-spinner border p-1 w-14 text-center h-8 box-border leading-none ${
              checkLimit(label)
              ? ""
              : "border-red-500 bg-red-50 text-red-600"
            }`}
            aria-label={`${label} loose quantity`}
          />
          <button
            onClick={() => increment(label)}
            className="bg-gray-200 rounded h-8 w-8 flex items-center justify-center "
          >
            <Plus />
          </button>
        </div>
      ))}
    </>
  );
}
