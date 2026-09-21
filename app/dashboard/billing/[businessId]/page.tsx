"use client";

import { useState } from "react";

const PLANS = [
  { id: "FREE", label: "Free", price: 0, blurb: "Basic page, GhanaSaaS subdomain" },
  { id: "BASIC", label: "Basic", price: 50, blurb: "Custom domain, analytics, priority support" },
  { id: "PREMIUM", label: "Premium", price: 150, blurb: "Premium templates, SEO tools, featured listing" },
];

export default function BillingPage({ params }: { params: { businessId: string } }) {
  const [planTier, setPlanTier] = useState("BASIC");
  const [channel, setChannel] = useState("MTN_MOMO");
  const [momoNumber, setMomoNumber] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    setStatus(null);

    const res = await fetch("/api/billing/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: params.businessId, planTier, momoNumber, channel }),
    });
    const data = await res.json();

    setLoading(false);
    setStatus(res.ok ? data.message ?? "Check your phone to approve the payment" : data.error);
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold">Billing</h1>

      <div className="space-y-2">
        {PLANS.map((p) => (
          <label
            key={p.id}
            className={`block rounded-lg border p-3 cursor-pointer ${planTier === p.id ? "border-black" : "border-gray-200"}`}
          >
            <input
              type="radio"
              name="plan"
              value={p.id}
              checked={planTier === p.id}
              onChange={() => setPlanTier(p.id)}
              className="mr-2"
            />
            <span className="font-medium">{p.label}</span>
            <span className="text-gray-500 text-sm"> — GHS {p.price}/mo</span>
            <p className="text-xs text-gray-500 mt-1">{p.blurb}</p>
          </label>
        ))}
      </div>

      {planTier !== "FREE" && (
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold text-sm">Pay with Mobile Money</h2>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="MTN_MOMO">MTN Mobile Money</option>
            <option value="VODAFONE_CASH">Vodafone Cash</option>
            <option value="AIRTELTIGO_MONEY">AirtelTigo Money</option>
          </select>
          <input
            value={momoNumber}
            onChange={(e) => setMomoNumber(e.target.value)}
            placeholder="MoMo number, e.g. 0241234567"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <button
            onClick={handlePay}
            disabled={loading || !momoNumber}
            className="w-full rounded-md bg-black text-white py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Sending prompt…" : `Pay GHS ${PLANS.find((p) => p.id === planTier)?.price}`}
          </button>
          {status && <p className="text-xs text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
