"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border bg-white p-6 space-y-4"
      >
        <h1 className="text-lg font-bold">
          {mode === "login" ? "Log in" : "Create an account"}
        </h1>

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className="w-full rounded-md bg-black text-white py-2 text-sm font-medium">
          {mode === "login" ? "Log in" : "Sign up"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-xs text-gray-500"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
