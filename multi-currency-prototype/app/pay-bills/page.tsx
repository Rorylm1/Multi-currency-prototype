'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, CheckCircle, AlertCircle, Building2 } from 'lucide-react'
import { mockServices, Beneficiary } from '@/lib/mock-services'
import { formatCurrency } from '@/lib/utils'

export default function PayBillsPage() {
  const [billers, setBillers] = useState([
    { id: 'electricity', name: 'Electricity Bill', icon: '⚡', category: 'Utilities' },
    { id: 'gas', name: 'Gas Bill', icon: '🔥', category: 'Utilities' },
    { id: 'water', name: 'Water Bill', icon: '💧', category: 'Utilities' },
    { id: 'broadband', name: 'Broadband', icon: '📶', category: 'Internet' },
    { id: 'mobile', name: 'Mobile Recharge', icon: '📱', category: 'Mobile' },
    { id: 'insurance', name: 'Insurance Premium', icon: '🛡️', category: 'Insurance' },
  ])
  
  const [selectedBiller, setSelectedBiller] = useState('')
  const [billId, setBillId] = useState('')
  const [amount, setAmount] = useState('')
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferDescription, setTransferDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'bills' | 'transfer'>('bills')

  useEffect(() => {
    loadBeneficiaries()
  }, [])

  const loadBeneficiaries = async () => {
    try {
      const data = await mockServices.getBeneficiaries()
      setBeneficiaries(data)
    } catch (error) {
      console.error('Failed to load beneficiaries:', error)
    }
  }

  const handleBillPayment = async () => {
    if (!selectedBiller || !billId || !amount) return
    
    setLoading(true)
    try {
      const biller = billers.find(b => b.id === selectedBiller)
      await mockServices.payBill(
        biller?.name || selectedBiller,
        billId,
        parseFloat(amount)
      )
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setSelectedBiller('')
        setBillId('')
        setAmount('')
      }, 3000)
    } catch (error) {
      console.error('Bill payment failed:', error)
      alert('Payment failed: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleBankTransfer = async () => {
    if (!selectedBeneficiary || !transferAmount) return
    
    setLoading(true)
    try {
      await mockServices.transferToBank(
        selectedBeneficiary,
        parseFloat(transferAmount),
        transferDescription
      )
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setSelectedBeneficiary('')
        setTransferAmount('')
        setTransferDescription('')
      }, 3000)
    } catch (error) {
      console.error('Transfer failed:', error)
      alert('Transfer failed: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const selectedBillerData = billers.find(b => b.id === selectedBiller)
  const canPayBill = selectedBiller && billId && amount && parseFloat(amount) > 0
  const canTransfer = selectedBeneficiary && transferAmount && parseFloat(transferAmount) > 0

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Pay Bills & Transfer</h1>
        <p className="text-gray-600">Use your INR balance to pay Indian bills and transfer to bank accounts</p>
      </div>

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Payment Successful!</h3>
                <p className="text-sm text-green-600">
                  Your payment has been processed successfully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('bills')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bills' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pay Bills
          </div>
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transfer' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Building2 className="h-4 w-4" />
            Bank Transfer
          </div>
        </button>
      </div>

      {/* Pay Bills Tab */}
      {activeTab === 'bills' && (
        <Card>
          <CardHeader>
            <CardTitle>Pay Indian Bills</CardTitle>
            <CardDescription>
              Pay your utility bills and services directly from your INR balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Biller Selection */}
            <div className="space-y-2">
              <Label>Select Biller</Label>
              <Select value={selectedBiller} onValueChange={setSelectedBiller}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a biller" />
                </SelectTrigger>
                <SelectContent>
                  {billers.map((biller) => (
                    <SelectItem key={biller.id} value={biller.id}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{biller.icon}</span>
                        <div>
                          <div className="font-medium">{biller.name}</div>
                          <div className="text-xs text-gray-500">{biller.category}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBiller && (
              <>
                {/* Bill ID */}
                <div className="space-y-2">
                  <Label htmlFor="billId">Bill ID / Account Number</Label>
                  <Input
                    id="billId"
                    placeholder="Enter your bill ID or account number"
                    value={billId}
                    onChange={(e) => setBillId(e.target.value)}
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="billAmount">Amount (INR)</Label>
                  <Input
                    id="billAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* Bill Summary */}
                {canPayBill && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Bill Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Biller:</span>
                          <span className="font-medium">{selectedBillerData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bill ID:</span>
                          <span className="font-medium">{billId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(parseFloat(amount))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pay Button */}
                <Button
                  onClick={handleBillPayment}
                  disabled={!canPayBill || loading}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Pay {formatCurrency(parseFloat(amount || '0'))}
                    </div>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bank Transfer Tab */}
      {activeTab === 'transfer' && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer to Indian Bank</CardTitle>
            <CardDescription>
              Send money directly to Indian bank accounts using IFSC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {beneficiaries.length > 0 ? (
              <>
                {/* Beneficiary Selection */}
                <div className="space-y-2">
                  <Label>Select Beneficiary</Label>
                  <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a beneficiary" />
                    </SelectTrigger>
                    <SelectContent>
                      {beneficiaries.map((beneficiary) => (
                        <SelectItem key={beneficiary.id} value={beneficiary.id}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{beneficiary.name}</div>
                              <div className="text-xs text-gray-500">
                                {beneficiary.bankName} • {beneficiary.accountNumber.slice(-4)}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBeneficiary && (
                  <>
                    {/* Transfer Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="transferAmount">Amount (INR)</Label>
                      <Input
                        id="transferAmount"
                        type="number"
                        placeholder="Enter amount to transfer"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="Add a note for this transfer"
                        value={transferDescription}
                        onChange={(e) => setTransferDescription(e.target.value)}
                      />
                    </div>

                    {/* Transfer Summary */}
                    {canTransfer && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Transfer Summary</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>To:</span>
                              <span className="font-medium">
                                {beneficiaries.find(b => b.id === selectedBeneficiary)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bank:</span>
                              <span className="font-medium">
                                {beneficiaries.find(b => b.id === selectedBeneficiary)?.bankName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Amount:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(parseFloat(transferAmount))}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Transfer Button */}
                    <Button
                      onClick={handleBankTransfer}
                      disabled={!canTransfer || loading}
                      className="w-full h-12 text-lg"
                      size="lg"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing Transfer...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Transfer {formatCurrency(parseFloat(transferAmount || '0'))}
                        </div>
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Beneficiaries Added</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add a beneficiary to start transferring money to Indian bank accounts.
                </p>
                <Button variant="outline" onClick={() => alert('Add beneficiary feature coming soon!')}>
                  Add Beneficiary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Payment Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Pay utility bills instantly with your INR balance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Transfer to any Indian bank account using IFSC</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>No additional fees for bill payments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Real-time transaction updates</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
