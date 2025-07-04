'use client';

import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Loader2 className="h-10 w-10 animate-spin text-white" />
    </div>
  );
};

export default LoadingSpinner;
