/**
 * @file Testes para ações de carteiras
 * @description Testa as funcionalidades principais das actions de carteiras
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  deleteWalletAction, 
  deleteWalletCascadeAction,
  duplicateWalletAction,
  setDefaultWalletAction,
  getWalletStatistics,
  updateWalletAction,
  ActionResponse,
  CascadeDeleteData
} from '@/lib/dashboardActions/walletActions'
import { 
  getMockedPrisma, 
  getMockedAuth, 
  setupAuthMock,
  setupUnauthenticatedMock,
  setupPrismaMocks,
  testData,
  createWallet,
  isSuccessResult,
  isErrorResult
} from './test-helpers'

// Mock do revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Wallet Actions Tests', () => {
  let mockPrisma: any
  let mockAuth: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma = getMockedPrisma()
    mockAuth = getMockedAuth()
    
    setupPrismaMocks(mockPrisma)
    setupAuthMock(mockAuth)
  })

  describe('deleteWalletAction - Exclusão Segura', () => {
    it('deve excluir carteira quando não há dados vinculados', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.transaction.count.mockResolvedValue(0)
      mockPrisma.transfer.count.mockResolvedValue(0)
      mockPrisma.account.delete.mockResolvedValue(testData.wallet)

      // Act
      const result = await deleteWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(true)
      expect(result.error).toBe(null)
      expect(mockPrisma.account.delete).toHaveBeenCalledWith({
        where: { id: 'wallet-123' }
      })
    })

    it('deve falhar quando carteira tem transações vinculadas', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.transaction.count.mockResolvedValue(5)

      // Act
      const result = await deleteWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('transações vinculadas')
      expect(mockPrisma.account.delete).not.toHaveBeenCalled()
    })

    it('deve falhar quando carteira tem transferências vinculadas', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.transaction.count.mockResolvedValue(0)
      mockPrisma.transfer.count.mockResolvedValue(3)

      // Act
      const result = await deleteWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('transferências vinculadas')
      expect(mockPrisma.account.delete).not.toHaveBeenCalled()
    })

    it('deve falhar quando carteira é padrão', async () => {
      // Arrange
      const defaultWallet = createWallet({ isDefault: true })
      mockPrisma.account.findFirst.mockResolvedValue(defaultWallet)
      mockPrisma.transaction.count.mockResolvedValue(0)
      mockPrisma.transfer.count.mockResolvedValue(0)

      // Act
      const result = await deleteWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('carteira padrão')
      expect(mockPrisma.account.delete).not.toHaveBeenCalled()
    })

    it('deve falhar quando usuário não está autenticado', async () => {
      // Arrange
      setupUnauthenticatedMock(mockAuth)

      // Act
      const result = await deleteWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('não autenticado')
    })

    it('deve falhar quando carteira não pertence ao usuário', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(null)

      // Act
      const result = await deleteWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('não encontrada')
    })
  })

  describe('deleteWalletCascadeAction - Exclusão em Cascata', () => {
    it('deve excluir carteira e reverter transferências corretamente', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          transfer: {
            findMany: vi.fn().mockResolvedValue([testData.transfer]),
            deleteMany: vi.fn().mockResolvedValue({ count: 1 })
          },
          account: {
            update: vi.fn().mockResolvedValue({}),
            delete: vi.fn().mockResolvedValue(testData.wallet)
          },
          transaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 3 })
          },
          recurringTransaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 1 })
          }
        }
        
        return await callback(mockTx)
      })

      // Act
      const result = await deleteWalletCascadeAction('wallet-123') as ActionResponse<CascadeDeleteData>

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.message).toContain('Conta Teste')
      expect(result.data?.details.transfersDeleted).toBe(1)
    })

    it('deve falhar quando carteira é padrão', async () => {
      // Arrange
      const defaultWallet = createWallet({ isDefault: true })
      mockPrisma.account.findFirst.mockResolvedValue(defaultWallet)

      // Act
      const result = await deleteWalletCascadeAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('carteira padrão')
    })

    it('deve tratar erros de transação corretamente', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.$transaction.mockRejectedValue(new Error('Database error'))

      // Act
      const result = await deleteWalletCascadeAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })

  describe('duplicateWalletAction', () => {
    it('deve duplicar carteira com sucesso', async () => {
      // Arrange
      const duplicatedWallet = createWallet({ 
        id: 'wallet-duplicate', 
        name: 'Conta Teste (Cópia)',
        balance: 0,
        isDefault: false
      })
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.account.create.mockResolvedValue(duplicatedWallet)

      // Act
      const result = await duplicateWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(true)
      expect(mockPrisma.account.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Conta Teste (Cópia)',
          type: 'bank',
          balance: 0,
          isDefault: false,
          userId: 'user-123'
        })
      })
    })

    it('deve falhar quando carteira não existe', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(null)

      // Act
      const result = await duplicateWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('não encontrada')
    })

    it('deve tratar nomes muito longos na duplicação', async () => {
      // Arrange
      const longNameWallet = createWallet({ 
        name: 'A'.repeat(200) // Nome muito longo
      })
      const expectedDuplicate = createWallet({
        id: 'wallet-duplicate',
        name: 'A'.repeat(200) + ' (Cópia)',
        balance: 0,
        isDefault: false
      })
      
      mockPrisma.account.findFirst.mockResolvedValue(longNameWallet)
      mockPrisma.account.create.mockResolvedValue(expectedDuplicate)

      // Act
      const result = await duplicateWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(true)
      expect(mockPrisma.account.create).toHaveBeenCalled()
    })
  })

  describe('setDefaultWalletAction', () => {
    it('deve definir carteira como padrão', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.account.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.account.update.mockResolvedValue(createWallet({ isDefault: true }))

      // Act
      const result = await setDefaultWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(true)
      expect(mockPrisma.account.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', isDefault: true },
        data: { isDefault: false }
      })
      expect(mockPrisma.account.update).toHaveBeenCalledWith({
        where: { id: 'wallet-123' },
        data: { isDefault: true }
      })
    })

    it('deve falhar quando carteira não existe', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(null)

      // Act
      const result = await setDefaultWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('não encontrada')
    })
  })

  describe('getWalletStatistics', () => {
    it('deve retornar estatísticas da carteira', async () => {
      // Arrange
      const mockTransactions = [
        { ...testData.transaction, type: 'income', amount: 500, category: { type: 'income' } },
        { ...testData.transaction, type: 'expense', amount: 300, category: { type: 'expense' } },
        { ...testData.transaction, type: 'expense', amount: 200, category: { type: 'expense' } }
      ]

      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions)

      // Act
      const result = await getWalletStatistics('wallet-123')

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(
        expect.objectContaining({
          totalTransactions: 3,
          incomeCount: 1,
          expenseCount: 2,
          totalIncome: 500,
          totalExpenses: 500,
          netFlow: 0
        })
      )
    })

    it('deve falhar quando carteira não existe', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(null)

      // Act
      const result = await getWalletStatistics('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('não encontrada')
    })
  })

  describe('updateWalletAction', () => {
    const updateData = {
      name: 'Conta Atualizada',
      type: 'savings' as const,
      balance: 1500,
      institution: 'Novo Banco',
      accountNumber: '5678',
      totalLimit: null,
      color: 'from-green-500 to-green-600',
      isDefault: true
    }

    it('deve atualizar carteira com sucesso', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.account.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.account.update.mockResolvedValue({ ...testData.wallet, ...updateData })

      // Act
      const result = await updateWalletAction('wallet-123', updateData)

      // Assert
      expect(result.success).toBe(true)
      expect(mockPrisma.account.update).toHaveBeenCalledWith({
        where: { id: 'wallet-123' },
        data: updateData
      })
    })

    it('deve falhar quando carteira não existe', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(null)

      // Act
      const result = await updateWalletAction('wallet-123', updateData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('não encontrada')
    })
  })

  describe('Cenários de Edge Cases', () => {
    it('deve tratar IDs vazios', async () => {
      // Act
      const result = await deleteWalletAction('')

      // Assert
      expect(result.success).toBe(false)
    })

    it('deve tratar erros de rede/banco de dados', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockRejectedValue(new Error('Network error'))

      // Act
      const result = await deleteWalletAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
    })

    it('deve funcionar com cartão de crédito', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.creditWallet)
      mockPrisma.transaction.count.mockResolvedValue(0)
      mockPrisma.transfer.count.mockResolvedValue(0)
      mockPrisma.account.delete.mockResolvedValue(testData.creditWallet)

      // Act
      const result = await deleteWalletAction('credit-wallet-123')

      // Assert
      expect(result.success).toBe(true)
    })
  })

  describe('Cenários de Performance', () => {
    it('deve tratar timeout de transação', async () => {
      // Arrange
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.$transaction.mockRejectedValue(new Error('Transaction timeout'))

      // Act
      const result = await deleteWalletCascadeAction('wallet-123')

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('timeout')
    })

    it('deve tratar grandes volumes de dados na exclusão em cascata', async () => {
      // Arrange
      const manyTransfers = Array.from({ length: 100 }, (_, i) => ({
        ...testData.transfer,
        id: `transfer-${i}`
      }))
      
      mockPrisma.account.findFirst.mockResolvedValue(testData.wallet)
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          transfer: {
            findMany: vi.fn().mockResolvedValue(manyTransfers),
            deleteMany: vi.fn().mockResolvedValue({ count: 100 })
          },
          account: {
            update: vi.fn().mockResolvedValue({}),
            delete: vi.fn().mockResolvedValue(testData.wallet)
          },
          transaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 500 })
          },
          recurringTransaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 10 })
          }
        }
        
        return await callback(mockTx)
      })

      // Act
      const result = await deleteWalletCascadeAction('wallet-123') as ActionResponse<CascadeDeleteData>

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.details.transfersDeleted).toBe(100)
    })
  })
})
