// app/actions/transactionActions.ts
"use server";

import { auth } from "@/app/auth";
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/data";
import { formSchemaTransaction, formSchemaTransactionEdit } from "@/lib/types";
import { notificationHelpers } from "@/lib/notifications/manager";
import { prisma } from "@/utils/prisma/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type TransactionFormValues = z.infer<typeof formSchemaTransaction>
type TransactionEditFormValues = z.infer<typeof formSchemaTransactionEdit>

export async function createTransactionAction(formData: TransactionFormValues) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Usuário não autenticado" };
  }

  const result = await createTransaction(formData);

  if (!result) {
    return { success: false, error: "Erro ao criar transação" };
  }

  // Enviar notificação de transação criada
  try {
    await notificationHelpers.transactionCreated(session.user.id, {
      type: formData.type,
      amount: formData.amount,
      description: formData.description,
    });
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
  }

  return { success: true, error: null };
}

export async function updateTransactionAction(transactionId: string, formData: TransactionEditFormValues) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Validar os dados
    const validatedData = formSchemaTransactionEdit.parse(formData);

    await updateTransaction(transactionId, validatedData);

    // Enviar notificação de transação atualizada
    try {
      await notificationHelpers.transactionUpdated(session.user.id, {
        description: validatedData.description,
      });
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteTransactionAction(transactionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Buscar dados da transação antes de deletar para a notificação
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId, userId: session.user.id },
      select: { description: true }
    });

    await deleteTransaction(transactionId);

    // Enviar notificação de transação deletada
    if (transaction) {
      try {
        await notificationHelpers.transactionDeleted(session.user.id, {
          description: transaction.description,
        });
      } catch (error) {
        console.error("Erro ao enviar notificação:", error);
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}