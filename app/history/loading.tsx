import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">History</h1>
        <div className="flex flex-col gap-2 bg-slate-50 w-sm py-4 px-4 rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-2">
            <LoaderCircle size={32} className="animate-spin text-zinc-500" />
            <div>Loading report...</div>
          </div>
        </div>
      </main>
    </div>
  );
}
