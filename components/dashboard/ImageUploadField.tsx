"use client";

import { useState } from "react";

// Drop this into any form. It uploads immediately on file select and
// keeps the resulting URL in a hidden input named `name`, so the
// surrounding <form action={serverAction}> picks it up like any
// other field — no extra wiring needed in the server action.
export function ImageUploadField({
  name,
  label,
  defaultUrl,
}: {
  name: string;
  label: string;
  defaultUrl?: string | null;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    setUploading(false);

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }

    setUrl(data.url);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input type="hidden" name={name} value={url} />
      {url && (
        <img src={url} alt="" className="h-20 w-20 object-cover rounded-md border" />
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="text-xs"
      />
      {uploading && <p className="text-xs text-gray-400">Uploading…</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
