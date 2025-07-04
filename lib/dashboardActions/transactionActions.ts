// app/actions/transactionActions.ts
"use server";

import { auth } from "@/app/auth";
import { createTransaction } from "@/lib/data";
import { formSchemaTransaction } from "@/lib/types";
import { z } from "zod";

type TransactionFormValues = z.infer<typeof formSchemaTransaction>

export async function createTransactionAction(formData: TransactionFormValues) {

  const result = await createTransaction(formData);

  if (!result) {
    return { success: false, error: "Erro ao criar transação" };
  }

  return { success: true, error: null };
}