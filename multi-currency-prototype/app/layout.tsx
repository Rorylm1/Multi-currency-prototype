import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DemoBanner } from '@/components/demo-banner'
import { Header } from '@/components/header'
import { Navigation } from '@/components/navigation'
import { PWAProvider } from '@/components/pwa-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aspora - Fintech for Indian Diaspora',
  description: 'A rupee-denominated account for the Indian diaspora',
  manifest: '/manifest.json',
  themeColor: '#1f2937',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aspora',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <PWAProvider />
        <div className="min-h-screen bg-gray-50">
          <DemoBanner />
          <Header />
          <main className="pb-20">
            {children}
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  )
}
