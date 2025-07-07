"use client"

import * as React from "react"
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface MonthYearPickerProps {
  value: { month: number; year: number }
  onChange: (value: { month: number; year: number }) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function MonthYearPicker({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = "Selecionar mês"
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [viewYear, setViewYear] = React.useState(value.year)

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const handleMonthSelect = (monthIndex: number) => {
    onChange({ month: monthIndex + 1, year: viewYear })
    setIsOpen(false)
  }

  const handleYearChange = (direction: 'prev' | 'next') => {
    setViewYear(prev => direction === 'prev' ? prev - 1 : prev + 1)
  }

  const getDisplayValue = () => {
    const date = new Date(value.year, value.month - 1)
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, c => c.toUpperCase())
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "justify-between gap-1 border-gray-700 hover:bg-gray-800 hover:border-gray-600 text-gray-300 hover:text-white",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <Calendar className="h-4 w-4" />
          <span className="flex-1 text-left">
            {disabled ? "Carregando..." : getDisplayValue()}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-800" align="end">
        <div className="p-4 space-y-4">
          {/* Header com navegação de ano */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleYearChange('prev')}
              className="h-8 w-8 p-0 hover:bg-gray-800 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold text-lg text-white">
              {viewYear}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleYearChange('next')}
              className="h-8 w-8 p-0 hover:bg-gray-800 text-gray-400 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Grid de meses */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const isSelected = value.month === index + 1 && value.year === viewYear
              const isCurrentMonth = new Date().getMonth() === index && new Date().getFullYear() === viewYear
              
              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleMonthSelect(index)}
                  className={cn(
                    "h-10 text-sm font-normal justify-center transition-colors",
                    isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                    !isSelected && "hover:bg-gray-800 text-gray-300 hover:text-white",
                    isCurrentMonth && !isSelected && "bg-gray-800 text-white border border-gray-700"
                  )}
                >
                  {month.slice(0, 3)}
                </Button>
              )
            })}
          </div>

          {/* Botões de ação rápida */}
          <div className="flex gap-2 pt-4 border-t border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date()
                const currentMonth = now.getMonth() + 1
                const currentYear = now.getFullYear()
                setViewYear(currentYear)
                onChange({ month: currentMonth, year: currentYear })
                setIsOpen(false)
              }}
              className="flex-1 text-xs hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
            >
              Mês Atual
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date()
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
                const month = lastMonth.getMonth() + 1
                const year = lastMonth.getFullYear()
                setViewYear(year)
                onChange({ month, year })
                setIsOpen(false)
              }}
              className="flex-1 text-xs hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
            >
              Mês Anterior
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
