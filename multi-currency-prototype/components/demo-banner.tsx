'use client'

import { AlertTriangle } from 'lucide-react'

export function DemoBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-amber-800">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">
          Demo Prototype — No Real Funds
        </span>
      </div>
    </div>
  )
}
