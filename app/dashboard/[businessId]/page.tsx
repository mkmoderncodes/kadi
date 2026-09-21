import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import {
  updateBusinessInfo,
  addProduct,
  deleteProduct,
  addPhoto,
  deletePhoto,
  updateHours,
  updateSocialLinks,
  publishBusiness,
} from "./actions";

const TEMPLATE_OPTIONS = [
  "RESTAURANT", "SALON", "FASHION", "MECHANIC", "SCHOOL",
  "CONSTRUCTION", "RETAIL", "PROFESSIONAL_SERVICES",
];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SOCIAL_PLATFORMS = ["INSTAGRAM", "FACEBOOK", "TIKTOK", "TWITTER_X", "YOUTUBE", "LINKEDIN"];

export default async function EditBusinessPage({
  params,
}: {
  params: { businessId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const business = await db.business.findUnique({
    where: { id: params.businessId },
    include: { products: true, photos: true, hours: true, socialLinks: true },
  });

  if (!business || business.ownerId !== user.id) notFound();

  const hoursByDay = Object.fromEntries(business.hours.map((h) => [h.day, h]));
  const socialsByPlatform = Object.fromEntries(business.socialLinks.map((s) => [s.platform, s.url]));

  const updateAction = updateBusinessInfo.bind(null, business.id);
  const addProductAction = addProduct.bind(null, business.id);
  const addPhotoAction = addPhoto.bind(null, business.id);
  const updateHoursAction = updateHours.bind(null, business.id);
  const updateSocialAction = updateSocialLinks.bind(null, business.id);
  const publishAction = publishBusiness.bind(null, business.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{business.name}</h1>
        <span className="text-xs uppercase text-gray-400">{business.status}</span>
      </div>

      {business.status !== "ACTIVE" ? (
        <form action={publishAction}>
          <button className="w-full rounded-md bg-green-600 text-white py-2 text-sm font-medium">
            Publish page — go live at /b/{business.slug}
          </button>
        </form>
      ) : (
        <a href={`/b/${business.slug}`} target="_blank" className="block text-sm text-blue-600 underline">
          View live page →
        </a>
      )}
      <a href={`/dashboard/${business.id}/analytics`} className="block text-sm text-gray-500 underline">
        View analytics →
      </a>
      <a href={`/dashboard/billing/${business.id}`} className="block text-sm text-gray-500 underline">
        Plan: {business.planTier} — manage billing →
      </a>

      {/* Business info */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-3">Business info</h2>
        <form action={updateAction} className="space-y-3">
          <input name="name" defaultValue={business.name} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Business name" />
          <textarea name="description" defaultValue={business.description ?? ""} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Short description" rows={3} />
          <input name="phone" defaultValue={business.phone ?? ""} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Phone number" />
          <input name="whatsapp" defaultValue={business.whatsapp ?? ""} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="WhatsApp number (with country code)" />
          <input name="addressText" defaultValue={business.addressText ?? ""} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Location / address" />
          <select name="templateId" defaultValue={business.templateId} className="w-full rounded-md border px-3 py-2 text-sm">
            {TEMPLATE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField name="logoUrl" label="Logo" defaultUrl={business.logoUrl} />
            <ImageUploadField name="coverPhotoUrl" label="Cover photo" defaultUrl={business.coverPhotoUrl} />
          </div>
          <button className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium">Save</button>
        </form>
      </section>

      {/* Opening hours */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-3">Opening hours</h2>
        <form action={updateHoursAction} className="space-y-2">
          {DAYS.map((day) => {
            const h = hoursByDay[day];
            return (
              <div key={day} className="flex items-center gap-2 text-sm">
                <span className="w-10">{day}</span>
                <input type="time" name={`open_${day}`} defaultValue={h?.openTime ?? ""} className="rounded-md border px-2 py-1 text-xs" />
                <span>–</span>
                <input type="time" name={`close_${day}`} defaultValue={h?.closeTime ?? ""} className="rounded-md border px-2 py-1 text-xs" />
                <label className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                  <input type="checkbox" name={`closed_${day}`} defaultChecked={h?.isClosed ?? false} />
                  Closed
                </label>
              </div>
            );
          })}
          <button className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium mt-2">Save hours</button>
        </form>
      </section>

      {/* Social links */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-3">Social links</h2>
        <form action={updateSocialAction} className="space-y-2">
          {SOCIAL_PLATFORMS.map((platform) => (
            <input
              key={platform}
              name={`social_${platform}`}
              defaultValue={socialsByPlatform[platform] ?? ""}
              placeholder={`${platform.replace("_", " ")} URL`}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          ))}
          <button className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium">Save links</button>
        </form>
      </section>

      {/* Products */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-3">Products / services</h2>
        <ul className="space-y-2 mb-4">
          {business.products.map((p) => (
            <li key={p.id} className="flex items-center justify-between text-sm border-b pb-2">
              <span>{p.name} {p.price != null && `— GHS ${p.price}`}</span>
              <form action={deleteProduct.bind(null, business.id, p.id)}>
                <button className="text-red-500 text-xs">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addProductAction} className="space-y-2">
          <div className="flex gap-2">
            <input name="name" placeholder="Item name" required className="flex-1 rounded-md border px-3 py-2 text-sm" />
            <input name="price" placeholder="Price (GHS)" type="number" className="w-28 rounded-md border px-3 py-2 text-sm" />
          </div>
          <ImageUploadField name="imageUrl" label="Photo (optional)" />
          <button className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium">Add</button>
        </form>
      </section>

      {/* Gallery */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-3">Photo gallery</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {business.photos.map((p) => (
            <div key={p.id} className="relative">
              <img src={p.url} alt={p.caption ?? ""} className="w-full h-20 object-cover rounded-md" />
              <form action={deletePhoto.bind(null, business.id, p.id)} className="absolute top-1 right-1">
                <button className="text-xs bg-white rounded-full px-1.5 text-red-500">×</button>
              </form>
            </div>
          ))}
        </div>
        <form action={addPhotoAction}>
          <ImageUploadField name="url" label="Add a photo" />
          <button className="mt-2 rounded-md bg-black text-white px-4 py-2 text-sm font-medium">Add to gallery</button>
        </form>
      </section>
    </div>
  );
}
