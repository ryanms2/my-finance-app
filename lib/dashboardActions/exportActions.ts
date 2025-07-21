"use server";

import { auth } from "@/app/auth";
import { prisma } from "@/utils/prisma/prisma";
import { z } from "zod";

// Schema de validação para exportação
const exportSchemaFilters = z.object({
  format: z.enum(['csv', 'xlsx', 'pdf']),
  type: z.enum(['transactions', 'reports', 'budgets', 'wallets']).default('transactions'),
  dateRange: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }).optional(),
  filters: z.object({
    transactionType: z.enum(['income', 'expense', 'all']).optional(),
    categoryIds: z.array(z.string()).optional(),
    walletIds: z.array(z.string()).optional(),
  }).optional(),
});

type ExportFilters = z.infer<typeof exportSchemaFilters>;

export async function exportDataAction(filters: ExportFilters) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // Validar dados de entrada
    const validatedFilters = exportSchemaFilters.parse(filters);

    // Buscar dados baseado no tipo de exportação
    const data = await getExportData(session.user.id, validatedFilters);

    if (!data || data.length === 0) {
      return { success: false, error: "Nenhum dado encontrado para exportar" };
    }

    // Gerar arquivo baseado no formato
    const fileData = await generateExportFile(data, validatedFilters);

    return { 
      success: true, 
      data: fileData.content,
      filename: fileData.filename,
      mimeType: fileData.mimeType 
    };

  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}

async function getExportData(userId: string, filters: ExportFilters) {
  const { type, dateRange, filters: dataFilters } = filters;

  switch (type) {
    case 'transactions':
      return await getTransactionsExportData(userId, dateRange, dataFilters);
    case 'reports':
      return await getReportsExportData(userId, dateRange);
    case 'budgets':
      return await getBudgetsExportData(userId, dateRange);
    case 'wallets':
      return await getWalletsExportData(userId);
    default:
      throw new Error("Tipo de exportação inválido");
  }
}

async function getTransactionsExportData(
  userId: string, 
  dateRange?: { startDate: Date; endDate: Date },
  filters?: { transactionType?: string; categoryIds?: string[]; walletIds?: string[] }
) {
  const whereConditions: any = { userId };

  // Filtro de data
  if (dateRange) {
    whereConditions.date = {
      gte: dateRange.startDate,
      lte: dateRange.endDate,
    };
  }

  // Filtro de tipo de transação
  if (filters?.transactionType && filters.transactionType !== 'all') {
    whereConditions.type = filters.transactionType;
  }

  // Filtro de categorias
  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    whereConditions.categoryId = {
      in: filters.categoryIds,
    };
  }

  // Filtro de carteiras
  if (filters?.walletIds && filters.walletIds.length > 0) {
    whereConditions.accountId = {
      in: filters.walletIds,
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: whereConditions,
    include: {
      category: {
        select: {
          name: true,
          type: true,
          icon: true,
        },
      },
      account: {
        select: {
          name: true,
          type: true,
          institution: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return transactions.map(transaction => ({
    nome: transaction.description,
    data: transaction.date.toLocaleDateString('pt-BR'),
    valor: transaction.amount,
    tipo: transaction.type === 'income' ? 'Receita' : 'Despesa',
    categoria: transaction.category.name,
    conta: transaction.account.name,
    instituição: transaction.account.institution || '',
  }));
}

async function getReportsExportData(
  userId: string,
  dateRange?: { startDate: Date; endDate: Date }
) {
  const startDate = dateRange?.startDate || new Date(new Date().getFullYear(), 0, 1);
  const endDate = dateRange?.endDate || new Date();

  // Buscar resumo mensal
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: true,
      account: true,
    },
  });

  // Agrupar por mês
  const monthlyData: Record<string, {
    month: string;
    receitas: number;
    despesas: number;
    saldo: number;
    transacoes: number;
  }> = {};

  transactions.forEach(transaction => {
    const monthKey = transaction.date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: '2-digit' 
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        receitas: 0,
        despesas: 0,
        saldo: 0,
        transacoes: 0,
      };
    }

    monthlyData[monthKey].transacoes++;
    
    if (transaction.type === 'income') {
      monthlyData[monthKey].receitas += transaction.amount;
    } else {
      monthlyData[monthKey].despesas += transaction.amount;
    }
    
    monthlyData[monthKey].saldo = monthlyData[monthKey].receitas - monthlyData[monthKey].despesas;
  });

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
}

