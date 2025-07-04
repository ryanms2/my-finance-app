"use client";

import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";

const formSchema = z.object({
    name: z.string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(50, "Nome muito longo"),
    email: z.string()
        .min(1, "Email é obrigatório")
        .email("Formato de email inválido"),
    password: z.string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .max(100, "Senha muito longa")
        .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
        .regex(/[0-9]/, "Senha deve conter pelo menos um número")
        .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
    passwordConfirmation: z.string()
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não conferem",
    path: ["passwordConfirmation"],
});

type CreateAccountFormValues = z.infer<typeof formSchema>;

export function CreateAccountForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<CreateAccountFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        }
    });

    async function onSubmit(data: CreateAccountFormValues) {
        try {
            setIsLoading(true);
            setError(null);

            console.log(data);

        } catch (error) {
            setError(error instanceof Error ? error.message : "Algo deu errado");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="flex flex-col items-center gap-2 mb-8">
                <h1 className="text-4xl font-bold text-emerald-600">MyFinance</h1>
                <p className="text-gray-600">Gerencie suas finanças de forma simples e eficiente</p>
            </div>

            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Criar Conta</h2>
                    <p className="text-sm text-gray-600">
                        Preencha os dados abaixo para criar sua conta
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Seu nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="email"
                                            placeholder="seuemail@exemplo.com" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Senha</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password" 
                                            placeholder="********" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Confirmar Senha</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password" 
                                            placeholder="********" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full font-medium bg-emerald-600 hover:bg-emerald-500"
                            disabled={isLoading}
                        >
                            {isLoading ? "Criando conta..." : "Criar conta"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Já tem uma conta?{" "}
                        <Link 
                            href="/signin" 
                            className="font-medium text-emerald-600 hover:text-emerald-500"
                        >
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}