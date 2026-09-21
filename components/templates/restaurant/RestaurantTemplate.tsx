import { WhatsAppButton } from "../shared/WhatsAppButton";
import { ContactForm } from "../shared/ContactForm";
import type { BusinessWithRelations } from "../types";

// Mobile-first by default: single column, big tap targets, image-forward.
// This is the pattern to copy for each new template — same props,
// different layout/branding.
export function RestaurantTemplate({
  business,
}: {
  business: BusinessWithRelations;
}) {
  return (
    <main className="min-h-screen bg-white">
      {/* Cover */}
      <div
        className="h-48 w-full bg-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: business.coverPhotoUrl
            ? `url(${business.coverPhotoUrl})`
            : undefined,
        }}
      />

      <div className="px-4 -mt-10">
        {/* Logo + name */}
        <div className="flex items-end gap-3">
          {business.logoUrl && (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-20 w-20 rounded-xl border-4 border-white shadow-md object-cover"
            />
          )}
          <h1 className="text-2xl font-bold pb-1">{business.name}</h1>
        </div>

        {business.description && (
          <p className="mt-3 text-gray-600">{business.description}</p>
        )}

        {/* Primary actions — WhatsApp is first-class, not buried */}
        <div className="mt-4 flex flex-wrap gap-3">
          {business.whatsapp && (
            <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
          )}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center rounded-full border border-gray-300 px-5 py-3 font-medium"
            >
              Call
            </a>
          )}
        </div>

        {/* Menu / products */}
        {business.products.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Menu</h2>
            <div className="grid grid-cols-2 gap-3">
              {business.products.map((p) => (
                <div key={p.id} className="rounded-lg border border-gray-200 p-3">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-24 object-cover rounded-md mb-2"
                    />
                  )}
                  <p className="font-medium text-sm">{p.name}</p>
                  {p.price != null && (
                    <p className="text-sm text-gray-500">
                      {p.currency} {p.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Opening hours */}
        {business.hours.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Opening Hours</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              {business.hours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span>{h.day}</span>
                  <span>
                    {h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Location */}
        {business.addressText && (
          <section className="mt-8 mb-8">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <p className="text-sm text-gray-600">{business.addressText}</p>
            {business.latitude && business.longitude && (
              <a
                className="text-sm text-blue-600 underline"
                href={`https://maps.google.com/?q=${business.latitude},${business.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            )}
          </section>
        )}

        {/* Contact form */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Send a message</h2>
          <ContactForm slug={business.slug} />
        </section>
      </div>
    </main>
  );
}
