import { WhatsAppButton } from "../shared/WhatsAppButton";
import type { BusinessWithRelations } from "../types";

export function SchoolTemplate({ business }: { business: BusinessWithRelations }) {
  return (
    <main className="min-h-screen bg-white">
      <div
        className="h-48 w-full bg-blue-100 bg-cover bg-center"
        style={{
          backgroundImage: business.coverPhotoUrl ? `url(${business.coverPhotoUrl})` : undefined,
        }}
      />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-blue-900">{business.name}</h1>
        {business.description && <p className="mt-2 text-sm text-gray-600">{business.description}</p>}

        <div className="mt-4 flex gap-3">
          {business.whatsapp && (
            <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`} className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-medium">
              Call admissions
            </a>
          )}
        </div>

        {business.products.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-3 text-blue-900">Programs offered</h2>
            <div className="grid grid-cols-1 gap-2">
              {business.products.map((p) => (
                <div key={p.id} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="font-medium text-sm">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-600 mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {business.addressText && (
          <section className="mt-8 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-900">Campus location</h2>
            <p className="text-sm text-gray-600">{business.addressText}</p>
          </section>
        )}
      </div>
    </main>
  );
}
