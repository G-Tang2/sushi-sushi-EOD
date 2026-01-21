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
          <div className="justify-center mb-4 flex">
            <Link href="/safe" passHref>
              <Button size="lg" onClick={handleStartNewReport}>
                Get Started
              </Button>
            </Link>
          </div>
          {reportInProgress && (
            <div className="justify-center mt-4 flex">
              <Link href="/safe" passHref>
                <Button size="lg" variant={"outline"}>
                  Continue Report
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
