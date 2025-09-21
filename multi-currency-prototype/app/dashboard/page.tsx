'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { mockServices, AccountBalance } from '@/lib/mock-services'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const [balance, setBalance] = useState<AccountBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [interestRate, setInterestRate] = useState(7.2)

  useEffect(() => {
    loadBalance()
    
    // Update interest rate every 30 seconds
    const interval = setInterval(() => {
      setInterestRate(prev => prev + (Math.random() - 0.5) * 0.1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadBalance = async () => {
    try {
      const accountBalance = await mockServices.getAccountBalance()
      setBalance(accountBalance)
    } catch (error) {
      console.error('Failed to load balance:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Add Money',
      description: 'Fund your INR account',
      icon: ArrowUpRight,
      href: '/transfer',
      color: 'bg-green-500'
    },
    {
      title: 'Pay Bills',
      description: 'Pay Indian bills',
      icon: ArrowDownRight,
      href: '/pay-bills',
      color: 'bg-blue-500'
    },
    {
      title: 'Transfer',
      description: 'Send to India',
      icon: Wallet,
      href: '/transfer',
      color: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <Card className="balance-card text-white">
        <CardHeader>
          <CardTitle className="text-white/90">INR Account Balance</CardTitle>
          <CardDescription className="text-white/70">
            Your rupee-denominated account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(balance?.inr || 0)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Interest Rate: {interestRate.toFixed(2)}% p.a.</span>
          </div>
        </CardContent>
      </Card>

      {/* Interest Ticker */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">Interest Accruing</h3>
              <p className="text-sm text-green-600">
                Your money grows while you hold it
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800 interest-ticker">
                +₹{(balance?.inr || 0) * (interestRate / 100 / 365).toFixed(2)}
              </div>
              <p className="text-xs text-green-600">daily</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => window.location.href = action.href}
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Activity
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/history'}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {balance && balance.inr > 0 && (
              <>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Initial Deposit</p>
                      <p className="text-xs text-gray-500">7 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+₹25,000</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Interest Earned</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+₹34.25</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
