// lib/dashboardActions/transferActions.ts
"use server";

import { createTransfer } from "@/lib/data";
import { formSchemaTransfer } from "@/lib/types";
import { z } from "zod";

type TransferFormValues = z.infer<typeof formSchemaTransfer>

export async function createTransferAction(formData: TransferFormValues) {
  const result = await createTransfer(formData);

  if (!result) {
    return { success: false, error: "Erro ao criar transferência" };
  }

  return { success: true, error: null };
}
