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
    { label: "Conta Corrente", value: "bank", icon: "🏦" },
    { label: "Poupança", value: "savings", icon: "🐷" },
    { label: "Cartão de Crédito", value: "credit", icon: "💳" },
    { label: "Cartão de Débito", value: "debit", icon: "💳" },
    { label: "Dinheiro", value: "cash", icon: "💰" },
    { label: "Investimentos", value: "investment", icon: "📈" },
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
        (val: any) => {
          // Validação condicional baseada no tipo da carteira
          return !val || val.length >= 3; // Se fornecido, deve ter pelo menos 3 caracteres
        },
        {
          message: "O número da conta deve ter pelo menos 3 caracteres.",
          path: ["accountNumber"],
        }
      ),
    totalLimit: z.number().min(0, { message: "O limite deve ser maior ou igual a zero." }).optional().nullable(),
    color: z.string().min(1, { message: "Por favor selecione uma cor." }),
    isDefault: z.boolean().optional(),
}).refine(
  (data) => {
    // Para cartões de crédito, o limite total é obrigatório
    if (data.type === "credit" && (!data.totalLimit || data.totalLimit <= 0)) {
      return false;
    }
    return true;
  },
  {
    message: "Para cartões de crédito, o limite total é obrigatório e deve ser maior que zero.",
    path: ["totalLimit"],
  }
).refine(
  (data) => {
    // Para cartões de crédito, o saldo não pode ser maior que o limite
    if (data.type === "credit" && data.totalLimit && data.balance > data.totalLimit) {
      return false;
    }
    return true;
  },
  {
    message: "O saldo disponível não pode ser maior que o limite total.",
    path: ["balance"],
  }
);

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
      message: "Por favor selecione uma conta.",
    }),
    category: z.string().min(1, {
      message: "Por favor selecione uma categoria.",
    })
});

export const formSchemaTransactionEdit = z.object({
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
    account: z.string().min(1, {
      message: "Por favor selecione um id de conta.",
    }),
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
  totalLimit?: number | null;
  institution?: string | null;
  accountNumber?: string | null;
  color: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalletsSummary {
  totalBalance: number;
  activeWallets: number;
  creditCards: Array<{
    id: string;
    name: string;
    balance: number;
    limit?: number | null;
  }>;
}

export interface TransferHistoryItem {
  id: string;
  fromWallet: string;
  toWallet: string;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
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
    }).max(999999.99, {
      message: "O valor não pode exceder R$ 999.999,99.",
    }),
    description: z.string().max(200, {
      message: "A descrição não pode ter mais de 200 caracteres.",
    }).optional(),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: "A carteira de origem deve ser diferente da carteira de destino",
  path: ["toAccountId"],
});



