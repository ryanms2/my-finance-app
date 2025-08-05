"use server"

import { auth } from "@/app/auth";
import { prisma } from "@/utils/prisma/prisma";

export async function getDashboardSummary() {
    const session = await auth();
    if (!session?.user?.id) return null;
  
    // Buscar contas
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
    });
  
    // Calcular datas para o mês atual e anterior
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
    // Buscar transações do mês atual
    const currentTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: currentMonth,
          lt: nextMonth
        }
      },
      include: { category: true },
    });
  
    // Buscar transações do mês anterior
    const previousTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: previousMonth,
          lt: currentMonth
        }
      },
      include: { category: true },
    });
  
    // Saldo total: soma dos saldos das contas
    const saldoTotal = accounts.reduce((acc, c) => acc + (c.balance ?? 0), 0);
  
    // Calcular valores do mês atual
    let receitas = 0;
    let despesas = 0;
    currentTransactions.forEach((t) => {
      if (t.category?.type === "income" || t.type === "income") {
        receitas += t.amount;
      } else if (t.category?.type === "expense" || t.type === "expense") {
        despesas += t.amount;
      }
    });
  
    // Calcular valores do mês anterior
    let receitasAnterior = 0;
    let despesasAnterior = 0;
    previousTransactions.forEach((t) => {
      if (t.category?.type === "income" || t.type === "income") {
        receitasAnterior += t.amount;
      } else if (t.category?.type === "expense" || t.type === "expense") {
        despesasAnterior += t.amount;
      }
    });
  
    // Economias atuais e anteriores
    const economias = receitas - despesas;
    const economiasAnterior = receitasAnterior - despesasAnterior;
  
    // Função para calcular porcentagem de variação
    const calcularVariacao = (atual: number, anterior: number) => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return ((atual - anterior) / anterior) * 100;
    };
  
    // Calcular variações percentuais
    const variacaoReceitas = calcularVariacao(receitas, receitasAnterior);
    const variacaoDespesas = calcularVariacao(despesas, despesasAnterior);
    const variacaoEconomias = calcularVariacao(economias, economiasAnterior);
    
    // Para o saldo total, vamos usar uma estimativa baseada nas economias
    const variacaoSaldo = calcularVariacao(economias, economiasAnterior);
  
    return {
      saldoTotal,
      receitas,
      despesas,
      economias,
      variacoes: {
        saldoTotal: variacaoSaldo,
        receitas: variacaoReceitas,
        despesas: variacaoDespesas,
        economias: variacaoEconomias,
      }
    };
  }

export async function getWalletsData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    return accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance ?? 0,
      bank: account.institution,
      accountNumber: account.accountNumber ? `****${account.accountNumber.slice(-4)}` : undefined,
      color: account.color ?? 'from-gray-500 to-gray-600',
      limit: account.totalLimit,
      isDefault: account.isDefault,
    }));
  } catch (error) {
    console.error('Erro ao buscar carteiras:', error);
    return [];
  }
}

export async function getWalletsSummary() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
    });

    const totalBalance = accounts.reduce((sum, account) => sum + (account.balance ?? 0), 0);
    const activeWallets = accounts.filter(account => (account.balance ?? 0) > 0).length;
    const creditCards = accounts
      .filter(account => account.type === 'credit')
      .map(account => ({
        id: account.id,
        name: account.name,
        balance: account.balance ?? 0,
        limit: account.totalLimit,
      }));

    return {
      totalBalance,
      activeWallets,
      creditCards,
    };
  } catch (error) {
    console.error('Erro ao buscar resumo das carteiras:', error);
    return {
      totalBalance: 0,
      activeWallets: 0,
      creditCards: [],
    };
  }
}

export async function getTransferHistory() {
  const session = await auth();
  if (!session?.user?.id) return [];

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
      },
      take: 10 // Últimas 10 transferências
    });

    return transfers.map(transfer => ({
      id: transfer.id,
      fromWallet: transfer.fromAccount.name,
      toWallet: transfer.toAccount.name,
      amount: transfer.amount,
      description: transfer.description || '',
      date: transfer.date.toISOString().split('T')[0],
      status: 'completed' as const,
    }));
  } catch (error) {
    console.error('Erro ao buscar histórico de transferências:', error);
    return [];
  }
}

