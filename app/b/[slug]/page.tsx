import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getTemplate } from "@/components/templates";

// This ONE route serves every business on the platform.
// kadi.app/b/kofis-chop-bar, kadi.app/b/ama-salon, etc.
// all hit this same file — the only thing that changes is the data
// and which template component gets picked.

export default async function BusinessPage({
  params,
}: {
  params: { slug: string };
}) {
  const business = await db.business.findUnique({
    where: { slug: params.slug },
    include: {
      products: { orderBy: { sortOrder: "asc" } },
      photos: { orderBy: { sortOrder: "asc" } },
      hours: true,
      socialLinks: true,
    },
  });

  if (!business || business.status !== "ACTIVE") {
    notFound();
  }

  // Fire-and-forget page view — don't block rendering on it.
  db.analyticsEvent.create({ data: { businessId: business.id, type: "PAGE_VIEW" } }).catch(() => {});

  // Every template component receives the exact same shape of data.
  // Adding template #9 later = adding one component, zero changes here.
  const Template = getTemplate(business.templateId);

  return <Template business={business} />;
}

// Regenerate this page's cache whenever the owner saves changes
// (call revalidatePath(`/b/${slug}`) from the dashboard save action).
export const revalidate = 3600; // fallback: refresh at most hourly