async function getBudgetsExportData(
  userId: string,
  dateRange?: { startDate: Date; endDate: Date }
) {
  const currentDate = new Date();
  const year = dateRange?.startDate?.getFullYear() || currentDate.getFullYear();
  const month = dateRange?.startDate?.getMonth() ? dateRange.startDate.getMonth() + 1 : currentDate.getMonth() + 1;

  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      year,
      month,
    },
    include: {
      category: true,
    },
  });

  // Buscar gastos realizados para cada categoria
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const expenses = await prisma.transaction.findMany({
    where: {
      userId,
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

  // Agrupar gastos por categoria
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach(expense => {
    const categoryId = expense.categoryId;
    expensesByCategory[categoryId] = (expensesByCategory[categoryId] || 0) + expense.amount;
  });

  return budgets.map(budget => ({
    categoria: budget.category.name,
    orçamentoPlanejado: budget.amount,
    gastoRealizado: expensesByCategory[budget.categoryId] || 0,
    diferença: budget.amount - (expensesByCategory[budget.categoryId] || 0),
    percentualUtilizado: Math.round(((expensesByCategory[budget.categoryId] || 0) / budget.amount) * 100),
    status: (expensesByCategory[budget.categoryId] || 0) > budget.amount ? 'Excedido' : 'Dentro do limite',
  }));
}

async function getWalletsExportData(userId: string) {
  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  return accounts.map(account => ({
    nome: account.name,
    tipo: account.type,
    instituição: account.institution || '',
    saldo: account.balance || 0,
    limite: account.totalLimit || 0,
    padrão: account.isDefault ? 'Sim' : 'Não',
    criadaEm: account.createdAt.toLocaleDateString('pt-BR'),
  }));
}

async function generateExportFile(
  data: any[],
  filters: ExportFilters
): Promise<{ content: string; filename: string; mimeType: string }> {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseFilename = `${filters.type}_${timestamp}`;

  switch (filters.format) {
    case 'csv':
      return generateCSV(data, baseFilename);
    case 'xlsx':
      return generateXLSX(data, baseFilename);
    case 'pdf':
      return generatePDF(data, baseFilename);
    default:
      throw new Error("Formato de exportação não suportado");
  }
}

function generateCSV(data: any[], baseFilename: string) {
  if (data.length === 0) {
    throw new Error("Nenhum dado para exportar");
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar aspas e envolver em aspas se contém vírgula
        const stringValue = String(value);
        return stringValue.includes(',') || stringValue.includes('"') 
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(',')
    )
  ].join('\n');

  return {
    content: csvContent,
    filename: `${baseFilename}.csv`,
    mimeType: 'text/csv',
  };
}

function generateXLSX(data: any[], baseFilename: string) {
  // Importação dinâmica para evitar problemas no servidor
  const XLSX = require('xlsx');
  
  if (data.length === 0) {
    throw new Error("Nenhum dado para exportar");
  }

  // Criar workbook e worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Definir range do worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  // Aplicar formatação básica sem cores específicas
  for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
      const cell = worksheet[cellAddress];
      
      if (cell) {
        cell.s = {
          font: {
            name: 'Arial',
            sz: 11,
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
          alignment: {
            horizontal: 'left',
            vertical: 'center',
          },
        };

        // Formatação especial para cabeçalho (primeira linha) - apenas negrito
        if (rowNum === range.s.r) {
          cell.s.font = {
            ...cell.s.font,
            bold: true,
          };
        }

        // Formatação especial para valores monetários
        const headers = Object.keys(data[0]);
        const headerName = headers[colNum];
        if (typeof cell.v === 'number' && (
          headerName === 'valor' || 
          headerName === 'saldo' || 
          headerName === 'orçamentoPlanejado' || 
          headerName === 'gastoRealizado' ||
          headerName === 'diferença' ||
          headerName === 'limite'
        )) {
          cell.z = '#,##0.00'; // Formato de moeda
        }
      }
    }
  }

  // Configurar larguras das colunas
  const headers = Object.keys(data[0]);
  const columnWidths = headers.map(header => {
    // Calcular largura baseada no conteúdo
    let maxLength = header.length;
    data.forEach(row => {
      const value = String(row[header] || '');
      if (value.length > maxLength) {
        maxLength = value.length;
      }
    });
    return { wch: Math.min(Math.max(maxLength + 2, 12), 30) }; // Min 12, Max 30
  });
  worksheet['!cols'] = columnWidths;

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');

  // Configurar propriedades do workbook
  workbook.Props = {
    Title: 'MyFinance - Exportação',
    Subject: 'Dados Financeiros',
    Author: 'MyFinance App',
    CreatedDate: new Date(),
  };

  // Gerar buffer com configurações para compatibilidade
  const buffer = XLSX.write(workbook, { 
    type: 'buffer', 
    bookType: 'xlsx',
    cellStyles: true,
    compression: true,
  });

  return {
    content: buffer.toString('base64'),
    filename: `${baseFilename}.xlsx`,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
}

function generatePDF(data: any[], baseFilename: string) {
  try {
    // Importação dinâmica para evitar problemas no servidor
    const { jsPDF } = require('jspdf');
    
    // Para jspdf-autotable v5.x, a importação deve ser feita assim
    const autoTable = require('jspdf-autotable');
    
    if (data.length === 0) {
      throw new Error("Nenhum dado para exportar");
    }

    // Criar documento PDF
    const doc = new jsPDF();
    
    // Configurar fonte para suporte a caracteres especiais
    doc.setFont('helvetica');
    
    // Título do documento
    doc.setFontSize(16);
    doc.text('MyFinance - Relatório de Exportação', 14, 22);
    
    // Data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
    
    // Preparar dados para a tabela
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => String(row[header] || '')));

    // Na versão 5.x do jspdf-autotable, usar autoTable.default(doc, config)
    autoTable.default(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [88, 28, 135], // Cor roxa do tema
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 40 },
    });

    // Gerar PDF como buffer
    const pdfBuffer = doc.output('arraybuffer');
    const base64 = Buffer.from(pdfBuffer).toString('base64');

    return {
      content: base64,
      filename: `${baseFilename}.pdf`,
      mimeType: 'application/pdf',
    };
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}
