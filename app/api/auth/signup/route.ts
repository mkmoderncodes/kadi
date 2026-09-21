import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, phone } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Valid email and a password of at least 8 characters are required" },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const user = await db.user.create({
    data: { email, phone, passwordHash: await hashPassword(password) },
  });

  await createSession(user.id);

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