export async function getBudgetsData() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Janeiro = 1
    const currentYear = now.getFullYear();

    // Buscar orçamentos do mês atual
    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id,
        month: currentMonth,
        year: currentYear,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Buscar gastos por categoria no mês atual
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        type: 'expense',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
    });

    // Mapear gastos por categoria
    const spentByCategory = transactions.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId;
      acc[categoryId] = (acc[categoryId] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    // Mapear orçamentos com gastos
    const budgetsWithSpending = budgets.map(budget => {
      const spent = spentByCategory[budget.categoryId] || 0;
      const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
      
      return {
        id: budget.id,
        name: budget.category.name,
        spent,
        total: budget.amount,
        percentage,
        color: budget.category.color || 'from-gray-400 to-gray-600',
        categoryId: budget.categoryId,
        icon: budget.category.icon,
      };
    });

    return budgetsWithSpending;
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    return [];
  }
}

export async function getBudgetsSummary() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Buscar orçamentos do mês atual
    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id,
        month: currentMonth,
        year: currentYear,
      },
      include: {
        category: true,
      },
    });

    // Buscar gastos do mês atual
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        type: 'expense',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
    });

    const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

    // Dados para o gráfico de rosca - apenas categorias com orçamento
    const chartData = budgets.map(budget => {
      const categoryTransactions = transactions.filter(t => t.categoryId === budget.categoryId);
      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        label: budget.category.name,
        value: spent,
        color: budget.category.color,
      };
    }).filter(item => item.value > 0); // Só mostrar categorias com gastos

    return {
      totalBudgeted,
      totalSpent,
      overallPercentage,
      chartData,
    };
  } catch (error) {
    console.error('Erro ao buscar resumo dos orçamentos:', error);
    return {
      totalBudgeted: 0,
      totalSpent: 0,
      overallPercentage: 0,
      chartData: [],
    };
  }
}

export async function getTransactionsData(filters?: {
  type?: 'income' | 'expense' | 'all'
  search?: string
  page?: number
  limit?: number
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      transactions: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      },
    };
  }

  try {
    const { type = 'all', search = '', page = 1, limit = 50 } = filters || {};
    
    // Validar parâmetros
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Limitar a 100 por segurança
    
    // Construir condições de filtro
    const whereConditions: any = {
      userId: session.user.id,
    };

    // Filtro por tipo
    if (type !== 'all') {
      whereConditions.type = type;
    }

    // Filtro de busca por descrição (sem mode insensitive para compatibilidade)
    if (search && search.trim()) {
      whereConditions.description = {
        contains: search.trim(),
      };
    }

    // Buscar transações com paginação
    const transactions = await prisma.transaction.findMany({
      where: whereConditions,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            icon: true,
            color: true,
          }
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip: (validPage - 1) * validLimit,
      take: validLimit,
    });

    // Contar total para paginação
    const totalCount = await prisma.transaction.count({
      where: whereConditions,
    });

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date.toISOString().split('T')[0],
      category: {
        id: transaction.category.id,
        name: transaction.category.name,
        type: transaction.category.type,
        icon: transaction.category.icon,
        color: transaction.category.color,
      },
      account: {
        id: transaction.account.id,
        name: transaction.account.name,
        type: transaction.account.type,
      },
      createdAt: transaction.createdAt,
    }));

    return {
      transactions: formattedTransactions,
      pagination: {
        page: validPage,
        limit: validLimit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / validLimit),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return {
      transactions: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

// Função para buscar transações filtradas por mês e ano
export async function getTransactionsDataFiltered(month: number, year: number, filters?: {
  type?: 'income' | 'expense' | 'all'
  search?: string
  page?: number
  limit?: number
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      transactions: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      },
    };
  }

  try {
    const { type = 'all', search = '', page = 1, limit = 50 } = filters || {};
    
    // Validar parâmetros
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);
    
    // Calcular datas do mês - usar UTC para evitar problemas de timezone
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    
    // Construir condições de filtro com índices otimizados
    const whereConditions: any = {
      userId: session.user.id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    };

    // Filtro por tipo
    if (type !== 'all') {
      whereConditions.type = type;
    }

    // Filtro de busca por descrição - compatível com SQLite e PostgreSQL
    if (search && search.trim()) {
      whereConditions.description = {
        contains: search.trim(),
      };
    }

    // Usar Promise.all para paralelizar as consultas
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: whereConditions,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              icon: true,
              color: true,
            }
          },
        },
        orderBy: [
          { date: 'desc' },
          { createdAt: 'desc' } // Ordenação secundária para consistência
        ],
        skip: (validPage - 1) * validLimit,
        take: validLimit,
      }),
      prisma.transaction.count({
        where: whereConditions,
      })
    ]);

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date.toISOString().split('T')[0],
      category: {
        id: transaction.category.id,
        name: transaction.category.name,
        type: transaction.category.type,
        icon: transaction.category.icon,
        color: transaction.category.color,
      },
      account: {
        id: transaction.account.id,
        name: transaction.account.name,
        type: transaction.account.type,
      },
      createdAt: transaction.createdAt,
    }));

    return {
      transactions: formattedTransactions,
      pagination: {
        page: validPage,
        limit: validLimit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / validLimit),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar transações filtradas:', error);
    return {
      transactions: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

export async function getTransactionsSummary() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Buscar transações do mês atual
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: currentMonth,
          lt: nextMonth,
        },
      },
      include: {
        category: true,
      },
    });

    // Calcular totais
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Contadores por tipo
    const incomeCount = monthlyTransactions.filter(t => t.type === 'income').length;
    const expenseCount = monthlyTransactions.filter(t => t.type === 'expense').length;
    const totalCount = monthlyTransactions.length;

    // Transações por categoria (top 5)
    const expensesByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const categoryName = transaction.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }));

    return {
      monthly: {
        totalIncome,
        totalExpenses,
        balance,
        incomeCount,
        expenseCount,
        totalCount,
      },
      topCategories,
    };
  } catch (error) {
    console.error('Erro ao buscar resumo das transações:', error);
    return null;
  }
}

