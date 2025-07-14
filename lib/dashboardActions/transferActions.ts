// lib/dashboardActions/transferActions.ts
"use server";

import { auth } from "@/app/auth";
import { createTransfer } from "@/lib/data";
import { formSchemaTransfer } from "@/lib/types";
import { notificationHelpers } from "@/lib/notifications/manager";
import { prisma } from "@/utils/prisma/prisma";
import { z } from "zod";

type TransferFormValues = z.infer<typeof formSchemaTransfer>

export async function createTransferAction(formData: TransferFormValues) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Usuário não autenticado" };
  }

  const result = await createTransfer(formData);

  if (!result) {
    return { success: false, error: "Erro ao criar transferência" };
  }

  // Buscar dados das contas para a notificação
  try {
    const [fromAccount, toAccount] = await Promise.all([
      prisma.account.findUnique({
        where: { id: formData.fromAccountId },
        select: { name: true }
      }),
      prisma.account.findUnique({
        where: { id: formData.toAccountId },
        select: { name: true }
      })
    ]);

    if (fromAccount && toAccount) {
      await notificationHelpers.transferCompleted(session.user.id, {
        amount: formData.amount,
        fromAccount: fromAccount,
        toAccount: toAccount,
      });
    }
  } catch (error) {
    console.error("Erro ao enviar notificação de transferência:", error);
  }

  return { success: true, error: null };
}
