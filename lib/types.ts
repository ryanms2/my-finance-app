import { z } from "zod";

export interface WalletFormProps {
    children?: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
};

export interface TransactionFormProps {
    children?: React.ReactNode
    className?: string
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    account: any
    categories: any
};

export const walletTypes = [
    { label: "Conta Corrente", value: "bank" },
    { label: "Poupança", value: "savings" },
    { label: "Cartão de Crédito", value: "credit" },
    { label: "Cartão de Débito", value: "debit" },
    { label: "Dinheiro", value: "cash" },
    { label: "Investimentos", value: "investment" },
];

export const categories = [
    { label: "Alimentação", value: "alimentacao" },
    { label: "Transporte", value: "transporte" },
    { label: "Moradia", value: "moradia" },
    { label: "Entretenimento", value: "entretenimento" },
    { label: "Saúde", value: "saude" },
    { label: "Educação", value: "educacao" },
    { label: "Investimentos", value: "investimentos" },
    { label: "Rendimentos", value: "rendimentos" },
    { label: "Outros", value: "outros" },
];

export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const defaultCategories: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  // Receitas
  { name: 'Salário', type: 'income', color: 'bg-green-500', icon: '💰' },
  { name: 'Investimentos', type: 'income', color: 'bg-sky-500', icon: '📈' },
  { name: 'Outros', type: 'income', color: 'bg-lime-400', icon: '✨' },
  // Despesas
  { name: 'Alimentação', type: 'expense', color: 'bg-orange-400', icon: '🍔' },
  { name: 'Transporte', type: 'expense', color: 'bg-rose-500', icon: '🚗' },
  { name: 'Moradia', type: 'expense', color: 'bg-indigo-500', icon: '🏠' },
  { name: 'Saúde', type: 'expense', color: 'bg-cyan-500', icon: '💊' },
  { name: 'Educação', type: 'expense', color: 'bg-yellow-400', icon: '🎓' },
  { name: 'Lazer', type: 'expense', color: 'bg-purple-800', icon: '🎮' },
  { name: 'Outros', type: 'expense', color: 'bg-slate-500', icon: '✨' },
];
export const formSchemaAccount = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    type: z.string().min(1, { message: "Por favor selecione um tipo de carteira." }),
    balance: z.number().min(0, { message: "O saldo inicial deve ser maior ou igual a zero." }),
    institution: z.string().optional(),
    accountNumber: z
      .string()
      .optional()
      .refine(
        (val: any, ctx: any) => {
          // Só valida se for cartão de crédito ou débito
          const type = ctx?.parent?.type;
          if (["credit", "debit"].includes(type)) {
            // Obrigatório e deve ser exatamente 4 dígitos numéricos
            return !!val && /^\d{4}$/.test(val);
          }
          // Para outros tipos, pode ser qualquer coisa (ou vazio)
          return true;
        },
        {
          message: "Insira os 4 últimos dígitos do cartão.",
          path: ["accountNumber"],
        }
      ),
    totalLimit: z.number().min(0, { message: "O limite deve ser maior ou igual a zero." }).optional(),
    color: z.string().min(1, { message: "Por favor selecione uma cor." }),
    isDefault: z.boolean().optional(),
});

const currentYear = new Date().getFullYear();
const minDateThisYear = new Date(currentYear, 0, 1);

export const formSchemaTransaction = z.object({
    description: z.string().min(2, {
      message: "A descrição deve ter pelo menos 2 caracteres.",
    }),
    amount: z.coerce.number().min(0.01, {
      message: "O valor deve ser maior que zero.",
    }),
    date: z.date().min(minDateThisYear, {
      message: "Por favor selecione uma data a partir deste ano.",
    }),
    type: z.string().min(1, {
      message: "Por favor selecione um tipo.",
    }),
    user: z.string().optional(),
    account: z.string().min(1, {
      message: "Por favor selecione um id de conta.",
    }).optional(),
    category: z.string().min(1, {
      message: "Por favor selecione um id de categoria.",
    })
});

export const schemaCategory = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  
})

// Interfaces para Transações
export interface TransactionData {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  category: {
    id: string;
    name: string;
    type: string;
    icon: string | null;
    color: string | null;
  };
  account: {
    id: string;
    name: string;
    type: string;
  };
  createdAt: Date;
}

export interface TransactionsData {
  transactions: TransactionData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionsSummary {
  monthly: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    incomeCount: number;
    expenseCount: number;
    totalCount: number;
  };
  topCategories: Array<{
    name: string;
    amount: number;
  }>;
}

export interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
  totalLimit: number;
  institution: string;
  accountNumber: string;
  color: string;
}

// Interfaces para dados de relatórios
export interface CategoryExpense {
  name: string;
  amount: number;
  color: string;
}

export interface VariationData {
  income: number;
  expenses: number;
  balance: number;
  totalBalance: number;
}

export interface SummaryData {
  totalBalance: number;
  currentIncome: number;
  currentExpenses: number;
  currentBalance: number;
  variations: VariationData;
}

export interface MetricData {
  current: number;
  previous: number;
  change: number;
}

export interface AdvancedMetricsData {
  dailyAverage: MetricData;
  weeklyAverage: MetricData;
  monthlyTotal: MetricData;
  transactionCount: MetricData;
}

export interface MonthlyChartDataItem {
  month: string;
  income: number;
  expenses: number;
}

export interface ReportsData {
  summary: SummaryData;
  categoryExpenses: CategoryExpense[];
  dailyData: {
    current: Record<string, number>;
    previous: Record<string, number>;
  };
  monthlyData: {
    current: { income: number; expenses: number };
    previous: { income: number; expenses: number };
  };
  metrics: {
    transactionCount: number;
    averageTransaction: number;
    topCategory: { name: string; amount: number };
  };
}

export const formSchemaTransfer = z.object({
    fromAccountId: z.string().min(1, {
      message: "Por favor selecione a carteira de origem.",
    }),
    toAccountId: z.string().min(1, {
      message: "Por favor selecione a carteira de destino.",
    }),
    amount: z.coerce.number().min(0.01, {
      message: "O valor deve ser maior que zero.",
    }),
    description: z.string().optional(),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: "A carteira de origem deve ser diferente da carteira de destino",
  path: ["toAccountId"],
});



