import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ExpensesDonutChart } from "./expenses-donut-chart";

export function BudgetProgress() {
    return (
        <Card className="lg:col-span-3 bg-gray-900/50 border-gray-800">
            <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Progresso do Orçamento</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-gray-400">
                Maio 2025
                </Button>
            </div>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span>Alimentação</span>
                <span className="font-medium">R$ 350 / R$ 500</span>
                </div>
                <div className="relative pt-1">
                <div className="h-2 rounded-full bg-gray-800">
                    <div
                    className="absolute top-0 h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: "70%" }}
                    ></div>
                </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span>Transporte</span>
                <span className="font-medium">R$ 120 / R$ 200</span>
                </div>
                <div className="relative pt-1">
                <div className="h-2 rounded-full bg-gray-800">
                    <div
                    className="absolute top-0 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{ width: "60%" }}
                    ></div>
                </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span>Entretenimento</span>
                <span className="font-medium">R$ 80 / R$ 150</span>
                </div>
                <div className="relative pt-1">
                <div className="h-2 rounded-full bg-gray-800">
                    <div
                    className="absolute top-0 h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                    style={{ width: "53%" }}
                    ></div>
                </div>
                </div>
            </div>

            <div className="pt-4">
                <ExpensesDonutChart />
            </div>
            </CardContent>
        </Card>
    )
}