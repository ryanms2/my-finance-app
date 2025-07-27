"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Edit2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { formSchemaAccount, walletTypes } from "@/lib/types"
import { updateWalletAction } from "@/lib/dashboardActions/walletActions"

type WalletFormValues = z.infer<typeof formSchemaAccount>

const colors = [
  { label: "Azul", value: "from-blue-500 to-blue-600" },
  { label: "Roxo", value: "from-purple-500 to-purple-600" },
  { label: "Verde", value: "from-green-500 to-green-600" },
  { label: "Laranja", value: "from-orange-500 to-orange-600" },
  { label: "Vermelho", value: "from-red-500 to-red-600" },
  { label: "Rosa", value: "from-pink-500 to-pink-600" },
  { label: "Amarelo", value: "from-yellow-500 to-yellow-600" },
  { label: "Cinza", value: "from-gray-500 to-gray-600" },
]

interface EditWalletDialogProps {
  wallet: {
    id: string | number
    name: string
    type: string
    balance: number
    bank?: string | null
    accountNumber?: string
    color: string
    limit?: number | null
    isDefault: boolean
  }
  trigger?: React.ReactNode
}

export function EditWalletDialog({ wallet, trigger }: EditWalletDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(formSchemaAccount),
    defaultValues: {
      name: wallet.name,
      type: wallet.type,
      balance: wallet.balance,
      institution: wallet.bank || "",
      accountNumber: wallet.accountNumber || "",
      totalLimit: wallet.limit || undefined,
      color: wallet.color,
      isDefault: wallet.isDefault,
    },
  })

  const watchedType = form.watch("type")

  async function onSubmit(values: WalletFormValues) {
    startTransition(async () => {
      try {
        const result = await updateWalletAction(wallet.id.toString(), values)
        
        if (result.success) {
          toast.success("Carteira atualizada com sucesso!")
          setOpen(false)
          
          // Aguardar o dialog fechar completamente antes de revalidar
          setTimeout(() => {
            router.refresh()
          }, 300)
        } else {
          toast.error(result.error || "Erro ao atualizar carteira")
        }
      } catch (error) {
        console.error("Erro ao atualizar carteira:", error)
        toast.error("Erro interno do servidor")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1">
            <Edit2 className="h-3 w-3" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Carteira</DialogTitle>
          <DialogDescription className="text-gray-400">
            Faça as alterações necessárias na sua carteira.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Carteira</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Conta Corrente, Cartão de Crédito..."
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {walletTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-white hover:bg-gray-700"
                        >
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchedType === "credit" ? "Limite Disponível" : "Saldo Inicial"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedType === "credit" && (
                <FormField
                  control={form.control}
                  name="totalLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite Total</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instituição (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Nubank, Itaú, Bradesco..."
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Conta (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 1234-5"
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500">
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {colors.map((color) => (
                        <SelectItem
                          key={color.value}
                          value={color.value}
                          className="text-white hover:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded-full bg-gradient-to-r ${color.value}`}
                            />
                            {color.label}
                          </div>
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
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4 bg-gray-800/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Carteira Padrão</FormLabel>
                    <div className="text-sm text-gray-400">
                      Esta carteira será selecionada automaticamente em novas transações
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={isPending}
              >
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
