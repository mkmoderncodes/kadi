// Reused by every template. Deep-links straight into a pre-filled chat.
export function WhatsAppButton({
  phone,
  businessName,
}: {
  phone: string;
  businessName: string;
}) {
  const cleaned = phone.replace(/\D/g, ""); // strip spaces, +, dashes
  const message = encodeURIComponent(`Hi ${businessName}, I saw your page and I'm interested.`);
  const href = `https://wa.me/${cleaned}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-white font-medium shadow-md active:scale-95 transition"
      // Fire an analytics event on click via onClick -> /api/analytics
    >
      Chat on WhatsApp
    </a>
  );
}
