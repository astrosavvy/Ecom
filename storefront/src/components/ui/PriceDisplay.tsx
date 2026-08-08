import React from 'react';

export function formatIndianCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PriceDisplay({ amount, className = '' }: { amount: number; className?: string }) {
  return <span className={className}>{formatIndianCurrency(amount)}</span>;
}
