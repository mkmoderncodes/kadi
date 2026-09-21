import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

// Paystack supports Ghanaian Mobile Money (MTN, Vodafone Cash, AirtelTigo)
// as a first-class channel — this is why it's used here instead of a
// MoMo-specific SDK. Hubtel is a solid alternative if you want a Ghana-
// only provider instead. Requires PAYSTACK_SECRET_KEY in your .env.
const PLAN_PRICES: Record<string, number> = {
  BASIC: 50,    // GHS/month — adjust to your real pricing
  PREMIUM: 150,
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { businessId, planTier, momoNumber, channel } = await req.json();

  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.ownerId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const amount = PLAN_PRICES[planTier];
  if (!amount) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const reference = `ghsaas_${randomUUID()}`;

  await db.payment.create({
    data: {
      businessId,
      amount,
      channel: channel ?? "MTN_MOMO",
      status: "PENDING",
      reference,
      planTier,
    },
  });

  // Charge the Mobile Money wallet directly via Paystack's charge API.
  // Paystack will send an OTP/PIN prompt to the customer's phone; the
  // final result arrives asynchronously at /api/billing/webhook.
  const paystackRes = await fetch("https://api.paystack.co/charge", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: amount * 100, // Paystack uses pesewas (kobo-equivalent)
      currency: "GHS",
      mobile_money: { phone: momoNumber, provider: mapProvider(channel) },
      reference,
    }),
  });

  const data = await paystackRes.json();

  if (!paystackRes.ok) {
    await db.payment.update({ where: { reference }, data: { status: "FAILED" } });
    return NextResponse.json({ error: data.message ?? "Payment initialization failed" }, { status: 400 });
  }

  // data.data.display_text usually tells the customer to approve on their phone
  return NextResponse.json({ reference, status: data.data?.status, message: data.data?.display_text });
}

function mapProvider(channel?: string) {
  switch (channel) {
    case "VODAFONE_CASH": return "vod";
    case "AIRTELTIGO_MONEY": return "atl";
    default: return "mtn";
  }
}
