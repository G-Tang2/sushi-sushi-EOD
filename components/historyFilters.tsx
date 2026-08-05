"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

import { DatePickerWithRange } from "@/components/rangePicker";
import { Button } from "@/components/ui/button";

export function HistoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const date: DateRange | undefined = useMemo(() => {
    if (!from) return undefined;
    return {
      from: new Date(`${from}T00:00:00`),
      to: to ? new Date(`${to}T00:00:00`) : undefined,
    };
  }, [from, to]);

  const handleDateChange = (range: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (range?.from) {
      params.set("from", format(range.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (range?.to) {
      params.set("to", format(range.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <DatePickerWithRange date={date} onDateChange={handleDateChange} />
      {(from || to) && (
        <Button variant="outline" size="sm" onClick={() => router.push(pathname)}>
          Clear
        </Button>
      )}
    </div>
  );
}
