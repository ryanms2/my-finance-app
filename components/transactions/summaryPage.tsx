import { ArrowUp, ArrowDown } from "lucide-react"
import { Card } from "../ui/card"

type CardSummaryProps = {
    title: string
    value: number
    change: string
    icon?: 'income' | 'expense'
}

export function SummaryPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <CardSummary title="Total" value={4250.75} change="+12%" />
            <CardSummary title="Receitas" value={4300.00} change="+8%" icon="income" />
            <CardSummary title="Despesas" value={456.25} change="+5%" icon="expense" />
            <CardSummary title="Saldo" value={3843.75} change="+15%" />
        </div>
    )
}


  
function CardSummary({ title, value, change, icon }: CardSummaryProps) {
    return (
        <Card>
            <div className="p-4">
                <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">R$ {value.toFixed(2)}</p>
                </div>
                {icon && (
                    <div className={`p-2 rounded-full ${icon === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {icon === 'income' ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : (
                        <ArrowDown className="h-4 w-4" />
                    )}
                    </div>
                )}
                </div>
                <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change} em relação ao mês passado
                </p>
            </div>
        </Card>
)
}