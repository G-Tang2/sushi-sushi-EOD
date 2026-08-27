"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DatePickerWithRange } from "@/components/rangePicker";
import { Button } from "@/components/ui/button";
import {
  formatWeekLabel,
  getWeekRange,
  isCurrentWeek,
  nextWeekParam,
  previousWeekParam,
} from "@/lib/weekRange";

export function HistoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const week = searchParams.get("week") ?? undefined;
  const isCustomRange = Boolean(from || to);

  const date: DateRange | undefined = useMemo(() => {
    if (!from) return undefined;
    return {
      from: new Date(`${from}T00:00:00`),
      to: to ? new Date(`${to}T00:00:00`) : undefined,
    };
  }, [from, to]);

  const { start: weekStart, end: weekEnd } = useMemo(
    () => getWeekRange(week),
    [week],
  );

  const goToWeek = (nextWeek: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    params.set("week", nextWeek);
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToCurrentWeek = () => {
    router.push(pathname);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("week");

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
    <div className="flex flex-col items-center gap-2 sm:items-start">
      {!isCustomRange && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous week"
            onClick={() => goToWeek(previousWeekParam(week))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="w-44 text-center text-sm font-medium">
            {formatWeekLabel(weekStart, weekEnd)}
          </span>

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next week"
            disabled={isCurrentWeek(week)}
            onClick={() => goToWeek(nextWeekParam(week))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {!isCurrentWeek(week) && (
            <Button variant="ghost" size="sm" onClick={goToCurrentWeek}>
              This week
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <DatePickerWithRange date={date} onDateChange={handleDateChange} />
        {isCustomRange && (
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
