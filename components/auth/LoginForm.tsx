"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { formSchema } from "@/lib/zod";
import { signIn } from 'next-auth/react'

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
        // const response = await signIn("credentials", {
        //     email: data.email,
        //     password: data.password,
        //     redirect: true,
        //     callbackUrl: "/"
        // });
        const response = await signIn("nodemailer", {email: data.email, redirect: false});
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="flex flex-col items-center gap-2 mb-8">
                <h1 className="text-4xl font-bold text-emerald-600">MyFinance</h1>
                <p className="text-gray-600">Gerencie suas finanças de forma simples e eficiente</p>
            </div>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Entrar na sua conta</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="seuemail@email.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This email will be used to login to your account.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                           
                        ) }/>
                        <Button 
                            type="submit" 
                            className="w-full py-3 font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}