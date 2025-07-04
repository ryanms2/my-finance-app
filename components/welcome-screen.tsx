"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, PieChart, Bell } from "lucide-react"
import Link from "next/link"

export function WelcomeScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Bem-vindo ao MyFinance</h1>
          <p className="text-xl text-muted-foreground">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Carteiras
              </CardTitle>
              <CardDescription>
                Gerencie todas as suas contas e cartões em um só lugar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Adicione suas contas bancárias, cartões de crédito e outras carteiras para ter uma visão completa das suas finanças.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Acompanhamento
              </CardTitle>
              <CardDescription>
                Acompanhe seus gastos e receitas em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize gráficos e relatórios detalhados sobre seus gastos e receitas para tomar melhores decisões financeiras.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Orçamento
              </CardTitle>
              <CardDescription>
                Defina e acompanhe seus orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crie orçamentos personalizados para diferentes categorias e mantenha suas finanças sob controle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificações
              </CardTitle>
              <CardDescription>
                Receba alertas importantes sobre suas finanças
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fique por dentro de pagamentos pendentes, limites de cartão e outras informações importantes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Comece agora mesmo!</h2>
          <p className="text-muted-foreground">
            Adicione sua primeira carteira para começar a gerenciar suas finanças
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/wallets">
              Adicionar Carteira
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 