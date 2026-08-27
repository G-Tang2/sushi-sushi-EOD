import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";

const WEEK_STARTS_ON = 1; // Monday
const WEEK_PARAM_FORMAT = "yyyy-MM-dd";

function parseWeekParam(week?: string): Date {
  if (week) {
    const parsed = new Date(`${week}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export function getWeekRange(week?: string): { start: Date; end: Date } {
  const anchor = parseWeekParam(week);
  return {
    start: startOfWeek(anchor, { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(anchor, { weekStartsOn: WEEK_STARTS_ON }),
  };
}

export function formatWeekParam(date: Date): string {
  return format(date, WEEK_PARAM_FORMAT);
}

export function previousWeekParam(week?: string): string {
  const { start } = getWeekRange(week);
  return formatWeekParam(subWeeks(start, 1));
}

export function nextWeekParam(week?: string): string {
  const { start } = getWeekRange(week);
  return formatWeekParam(addWeeks(start, 1));
}

export function isCurrentWeek(week?: string): boolean {
  const { start } = getWeekRange(week);
  const { start: currentStart } = getWeekRange();
  return start.getTime() === currentStart.getTime();
}

export function formatWeekLabel(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${format(start, "d")} – ${format(end, "d MMM yyyy")}`;
  }
  if (sameYear) {
    return `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;
  }
  return `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;
}
