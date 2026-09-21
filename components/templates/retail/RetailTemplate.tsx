import { WhatsAppButton } from "../shared/WhatsAppButton";
import type { BusinessWithRelations } from "../types";

export function RetailTemplate({ business }: { business: BusinessWithRelations }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 py-6 border-b">
        <div className="flex items-center gap-3">
          {business.logoUrl && (
            <img src={business.logoUrl} className="h-14 w-14 rounded-lg object-cover" alt={business.name} />
          )}
          <div>
            <h1 className="text-xl font-bold">{business.name}</h1>
            {business.addressText && <p className="text-xs text-gray-500">{business.addressText}</p>}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          {business.whatsapp && (
            <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`} className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-medium">
              Call
            </a>
          )}
        </div>
      </div>

      {business.products.length > 0 && (
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-3">Catalogue</h2>
          <div className="grid grid-cols-2 gap-3">
            {business.products.map((p) => (
              <div key={p.id} className="border rounded-lg overflow-hidden">
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-28 object-cover" />}
                <div className="p-2">
                  <p className="text-sm font-medium">{p.name}</p>
                  {p.price != null && <p className="text-xs text-gray-500">{p.currency} {p.price}</p>}
                  {!p.isAvailable && <p className="text-xs text-red-500">Out of stock</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
