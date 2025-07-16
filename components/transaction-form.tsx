"use client"

import React, { useEffect } from "react"

import { useActionState, useState } from "react"
import { CalendarIcon, Check, ChevronsUpDown, Plus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Category, formSchemaAccount, formSchemaTransaction, TransactionFormProps } from "@/lib/types"
import { createTransactionAction } from "@/lib/dashboardActions/transactionActions"

type TransactionFormValues = z.infer<typeof formSchemaTransaction>
type WalletFormValues = z.infer<typeof formSchemaAccount>;

export function TransactionForm({children, className, variant = "default", size = "default", account, categories }: TransactionFormProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchemaTransaction),
    defaultValues: {
      description: "",
      amount: undefined,
      type: "expense",
      date: new Date(),
      category: "",
    },
  })
  
  async function existAccount() {
    if (!account && open || account.valueOf() == false) {
      console.log("Adicione uma conta para continuar")
      setOpen(false)
      return toast.error("Adicione uma conta para continuar")
    }
  }

  async function onSubmit(values: TransactionFormValues) {
    // lógica para salvar a transação
    const transaction = await createTransactionAction(values)
    if(transaction.success) {
      setOpen(false)
      return toast.success("Transação criada com sucesso!")

    }
    
    toast.error(transaction.error)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} size={size} className={className} onClick={existAccount}>
            <Plus className="mr-2 h-4 w-4" /> Nova Transação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
          <DialogDescription className="text-gray-400">Preencha os detalhes da transação abaixo.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Supermercado"
                      {...field}
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={field.value === undefined ? "" : field.value}
                      onChange={e => {
                        const val = e.target.value;
                        field.onChange(val === "" ? "" : Number(val));
                      }}
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Removido o campo de seleção de tipo */}
            </div>

            {/* Campo oculto para garantir que o type seja enviado pelo formulário */}
            <input type="hidden" {...form.register("type")} />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categoria</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? (() => {
                                const selectedCategory = categories.find(
                                  (category: Category) => category.id === field.value
                                );
                                if (selectedCategory) {
                                  return `${selectedCategory.name} (${selectedCategory.type === 'income' ? 'Receita' : 'Despesa'})`;
                                }
                                return "Selecione uma categoria";
                              })()
                            : "Selecione uma categoria"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
                      <Command className="bg-gray-800">
                        <CommandInput placeholder="Buscar categoria..." className="h-9 border-b border-gray-700" />
                        <CommandList>
                          <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {categories.map((category: Category) => (
                              <CommandItem
                                key={category.id}
                                value={category.id}
                                onSelect={() => {
                                  form.setValue("category", category.id)
                                  form.setValue("type", category.type)
                                }}
                                className={cn(
                                  "flex items-center gap-2 hover:bg-gray-700 justify-between",
                                  category.id === field.value && "bg-gray-700",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      category.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {`${category.name} ${category.icon ?? ""}`}
                                </div>
                                <span
                                  className={cn(
                                    "ml-2 text-xs px-2 py-0.5 rounded",
                                    category.type === "income"
                                      ? "bg-green-700 text-green-200"
                                      : "bg-red-700 text-red-200"
                                  )}
                                >
                                  {category.type === "income" ? "Receita" : "Despesa"}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carteira</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-purple-500">
                        <SelectValue placeholder="Selecione uma carteira" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {account.map((wallet: WalletFormValues) => (
                        <SelectItem
                          key={wallet.id ?? wallet.name}
                          value={String(wallet.id)}
                        >
                          {wallet.type === "credit"
                            ? `Cartão de Crédito • ${wallet.name}`
                            : wallet.type === "bank"
                            ? `Conta Corrente • ${wallet.name}`
                            : wallet.type === "savings"
                            ? `Poupança  • ${wallet.name}`
                            : wallet.type === "debit"
                            ? `Cartão de Débito • ${wallet.name}`
                            : wallet.type === "cash"
                            ? `Dinheiro • ${wallet.name}`
                            : wallet.type === "investment"
                            ? `Investimento • ${wallet.name}`
                            : wallet.name}
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        className="bg-gray-800"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-gray-700 hover:bg-gray-700 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
