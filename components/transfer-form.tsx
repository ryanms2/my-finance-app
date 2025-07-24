"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRightLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formSchemaTransfer } from "@/lib/types"
import { createTransferAction } from "@/lib/dashboardActions/transferActions"

type TransferFormValues = z.infer<typeof formSchemaTransfer>

type WalletForTransfer = {
  id: string
  name: string
  balance: number | null
}

interface TransferFormProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  wallets: WalletForTransfer[]
}

export function TransferForm({ children, className, variant = "default", size = "default", wallets }: TransferFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(formSchemaTransfer),
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: undefined,
      description: "",
    },
  })

  async function existWallets() {
    if (!wallets || wallets.length < 2) {
      console.log("Adicione pelo menos duas carteiras para continuar")
      setOpen(false)
      return toast.error("Adicione pelo menos duas carteiras para realizar transferências")
    }
  }

  async function onSubmit(values: TransferFormValues) {
    // Verificar saldo da carteira de origem
    const sourceWallet = wallets.find(w => w.id === values.fromAccountId)
    if (!sourceWallet || (sourceWallet.balance ?? 0) < values.amount) {
      return toast.error("Saldo insuficiente na carteira de origem")
    }

    setIsSubmitting(true)
    try {
      // lógica para salvar a transferência
      const transfer = await createTransferAction(values)
      if (transfer.success) {
        setOpen(false)
        form.reset()
        toast.success("Transferência realizada com sucesso!")
      } else {
        toast.error(transfer.error)
      }
    } catch (error) {
      toast.error("Erro ao realizar transferência")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Filtrar carteiras disponíveis para destino
  const availableDestinations = wallets.filter(wallet => 
    wallet.id !== form.watch("fromAccountId")
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} size={size} className={className} onClick={existWallets}>
            <ArrowRightLeft className="mr-2 h-4 w-4" /> Nova Transferência
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] bg-gray-900 border-gray-800 text-white flex flex-col max-h-[95vh]">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Transferir entre Carteiras</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Transfira dinheiro entre suas carteiras de forma rápida e segura.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 pb-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="fromAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Carteira de Origem</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500">
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id} className="text-white hover:bg-gray-700">
                            {wallet.name} - {formatCurrency(wallet.balance ?? 0)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Carteira de Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500">
                          <SelectValue placeholder="Selecione o destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {availableDestinations.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id} className="text-white hover:bg-gray-700">
                            {wallet.name} - {formatCurrency(wallet.balance ?? 0)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0,00"
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Pagamento de conta..."
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        </div>
        
        <DialogFooter className="px-4 sm:px-6 py-4 bg-gray-900 border-t border-gray-800 flex-shrink-0">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </div>
            ) : (
              'Realizar Transferência'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
