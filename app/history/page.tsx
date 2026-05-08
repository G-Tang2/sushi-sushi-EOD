"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
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
import { LoaderCircle } from "lucide-react";

type Report = {
  id: number;
  created_at: string;
  net_sales: number;
  gross_sales: number;
  cash_read: number;
  cash_to_bank: number;
  handroll: number;
  wastage: number;
  petty_cash: number;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

const formatCurrency = (amount: number) => {
  if (amount === null || amount === undefined) {
    return "$0.00";
  }
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
};

export default function Page() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabaseClient.from("reports").select("*");

      if (error) {
        console.error(error);
      } else {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">History</h1>
        <div className="flex flex-col gap-2 bg-slate-50 w-sm py-4 px-4 rounded-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <LoaderCircle
                size={32}
                className="animate-spin text-zinc-500 item-center"
              />
              <div>Loading reports...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-center">
                    Date
                  </TableHead>
                  <TableHead> Net Sale</TableHead>
                  <TableHead className="text-center">Handroll</TableHead>
                  <TableHead className="text-right">Wastage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium text-center">
                      {formatDate(report.created_at)}
                    </TableCell>
                    <TableCell>{formatCurrency(report.net_sales)}</TableCell>
                    <TableCell className="text-center">
                      {report.handroll}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(report.wastage)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <Link href="/" passHref>
          <Button size="lg" className="my-8">
            Home
          </Button>
        </Link>
      </main>
    </div>
  );
}
