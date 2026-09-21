import { WhatsAppButton } from "../shared/WhatsAppButton";
import type { BusinessWithRelations } from "../types";

export function SalonTemplate({ business }: { business: BusinessWithRelations }) {
  return (
    <main className="min-h-screen bg-[#fdf6f0]">
      <div
        className="h-56 w-full bg-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: business.coverPhotoUrl ? `url(${business.coverPhotoUrl})` : undefined,
        }}
      />
      <div className="px-4 -mt-12">
        <div className="rounded-2xl bg-white shadow-md p-5">
          <div className="flex items-center gap-3">
            {business.logoUrl && (
              <img src={business.logoUrl} className="h-16 w-16 rounded-full object-cover" alt={business.name} />
            )}
            <div>
              <h1 className="text-xl font-bold">{business.name}</h1>
              {business.addressText && (
                <p className="text-xs text-gray-500">{business.addressText}</p>
              )}
            </div>
          </div>
          {business.description && (
            <p className="mt-3 text-sm text-gray-600">{business.description}</p>
          )}
          <div className="mt-4 flex gap-3">
            {business.whatsapp && (
              <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
            )}
            {business.phone && (
              <a href={`tel:${business.phone}`} className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-medium">
                Book by phone
              </a>
            )}
          </div>
        </div>

        {business.products.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Services</h2>
            <div className="space-y-2">
              {business.products.map((s) => (
                <div key={s.id} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    {s.description && <p className="text-xs text-gray-500">{s.description}</p>}
                  </div>
                  {s.price != null && (
                    <span className="text-sm font-semibold text-pink-700">
                      {s.currency} {s.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {business.photos.length > 0 && (
          <section className="mt-6 mb-8">
            <h2 className="text-lg font-semibold mb-3">Our work</h2>
            <div className="grid grid-cols-3 gap-2">
              {business.photos.map((p) => (
                <img key={p.id} src={p.url} alt={p.caption ?? ""} className="w-full h-24 object-cover rounded-md" />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
