import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AnalyticsPage({
  params,
}: {
  params: { businessId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const business = await db.business.findUnique({ where: { id: params.businessId } });
  if (!business || business.ownerId !== user.id) notFound();

  const counts = await db.analyticsEvent.groupBy({
    by: ["type"],
    where: { businessId: business.id },
    _count: true,
  });

  const submissions = await db.contactSubmission.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const countByType = Object.fromEntries(counts.map((c) => [c.type, c._count]));

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8">
      <h1 className="text-xl font-bold">Analytics — {business.name}</h1>

      <div className="grid grid-cols-2 gap-3">
        {[
          ["Page views", countByType.PAGE_VIEW ?? 0],
          ["WhatsApp clicks", countByType.WHATSAPP_CLICK ?? 0],
          ["Call clicks", countByType.CALL_CLICK ?? 0],
          ["Map clicks", countByType.MAP_CLICK ?? 0],
        ].map(([label, count]) => (
          <div key={label as string} className="rounded-lg border bg-white p-4">
            <p className="text-2xl font-bold">{count as number}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-semibold mb-3">Recent messages</h2>
        {submissions.length === 0 && (
          <p className="text-sm text-gray-500">No messages yet.</p>
        )}
        <ul className="space-y-2">
          {submissions.map((s) => (
            <li key={s.id} className="rounded-lg border bg-white p-3 text-sm">
              <p className="font-medium">{s.name} {s.phone && `— ${s.phone}`}</p>
              <p className="text-gray-600 mt-1">{s.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
