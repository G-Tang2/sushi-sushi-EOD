"use client";

import { useRouter } from "next/navigation";
import { TableRow } from "@/components/ui/table";

export function ClickableRow({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <TableRow
      onClick={() => router.push(href)}
      className="cursor-pointer hover:bg-zinc-100 transition"
    >
      {children}
    </TableRow>
  );
}
