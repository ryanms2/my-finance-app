
import { prisma } from "@/utils/prisma/prisma";

export async function POST(req: Request) {
  const { description, amount, date, type, userId, accountId, categoryId, tagIds } = await req.json();

  const transaction = await prisma.transaction.create({
    data: {
      description,
      amount,
      date: new Date(date),
      type,
      user: { connect: { id: userId } },
      account: { connect: { id: accountId } },
      category: { connect: { id: categoryId } },
      tags: tagIds && tagIds.length > 0 ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
    },
  });

  console.log(transaction)

  return Response.json(transaction);
}