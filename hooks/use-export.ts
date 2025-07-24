"use client";

import { useState } from 'react';
import { toast } from 'sonner';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';
export type ExportType = 'transactions' | 'reports' | 'budgets' | 'wallets';

export interface ExportFilters {
  format: ExportFormat;
  type: ExportType;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  filters?: {
    transactionType?: 'income' | 'expense' | 'all';
    categoryIds?: string[];
    walletIds?: string[];
  };
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (filters: ExportFilters) => {
    if (isExporting) return;

    setIsExporting(true);
    
    try {
      toast.loading('Preparando exportação...', { 
        id: 'export-loading',
        duration: Infinity,
        icon: '📊'
      });
      
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        // Tentar ler erro como JSON, mas fallback para texto se falhar
        let errorMessage = 'Erro ao exportar dados';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          } else {
            errorMessage = await response.text() || errorMessage;
          }
        } catch {
          // Se não conseguir ler o erro, usar mensagem padrão
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      toast.loading('Gerando arquivo...', { 
        id: 'export-loading',
        duration: Infinity,
        icon: '⚡'
      });

      // Obter o nome do arquivo do cabeçalho Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `export_${new Date().toISOString().split('T')[0]}.${filters.format}`;

      // Criar blob e fazer download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Arquivo ${filename} baixado com sucesso!`, { 
        id: 'export-loading',
        icon: '✅'
      });
      
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao exportar dados', { 
        id: 'export-loading',
        icon: '❌'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting,
  };
}
