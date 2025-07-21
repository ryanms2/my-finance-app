"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useExport, type ExportFormat, type ExportType, type ExportFilters } from '@/hooks/use-export';

interface ExportDialogProps {
  children?: React.ReactNode;
  defaultType?: ExportType;
  availableWallets?: Array<{ id: string; name: string }>;
  availableCategories?: Array<{ id: string; name: string; type: 'income' | 'expense' }>;
}

export function ExportDialog({ 
  children, 
  defaultType = 'transactions',
  availableWallets = [],
  availableCategories = []
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [exportType, setExportType] = useState<ExportType>(defaultType);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'all'>('all');
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [useDateRange, setUseDateRange] = useState(false);

  const { exportData, isExporting } = useExport();

  const handleExport = async () => {
    const filters: ExportFilters = {
      format: exportFormat,
      type: exportType,
    };

    // Adicionar filtro de data se selecionado
    if (useDateRange && startDate && endDate) {
      filters.dateRange = { startDate, endDate };
    }

    // Adicionar filtros específicos para transações
    if (exportType === 'transactions') {
      filters.filters = {
        transactionType,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        walletIds: selectedWallets.length > 0 ? selectedWallets : undefined,
      };
    }

    await exportData(filters);
    setOpen(false);
  };

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setTransactionType('all');
    setSelectedWallets([]);
    setSelectedCategories([]);
    setUseDateRange(false);
  };

  const handleTypeChange = (newType: ExportType) => {
    setExportType(newType);
    resetFilters();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Exportar Dados</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure as opções de exportação para baixar seus dados.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
          {/* Tipo de Exportação */}
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Dados</Label>
            <Select value={exportType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="transactions">Transações</SelectItem>
                <SelectItem value="reports">Relatórios</SelectItem>
                <SelectItem value="budgets">Orçamentos</SelectItem>
                <SelectItem value="wallets">Carteiras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Formato */}
          <div className="grid gap-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={exportFormat} onValueChange={(value: ExportFormat) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="csv">CSV (Compatível com Excel)</SelectItem>
                <SelectItem value="xlsx">XLSX (Excel Nativo)</SelectItem>
                <SelectItem value="pdf">PDF (Relatório Visual)</SelectItem>
              </SelectContent>
            </Select>
            {exportFormat && (
              <p className="text-xs text-gray-400 mt-1">
                {exportFormat === 'csv' && 'Arquivo separado por vírgulas, compatível com Excel e outras planilhas'}
                {exportFormat === 'xlsx' && 'Arquivo Excel nativo com formatação automática de colunas'}
                {exportFormat === 'pdf' && 'Relatório em PDF com layout profissional e tabelas formatadas'}
              </p>
            )}
          </div>

          {/* Filtro de Data */}
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useDateRange"
                checked={useDateRange}
                onCheckedChange={(checked) => setUseDateRange(checked as boolean)}
              />
              <Label htmlFor="useDateRange">Filtrar por período</Label>
            </div>
            
            {useDateRange && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Data inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal border-gray-700',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Data final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal border-gray-700',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {/* Filtros específicos para transações */}
          {exportType === 'transactions' && (
            <>
              <div className="grid gap-2">
                <Label>Tipo de Transação</Label>
                <Select value={transactionType} onValueChange={(value: 'income' | 'expense' | 'all') => setTransactionType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {availableWallets.length > 0 && (
                <div className="grid gap-2">
                  <Label>Carteiras (opcional)</Label>
                  <div className="max-h-24 overflow-y-auto border border-gray-700 rounded p-2 space-y-1">
                    {availableWallets.map((wallet) => (
                      <div key={wallet.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`wallet-${wallet.id}`}
                          checked={selectedWallets.includes(wallet.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedWallets([...selectedWallets, wallet.id]);
                            } else {
                              setSelectedWallets(selectedWallets.filter(id => id !== wallet.id));
                            }
                          }}
                        />
                        <Label htmlFor={`wallet-${wallet.id}`} className="text-sm">
                          {wallet.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableCategories.length > 0 && (
                <div className="grid gap-2">
                  <Label>Categorias (opcional)</Label>
                  <div className="max-h-24 overflow-y-auto border border-gray-700 rounded p-2 space-y-1">
                    {availableCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                            }
                          }}
                        />
                        <Label htmlFor={`category-${category.id}`} className="text-sm">
                          {category.name} ({category.type === 'income' ? 'Receita' : 'Despesa'})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
