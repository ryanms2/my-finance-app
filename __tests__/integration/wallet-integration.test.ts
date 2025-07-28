/**
 * @file Testes de integração para funcionalidades de carteiras
 * @description Testa fluxos completos de uso das funcionalidades de carteira
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  updateWalletAction,
  duplicateWalletAction,
  setDefaultWalletAction,
  deleteWalletAction,
  deleteWalletCascadeAction,
  getWalletStatistics
} from '@/lib/dashboardActions/walletActions'
import { 
  getMockedPrisma, 
  getMockedAuth, 
  setupAuthMock,
  setupPrismaMocks,
  testData,
  createWallet
} from '../lib/test-helpers'

// Mock do revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Wallet Integration Tests', () => {
  let mockPrisma: any
  let mockAuth: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma = getMockedPrisma()
    mockAuth = getMockedAuth()
    
    setupPrismaMocks(mockPrisma)
    setupAuthMock(mockAuth)
  })

  describe('Fluxo Completo: Criar, Atualizar, Duplicar e Excluir Carteira', () => {
    it('deve executar um fluxo completo de gerenciamento de carteira', async () => {
      const walletData = {
        name: 'Nova Carteira',
        type: 'bank' as const,
        balance: 500,
        institution: 'Banco Teste',
        accountNumber: '12345',
        totalLimit: null,
        color: 'from-blue-500 to-blue-600',
        isDefault: false
      }

      // 1. Simular carteira existente
      const originalWallet = createWallet(walletData)
      mockPrisma.account.findFirst.mockResolvedValue(originalWallet)

      // 2. Atualizar carteira
      const updatedWallet = createWallet({ 
        ...walletData, 
        name: 'Carteira Atualizada',
        balance: 1000 
      })
      mockPrisma.account.update.mockResolvedValue(updatedWallet)
      mockPrisma.account.updateMany.mockResolvedValue({ count: 0 })

      const updateResult = await updateWalletAction('wallet-123', {
        ...walletData,
        name: 'Carteira Atualizada',
        balance: 1000
      })

      expect(updateResult.success).toBe(true)

      // 3. Duplicar carteira
      const duplicatedWallet = createWallet({
        id: 'wallet-duplicate',
        name: 'Carteira Atualizada (Cópia)',
        balance: 0,
        isDefault: false
      })
      mockPrisma.account.create.mockResolvedValue(duplicatedWallet)

      const duplicateResult = await duplicateWalletAction('wallet-123')
      expect(duplicateResult.success).toBe(true)

      // 4. Definir como padrão
      mockPrisma.account.update.mockResolvedValue({ ...updatedWallet, isDefault: true })
      
      const setDefaultResult = await setDefaultWalletAction('wallet-123')
      expect(setDefaultResult.success).toBe(true)

      // 5. Obter estatísticas
      const mockTransactions = [
        { ...testData.transaction, type: 'income', amount: 500, category: { type: 'income' } },
        { ...testData.transaction, type: 'expense', amount: 300, category: { type: 'expense' } }
      ]
      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions)

      const statsResult = await getWalletStatistics('wallet-123')
      expect(statsResult.success).toBe(true)
      expect(statsResult.data?.totalTransactions).toBe(2)

      // 6. Exclusão segura (deve falhar se houver dados)
      mockPrisma.transaction.count.mockResolvedValue(2)
      mockPrisma.transfer.count.mockResolvedValue(0)

      const safeDeleteResult = await deleteWalletAction('wallet-123')
      expect(safeDeleteResult.success).toBe(false)
      expect(safeDeleteResult.error).toContain('transações vinculadas')

      // 7. Exclusão em cascata (deve funcionar)
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          transfer: {
            findMany: vi.fn().mockResolvedValue([]),
            deleteMany: vi.fn().mockResolvedValue({ count: 0 })
          },
          account: {
            update: vi.fn().mockResolvedValue({}),
            delete: vi.fn().mockResolvedValue(updatedWallet)
          },
          transaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 2 })
          },
          recurringTransaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 0 })
          }
        }
        
        return await callback(mockTx)
      })

      // Modificar para não ser carteira padrão durante a exclusão
      mockPrisma.account.findFirst.mockResolvedValue({ ...updatedWallet, isDefault: false })

      const cascadeDeleteResult = await deleteWalletCascadeAction('wallet-123')
      expect(cascadeDeleteResult.success).toBe(true)
    })
  })

  describe('Cenários de Negócio Complexos', () => {
    it('deve gerenciar carteiras com diferentes tipos corretamente', async () => {
      const bankWallet = createWallet({ 
        type: 'bank', 
        balance: 1000, 
        totalLimit: null 
      })
      const creditWallet = createWallet({ 
        type: 'credit', 
        balance: 500, 
        totalLimit: 1000
      } as any) // Forçar tipo para evitar erro de TypeScript nos testes

      // Teste com carteira bancária
      mockPrisma.account.findFirst.mockResolvedValue(bankWallet)
      mockPrisma.transaction.count.mockResolvedValue(0)
      mockPrisma.transfer.count.mockResolvedValue(0)
      mockPrisma.account.delete.mockResolvedValue(bankWallet)

      const bankDeleteResult = await deleteWalletAction('bank-wallet')
      expect(bankDeleteResult.success).toBe(true)

      // Teste com cartão de crédito
      mockPrisma.account.findFirst.mockResolvedValue(creditWallet)
      mockPrisma.account.delete.mockResolvedValue(creditWallet)

      const creditDeleteResult = await deleteWalletAction('credit-wallet')
      expect(creditDeleteResult.success).toBe(true)
    })

    it('deve tratar transferências entre carteiras na exclusão cascata', async () => {
      const wallet1 = createWallet({ id: 'wallet-1', name: 'Carteira 1' })
      const wallet2 = createWallet({ id: 'wallet-2', name: 'Carteira 2' })

      const transfer1 = {
        ...testData.transfer,
        id: 'transfer-1',
        fromAccountId: 'wallet-1',
        toAccountId: 'wallet-2',
        amount: 200,
        fromAccount: wallet1,
        toAccount: wallet2
      }

      const transfer2 = {
        ...testData.transfer,
        id: 'transfer-2',
        fromAccountId: 'wallet-2',
        toAccountId: 'wallet-1',
        amount: 100,
        fromAccount: wallet2,
        toAccount: wallet1
      }

      mockPrisma.account.findFirst.mockResolvedValue(wallet1)
      
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          transfer: {
            findMany: vi.fn().mockResolvedValue([transfer1, transfer2]),
            deleteMany: vi.fn().mockResolvedValue({ count: 2 })
          },
          account: {
            update: vi.fn()
              .mockResolvedValueOnce({ ...wallet2, balance: wallet2.balance - 200 + 100 }) // Reverter transfer1 e transfer2
              .mockResolvedValueOnce({}), // Outras atualizações
            delete: vi.fn().mockResolvedValue(wallet1)
          },
          transaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 5 })
          },
          recurringTransaction: {
            deleteMany: vi.fn().mockResolvedValue({ count: 0 })
          }
        }
        
        return await callback(mockTx)
      })

      const result = await deleteWalletCascadeAction('wallet-1')
      
      expect(result.success).toBe(true)
      expect(result.data?.details.transfersDeleted).toBe(2)
      expect(result.data?.details.transactionsDeleted).toBe(5)
    })
  })

  describe('Validações de Regras de Negócio', () => {
    it('deve impedir exclusão de carteira padrão', async () => {
      const defaultWallet = createWallet({ isDefault: true })
      mockPrisma.account.findFirst.mockResolvedValue(defaultWallet)

      const safeDeleteResult = await deleteWalletAction('wallet-123')
      expect(safeDeleteResult.success).toBe(false)
      expect(safeDeleteResult.error).toContain('carteira padrão')

      const cascadeDeleteResult = await deleteWalletCascadeAction('wallet-123')
      expect(cascadeDeleteResult.success).toBe(false)
      expect(cascadeDeleteResult.error).toContain('carteira padrão')
    })

    it('deve permitir apenas uma carteira padrão por usuário', async () => {
      const wallet = createWallet({ isDefault: false })
      mockPrisma.account.findFirst.mockResolvedValue(wallet)
      mockPrisma.account.updateMany.mockResolvedValue({ count: 1 }) // Uma carteira padrão removida
      mockPrisma.account.update.mockResolvedValue({ ...wallet, isDefault: true })

      const result = await setDefaultWalletAction('wallet-123')

      expect(result.success).toBe(true)
      expect(mockPrisma.account.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', isDefault: true },
        data: { isDefault: false }
      })
    })

    it('deve inicializar carteira duplicada com saldo zero', async () => {
      const originalWallet = createWallet({ balance: 1500 })
      const duplicatedWallet = createWallet({
        id: 'wallet-duplicate',
        name: 'Conta Teste (Cópia)',
        balance: 0,
        isDefault: false
      })

      mockPrisma.account.findFirst.mockResolvedValue(originalWallet)
      mockPrisma.account.create.mockResolvedValue(duplicatedWallet)

      const result = await duplicateWalletAction('wallet-123')

      expect(result.success).toBe(true)
      expect(mockPrisma.account.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          balance: 0,
          isDefault: false
        })
      })
    })
  })
})
