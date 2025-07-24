'use client';

import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  className, 
  size = 'md',
  text 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 gap-3', className)}>
      <Loader2 className={cn('animate-spin text-purple-400', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Loading overlay para formulários
export const FormLoadingOverlay: FC<{ isLoading: boolean; text?: string }> = ({ 
  isLoading, 
  text = 'Carregando...' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        <p className="text-sm text-gray-300">{text}</p>
      </div>
    </div>
  );
};

// Loading para botões
export const ButtonLoader: FC<{ className?: string }> = ({ className }) => {
  return (
    <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
  );
};

export default LoadingSpinner;
