import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300 ${className}`}>
      {children}
    </div>
  );
}
