"use client";

import { useState } from "react";
import { Camera, LoaderCircle } from "lucide-react";
import { scanReceiptImage, type ScanReceiptResult } from "@/lib/scanReceipt";

interface ScanReceiptButtonProps {
  onScanned: (totals: ScanReceiptResult) => void;
}

export function ScanReceiptButton({ onScanned }: ScanReceiptButtonProps) {
  const [status, setStatus] = useState<"idle" | "scanning" | "error">("idle");

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setStatus("scanning");

    try {
      const totals = await scanReceiptImage(file);
      onScanned(totals);
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
      {status === "scanning" ? (
        <LoaderCircle size={14} className="animate-spin" />
      ) : (
        <Camera size={14} />
      )}
      {status === "scanning" ? "Scanning..." : "Scan receipt"}
      {status === "error" && (
        <span className="text-red-600">— scan failed</span>
      )}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}
