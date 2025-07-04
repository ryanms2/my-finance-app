import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TransactionsTable } from "./transactions-table";

export function RecentTransactions() {
    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transações Recentes</CardTitle>
            <Button variant="outline" size="sm" className="hidden sm:flex">
                Ver Todas
            </Button>
            </CardHeader>
            <CardContent>
            <TransactionsTable />
            </CardContent>
        </Card>
)
}