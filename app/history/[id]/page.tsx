"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Report } from "@/types/report";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();

  const [report, setReport] = useState<Report | null>(null);
  const [editedReport, setEditedReport] = useState<Report | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
        setEditedReport(data);

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

  const handleChange = (field: keyof Report, value: string | number) => {
    if (!editedReport) return;
    console.log("Changing", field, "to", value);

    setEditedReport({
      ...editedReport,
      [field]: typeof editedReport[field] === "number" ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    if (!editedReport) return;

    setSaving(true);
    console.log("Saving report", editedReport);

    const { error } = await supabaseClient
      .from("reports")
      .update({
        net_sales: editedReport.net_sales,
        gross_sales: editedReport.gross_sales,
        handroll: editedReport.handroll,
        cash_to_bank: editedReport.cash_to_bank,
        cash_read: editedReport.cash_read,
        wastage: editedReport.wastage,
        petty_cash: editedReport.petty_cash,
      })
      .eq("id", editedReport.id);

    if (error) {
      console.error(error);
      alert("Failed to save report.");
    } else {
      setReport(editedReport);
      setIsEditing(false);
    }

    setSaving(false);
  };

  const handleCancel = () => {
    setEditedReport(report);
    setIsEditing(false);
  };

  const renderCell = (
    label: string,
    field: keyof Report,
    isCurrency = true,
  ) => {
    const value = editedReport?.[field];

    return (
      <TableRow>
        <TableCell className="font-medium">{label}</TableCell>

        <TableCell className="text-right">
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={value ?? ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-28 rounded border px-2 text-right text-base"
            />
          ) : isCurrency ? (
            formatCurrency(Number(value))
          ) : (
            value
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">EOD Report</h1>

        <div className="flex w-sm flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <LoaderCircle size={32} className="animate-spin text-zinc-500" />
              <div>Loading report...</div>
            </div>
          ) : report ? (
            <div>
              <div className="mb-4 flex items-center justify-center gap-2">
                {previousReportId ? (
                  <Link href={`/history/${previousReportId}`}>
                    <ArrowLeft
                      size={20}
                      className="mr-6 cursor-pointer text-zinc-700 hover:text-black"
                    />
                  </Link>
                ) : (
                  <div className="mr-6 w-5" />
                )}

                <h3 className="py-2 text-center text-lg font-semibold">
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
                  <div className="ml-6 w-5" />
                )}
              </div>

              <Table className="[&_td]:py-3 [&_th]:py-3">
                <TableBody>
                  {renderCell("Net Sales", "net_sales")}
                  {renderCell("Gross Sales", "gross_sales")}
                  {renderCell("Handroll Count", "handroll", false)}
                  {renderCell("Cash To Bank", "cash_to_bank")}
                  {renderCell("Cash Read", "cash_read")}
                  {renderCell("Wastage", "wastage")}
                  {renderCell("Petty Cash", "petty_cash")}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-red-500">Error loading report.</div>
            </div>
          )}
        </div>

        {!loading && report && (
          <div className="flex gap-12 mt-8">
            {isEditing ? (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="w-24"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>

                <Button
                  size="lg"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-24"
                >
                  {saving ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <>
                <Link href="/history">
                  <Button size="lg" className="w-24">
                    Back
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsEditing(true)}
                  size="lg"
                  className="w-24"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
