import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold">Kadi</h1>
      <p className="mt-2 text-gray-600 max-w-sm">
        Get your business online in minutes — no developer needed.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/login" className="rounded-md bg-black text-white px-5 py-2 text-sm font-medium">
          Get started
        </Link>
      </div>
    </main>
  );
}
