"use client";

import { useState } from "react";
import { Camera, ImageUp, LoaderCircle } from "lucide-react";
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

  if (status === "scanning") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
        <LoaderCircle size={14} className="animate-spin" />
        Scanning...
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <label className="inline-flex cursor-pointer items-center gap-1 text-blue-600 hover:text-blue-800">
        <Camera size={14} />
        Take photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      <span className="text-zinc-300">|</span>
      <label className="inline-flex cursor-pointer items-center gap-1 text-blue-600 hover:text-blue-800">
        <ImageUp size={14} />
        Upload
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {status === "error" && (
        <span className="text-red-600">— scan failed</span>
      )}
    </div>
  );
}
