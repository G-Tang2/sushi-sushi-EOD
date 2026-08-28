import { supabaseClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ChevronRight } from "lucide-react";
import { ClickableRow } from "@/components/clickablerow";
import { HistoryFilters } from "@/components/historyFilters";
import { endOfDay } from "date-fns";
import { getWeekRange } from "@/lib/weekRange";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; week?: string }>;
}) {
  const { from, to, week } = await searchParams;
  const isCustomRange = Boolean(from || to);

  let query = supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (isCustomRange) {
    if (from) {
      query = query.gte(
        "created_at",
        new Date(`${from}T00:00:00`).toISOString(),
      );
    }

    if (to) {
      query = query.lte(
        "created_at",
        endOfDay(new Date(`${to}T00:00:00`)).toISOString(),
      );
    }
  } else {
    const { start, end } = getWeekRange(week);
    query = query
      .gte("created_at", start.toISOString())
      .lte("created_at", endOfDay(end).toISOString());
  }

  const { data: reports, error } = await query;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load reports
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 pt-10 sm:pt-16">
      <main className="flex w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">History</h1>

        <HistoryFilters />

        <div className="flex w-full max-w-sm flex-col gap-2 bg-slate-50 py-4 px-4 rounded-2xl mt-4">
          {reports && reports.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              {isCustomRange
                ? "No reports found for this date range."
                : "No reports found for this week."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Net Sale</TableHead>
                  <TableHead className="text-center">Handroll</TableHead>
                  <TableHead className="text-center">Wastage</TableHead>
                  <TableHead className="w-4"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reports?.map((report) => (
                  <ClickableRow
                    key={report.id}
                    href={`/history/${report.id}`}
                  >
                    <TableCell className="font-medium whitespace-normal break-words text-center">
                      <Link href={`/history/${report.id}`}>
                        {formatDate(report.created_at)}
                      </Link>
                    </TableCell>

                    <TableCell>{formatCurrency(report.net_sales)}</TableCell>

                    <TableCell className="text-center">
                      {report.handroll}
                    </TableCell>

                    <TableCell className="text-right">
                      {formatCurrency(report.wastage)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ChevronRight className="h-4 w-4 text-zinc-400" />
                    </TableCell>
                  </ClickableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Link href="/" className="my-8">
          <Button size="lg">Go Home</Button>
        </Link>
      </main>
    </div>
  );
}
