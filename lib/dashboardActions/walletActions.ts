"use server";

import { auth } from "@/app/auth";
import { prisma } from "@/utils/prisma/prisma";
import { z } from "zod";
import { formSchemaAccount } from "@/lib/types";
import { revalidatePath } from 'next/cache';

type WalletFormValues = z.infer<typeof formSchemaAccount>;

// Tipos para as respostas das actions
export interface ActionResponse<T = any> {
  success: boolean;
  error: string | null;
  data?: T;
}

export interface CascadeDeleteData {
  message: string;
  details: {
    transfersDeleted: number;
    transactionsDeleted: number;
  };
}

/**
 * Helper para revalidar todas as páginas que podem ser afetadas por mudanças de carteiras
 */
function revalidateWalletPages() {
  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  revalidatePath('/wallets')
  revalidatePath('/budgets')
  revalidatePath('/(main)', 'layout')
}

export async function updateWalletAction(walletId: string, walletData: WalletFormValues) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Verificar se a carteira pertence ao usuário
    const existingWallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: session.user.id
      }
    });

    if (!existingWallet) {
      return { success: false, error: "Carteira não encontrada ou sem permissão" };
    }

    // Se está marcando como padrão, desmarcar outras carteiras como padrão
    if (walletData.isDefault) {
      await prisma.account.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    await prisma.account.update({
      where: { id: walletId },
      data: {
        name: walletData.name,
        type: walletData.type,
        institution: walletData.institution,
        accountNumber: walletData.accountNumber,
        balance: walletData.balance,
        totalLimit: walletData.totalLimit,
        color: walletData.color,
        isDefault: walletData.isDefault,
      }
    });

    revalidateWalletPages();
    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao atualizar carteira:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteWalletAction(walletId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Verificar se a carteira pertence ao usuário
    const existingWallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: session.user.id
      }
    });

    if (!existingWallet) {
      return { success: false, error: "Carteira não encontrada ou sem permissão" };
    }

    // Não permitir exclusão da carteira padrão
    if (existingWallet.isDefault) {
      return { 
        success: false, 
        error: "Não é possível excluir a carteira padrão. Defina outra carteira como padrão primeiro." 
      };
    }

    // Verificar se existem transações vinculadas à carteira
    const transactionCount = await prisma.transaction.count({
      where: { accountId: walletId }
    });

    if (transactionCount > 0) {
      return { 
        success: false, 
        error: "Não é possível excluir uma carteira que possui transações vinculadas" 
      };
    }

    // Verificar se existem transferências vinculadas à carteira
    const transferCount = await prisma.transfer.count({
      where: {
        OR: [
          { fromAccountId: walletId },
          { toAccountId: walletId }
        ]
      }
    });

    if (transferCount > 0) {
      return { 
        success: false, 
        error: "Não é possível excluir uma carteira que possui transferências vinculadas" 
      };
    }

    await prisma.account.delete({
      where: { id: walletId }
    });

    revalidateWalletPages();
    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao excluir carteira:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}

/**
 * Exclusão em cascata - Remove carteira junto com todas suas transações e transferências
 * ATENÇÃO: Esta operação é irreversível e pode afetar outros dados do sistema
 */
export async function deleteWalletCascadeAction(walletId: string): Promise<ActionResponse<CascadeDeleteData>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Verificar se a carteira pertence ao usuário
    const existingWallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: session.user.id
      }
    });

    if (!existingWallet) {
      return { success: false, error: "Carteira não encontrada ou sem permissão" };
    }

    // Não permitir exclusão da carteira padrão
    if (existingWallet.isDefault) {
      return { 
        success: false, 
        error: "Não é possível excluir a carteira padrão. Defina outra carteira como padrão primeiro." 
      };
    }

    // Executar operação em transação para garantir atomicidade
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buscar todas as transferências que envolvem esta carteira
      const transfers = await tx.transfer.findMany({
        where: {
          OR: [
            { fromAccountId: walletId },
            { toAccountId: walletId }
          ]
        },
        include: {
          fromAccount: true,
          toAccount: true
        }
      });

      // 2. Reverter o impacto das transferências nos saldos das outras carteiras
      for (const transfer of transfers) {
        if (transfer.fromAccountId === walletId && transfer.toAccountId !== walletId) {
          // Esta carteira enviou dinheiro para outra - devolver o dinheiro para a carteira de destino
          await tx.account.update({
            where: { id: transfer.toAccountId },
            data: {
              balance: {
                decrement: transfer.amount
              }
            }
          });
        } else if (transfer.toAccountId === walletId && transfer.fromAccountId !== walletId) {
          // Esta carteira recebeu dinheiro de outra - devolver o dinheiro para a carteira de origem
          await tx.account.update({
            where: { id: transfer.fromAccountId },
            data: {
              balance: {
                increment: transfer.amount
              }
            }
          });
        }
        // Se ambas as carteiras são a mesma (transferência interna), não há o que reverter
      }

      // 3. Excluir todas as transferências que envolvem esta carteira
      await tx.transfer.deleteMany({
        where: {
          OR: [
            { fromAccountId: walletId },
            { toAccountId: walletId }
          ]
        }
      });

      // 4. Excluir todas as transações da carteira
      const deletedTransactions = await tx.transaction.deleteMany({
        where: { accountId: walletId }
      });

      // 5. Excluir transações recorrentes vinculadas
      await tx.recurringTransaction.deleteMany({
        where: { accountId: walletId }
      });

      // 6. Finalmente, excluir a carteira
      await tx.account.delete({
        where: { id: walletId }
      });

      return {
        transfersDeleted: transfers.length,
        transactionsDeleted: deletedTransactions.count,
        walletName: existingWallet.name
      };
    });

    revalidateWalletPages();
    
    return { 
      success: true, 
      error: null,
      data: {
        message: `Carteira "${result.walletName}" excluída com sucesso!`,
        details: {
          transfersDeleted: result.transfersDeleted,
          transactionsDeleted: result.transactionsDeleted
        }
      }
    };

  } catch (error) {
    console.error("Erro ao excluir carteira em cascata:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor ao executar exclusão em cascata" };
  }
}

