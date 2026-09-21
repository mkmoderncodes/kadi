"use client";

import { useState } from "react";

// Fire-and-forget analytics ping. Doesn't block the WhatsApp/call
// link from opening — call this in an onClick alongside the href.
export function trackEvent(slug: string, type: string) {
  fetch(`/api/businesses/${slug}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
    keepalive: true, // survives page navigation
  }).catch(() => {}); // never let analytics break the user's action
}

export function ContactForm({ slug }: { slug: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/businesses/${slug}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return <p className="text-sm text-green-700">Thanks — your message has been sent.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="name" required placeholder="Your name" className="w-full rounded-md border px-3 py-2 text-sm" />
      <input name="phone" placeholder="Phone (optional)" className="w-full rounded-md border px-3 py-2 text-sm" />
      <textarea name="message" required placeholder="Message" rows={3} className="w-full rounded-md border px-3 py-2 text-sm" />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button disabled={loading} className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-50">
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
