import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Transaction = {
    id: number
    description: string
    amount: number
    date: string
    category: string
    type: 'income' | 'expense'
    status: 'completed' | 'pending' | 'cancelled'
  }

export function TransactionTable() {

    const transactions: Transaction[] = [
        {
          id: 1,
          description: 'Supermercado',
          amount: 250.75,
          date: '2023-11-15',
          category: 'Alimentação',
          type: 'expense',
          status: 'completed'
        },
        {
          id: 2,
          description: 'Salário',
          amount: 3500.00,
          date: '2023-11-10',
          category: 'Rendimento',
          type: 'income',
          status: 'completed'
        },
        {
          id: 3,
          description: 'Academia',
          amount: 120.00,
          date: '2023-11-05',
          category: 'Saúde',
          type: 'expense',
          status: 'pending'
        },
        {
          id: 4,
          description: 'Freelance',
          amount: 800.00,
          date: '2023-11-03',
          category: 'Rendimento',
          type: 'income',
          status: 'completed'
        },
        {
          id: 5,
          description: 'Restaurante',
          amount: 85.50,
          date: '2023-11-01',
          category: 'Alimentação',
          type: 'expense',
          status: 'completed'
        },
      ]
    
      const statusVariant: Record<Transaction['status'], 'default' | 'destructive' | 'secondary'> = {
        completed: 'default',
        pending: 'secondary',
        cancelled: 'destructive'
      }
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.description}
                </TableCell>
                <TableCell className={`text-right ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[transaction.status]}>
                    {transaction.status === 'completed' ? 'Concluído' : 
                     transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    )
}