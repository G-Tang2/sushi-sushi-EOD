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

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data: reports, error } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load reports
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">History</h1>

        <div className="flex flex-col gap-2 bg-slate-50 w-sm py-4 px-4 rounded-2xl">
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
        </div>

        <Link href="/" className="my-8">
          <Button size="lg">Go Home</Button>
        </Link>
      </main>
    </div>
  );
}
