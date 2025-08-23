"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Trash2, AlertCircle } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { updateBudget, deleteBudget } from "@/lib/data";
import { toast } from "sonner";

// Schema de validação para o formulário de edição
const formSchemaEditBudget = z.object({
  amount: z.number().min(0.01, { message: "O valor deve ser maior que zero" }),
});

type EditBudgetValues = z.infer<typeof formSchemaEditBudget>;

interface Budget {
  id: string;
  name: string;
  spent: number;
  total: number;
  percentage: number;
  color: string;
  categoryId: string;
  icon: string | null;
}

interface BudgetActionsProps {
  budget: Budget;
}

export function BudgetActions({ budget }: BudgetActionsProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const form = useForm<EditBudgetValues>({
    resolver: zodResolver(formSchemaEditBudget),
    defaultValues: {
      amount: budget.total,
    },
  });

  const handleUpdate = async (values: EditBudgetValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateBudget(budget.id, values.amount);
      if (result) {
        toast.success(`Orçamento "${budget.name}" atualizado com sucesso!`);
        setOpenEdit(false);
        
        // Usar router.refresh em vez de window.location.reload
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        toast.error("Erro ao atualizar orçamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      toast.error("Erro ao atualizar orçamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBudget(budget.id);
      if (result) {
        toast.success(`Orçamento "${budget.name}" excluído com sucesso!`);
       
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        toast.error("Erro ao excluir orçamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error);
      toast.error("Erro ao excluir orçamento. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Diálogo de Edição */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-300 hover:bg-gray-800">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Editar Orçamento</DialogTitle>
            <DialogDescription className="text-gray-400">
              Atualize o valor limite para a categoria "{budget.name}"
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">
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
                          e.target.select();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Atualizando..." : "Atualizar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-800">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Excluir Orçamento
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o orçamento para "{budget.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
