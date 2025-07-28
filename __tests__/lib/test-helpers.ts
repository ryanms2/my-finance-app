/**
 * @file Helpers para testes
 * @description Utilitários compartilhados para testes de carteiras
 */

import { vi } from 'vitest'
import { prisma } from '@/utils/prisma/prisma'
import { auth } from '@/app/auth'

// Type Helpers
export type MockedFunction<T extends (...args: any[]) => any> = T & {
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => void
  mockRejectedValue: (error: any) => void
  mockImplementation: (fn: T) => void
}

// Mock helpers
export const getMockedPrisma = () => prisma as any
export const getMockedAuth = () => auth as any

// Dados de teste padronizados
export const testData = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User'
  },

  wallet: {
    id: 'wallet-123',
    name: 'Conta Teste',
    type: 'bank',
    balance: 1000,
    totalLimit: null,
    color: 'from-blue-500 to-blue-600',
    institution: 'Banco Teste',
    accountNumber: '1234',
    isDefault: false,
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  creditWallet: {
    id: 'credit-wallet-123',
    name: 'Cartão de Crédito',
    type: 'credit',
    balance: 800,
    totalLimit: 1000,
    color: 'from-red-500 to-red-600',
    institution: 'Banco Teste',
    accountNumber: '1234',
    isDefault: false,
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  transaction: {
    id: 'transaction-123',
    description: 'Compra teste',
    amount: 100,
    date: new Date(),
    type: 'expense',
    userId: 'user-123',
    accountId: 'wallet-123',
    categoryId: 'category-123',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  transfer: {
    id: 'transfer-123',
    description: 'Transferência teste',
    amount: 200,
    date: new Date(),
    userId: 'user-123',
    fromAccountId: 'wallet-123',
    toAccountId: 'wallet-456',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Setup helpers
export const setupAuthMock = (mockAuth: any, userData = testData.user) => {
  mockAuth.mockResolvedValue({
    user: userData,
    expires: '2024-12-31'
  })
}

export const setupUnauthenticatedMock = (mockAuth: any) => {
  mockAuth.mockResolvedValue(null)
}

export function setupPrismaMocks(mockPrisma: any) {
  // Certifica que todas as entidades existem primeiro
  mockPrisma.account = mockPrisma.account || {}
  mockPrisma.transaction = mockPrisma.transaction || {}
  mockPrisma.transfer = mockPrisma.transfer || {}
  mockPrisma.category = mockPrisma.category || {}
  mockPrisma.recurringTransaction = mockPrisma.recurringTransaction || {}
  mockPrisma.user = mockPrisma.user || {}

  // Account mocks
  mockPrisma.account.findMany = vi.fn()
  mockPrisma.account.findFirst = vi.fn()
  mockPrisma.account.findUnique = vi.fn()
  mockPrisma.account.create = vi.fn()
  mockPrisma.account.update = vi.fn()
  mockPrisma.account.updateMany = vi.fn()
  mockPrisma.account.delete = vi.fn()
  mockPrisma.account.deleteMany = vi.fn()
  mockPrisma.account.count = vi.fn()
  mockPrisma.account.aggregate = vi.fn()

  // Transaction mocks
  mockPrisma.transaction.findMany = vi.fn()
  mockPrisma.transaction.findFirst = vi.fn()
  mockPrisma.transaction.create = vi.fn()
  mockPrisma.transaction.update = vi.fn()
  mockPrisma.transaction.delete = vi.fn()
  mockPrisma.transaction.deleteMany = vi.fn()
  mockPrisma.transaction.count = vi.fn()
  mockPrisma.transaction.aggregate = vi.fn()

  // Transfer mocks
  mockPrisma.transfer.findMany = vi.fn()
  mockPrisma.transfer.findFirst = vi.fn()
  mockPrisma.transfer.create = vi.fn()
  mockPrisma.transfer.update = vi.fn()
  mockPrisma.transfer.delete = vi.fn()
  mockPrisma.transfer.deleteMany = vi.fn()
  mockPrisma.transfer.count = vi.fn()

  // Category mocks
  mockPrisma.category.findMany = vi.fn()
  mockPrisma.category.findFirst = vi.fn()
  mockPrisma.category.create = vi.fn()
  mockPrisma.category.update = vi.fn()
  mockPrisma.category.delete = vi.fn()

  // Recurring transaction mocks
  mockPrisma.recurringTransaction.findMany = vi.fn()
  mockPrisma.recurringTransaction.create = vi.fn()
  mockPrisma.recurringTransaction.delete = vi.fn()
  mockPrisma.recurringTransaction.deleteMany = vi.fn()

  // User mocks
  mockPrisma.user.findFirst = vi.fn()
  mockPrisma.user.findUnique = vi.fn()
  mockPrisma.user.create = vi.fn()
  mockPrisma.user.update = vi.fn()

  // Transaction function
  mockPrisma.$transaction = vi.fn()
}

// Assertion helpers
export const isSuccessResult = (result: any): boolean => {
  return result.success === true && result.error === null
}

export const isErrorResult = (result: any, errorMessage?: string): boolean => {
  const hasError = result.success === false
  if (errorMessage) {
    return hasError && result.error?.includes(errorMessage)
  }
  return hasError
}

// Mock transaction helper
export const createMockTransaction = (mockPrisma: any, callback: any) => {
  mockPrisma.$transaction.mockImplementation(async (fn: any) => {
    const mockTx = {
      account: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
        count: vi.fn()
      },
      transaction: {
        findMany: vi.fn(),
        deleteMany: vi.fn(),
        count: vi.fn(),
        aggregate: vi.fn()
      },
      transfer: {
        findMany: vi.fn(),
        deleteMany: vi.fn(),
        count: vi.fn()
      },
      recurringTransaction: {
        deleteMany: vi.fn()
      }
    }
    
    return await fn(mockTx)
  })
}

// Factories para dados de teste
export const createWallet = (overrides: Partial<typeof testData.wallet> = {}) => ({
  ...testData.wallet,
  ...overrides
})

export const createTransaction = (overrides: Partial<typeof testData.transaction> = {}) => ({
  ...testData.transaction,
  ...overrides
})

export const createTransfer = (overrides: Partial<typeof testData.transfer> = {}) => ({
  ...testData.transfer,
  ...overrides
})
