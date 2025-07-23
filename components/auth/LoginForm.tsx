"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useForm } from "react-hook-form";
import { formSchema } from "@/lib/zod";
import { signIn } from 'next-auth/react'
import { DollarSign, Mail, ArrowRight } from "lucide-react";

export function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: (
            {
                email: "",
            }
        )
    });
    
    const onSubmit = async(data: z.infer<typeof formSchema>) => {
        const response = await signIn("nodemailer", {email: data.email, redirect: false});
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            
            <div className="relative w-full max-w-md">
                {/* Logo e Branding */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                            <DollarSign className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            MyFinance
                        </h1>
                    </div>
                    <p className="text-gray-400 text-center leading-relaxed">
                        Gerencie suas finanças de forma simples e eficiente
                    </p>
                </div>

                {/* Card de Login */}
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-md shadow-2xl">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-semibold text-white">
                            Bem-vindo
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Digite seu email para acessar sua conta
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200 font-medium">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input 
                                                        placeholder="seuemail@email.com" 
                                                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 transition-colors"
                                                        {...field} 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-gray-500 text-sm">
                                                Enviaremos um link de acesso para este email
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25 group"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Enviar link de acesso
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </Form>
                        
                        {/* Footer do Card */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <p className="text-xs text-gray-500 text-center">
                                Ao continuar, você concorda com nossos{" "}
                                <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                                    Termos de Uso
                                </span>{" "}
                                e{" "}
                                <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                                    Política de Privacidade
                                </span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}