export async function setDefaultWalletAction(walletId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Verificar se a carteira pertence ao usuário
    const existingWallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: session.user.id
      }
    });

    if (!existingWallet) {
      return { success: false, error: "Carteira não encontrada ou sem permissão" };
    }

    // Desmarcar todas as carteiras como padrão
    await prisma.account.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true
      },
      data: {
        isDefault: false
      }
    });

    // Marcar a carteira selecionada como padrão
    await prisma.account.update({
      where: { id: walletId },
      data: { isDefault: true }
    });

    revalidateWalletPages();
    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao definir carteira padrão:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getWalletTransactions(walletId: string, limit: number = 10) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado", data: [] };
    }

    // Verificar se a carteira pertence ao usuário
    const existingWallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: session.user.id
      }
    });

    if (!existingWallet) {
      return { success: false, error: "Carteira não encontrada ou sem permissão", data: [] };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: walletId,
        userId: session.user.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            icon: true,
            color: true,
          }
        },
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      },
      orderBy: { date: 'desc' },
      take: limit
    });

    return { success: true, error: null, data: transactions };
  } catch (error) {
    console.error("Erro ao buscar transações da carteira:", error);
    return { success: false, error: "Erro interno do servidor", data: [] };
  }
}

export async function duplicateWalletAction(walletId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Buscar a carteira original
    const originalWallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: session.user.id
      }
    });

    if (!originalWallet) {
      return { success: false, error: "Carteira não encontrada ou sem permissão" };
    }

    // Criar uma cópia da carteira
    const duplicatedWallet = await prisma.account.create({
      data: {
        name: `${originalWallet.name} (Cópia)`,
        type: originalWallet.type,
        userId: session.user.id,
        institution: originalWallet.institution,
        accountNumber: originalWallet.accountNumber,
        balance: 0, // Começar com saldo zero
        totalLimit: originalWallet.totalLimit,
        color: originalWallet.color,
        isDefault: false, // Não pode ser padrão
      }
    });

    revalidateWalletPages();
    return { success: true, error: null, walletId: duplicatedWallet.id };
  } catch (error) {
    console.error("Erro ao duplicar carteira:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getWalletStatistics(walletId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado", data: null };
    }

    // Verificar se a carteira pertence ao usuário
    const existingWallet = await prisma.account.findFirst({
      where: {
        id: walletId,
        userId: session.user.id
      }
    });

    if (!existingWallet) {
      return { success: false, error: "Carteira não encontrada ou sem permissão", data: null };
    }

    // Buscar todas as transações da carteira
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: walletId,
        userId: session.user.id
      },
      include: {
        category: true
      },
      orderBy: { date: 'desc' }
    });

    // Calcular estatísticas
    const totalTransactions = transactions.length;
    const incomeTransactions = transactions.filter(t => t.type === 'income' || t.category?.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense' || t.category?.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIncome - totalExpenses;

    const averageTransactionValue = totalTransactions > 0 ? 
      (totalIncome + totalExpenses) / totalTransactions : 0;

    // Estatísticas por mês atual
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthTransactions = transactions.filter(t => t.date >= currentMonthStart);
    
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income' || t.category?.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense' || t.category?.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      success: true,
      error: null,
      data: {
        totalTransactions,
        incomeCount: incomeTransactions.length,
        expenseCount: expenseTransactions.length,
        totalIncome,
        totalExpenses,
        netFlow,
        averageTransactionValue,
        monthlyIncome,
        monthlyExpenses,
        monthlyTransactions: currentMonthTransactions.length,
        firstTransaction: transactions.length > 0 ? transactions[transactions.length - 1].date : null,
        lastTransaction: transactions.length > 0 ? transactions[0].date : null
      }
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas da carteira:", error);
    return { success: false, error: "Erro interno do servidor", data: null };
  }
}
