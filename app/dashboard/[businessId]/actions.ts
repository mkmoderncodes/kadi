"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Every action re-checks ownership — never trust the businessId alone.
async function assertOwnership(businessId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.ownerId !== user.id) {
    throw new Error("Not authorized to edit this business");
  }
  return business;
}

export async function updateBusinessInfo(businessId: string, formData: FormData) {
  await assertOwnership(businessId);

  await db.business.update({
    where: { id: businessId },
    data: {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      phone: (formData.get("phone") as string) || null,
      whatsapp: (formData.get("whatsapp") as string) || null,
      addressText: (formData.get("addressText") as string) || null,
      templateId: formData.get("templateId") as string,
      logoUrl: (formData.get("logoUrl") as string) || null,
      coverPhotoUrl: (formData.get("coverPhotoUrl") as string) || null,
    },
  });

  revalidatePath(`/dashboard/${businessId}`);
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export async function updateHours(businessId: string, formData: FormData) {
  const business = await assertOwnership(businessId);

  for (const day of DAYS) {
    const isClosed = formData.get(`closed_${day}`) === "on";
    const openTime = (formData.get(`open_${day}`) as string) || null;
    const closeTime = (formData.get(`close_${day}`) as string) || null;

    await db.businessHour.upsert({
      where: { businessId_day: { businessId: business.id, day } },
      create: { businessId: business.id, day, isClosed, openTime, closeTime },
      update: { isClosed, openTime, closeTime },
    });
  }

  revalidatePath(`/dashboard/${businessId}`);
}

const SOCIAL_PLATFORMS = ["INSTAGRAM", "FACEBOOK", "TIKTOK", "TWITTER_X", "YOUTUBE", "LINKEDIN"] as const;

export async function updateSocialLinks(businessId: string, formData: FormData) {
  const business = await assertOwnership(businessId);

  for (const platform of SOCIAL_PLATFORMS) {
    const url = (formData.get(`social_${platform}`) as string)?.trim();

    if (!url) {
      await db.socialLink.deleteMany({ where: { businessId: business.id, platform } });
      continue;
    }

    await db.socialLink.upsert({
      where: { businessId_platform: { businessId: business.id, platform } },
      create: { businessId: business.id, platform, url },
      update: { url },
    });
  }

  revalidatePath(`/dashboard/${businessId}`);
}

export async function addProduct(businessId: string, formData: FormData) {
  const business = await assertOwnership(businessId);

  const name = formData.get("name") as string;
  if (!name?.trim()) return;

  const priceRaw = formData.get("price") as string;

  await db.product.create({
    data: {
      businessId: business.id,
      name,
      price: priceRaw ? Number(priceRaw) : null,
      description: (formData.get("description") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
    },
  });

  revalidatePath(`/dashboard/${businessId}`);
}

export async function deleteProduct(businessId: string, productId: string) {
  await assertOwnership(businessId);
  await db.product.delete({ where: { id: productId } });
  revalidatePath(`/dashboard/${businessId}`);
}

export async function addPhoto(businessId: string, formData: FormData) {
  const business = await assertOwnership(businessId);
  const url = formData.get("url") as string;
  if (!url) return;

  await db.photo.create({
    data: { businessId: business.id, url, caption: (formData.get("caption") as string) || null },
  });

  revalidatePath(`/dashboard/${businessId}`);
}

export async function deletePhoto(businessId: string, photoId: string) {
  await assertOwnership(businessId);
  await db.photo.delete({ where: { id: photoId } });
  revalidatePath(`/dashboard/${businessId}`);
}

export async function publishBusiness(businessId: string) {
  await assertOwnership(businessId);
  await db.business.update({
    where: { id: businessId },
    data: { status: "ACTIVE" },
  });
  revalidatePath(`/dashboard/${businessId}`);
  revalidatePath(`/b`); // public page cache
}
