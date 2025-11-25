import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-8 text-4xl font-bold text-zinc-800">
            End of Day Counting
          </h1>
          <p className="mb-8 text-sm text-zinc-500">Designed for Sushi Sushi</p>
        </div>
        <Link href="/safe" passHref>
          <Button size="lg">
            Get Started
          </Button>
        </Link>
      </main>
    </div>
  );
}
