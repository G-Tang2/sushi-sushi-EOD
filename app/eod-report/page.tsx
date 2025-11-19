"use client";

import React from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import {
  createEODReportAtom,
  SalesState,
  handrollCountAtom,
  pettyCashAtom,
} from "@/state/moneyAtoms";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SalesStateEditorProps {
  salesAtom: PrimitiveAtom<SalesState>;
  onDelete: () => void;
}

function SalesStateEditor({ salesAtom, onDelete }: SalesStateEditorProps) {
  const [sales, setSales] = useAtom(salesAtom);

  return (
    <div className="flex order p-4 mb-4 space-y-2">
      <label>
        Net Sales:
        <input
          type="number"
          value={sales.netSales || ""}
          onChange={(e) =>
            setSales({ ...sales, netSales: Number(e.target.value) })
          }
          className="border p-1 ml-2 w-24"
        />
      </label>
      <label>
        Gross Sales:
        <input
          type="number"
          value={sales.grossSales || ""}
          onChange={(e) =>
            setSales({ ...sales, grossSales: Number(e.target.value) })
          }
          className="border p-1 ml-2 w-24"
        />
      </label>
      <label>
        Cash Reading:
        <input
          type="number"
          value={sales.cashReading || ""}
          onChange={(e) =>
            setSales({ ...sales, cashReading: Number(e.target.value) })
          }
          className="border p-1 ml-2 w-24"
        />
      </label>
      <button
        onClick={onDelete}
        className="px-2 py-1 bg-red-600 text-white rounded"
        aria-label="Delete sales entry"
      >
        X
      </button>
    </div>
  );
}

export default function EODReport() {
  const [atoms, setAtoms] = React.useState<PrimitiveAtom<SalesState>[]>([
    createEODReportAtom(),
  ]);
  const [hrCount, setHrCount] = useAtom(handrollCountAtom);
  const [pettyCash, setPettyCash] = useAtom(pettyCashAtom);

  const handleAdd = () => {
    const newAtom = createEODReportAtom();
    setAtoms((prev) => [...prev, newAtom]);
  };

  const handleDelete = (index: number) => {
    setAtoms((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center bg-white sm:items-start">
        <h1 className="mb-8 text-4xl font-bold text-zinc-800">
          End of Day Report
        </h1>
        <label>
          Handroll Count:
          <input
            type="number"
            value={hrCount || ""}
            onChange={(e) => setHrCount(Number(e.target.value) || 0)}
            className="border p-1 ml-2 w-24"
          />
        </label>
        <label>
          Petty Cash:
          <input
            type="number"
            value={pettyCash || ""}
            onChange={(e) => setPettyCash(Number(e.target.value) || 0)}
            className="border p-1 ml-2 w-24"
          />
        </label>
        <div>
          {atoms.map((atom, idx) => (
            <SalesStateEditor
              key={idx}
              salesAtom={atom}
              onDelete={() => handleDelete(idx)}
            />
          ))}
          <button
            onClick={handleAdd}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            +
          </button>
        </div>
        <Link href="/summary" passHref>
          <Button variant="outline" size="lg" className="mb-8">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