// Função para buscar transações recentes para o dashboard
export async function getRecentTransactions(limit: number = 5) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      transactions: [],
      pagination: {
        page: 1,
        limit: limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  try {
    // Buscar transações recentes
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            icon: true,
            color: true,
          }
        },
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
    });

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date.toISOString().split('T')[0],
      category: {
        id: transaction.category.id,
        name: transaction.category.name,
        type: transaction.category.type,
        icon: transaction.category.icon,
        color: transaction.category.color,
      },
      account: {
        id: transaction.account.id,
        name: transaction.account.name,
        type: transaction.account.type,
      },
      createdAt: transaction.createdAt,
    }));

    return {
      transactions: formattedTransactions,
      pagination: {
        page: 1,
        limit: limit,
        total: formattedTransactions.length,
        totalPages: 1,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar transações recentes:', error);
    return {
      transactions: [],
      pagination: {
        page: 1,
        limit: limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

// Função para buscar resumo das transações filtrado por mês e ano
export async function getTransactionsSummaryFiltered(month: number, year: number) {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    // Calcular datas do mês
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Buscar transações do mês especificado
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
    });

    // Calcular totais
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Contadores por tipo
    const incomeCount = monthlyTransactions.filter(t => t.type === 'income').length;
    const expenseCount = monthlyTransactions.filter(t => t.type === 'expense').length;
    const totalCount = monthlyTransactions.length;

    // Transações por categoria (top 5)
    const expensesByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const categoryName = transaction.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }));

    return {
      monthly: {
        totalIncome,
        totalExpenses,
        balance,
        incomeCount,
        expenseCount,
        totalCount,
      },
      topCategories,
    };
  } catch (error) {
    console.error('Erro ao buscar resumo das transações filtrado:', error);
    return null;
  }
}

