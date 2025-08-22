"use server"
import { auth } from "@/app/auth";
import { prisma } from "@/utils/prisma/prisma";
import { z } from "zod";
import { formSchemaAccount, formSchemaTransaction, formSchemaTransfer } from "./types";
import { revalidatePath } from 'next/cache';
import bcrypt from "bcryptjs";
  
/**
 * Helper para revalidar todas as páginas que podem ser afetadas por mudanças financeiras
 */
function revalidateFinancePages() {
  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  revalidatePath('/wallets')
  revalidatePath('/budgets')
  revalidatePath('/(main)', 'layout')
}

type WalletFormValues = z.infer<typeof formSchemaAccount>;
type TransactionFormValues = z.infer<typeof formSchemaTransaction>
type TransferFormValues = z.infer<typeof formSchemaTransfer>

export async function getAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'asc' }
      ]
    });
    
    return accounts;
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    return [];
  }
}

export async function createAccount(account: WalletFormValues) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false
  }
  try {
  const create = await prisma.account.create({
    data: {
      name: account.name,
      type: account.type,
      userId: userId,
      institution: account.institution,
      color: account.color,
      isDefault: account.isDefault,
      accountNumber: account.accountNumber,
      balance: account.balance,
      totalLimit: account.totalLimit,
      }
    })
    
    revalidateFinancePages()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function createTransaction(transaction: TransactionFormValues) {

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false
  }

  try {
  const create = await prisma.transaction.create({
    data: {
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      user: {
        connect: {
          id: userId
        }
      },
      account: {
        connect: {
          id: transaction.account
        }
      },
      category: {
        connect: {
          id: transaction.category
        }
      }
    },
  })

  revalidateFinancePages()
  return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getTransactions() {
  return await prisma.transaction.findMany()
}

export async function getCategoriesUser() {
  const session = await auth();

  try {
    if (!session?.user) false

    const create = await prisma.category.findMany({
      where: {
        userId: session?.user?.id
      }
    })
    return create
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function createBudget(budgetData: { categoryId: string; amount: number; month: number; year: number }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false;
  }

  try {
    const budget = await prisma.budget.create({
      data: {
        userId,
        categoryId: budgetData.categoryId,
        amount: budgetData.amount,
        month: budgetData.month,
        year: budgetData.year,
      },
    });

    revalidateFinancePages()
    return true;
  } catch (error) {
    console.error('Erro ao criar orçamento:', error);
    return false;
  }
}

export async function updateBudget(budgetId: string, amount: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false;
  }

  try {
    const budget = await prisma.budget.update({
      where: {
        id: budgetId,
        userId, // Garantir que só o dono pode atualizar
      },
      data: {
        amount,
      },
    });

    revalidateFinancePages()
    return true;
  } catch (error) {
    console.error('Erro ao atualizar orçamento:', error);
    return false;
  }
}

// Funções para gerenciamento de usuário

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

export async function updateUserProfile(data: { name: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: 'Usuário não autenticado' };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: data.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    });

    return { success: true, data: updatedUser, message: 'Nome atualizado com sucesso' };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { success: false, message: 'Erro ao atualizar perfil' };
  }
}

export async function updateUserPassword(data: { currentPassword: string; newPassword: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) {
    return { success: false, message: 'Usuário não autenticado' };
  }

  try {
    // Buscar usuário com senha atual
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user || !user.password) {
      return { success: false, message: 'Usuário não encontrado ou não possui senha configurada' };
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { success: false, message: 'Senha atual incorreta' };
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    // Atualizar a senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true, message: 'Senha atualizada com sucesso' };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return { success: false, message: 'Erro ao atualizar senha' };
  }
}

export async function deleteUserAccount() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: 'Usuário não autenticado' };
  }

  try {
    // Como o Prisma está configurado com onDelete: Cascade,
    // todos os dados relacionados serão deletados automaticamente
    await prisma.user.delete({
      where: {
        id: userId
      }
    });

    return { success: true, message: 'Conta excluída com sucesso' };
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return { success: false, message: 'Erro ao excluir conta' };
  }
}

export async function deleteBudget(budgetId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false;
  }

  try {
    await prisma.budget.delete({
      where: {
        id: budgetId,
        userId, // Garantir que só o dono pode deletar
      },
    });

    revalidateFinancePages()
    return true;
  } catch (error) {
    console.error('Erro ao deletar orçamento:', error);
    return false;
  }
}

// Funções para transferências

export async function getTransfers() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const transfers = await prisma.transfer.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        fromAccount: true,
        toAccount: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return transfers;
  } catch (error) {
    console.error('Erro ao buscar transferências:', error);
    return [];
  }
}

export async function createTransfer(transfer: TransferFormValues) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false
  }

  try {
    // Verificar se as contas pertencem ao usuário
    const [fromAccount, toAccount] = await Promise.all([
      prisma.account.findFirst({
        where: { id: transfer.fromAccountId, userId }
      }),
      prisma.account.findFirst({
        where: { id: transfer.toAccountId, userId }
      })
    ]);

    if (!fromAccount || !toAccount) {
      return false;
    }

    // Verificar se há saldo suficiente na conta de origem
    if ((fromAccount.balance ?? 0) < transfer.amount) {
      return false;
    }

    // Usar transação do Prisma para garantir atomicidade
    await prisma.$transaction(async (tx) => {
      // Criar registro da transferência
      await tx.transfer.create({
        data: {
          userId,
          fromAccountId: transfer.fromAccountId,
          toAccountId: transfer.toAccountId,
          amount: transfer.amount,
          description: transfer.description || '',
          date: new Date(),
        }
      });

      // Atualizar saldo da conta de origem
      await tx.account.update({
        where: { id: transfer.fromAccountId },
        data: {
          balance: {
            decrement: transfer.amount
          }
        }
      });

      // Atualizar saldo da conta de destino
      await tx.account.update({
        where: { id: transfer.toAccountId },
        data: {
          balance: {
            increment: transfer.amount
          }
        }
      });
    });

    revalidateFinancePages()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function updateTransaction(transactionId: string, transaction: TransactionFormValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se a transação pertence ao usuário
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: userId
    }
  });

  if (!existingTransaction) {
    throw new Error("Transação não encontrada ou sem permissão");
  }

  // Verificar se as carteiras e categorias pertencem ao usuário
  const [accountExists, categoryExists] = await Promise.all([
    prisma.account.findFirst({
      where: { id: transaction.account, userId: userId }
    }),
    prisma.category.findFirst({
      where: { id: transaction.category, userId: userId }
    })
  ]);

  if (!accountExists) {
    throw new Error("Carteira não encontrada ou sem permissão");
  }

  if (!categoryExists) {
    throw new Error("Categoria não encontrada ou sem permissão");
  }

  try {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        accountId: transaction.account,
        categoryId: transaction.category,
      }
    });

    revalidateFinancePages()
    return true;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw new Error("Erro ao atualizar transação");
  }
}

export async function deleteTransaction(transactionId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se a transação pertence ao usuário
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: userId
    }
  });

  if (!existingTransaction) {
    throw new Error("Transação não encontrada ou sem permissão");
  }

  try {
    await prisma.transaction.delete({
      where: { id: transactionId }
    });

    revalidateFinancePages()
    return true;
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw new Error("Erro ao deletar transação");
  }
}