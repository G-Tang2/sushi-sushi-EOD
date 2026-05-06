import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { toNullableFloat, toNullableInt } from "@/lib/parsers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.json();
  const { error } = await supabase.from("eod").insert([
    {
      net_sales: toNullableFloat(body.netSales),
      gross_sales: toNullableFloat(body.grossSales),
      cash_to_bank: toNullableFloat(body.cashToBank),
      cash_read: toNullableFloat(body.cashRead),
      handroll: toNullableInt(body.handRoll),
      wastage: toNullableFloat(body.wastage),
      petty_cash: toNullableFloat(body.pettyCash),
    },
  ]);

  if (error) {
    console.log("error" + error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
