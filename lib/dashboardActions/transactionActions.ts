// app/actions/transactionActions.ts
"use server";

import { auth } from "@/app/auth";
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/data";
import { formSchemaTransaction, formSchemaTransactionEdit } from "@/lib/types";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type TransactionFormValues = z.infer<typeof formSchemaTransaction>
type TransactionEditFormValues = z.infer<typeof formSchemaTransactionEdit>

export async function createTransactionAction(formData: TransactionFormValues) {
  const result = await createTransaction(formData);

  if (!result) {
    return { success: false, error: "Erro ao criar transação" };
  }

  return { success: true, error: null };
}

export async function updateTransactionAction(transactionId: string, formData: TransactionEditFormValues) {
  try {
    // Validar os dados
    const validatedData = formSchemaTransactionEdit.parse(formData);

    await updateTransaction(transactionId, validatedData);

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
    await deleteTransaction(transactionId);

    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}