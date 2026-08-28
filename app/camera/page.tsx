import Link from "next/link";
import { Button } from "@/components/ui/button";
import CameraCapture from "@/components/cameraCapture";

export default function CameraPage() {
  return (
    <div className="flex min-h-screen items-start justify-center px-4 pt-10 sm:pt-16">
      <main className="flex w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="my-8 text-4xl font-bold">Scan Receipt</h1>

        <div className="flex w-full max-w-sm flex-col gap-4 bg-slate-50 py-4 px-4 rounded-2xl">
          <CameraCapture />
        </div>

        <Link href="/" className="my-8">
          <Button size="lg">Go Home</Button>
        </Link>
      </main>
    </div>
  );
}