export async function getReportsData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Buscar transações do mês atual
    const currentTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: currentMonth,
          lt: nextMonth
        }
      },
      include: { category: true, account: true },
    });
  
    // Buscar transações do mês anterior
    const previousTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: previousMonth,
          lt: currentMonth
        }
      },
      include: { category: true },
    });
  
    // Buscar contas
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
    });

    // Calcular valores do mês atual
    let currentIncome = 0;
    let currentExpenses = 0;
    const expensesByCategory: Record<string, { name: string; amount: number; color: string }> = {};
    const dailyExpenses: Record<string, number> = {};

    currentTransactions.forEach((transaction) => {
      const transactionType = transaction.category?.type || transaction.type;
      
      if (transactionType === 'income') {
        currentIncome += transaction.amount;
      } else if (transactionType === 'expense') {
        currentExpenses += transaction.amount;
        
        // Agrupar por categoria
        const categoryName = transaction.category?.name || 'Outros';
        const categoryColor = transaction.category?.color || 'bg-gray-500';
        
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = {
            name: categoryName,
            amount: 0,
            color: categoryColor
          };
        }
        expensesByCategory[categoryName].amount += transaction.amount;

        // Agrupar por dia
        const day = transaction.date.getDate().toString();
        dailyExpenses[day] = (dailyExpenses[day] || 0) + transaction.amount;
      }
    });

    // Calcular valores do mês anterior
    let previousIncome = 0;
    let previousExpenses = 0;
    const previousDailyExpenses: Record<string, number> = {};

    previousTransactions.forEach((transaction) => {
      const transactionType = transaction.category?.type || transaction.type;
      
      if (transactionType === 'income') {
        previousIncome += transaction.amount;
      } else if (transactionType === 'expense') {
        previousExpenses += transaction.amount;
        
        // Agrupar por dia
        const day = transaction.date.getDate().toString();
        previousDailyExpenses[day] = (previousDailyExpenses[day] || 0) + transaction.amount;
      }
    });

    // Calcular saldo total
    const totalBalance = accounts.reduce((sum, account) => sum + (account.balance ?? 0), 0);
    const currentBalance = currentIncome - currentExpenses;
    const previousBalance = previousIncome - previousExpenses;

    // Calcular variações percentuais
    const calcVariation = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Preparar dados para gráficos
    const categoryExpenses = Object.values(expensesByCategory)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categorias

    return {
      summary: {
        totalBalance,
        currentIncome,
        currentExpenses,
        currentBalance,
        variations: {
          income: calcVariation(currentIncome, previousIncome),
          expenses: calcVariation(currentExpenses, previousExpenses),
          balance: calcVariation(currentBalance, previousBalance),
          totalBalance: calcVariation(totalBalance, totalBalance), // Placeholder
        }
      },
      categoryExpenses,
      dailyData: {
        current: dailyExpenses,
        previous: previousDailyExpenses,
      },
      monthlyData: {
        current: { income: currentIncome, expenses: currentExpenses },
        previous: { income: previousIncome, expenses: previousExpenses },
      },
      metrics: {
        transactionCount: currentTransactions.length,
        averageTransaction: currentTransactions.length > 0 ? 
          (currentIncome + currentExpenses) / currentTransactions.length : 0,
        topCategory: categoryExpenses[0] || { name: 'N/A', amount: 0 },
      }
    };
  } catch (error) {
    console.error('Erro ao buscar dados de relatórios:', error);
    return null;
  }
}

