import { WhatsAppButton } from "../shared/WhatsAppButton";
import type { BusinessWithRelations } from "../types";

export function MechanicTemplate({ business }: { business: BusinessWithRelations }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gray-900 text-white px-4 py-8">
        <h1 className="text-2xl font-bold">{business.name}</h1>
        {business.description && <p className="mt-2 text-gray-300 text-sm">{business.description}</p>}
        <div className="mt-5 flex gap-3">
          {business.phone && (
            <a href={`tel:${business.phone}`} className="rounded-full bg-yellow-400 text-black px-5 py-3 font-semibold text-sm">
              Call now
            </a>
          )}
          {business.whatsapp && (
            <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
          )}
        </div>
      </div>

      <div className="px-4 py-6">
        {business.products.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Services</h2>
            <ul className="divide-y border rounded-lg overflow-hidden">
              {business.products.map((s) => (
                <li key={s.id} className="flex justify-between p-3 text-sm">
                  <span>{s.name}</span>
                  {s.price != null && <span className="font-medium">{s.currency} {s.price}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {business.addressText && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Find us</h2>
            <p className="text-sm text-gray-600">{business.addressText}</p>
            {business.latitude && business.longitude && (
              <a
                className="text-sm text-blue-600 underline"
                href={`https://maps.google.com/?q=${business.latitude},${business.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
            )}
          </section>
        )}

        {business.hours.length > 0 && (
          <section className="mt-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Hours</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              {business.hours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span>{h.day}</span>
                  <span>{h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
