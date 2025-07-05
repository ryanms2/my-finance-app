import { auth } from "@/app/auth";
import { prisma } from "@/utils/prisma/prisma";

/**
 * Verifica se o usuário logado tem permissão para acessar uma transação
 */
export async function canAccessTransaction(transactionId: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return false;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: userId
      }
    });

    return !!transaction;
  } catch (error) {
    console.error("Erro ao verificar permissão da transação:", error);
    return false;
  }
}

/**
 * Verifica se o usuário logado tem permissão para acessar uma carteira
 */
export async function canAccessWallet(walletId: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return false;
  }

  try {
    const wallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: userId
      }
    });

    return !!wallet;
  } catch (error) {
    console.error("Erro ao verificar permissão da carteira:", error);
    return false;
  }
}

/**
 * Verifica se o usuário logado tem permissão para acessar uma categoria
 */
export async function canAccessCategory(categoryId: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return false;
  }

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId
      }
    });

    return !!category;
  } catch (error) {
    console.error("Erro ao verificar permissão da categoria:", error);
    return false;
  }
}

/**
 * Busca uma transação com verificação de permissão
 */
export async function getTransactionWithPermission(transactionId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: userId
      },
      include: {
        category: true,
        account: true
      }
    });

    if (!transaction) {
      throw new Error("Transação não encontrada ou sem permissão");
    }

    return transaction;
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    throw error;
  }
}
