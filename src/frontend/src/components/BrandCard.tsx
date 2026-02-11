import { cn } from '@/lib/utils';

interface BrandCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function BrandCard({ children, className }: BrandCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-border bg-card shadow-sm',
      className
    )}>
      {children}
    </div>
  );
}
