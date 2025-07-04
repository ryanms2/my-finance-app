"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { addDays } from "date-fns";
import { Download } from "lucide-react";
import { Calendar } from '@/components/ui/calendar'
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TransactionTable } from "./transactionTable";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export function FilterPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    })
    return (
    <Card className="overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="food">Alimentação</SelectItem>
                <SelectItem value="income">Rendimento</SelectItem>
                <SelectItem value="health">Saúde</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex items-center gap-2">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                className="border rounded-md"
              />
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
            </div>
          </div>
        </div>

        <TransactionTable />
    </Card>
    )
}