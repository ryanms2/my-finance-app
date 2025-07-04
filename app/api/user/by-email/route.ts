// app/api/user/by-email/route.ts
import { prisma } from "@/utils/prisma/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return new Response("Email is required", { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return new Response("User not found", { status: 404 });

  return Response.json({ id: user.id });
}