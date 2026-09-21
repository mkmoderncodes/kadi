import { WhatsAppButton } from "../shared/WhatsAppButton";
import type { BusinessWithRelations } from "../types";

export function FashionTemplate({ business }: { business: BusinessWithRelations }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div
        className="h-64 w-full bg-gray-800 bg-cover bg-center"
        style={{
          backgroundImage: business.coverPhotoUrl ? `url(${business.coverPhotoUrl})` : undefined,
        }}
      />
      <div className="px-4 py-6 text-center">
        <h1 className="text-2xl font-bold tracking-wide uppercase">{business.name}</h1>
        {business.description && (
          <p className="mt-2 text-sm text-gray-300 max-w-sm mx-auto">{business.description}</p>
        )}
        <div className="mt-4 flex justify-center gap-3">
          {business.whatsapp && (
            <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
          )}
        </div>
      </div>

      {/* Product / lookbook grid */}
      {business.products.length > 0 && (
        <section className="px-2">
          <div className="grid grid-cols-2 gap-2">
            {business.products.map((p) => (
              <div key={p.id} className="bg-gray-900 rounded-md overflow-hidden">
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover" />
                )}
                <div className="p-2">
                  <p className="text-sm font-medium">{p.name}</p>
                  {p.price != null && (
                    <p className="text-xs text-gray-400">{p.currency} {p.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {business.socialLinks.length > 0 && (
        <section className="px-4 py-8 text-center">
          <div className="flex justify-center gap-4 text-sm text-gray-300">
            {business.socialLinks.map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                {s.platform}
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
