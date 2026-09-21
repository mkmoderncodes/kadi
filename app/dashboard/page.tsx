import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateUniqueSlug } from "@/lib/slug";
import Link from "next/link";

async function createBusiness(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = formData.get("name") as string;
  if (!name?.trim()) return;

  const slug = await generateUniqueSlug(name);
  const business = await db.business.create({
    data: { name, slug, ownerId: user.id, status: "DRAFT" },
  });

  redirect(`/dashboard/${business.id}`);
}

export default async function DashboardHome() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const businesses = await db.business.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-bold mb-4">Your businesses</h1>
        {businesses.length === 0 && (
          <p className="text-gray-500 text-sm">
            You haven't created a business page yet — start below.
          </p>
        )}
        <ul className="space-y-2">
          {businesses.map((b) => (
            <li key={b.id}>
              <Link
                href={`/dashboard/${b.id}`}
                className="block rounded-lg border bg-white p-4 hover:border-gray-400"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{b.name}</span>
                  <span className="text-xs uppercase text-gray-400">{b.status}</span>
                </div>
                <span className="text-sm text-gray-500">/b/{b.slug}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-3">Create a new business page</h2>
        <form action={createBusiness} className="flex gap-2">
          <input
            name="name"
            placeholder="Business name"
            required
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium">
            Create
          </button>
        </form>
      </section>
    </div>
  );
}
