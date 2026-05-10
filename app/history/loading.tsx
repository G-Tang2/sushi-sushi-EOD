import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <div className="flex flex-col items-center w-full max-w-xs gap-2 my-9">
            <LoaderCircle size={32} className="animate-spin text-zinc-500" />
        </div>
        <div className="flex flex-col gap-2 bg-slate-50 w-sm py-4 px-4 rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-2">
            <LoaderCircle size={32} className="animate-spin text-zinc-500" />
            <div>Loading reports...</div>   
          </div>
        </div>
      </main>
    </div>
  );
}
