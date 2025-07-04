import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface CardsSummaryProps {
  saldoTotal: number;
  receitas: number;
  despesas: number;
  economias: number;
  variacoes?: {
    saldoTotal: number;
    receitas: number;
    despesas: number;
    economias: number;
  };
}

export function CardsSummary({ saldoTotal, receitas, despesas, economias, variacoes }: CardsSummaryProps) {
    // Função para formatar a variação
    const formatVariacao = (variacao: number) => {
      const sinal = variacao >= 0 ? '+' : '';
      return `${sinal}${variacao.toFixed(1)}%`;
    };

    // Função para determinar a cor baseada na variação
    const getVariacaoColor = (variacao: number, isInvertido: boolean = false) => {
      const isPositivo = isInvertido ? variacao < 0 : variacao >= 0;
      return isPositivo ? 'text-green-400' : 'text-red-400';
    };

    // Função para determinar o ícone baseado na variação
    const getVariacaoIcon = (variacao: number, isInvertido: boolean = false) => {
      const isPositivo = isInvertido ? variacao < 0 : variacao >= 0;
      return isPositivo ? TrendingUp : TrendingDown;
    };
    return (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-purple-400" />
                </div>
                </CardHeader>
                <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">{saldoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                {variacoes && (
                  <div className="flex items-center mt-1">
                    {(() => {
                      const Icon = getVariacaoIcon(variacoes.saldoTotal);
                      return <Icon className={`h-4 w-4 mr-1 ${getVariacaoColor(variacoes.saldoTotal)}`} />;
                    })()}
                    <p className={`text-xs ${getVariacaoColor(variacoes.saldoTotal)}`}>
                      {formatVariacao(variacoes.saldoTotal)} em relação ao mês anterior
                    </p>
                  </div>
                )}
                </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                </CardHeader>
                <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">{receitas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                {variacoes && (
                  <div className="flex items-center mt-1">
                    {(() => {
                      const Icon = getVariacaoIcon(variacoes.receitas);
                      return <Icon className={`h-4 w-4 mr-1 ${getVariacaoColor(variacoes.receitas)}`} />;
                    })()}
                    <p className={`text-xs ${getVariacaoColor(variacoes.receitas)}`}>
                      {formatVariacao(variacoes.receitas)} em relação ao mês anterior
                    </p>
                  </div>
                )}
                </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-lg"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                </div>
                </CardHeader>
                <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">{despesas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                {variacoes && (
                  <div className="flex items-center mt-1">
                    {(() => {
                      const Icon = getVariacaoIcon(variacoes.despesas, true); // true = invertido (para despesas, aumento é negativo)
                      return <Icon className={`h-4 w-4 mr-1 ${getVariacaoColor(variacoes.despesas, true)}`} />;
                    })()}
                    <p className={`text-xs ${getVariacaoColor(variacoes.despesas, true)}`}>
                      {formatVariacao(variacoes.despesas)} em relação ao mês anterior
                    </p>
                  </div>
                )}
                </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium">Economias</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-blue-400" />
                </div>
                </CardHeader>
                <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">{economias.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                {variacoes && (
                  <div className="flex items-center mt-1">
                    {(() => {
                      const Icon = getVariacaoIcon(variacoes.economias);
                      return <Icon className={`h-4 w-4 mr-1 ${getVariacaoColor(variacoes.economias)}`} />;
                    })()}
                    <p className={`text-xs ${getVariacaoColor(variacoes.economias)}`}>
                      {formatVariacao(variacoes.economias)} em relação ao mês anterior
                    </p>
                  </div>
                )}
                </CardContent>
            </Card>
        </div>
        
    )
}