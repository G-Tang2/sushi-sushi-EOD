import { atom, PrimitiveAtom } from "jotai";

export const tillQuantitiesAtom = atom<Record<string, number>>({});
export const safeQuantitiesAtom = atom<Record<string, number>>({});
export const safeRollsAtom = atom<Record<string, number>>({});

export const createTotalAtom = (
  quantitiesAtom: PrimitiveAtom<Record<string, number>>,
  rollsAtom: PrimitiveAtom<Record<string, number>> | undefined,
  denominations: { label: string; value: number; rollSize?: number }[]
) =>
  atom((get) => {
    const quantities = get(quantitiesAtom);
    const rolls = rollsAtom ? get(rollsAtom) : {};

    return denominations.reduce((acc, { label, value, rollSize }) => {
      const looseQty = quantities[label] || 0;
      const rollQty = rolls[label] || 0;
      const rollValue = rollSize ? rollSize * value : 0;
      return acc + looseQty * value + rollQty * rollValue;
    }, 0);
  });
