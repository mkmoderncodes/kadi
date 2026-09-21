import { WhatsAppButton } from "../shared/WhatsAppButton";
import type { BusinessWithRelations } from "../types";

export function ProfessionalServicesTemplate({ business }: { business: BusinessWithRelations }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 py-10 text-center bg-slate-50">
        {business.logoUrl && (
          <img src={business.logoUrl} className="h-16 w-16 rounded-full object-cover mx-auto mb-3" alt={business.name} />
        )}
        <h1 className="text-2xl font-bold text-slate-900">{business.name}</h1>
        {business.description && (
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">{business.description}</p>
        )}
        <div className="mt-5 flex justify-center gap-3">
          {business.whatsapp && (
            <WhatsAppButton phone={business.whatsapp} businessName={business.name} />
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`} className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-medium">
              Call to book
            </a>
          )}
        </div>
      </div>

      {business.products.length > 0 && (
        <section className="px-4 py-8 max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Services</h2>
          <div className="space-y-3">
            {business.products.map((s) => (
              <div key={s.id} className="border-l-2 border-slate-900 pl-3">
                <p className="font-medium text-sm">{s.name}</p>
                {s.description && <p className="text-xs text-slate-500 mt-1">{s.description}</p>}
                {s.price != null && (
                  <p className="text-xs text-slate-700 mt-1 font-medium">{s.currency} {s.price}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {business.addressText && (
        <section className="px-4 pb-8 max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-2 text-slate-900">Office</h2>
          <p className="text-sm text-slate-600">{business.addressText}</p>
        </section>
      )}
    </main>
  );
}
