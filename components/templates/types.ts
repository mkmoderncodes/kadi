// The shared contract every template component is built against.
// Whatever Prisma returns from the businesses query (with relations
// included) should satisfy this shape. Keep this in sync with
// prisma/schema.prisma.

export interface BusinessWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  addressText: string | null;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
  coverPhotoUrl: string | null;
  primaryColor: string | null;
  products: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    currency: string;
    imageUrl: string | null;
    category: string | null;
    isAvailable: boolean;
  }[];
  photos: { id: string; url: string; caption: string | null }[];
  hours: {
    day: string;
    isClosed: boolean;
    openTime: string | null;
    closeTime: string | null;
  }[];
  socialLinks: { platform: string; url: string }[];
}
