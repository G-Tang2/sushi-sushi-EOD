"use client";
import { Button } from "@/components/ui/button";
import { reportInProgressAtom } from "@/state/moneyAtoms";
import { useAtom } from "jotai";
import useResetMoneyCounters from "@/app/hooks/useResetMoneyCounters";
import Link from "next/link";

export default function Home() {
  const [reportInProgress, setReportInProgress] = useAtom(reportInProgressAtom);
  const resetMoneyCounters = useResetMoneyCounters();

  const handleStartNewReport = () => {
    resetMoneyCounters();
    setReportInProgress(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-8 text-4xl font-bold text-zinc-800">
            End of Day Counting
          </h1>
          <p className="mb-8 text-sm text-zinc-500">Designed for Sushi Sushi</p>
        </div>
        <div>
          <div className="w-full flex flex-col gap-3">
            <Link href="/safe" className="w-full">
              <Button
                size="lg"
                onClick={handleStartNewReport}
                className="w-full"
              >
                Create Report
              </Button>
            </Link>
            {reportInProgress && (
              <Link href="/safe" className="w-full">
                <Button size="lg" variant="outline" className="w-full">
                  Continue Report
                </Button>
              </Link>
            )}
            <Link href="/history" className="w-full">
              <Button
                size="lg"
                variant="ghost"
                className="w-full text-zinc-600 hover:text-zinc-900"
              >
                View History
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
