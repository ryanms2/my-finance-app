"use client"

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/lib/data";
import { toast } from "sonner";
import { formSchemaAccount, WalletFormProps, walletTypes } from "@/lib/types";

const colors = [
  { label: "Azul", value: "from-blue-500 to-blue-600" },
  { label: "Roxo", value: "from-purple-500 to-purple-600" },
  { label: "Verde", value: "from-green-500 to-green-600" },
  { label: "Laranja", value: "from-orange-500 to-orange-600" },
  { label: "Vermelho", value: "from-red-500 to-red-600" },
  { label: "Rosa", value: "from-pink-500 to-pink-600" },
  { label: "Amarelo", value: "from-yellow-500 to-yellow-600" },
  { label: "Cinza", value: "from-gray-500 to-gray-600" },
];


type WalletFormValues = z.infer<typeof formSchemaAccount>;

export function WalletForm({
  children,
  className,
  variant = "default",
  size = "default",
}: WalletFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(formSchemaAccount),
    defaultValues: {
      name: "",
      type: "",
      balance: 0,
      institution: "",
      accountNumber: "",
      totalLimit: undefined,
      color: "",
      isDefault: false,
    },
  });

  const watchedType = form.watch("type");

  function onSubmit(values: WalletFormValues) {
    // lógica para salvar a carteira
      const createAccountInDb = async () => {
        const createNewAccount = await createAccount(values);
        if (createNewAccount) {
          toast.success("Carteira criada com sucesso");
          form.reset();
          setOpen(false);
        }
        else {
          toast.error("Erro ao criar carteira");
        }
      }
      createAccountInDb();
  }

  // Ref para o form, para submit programático
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} size={size} className={className}>
            <Plus className="mr-2 h-4 w-4" /> Nova Carteira
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] max-w-[95vw] bg-gray-900 border-gray-800 text-white flex flex-col max-h-[95vh] p-0"
        style={{ maxHeight: "95vh", padding: 0 }}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <DialogTitle className="text-lg sm:text-xl">Adicionar Carteira</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Adicione uma nova carteira ou conta para gerenciar suas finanças.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-4 sm:px-6 pb-2 flex-1" style={{ maxHeight: "calc(95vh - 100px)" }}>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Nome da Carteira</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Conta Corrente"
                        {...field}
                        className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
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
                    <FormLabel className="text-sm">Tipo</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-purple-500">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {walletTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm">
                        {watchedType === "credit"
                          ? "Limite Disponível"
                          : "Saldo Inicial"}
                      </FormLabel>
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

                {watchedType === "credit" && (
                  <FormField
                    control={form.control}
                    name="totalLimit"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm">Limite Total</FormLabel>
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
                )}
              </div>

              {["bank", "savings", "credit", "debit"].includes(watchedType) && (
                <>
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Banco/Instituição</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Banco do Brasil"
                            {...field}
                            className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
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
                        <FormLabel className="text-sm">Número da Conta/Cartão</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              ["credit", "debit"].includes(watchedType)
                                ? "Ex: 1234"
                                : "Ex: ****1234"
                            }
                            type="text"
                            inputMode={
                              ["credit", "debit"].includes(watchedType)
                                ? "numeric"
                                : "text"
                            }
                            maxLength={
                              ["credit", "debit"].includes(watchedType)
                                ? 4
                                : undefined
                            }
                            pattern={
                              ["credit", "debit"].includes(watchedType)
                                ? "\\d{4}"
                                : undefined
                            }
                            value={field.value ?? ""}
                            onChange={e => {
                              let val = e.target.value;
                              // Permitir apenas números e limitar a 4 dígitos para cartões
                              if (["credit", "debit"].includes(watchedType)) {
                                val = val.replace(/\D/g, "").slice(0, 4);
                              }
                              field.onChange(val);
                            }}
                            className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                          />
                        </FormControl>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {["credit", "debit"].includes(watchedType)
                            ? "Por segurança, insira apenas os 4 últimos dígitos do cartão."
                            : "Por segurança, insira apenas os últimos números do cartão."}
                        </span>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Cor</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-purple-500">
                          <SelectValue placeholder="Selecione uma cor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {colors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`h-4 w-4 rounded-full bg-gradient-to-r ${color.value}`}></div>
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Carteira Padrão</FormLabel>
                      <div className="text-sm text-gray-400">
                        Esta será a carteira selecionada por padrão nas transações
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* DialogFooter is now outside the scrollable area */}
            </form>
          </Form>
        </div>
        <DialogFooter className="pt-3 sm:pt-4 px-4 sm:px-6 pb-4 sm:pb-6 bg-gray-900 border-t border-gray-800 sticky bottom-0 z-10 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-700 hover:bg-gray-700 hover:text-white w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 w-full sm:w-auto order-1 sm:order-2"
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
