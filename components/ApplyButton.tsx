'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type ApplyButtonProps = {
  label?: string;
  country?: string;
  variant?: 'primary' | 'outline' | 'text';
  className?: string;
};

export function ApplyButton({ label = 'Apply for trials', country, variant = 'primary', className = '' }: ApplyButtonProps) {
  const href = country ? `/register?destination=${encodeURIComponent(country)}` : '/register';
  return (
    <Link href={href} className={`apply-button apply-button-${variant} ${className}`}>
      {label}<ArrowUpRight size={16} strokeWidth={2.5} />
    </Link>
  );
}
