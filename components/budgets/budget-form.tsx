"use client"

import React, { useState, useEffect } from "react";
import { Plus, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBudget } from "@/lib/data";
import { toast } from "sonner";

// Schema de validação para o formulário de orçamentos
const formSchemaBudget = z.object({
  categoryId: z.string().min(1, { message: "Selecione uma categoria" }),
  amount: z.number().min(0.01, { message: "O valor deve ser maior que zero" }),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2050),
});

type BudgetFormValues = z.infer<typeof formSchemaBudget>;

interface Category {
  id: string;
  name: string;
  type: string;
  color?: string | null;
  icon?: string | null;
}

interface BudgetFormProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  categories?: Category[];
}

export function BudgetForm({
  children,
  className,
  variant = "default",
  size = "default",
  categories = [],
}: BudgetFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Filtra apenas categorias de despesa
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  // Define o mês e ano atual como valores padrão
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Janeiro é 0
  const currentYear = currentDate.getFullYear();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchemaBudget),
    defaultValues: {
      categoryId: "",
      amount: 0,
      month: currentMonth,
      year: currentYear,
    },
  });

  // Resetar o valor para vazio quando o formulário é aberto
  useEffect(() => {
    if (open) {
      form.setValue("amount", 0);
    }
  }, [open, form]);

  function onSubmit(values: BudgetFormValues) {
    const createBudgetInDb = async () => {
      setIsSubmitting(true);
      try {
        const result = await createBudget(values);
        if (result) {
          const categoryName = expenseCategories.find(cat => cat.id === values.categoryId)?.name || "Orçamento";
          toast.success(`Orçamento para "${categoryName}" criado com sucesso! 🎉`);
          form.reset();
          setOpen(false);
          
          // Usar router.refresh() em vez de recarregar a página
          router.refresh();
        }
        else {
          toast.error("Erro ao criar orçamento. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao criar orçamento:", error);
        toast.error("Erro ao criar orçamento. Tente novamente.");
      } finally {
        setIsSubmitting(false);
      }
    };

    createBudgetInDb();
  }

  // Array de meses para o select
  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  // Gerar anos (atual - 1, atual, atual + 1)
  const years = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant={variant}
            size={size}
            className={className}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Criar Novo Orçamento</DialogTitle>
          <DialogDescription className="text-gray-400">
            Defina limites de gastos para suas categorias
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {expenseCategories.length > 0 ? (
                        expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <span className="mr-2">{category.icon}</span>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Nenhuma categoria disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Limite (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="bg-gray-800 border-gray-700"
                      placeholder="0,00"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => {
                        // Converter valor para número, removendo o "0" inicial se necessário
                        const inputValue = e.target.value;
                        if (inputValue === "") {
                          field.onChange(0);
                        } else {
                          // Se o valor começa com 0 e tem mais de 1 dígito, remover o 0
                          if (inputValue.startsWith("0") && inputValue.length > 1) {
                            const newValue = parseFloat(inputValue.substring(1));
                            field.onChange(newValue);
                            e.target.value = newValue.toString();
                          } else {
                            field.onChange(parseFloat(inputValue) || 0);
                          }
                        }
                      }}
                      onFocus={(e) => {
                        // Selecionar todo o texto quando o campo recebe foco
                        if (e.target.value === "0") {
                          e.target.select();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
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
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Orçamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
