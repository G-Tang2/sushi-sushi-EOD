import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabase.from("eod").insert([
    {
      net_sales: body.netSales,
      gross_sales: body.grossSales,
      cash_to_bank: body.cashToBank,
      cash_read: body.cashRead,
      handroll: body.handRoll,
      wastage: body.wastage,
      petty_cash: body.pettyCash,
    },
  ]);

  if (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
