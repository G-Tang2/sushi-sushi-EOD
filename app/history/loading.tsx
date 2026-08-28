import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-start justify-center px-4 pt-10 sm:pt-16">
      <main className="flex w-full max-w-3xl flex-col items-center">
        <div className="flex flex-col items-center w-full max-w-xs gap-2 my-9">
            <LoaderCircle size={32} className="animate-spin text-zinc-500" />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-2 bg-slate-50 py-4 px-4 rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-2">
            <LoaderCircle size={32} className="animate-spin text-zinc-500" />
            <div>Loading reports...</div>   
          </div>
        </div>
      </main>
    </div>
  );
}
