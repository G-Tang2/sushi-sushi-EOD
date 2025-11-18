import { atom } from "jotai";

// Till counts
export const tillQuantitiesAtom = atom<Record<string, number>>({});
export const tillRollsAtom = atom<Record<string, number>>({});

// Safe counts
export const safeQuantitiesAtom = atom<Record<string, number>>({});
export const safeRollsAtom = atom<Record<string, number>>({});