// Função para obter dados de relatórios filtrados por mês e ano
export async function getReportsDataFiltered(month: number, year: number) {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const targetMonth = new Date(year, month - 1, 1);
    const previousMonth = new Date(year, month - 2, 1);
    const nextMonth = new Date(year, month, 1);

    // Buscar transações do mês alvo
    const currentTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: targetMonth,
          lt: nextMonth
        }
      },
      include: { category: true, account: true },
    });
  
    // Buscar transações do mês anterior
    const previousTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: previousMonth,
          lt: targetMonth
        }
      },
      include: { category: true },
    });
  
    // Buscar contas
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
    });

    // Calcular valores do mês alvo
    let currentIncome = 0;
    let currentExpenses = 0;
    const expensesByCategory: Record<string, { name: string; amount: number; color: string }> = {};
    const dailyExpenses: Record<string, number> = {};

    currentTransactions.forEach((transaction) => {
      const transactionType = transaction.category?.type || transaction.type;
      
      if (transactionType === 'income') {
        currentIncome += transaction.amount;
      } else if (transactionType === 'expense') {
        currentExpenses += transaction.amount;
        
        // Agrupar por categoria
        const categoryName = transaction.category?.name || 'Outros';
        const categoryColor = transaction.category?.color || 'bg-gray-500';
        
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = {
            name: categoryName,
            amount: 0,
            color: categoryColor
          };
        }
        expensesByCategory[categoryName].amount += transaction.amount;

        // Agrupar por dia
        const day = transaction.date.getDate().toString();
        dailyExpenses[day] = (dailyExpenses[day] || 0) + transaction.amount;
      }
    });

    // Calcular valores do mês anterior
    let previousIncome = 0;
    let previousExpenses = 0;
    const previousDailyExpenses: Record<string, number> = {};

    previousTransactions.forEach((transaction) => {
      const transactionType = transaction.category?.type || transaction.type;
      
      if (transactionType === 'income') {
        previousIncome += transaction.amount;
      } else if (transactionType === 'expense') {
        previousExpenses += transaction.amount;
        
        // Agrupar por dia para comparação
        const day = transaction.date.getDate().toString();
        previousDailyExpenses[day] = (previousDailyExpenses[day] || 0) + transaction.amount;
      }
    });

    // Calcular saldo total
    const totalBalance = accounts.reduce((sum, account) => sum + (account.balance ?? 0), 0);
    const currentBalance = currentIncome - currentExpenses;
    const previousBalance = previousIncome - previousExpenses;

    // Função auxiliar para calcular variação percentual
    const calcVariation = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Preparar dados de categorias ordenadas por valor
    const categoryExpenses = Object.values(expensesByCategory)
      .sort((a, b) => b.amount - a.amount);

    return {
      summary: {
        totalBalance: totalBalance,
        currentIncome: currentIncome,
        currentExpenses: currentExpenses,
        currentBalance: currentBalance,
        variations: {
          income: calcVariation(currentIncome, previousIncome),
          expenses: calcVariation(currentExpenses, previousExpenses),
          balance: calcVariation(currentBalance, previousBalance),
          totalBalance: calcVariation(totalBalance, totalBalance), // Placeholder
        }
      },
      categoryExpenses,
      dailyData: {
        current: dailyExpenses,
        previous: previousDailyExpenses,
      },
      monthlyData: {
        current: { income: currentIncome, expenses: currentExpenses },
        previous: { income: previousIncome, expenses: previousExpenses },
      },
      metrics: {
        transactionCount: currentTransactions.length,
        averageTransaction: currentTransactions.length > 0 ? 
          (currentIncome + currentExpenses) / currentTransactions.length : 0,
        topCategory: categoryExpenses[0] || { name: 'N/A', amount: 0 },
      }
    };
  } catch (error) {
    console.error('Erro ao buscar dados de relatórios filtrados:', error);
    return null;
  }
}

// Função para obter métricas avançadas filtradas por mês e ano
export async function getAdvancedMetricsFiltered(month: number, year: number) {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const targetMonth = new Date(year, month - 1, 1);
    const nextMonth = new Date(year, month, 1);

    // Buscar transações do mês
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: targetMonth,
          lt: nextMonth
        }
      },
      include: { category: true },
    });

    // Cálculos das métricas
    const totalTransactions = transactions.length;
    const expenseTransactions = transactions.filter(t => 
      (t.category?.type || t.type) === 'expense'
    );
    const incomeTransactions = transactions.filter(t => 
      (t.category?.type || t.type) === 'income'
    );

    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const avgExpensePerTransaction = expenseTransactions.length > 0 ? 
      totalExpenses / expenseTransactions.length : 0;
    const avgIncomePerTransaction = incomeTransactions.length > 0 ? 
      totalIncome / incomeTransactions.length : 0;

    // Categoria com mais gastos
    const expensesByCategory: Record<string, number> = {};
    expenseTransactions.forEach(t => {
      const categoryName = t.category?.name || 'Outros';
      expensesByCategory[categoryName] = (expensesByCategory[categoryName] || 0) + t.amount;
    });
    
    const topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0] || ['N/A', 0];

    // Meta de gastos (exemplo: baseada na média dos últimos 3 meses)
    const threeMonthsAgo = new Date(year, month - 4, 1);
    const recentTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: threeMonthsAgo,
          lt: targetMonth
        }
      },
      include: { category: true },
    });

    const recentExpenses = recentTransactions.filter(t => 
      (t.category?.type || t.type) === 'expense'
    ).reduce((sum, t) => sum + t.amount, 0);
    
    const monthsCount = Math.max(1, (targetMonth.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const avgMonthlyExpenses = recentExpenses / monthsCount;
    const spendingGoalProgress = avgMonthlyExpenses > 0 ? (totalExpenses / avgMonthlyExpenses) * 100 : 0;

    // Taxa de poupança
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Calcular médias anteriores para comparação (mês anterior)
    const previousTargetMonth = new Date(year, month - 2, 1);
    const currentTargetMonth = new Date(year, month - 1, 1);
    
    const previousTransactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: previousTargetMonth,
          lt: currentTargetMonth
        }
      },
      include: { category: true },
    });

    const previousExpenseTransactions = previousTransactions.filter(t => 
      (t.category?.type || t.type) === 'expense'
    );
    const previousIncomeTransactions = previousTransactions.filter(t => 
      (t.category?.type || t.type) === 'income'
    );

    const previousTotalExpenses = previousExpenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const previousTotalIncome = previousIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const previousAvgExpensePerTransaction = previousExpenseTransactions.length > 0 ? 
      previousTotalExpenses / previousExpenseTransactions.length : 0;
    const previousAvgIncomePerTransaction = previousIncomeTransactions.length > 0 ? 
      previousTotalIncome / previousIncomeTransactions.length : 0;

    // Função para calcular variação
    const calcChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Calcular média diária
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyAverage = totalExpenses / daysInMonth;
    const previousDaysInMonth = new Date(year, month - 1, 0).getDate();
    const previousDailyAverage = previousTotalExpenses / previousDaysInMonth;

    // Calcular média semanal (aproximadamente 4.3 semanas por mês)
    const weeklyAverage = totalExpenses / 4.3;
    const previousWeeklyAverage = previousTotalExpenses / 4.3;

    return {
      dailyAverage: {
        current: dailyAverage,
        previous: previousDailyAverage,
        change: calcChange(dailyAverage, previousDailyAverage)
      },
      weeklyAverage: {
        current: weeklyAverage,
        previous: previousWeeklyAverage,
        change: calcChange(weeklyAverage, previousWeeklyAverage)
      },
      monthlyTotal: {
        current: totalExpenses,
        previous: previousTotalExpenses,
        change: calcChange(totalExpenses, previousTotalExpenses)
      },
      transactionCount: {
        current: totalTransactions,
        previous: previousTransactions.length,
        change: calcChange(totalTransactions, previousTransactions.length)
      }
    };
  } catch (error) {
    console.error('Erro ao buscar métricas avançadas filtradas:', error);
    return null;
  }
}

