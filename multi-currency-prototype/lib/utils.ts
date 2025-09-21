import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateTransactionId(): string {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
}

export function validateIFSC(ifsc: string): boolean {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  return ifscRegex.test(ifsc)
}

export function generateMockInterestRate(): number {
  // Returns interest rate between 6.5% and 7.5%
  return 6.5 + Math.random() * 1
}

export function calculateInterest(principal: number, rate: number, days: number): number {
  return (principal * rate * days) / (365 * 100)
}
