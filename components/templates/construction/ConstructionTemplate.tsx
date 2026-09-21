import { WhatsAppButton } from "../shared/WhatsAppButton";
import type { BusinessWithRelations } from "../types";

export function ConstructionTemplate({ business }: { business: BusinessWithRelations }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-orange-600 text-white px-4 py-8">
        <h1 className="text-2xl font-bold">{business.name}</h1>
        {business.description && <p className="mt-2 text-orange-50 text-sm">{business.description}</p>}
        <div className="mt-5 flex gap-3">
          {business.whatsapp && (
            <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`} className="rounded-full bg-white text-orange-700 px-5 py-3 font-semibold text-sm">
              Request a quote
            </a>
          )}
        </div>
      </div>

      {business.photos.length > 0 && (
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-3">Our projects</h2>
          <div className="grid grid-cols-2 gap-2">
            {business.photos.map((p) => (
              <img key={p.id} src={p.url} alt={p.caption ?? ""} className="w-full h-32 object-cover rounded-md" />
            ))}
          </div>
        </section>
      )}

      {business.products.length > 0 && (
        <section className="px-4 pb-6">
          <h2 className="text-lg font-semibold mb-3">Services</h2>
          <ul className="space-y-2">
            {business.products.map((s) => (
              <li key={s.id} className="border rounded-lg p-3 text-sm">
                <p className="font-medium">{s.name}</p>
                {s.description && <p className="text-gray-500 text-xs mt-1">{s.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
