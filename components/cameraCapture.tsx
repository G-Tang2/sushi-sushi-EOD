"use client";

import { useState } from "react";
import { Camera, ImageUp } from "lucide-react";
import { scanReceiptImage } from "@/lib/scanReceipt";

interface Totals {
  cash: string;
  totalNet: string;
  totalGross: string;
}

const emptyTotals: Totals = { cash: "", totalNet: "", totalGross: "" };

const SUSPICIOUS_THRESHOLD = 10000;

function isSuspicious(value: string): boolean {
  const parsed = parseFloat(value);
  return !Number.isNaN(parsed) && parsed >= SUSPICIOUS_THRESHOLD;
}

interface TotalFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function TotalField({ label, value, onChange }: TotalFieldProps) {
  const suspicious = isSuspicious(value);

  return (
    <label className="flex items-center justify-between gap-2">
      {label}
      <div className="flex flex-col items-end">
        <div>
          $
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className={`ml-2 w-24 rounded border px-2 py-1 text-right text-base ${
              suspicious ? "border-red-500 bg-red-50 text-red-600" : ""
            }`}
          />
        </div>
        {suspicious && (
          <span className="text-xs text-red-600">
            Unusually high — check photo
          </span>
        )}
      </div>
    </label>
  );
}

export default function CameraCapture() {
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [rawText, setRawText] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [values, setValues] = useState<Totals>(emptyTotals);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setStatus("Reading receipt...");
    setRawText("");
    setShowRaw(false);
    setValues(emptyTotals);

    try {
      const totals = await scanReceiptImage(file);

      setRawText(totals.rawText);
      setValues({
        cash: totals.cash ?? "",
        totalNet: totals.totalNet ?? "",
        totalGross: totals.totalGross ?? "",
      });

      setStatus("Done. Double-check the values below against the photo.");
    } catch (err) {
      console.error(err);
      setStatus("Scan failed. Enter values manually.");
    }
  };

  const handleValueChange = (field: keyof Totals, value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Camera size={16} />
          Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded border px-4 py-2 text-sm font-medium hover:bg-zinc-50">
          <ImageUp size={16} />
          Upload Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Receipt preview"
          className="max-w-full rounded"
        />
      )}

      {status && <p className="text-sm text-zinc-600">{status}</p>}

      <div className="space-y-2">
        <TotalField
          label="Cash"
          value={values.cash}
          onChange={(v) => handleValueChange("cash", v)}
        />
        <TotalField
          label="Total Net"
          value={values.totalNet}
          onChange={(v) => handleValueChange("totalNet", v)}
        />
        <TotalField
          label="Total Gross"
          value={values.totalGross}
          onChange={(v) => handleValueChange("totalGross", v)}
        />
      </div>

      {rawText && (
        <div>
          <button
            type="button"
            onClick={() => setShowRaw((v) => !v)}
            className="text-xs text-zinc-500 underline"
          >
            {showRaw ? "Hide" : "Show"} raw scanned text
          </button>
          {showRaw && (
            <textarea
              value={rawText}
              readOnly
              rows={10}
              className="mt-2 w-full border p-2 text-xs"
            />
          )}
        </div>
      )}
    </div>
  );
}