// Função para obter dados do gráfico mensal filtrados por ano
export async function getMonthlyChartDataFiltered(year: number) {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        date: {
          gte: startOfYear,
          lt: endOfYear
        }
      },
      include: { category: true },
      orderBy: { date: 'asc' }
    });

    // Agrupar por mês
    const monthlyData: Record<string, { income: number; expense: number }> = {};
    
    for (let month = 0; month < 12; month++) {
      const monthKey = new Date(year, month).toLocaleDateString('pt-BR', { month: 'short' });
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(transaction => {
      const month = transaction.date.toLocaleDateString('pt-BR', { month: 'short' });
      const type = transaction.category?.type || transaction.type;
      
      if (type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else if (type === 'expense') {
        monthlyData[month].expense += transaction.amount;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expense
    }));
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico mensal filtrados:', error);
    return null;
  }
}

// Função para obter dados de despesas por categoria filtrados por mês e ano
export async function getExpensesChartDataFiltered(month: number, year: number) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const targetMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Buscar todas as transações de despesa do mês atual
    const expenseTransactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: targetMonth,
          lte: endOfMonth,
        },
        OR: [
          { type: 'expense' },
          { 
            category: {
              type: 'expense'
            }
          }
        ]
      },
      include: {
        category: true,
      },
    });

    // Agrupar por categoria
    const expensesByCategory: Record<string, { name: string; amount: number; color: string }> = {};

    expenseTransactions.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Outros';
      const categoryColor = transaction.category?.color || 'bg-gray-500';
      
      if (!expensesByCategory[categoryName]) {
        expensesByCategory[categoryName] = {
          name: categoryName,
          amount: 0,
          color: categoryColor,
        };
      }
      
      expensesByCategory[categoryName].amount += transaction.amount;
    });

    // Converter para array e ordenar por valor
    const chartData = Object.values(expensesByCategory)
      .filter(category => category.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Limitar a 6 categorias principais

    return chartData;
  } catch (error) {
    console.error('Erro ao buscar dados de despesas por categoria:', error);
    return [];
  }
}

export async function getAdvancedMetrics() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return await getAdvancedMetricsFiltered(currentMonth, currentYear);
}

export async function getMonthlyChartData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  return await getMonthlyChartDataFiltered(currentYear);
}

export async function getExpensesChartData() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return await getExpensesChartDataFiltered(currentMonth, currentYear);
}