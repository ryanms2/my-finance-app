"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, PieChart, Bell } from "lucide-react"
import Link from "next/link"
import { NavigationLink } from "@/components/navigation-link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface WelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Bem-vindo ao MyFinance!</DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Vamos começar a organizar suas finanças
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wallet className="h-4 w-4 text-primary" />
                Carteiras
              </CardTitle>
              <CardDescription className="text-xs">
                Gerencie todas as suas contas e cartões
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                Acompanhamento
              </CardTitle>
              <CardDescription className="text-xs">
                Acompanhe seus gastos e receitas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <PieChart className="h-4 w-4 text-primary" />
                Orçamento
              </CardTitle>
              <CardDescription className="text-xs">
                Defina e acompanhe seus orçamentos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-primary" />
                Notificações
              </CardTitle>
              <CardDescription className="text-xs">
                Receba alertas importantes
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Adicione sua primeira carteira para começar a gerenciar suas finanças
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <NavigationLink href="/wallets">
              Adicionar Carteira
            </NavigationLink>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 