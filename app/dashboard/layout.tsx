import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <span className="font-semibold">Dashboard</span>
        <form action="/api/auth/logout" method="post">
          <button className="text-sm text-gray-500">Log out</button>
        </form>
      </header>
      <main className="p-4 max-w-2xl mx-auto">{children}</main>
    </div>
  );
}
