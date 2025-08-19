import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  PiggyBank, 
  TrendingUp, 
  Shield, 
  Smartphone,
  BarChart3,
  Wallet,
  Target,
  Bell
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold">MyFinance</span>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-white hover:text-purple-300">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Controle suas finanças com inteligência
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            O MyFinance é sua plataforma completa para gerenciamento financeiro pessoal. 
            Organize seus gastos, defina metas e acompanhe seu progresso em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Começar gratuitamente
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tudo que você precisa para organizar suas finanças
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Wallet className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-white">Controle de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Registre e categorize todas suas transações de forma simples e rápida.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Target className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle className="text-white">Orçamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Defina metas de gastos por categoria e acompanhe seu progresso.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-green-500 mb-2" />
                <CardTitle className="text-white">Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Visualize gráficos detalhados sobre seus hábitos financeiros.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Bell className="h-10 w-10 text-yellow-500 mb-2" />
                <CardTitle className="text-white">Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Receba alertas quando ultrapassar seus orçamentos ou prazos.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Por que escolher o MyFinance?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seguro e Privado</h3>
              <p className="text-gray-400">
                Seus dados são protegidos com criptografia de ponta e nunca são compartilhados.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Smartphone className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interface Moderna</h3>
              <p className="text-gray-400">
                Design intuitivo e responsivo que funciona perfeitamente em qualquer dispositivo.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Insights Inteligentes</h3>
              <p className="text-gray-400">
                Análises automáticas que ajudam você a tomar melhores decisões financeiras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para transformar sua vida financeira?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de usuários que já organizaram suas finanças com o MyFinance.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Começar agora - É grátis!
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 MyFinance. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
