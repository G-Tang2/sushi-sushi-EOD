"use client";

import React from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import {
  createEODReportAtom,
  SalesState,
  handrollCountAtom,
  pettyCashAtom,
  salesAtom,
  wastageAtom,
} from "@/state/moneyAtoms";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SalesStateEditorProps {
  idx: number;
  salesAtom: PrimitiveAtom<SalesState>;
  onDelete: () => void;
}

function SalesStateEditor({ idx, salesAtom, onDelete }: SalesStateEditorProps) {
  const [sales, setSales] = useAtom(salesAtom);
  return (
    <div className="flex flex-col order mb-1 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold">POS {idx + 1}</p>
        {idx != 0 && (
          <button onClick={onDelete} aria-label="Delete sales entry">
            <Trash2 size={24} color="red" />
          </button>
        )}
      </div>
      <label className="justify-between flex items-center">
        Net Sales:
        <div>
          $
          <input
            type="number"
            value={sales.netSales || ""}
            onChange={(e) =>
              setSales({ ...sales, netSales: Number(e.target.value) })
            }
            className="border p-1 ml-2 w-24"
          />
        </div>
      </label>
      <label className="justify-between flex items-center">
        Gross Sales:
        <div>
          $
          <input
            type="number"
            value={sales.grossSales || ""}
            onChange={(e) =>
              setSales({ ...sales, grossSales: Number(e.target.value) })
            }
            className="border p-1 ml-2 w-24"
          />
        </div>
      </label>
      <label className="justify-between flex items-center">
        Cash Reading:
        <div>
          $
          <input
            type="number"
            value={sales.cashReading || ""}
            onChange={(e) =>
              setSales({ ...sales, cashReading: Number(e.target.value) })
            }
            className="border p-1 ml-2 w-24"
          />
        </div>
      </label>
    </div>
  );
}

export default function EODReport() {
  const [atoms, setAtoms] = useAtom(salesAtom);
  const [hrCount, setHrCount] = useAtom(handrollCountAtom);
  const [wastage, setWastage] = useAtom(wastageAtom);
  const [pettyCash, setPettyCash] = useAtom(pettyCashAtom);

  const handleAdd = () => {
    const newAtom = createEODReportAtom();
    setAtoms((prev) => [...prev, newAtom]);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this sales entry?")) {
      setAtoms((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">End of Day Report</h1>
        <div className="flex flex-col gap-2 bg-slate-50 w-sm py-4 px-6 mb-2 rounded-2xl">
          <label className="flex justify-between items-center">
            Handroll Count:
            <input
              type="number"
              value={hrCount || ""}
              onChange={(e) => setHrCount(Number(e.target.value) || 0)}
              className="border p-1 ml-2 w-24"
            />
          </label>
          <label className="flex justify-between items-center">
            Wastage:
            <div>
              $
              <input
                type="number"
                value={wastage || ""}
                onChange={(e) => setWastage(Number(e.target.value) || 0)}
                className="border p-1 ml-2 w-24"
              />
            </div>
          </label>
          <label className="flex justify-between items-center">
            Petty Cash:
            <div>
              $
              <input
                type="number"
                value={pettyCash || ""}
                onChange={(e) => setPettyCash(Number(e.target.value) || 0)}
                className="border p-1 ml-2 w-24"
              />
            </div>
          </label>
        </div>
        <div className="flex flex-col gap-2 bg-slate-50 w-sm py-4 px-6 mb-2 rounded-2xl">
          {atoms.map((atom, idx) => (
            <React.Fragment key={idx}>
              {idx !== 0 && <hr className="my-2 border-gray-600" />}
              <SalesStateEditor
                idx={idx}
                salesAtom={atom}
                onDelete={() => handleDelete(idx)}
              />
            </React.Fragment>
          ))}

          <button
            onClick={handleAdd}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            +
          </button>
        </div>
        <Link href="/summary" passHref>
          <Button size="lg" className="my-8">
            Next
          </Button>
        </Link>
      </main>
    </div>
  );
}
