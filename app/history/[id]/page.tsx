"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Report } from "@/types/report";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousReportId, setPreviousReportId] = useState<string | null>(null);
  const [nextReportId, setNextReportId] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchReport = async () => {
      const { data, error } = await supabaseClient
        .from("reports")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
        setReport(null);
      } else {
        setReport(data);
        const [{ data: previous }, { data: next }] = await Promise.all([
          supabaseClient
            .from("reports")
            .select("id")
            .lt("created_at", data.created_at)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),

          supabaseClient
            .from("reports")
            .select("id")
            .gt("created_at", data.created_at)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle(),
        ]);

        setPreviousReportId(previous?.id || null);
        setNextReportId(next?.id || null);
      }

      setLoading(false);
    };

    fetchReport();
  }, [params?.id]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">EOD Report</h1>
        <div className="flex flex-col gap-2 bg-slate-50 w-sm py-4 px-4 rounded-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <LoaderCircle size={32} className="animate-spin text-zinc-500" />
              <div>Loading report...</div>
            </div>
          ) : report ? (
            <div>
              <div className="flex items-center justify-center gap-2 mb-4">
                {previousReportId ? (
                  <Link href={`/history/${previousReportId}`}>
                    <ArrowLeft
                      size={20}
                      className="mr-6 cursor-pointer text-zinc-700 hover:text-black"
                    />
                  </Link>
                ) : (
                  <div className="w-5 mr-6" />
                )}
                <h3 className="text-lg font-semibold text-center py-2">
                  {" "}
                  {formatDate(report.created_at)}
                </h3>
                {nextReportId ? (
                  <Link href={`/history/${nextReportId}`}>
                    <ArrowRight
                      size={20}
                      className="ml-6 cursor-pointer text-zinc-700 hover:text-black"
                    />
                  </Link>
                ) : (
                  <div className="w-5 ml-6" />
                )}
              </div>
              <Table className="[&_td]:py-3 [&_th]:py-3">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Net Sales</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(report.net_sales)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Gross Sales</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(report.gross_sales)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      Handroll Count
                    </TableCell>
                    <TableCell className="text-right">
                      {report.handroll}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Cash To Bank</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(report.cash_to_bank)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Cash Read</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(report.cash_read)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Wastage</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(report.wastage)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Petty Cash</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(report.petty_cash)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-red-500">Error loading report.</div>
            </div>
          )}
        </div>

        <Link href="/history" className="my-8">
          <Button size="lg">Back</Button>
        </Link>
      </main>
    </div>
  );
}
