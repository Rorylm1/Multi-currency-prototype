'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpDown, Clock, CheckCircle } from 'lucide-react'
import { mockServices, FXQuote } from '@/lib/mock-services'
import { formatCurrency } from '@/lib/utils'

export default function TransferPage() {
  const [fromCurrency, setFromCurrency] = useState('GBP')
  const [toCurrency, setToCurrency] = useState('INR')
  const [amount, setAmount] = useState('')
  const [fxQuote, setFxQuote] = useState<FXQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [transactionSuccess, setTransactionSuccess] = useState(false)

  const currencies = [
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  ]

  const getQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    
    setQuoteLoading(true)
    try {
      const quote = await mockServices.getFXQuote(fromCurrency, toCurrency)
      setFxQuote(quote)
    } catch (error) {
      console.error('Failed to get FX quote:', error)
    } finally {
      setQuoteLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (!fxQuote || !amount) return
    
    setLoading(true)
    try {
      const inrAmount = parseFloat(amount) * fxQuote.rate
      await mockServices.addTransaction({
        type: 'deposit',
        amount: inrAmount,
        currency: 'INR',
        description: `Fund transfer from ${fromCurrency}`,
        status: 'completed',
        metadata: {
          fromCurrency,
          fromAmount: parseFloat(amount),
          fxRate: fxQuote.rate,
          quoteId: fxQuote.timestamp.getTime()
        }
      })
      
      setTransactionSuccess(true)
      setTimeout(() => {
        setTransactionSuccess(false)
        setAmount('')
        setFxQuote(null)
      }, 3000)
    } catch (error) {
      console.error('Transfer failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timeoutId = setTimeout(() => {
        getQuote()
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setFxQuote(null)
    }
  }, [amount, fromCurrency, toCurrency])

  const isValidAmount = amount && parseFloat(amount) > 0
  const canTransfer = !!fxQuote && isValidAmount && !loading
  const isQuoteExpired = !!fxQuote && new Date() > fxQuote.expiresAt

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Add Money</h1>
        <p className="text-gray-600">Fund your INR account from your local currency</p>
      </div>

      {transactionSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Transfer Successful!</h3>
                <p className="text-sm text-green-600">
                  Your INR account has been funded successfully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Currency Exchange</CardTitle>
          <CardDescription>
            Get live FX rates and transfer money to your INR account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* From Currency */}
          <div className="space-y-2">
            <Label htmlFor="from-currency">From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{currency.code} - {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <Label htmlFor="to-currency">To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">
                  <div className="flex items-center gap-2">
                    <span>🇮🇳</span>
                    <span>INR - Indian Rupee</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FX Quote Display */}
          {quoteLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Getting live rate...</span>
            </div>
          )}

          {fxQuote && !quoteLoading && (
            <Card className={isQuoteExpired ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Exchange Rate</span>
                    <span className="text-lg font-bold">
                      1 {fromCurrency} = {fxQuote.rate.toFixed(4)} {toCurrency}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">You'll Receive</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(parseFloat(amount || '0') * fxQuote.rate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>
                      Quote expires in {Math.max(0, Math.ceil((fxQuote.expiresAt.getTime() - Date.now()) / 1000 / 60))} minutes
                    </span>
                  </div>

                  {isQuoteExpired && (
                    <div className="text-sm text-red-600 font-medium">
                      Quote expired. Please get a new quote.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transfer Button */}
          <Button
            onClick={handleTransfer}
            disabled={!canTransfer || isQuoteExpired}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Transfer to INR Account
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Why choose Aspora?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Live FX rates with no hidden fees</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Instant transfers to your INR account</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Earn interest on your rupee balance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use directly for bills and transfers to India</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
