import { generateTransactionId, generateMockInterestRate, calculateInterest } from './utils'

export interface FXQuote {
  from: string
  to: string
  rate: number
  timestamp: Date
  expiresAt: Date
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'transfer' | 'bill_payment' | 'interest'
  amount: number
  currency: string
  description: string
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
  metadata?: any
}

export interface AccountBalance {
  inr: number
  interestRate: number
  lastInterestUpdate: Date
}

export interface Beneficiary {
  id: string
  name: string
  accountNumber: string
  ifsc: string
  bankName: string
  verified: boolean
}

// Mock data storage
let accountBalance: AccountBalance = {
  inr: 25000,
  interestRate: 7.2,
  lastInterestUpdate: new Date()
}

let transactions: Transaction[] = [
  {
    id: generateTransactionId(),
    type: 'deposit',
    amount: 25000,
    currency: 'INR',
    description: 'Initial deposit from GBP',
    timestamp: new Date(Date.now() - 86400000 * 7), // 7 days ago
    status: 'completed',
    metadata: { fxRate: 103.45, gbpAmount: 241.50 }
  },
  {
    id: generateTransactionId(),
    type: 'interest',
    amount: 34.25,
    currency: 'INR',
    description: 'Daily interest accrual',
    timestamp: new Date(Date.now() - 86400000 * 1), // 1 day ago
    status: 'completed'
  },
  {
    id: generateTransactionId(),
    type: 'bill_payment',
    amount: 1500,
    currency: 'INR',
    description: 'Electricity bill payment',
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    status: 'completed',
    metadata: { biller: 'BSES Yamuna', billId: 'BY123456789' }
  }
]

let beneficiaries: Beneficiary[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    accountNumber: '1234567890',
    ifsc: 'SBIN0001234',
    bankName: 'State Bank of India',
    verified: true
  },
  {
    id: '2',
    name: 'Priya Sharma',
    accountNumber: '0987654321',
    ifsc: 'HDFC0000987',
    bankName: 'HDFC Bank',
    verified: true
  }
]

// Mock API functions
export const mockServices = {
  // FX Quotes
  async getFXQuote(from: string, to: string): Promise<FXQuote> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const baseRates: { [key: string]: number } = {
      'GBP-INR': 103.45,
      'USD-INR': 83.25,
      'EUR-INR': 90.15,
      'AUD-INR': 54.30,
      'CAD-INR': 61.20
    }
    
    const key = `${from}-${to}`
    const baseRate = baseRates[key] || 80.00
    const variation = 0.02 // ±2% variation
    const rate = baseRate * (1 + (Math.random() - 0.5) * variation)
    
    return {
      from,
      to,
      rate: parseFloat(rate.toFixed(4)),
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 300000) // 5 minutes
    }
  },

  // Account Balance
  async getAccountBalance(): Promise<AccountBalance> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Update interest if needed
    const now = new Date()
    const daysSinceUpdate = Math.floor((now.getTime() - accountBalance.lastInterestUpdate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceUpdate > 0) {
      const interest = calculateInterest(accountBalance.inr, accountBalance.interestRate, daysSinceUpdate)
      accountBalance.inr += interest
      accountBalance.lastInterestUpdate = now
      
      // Add interest transaction
      const interestTransaction: Transaction = {
        id: generateTransactionId(),
        type: 'interest',
        amount: interest,
        currency: 'INR',
        description: `Interest accrual for ${daysSinceUpdate} day${daysSinceUpdate > 1 ? 's' : ''}`,
        timestamp: now,
        status: 'completed'
      }
      transactions.unshift(interestTransaction)
    }
    
    return { ...accountBalance }
  },

  // Transactions
  async getTransactions(limit: number = 50): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return transactions.slice(0, limit)
  },

  async addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newTransaction: Transaction = {
      ...transaction,
      id: generateTransactionId(),
      timestamp: new Date()
    }
    
    transactions.unshift(newTransaction)
    
    // Update balance for non-interest transactions
    if (transaction.type !== 'interest') {
      if (transaction.type === 'deposit') {
        accountBalance.inr += transaction.amount
      } else {
        accountBalance.inr -= transaction.amount
      }
    }
    
    return newTransaction
  },

  // Beneficiaries
  async getBeneficiaries(): Promise<Beneficiary[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...beneficiaries]
  },

  async addBeneficiary(beneficiary: Omit<Beneficiary, 'id'>): Promise<Beneficiary> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      id: Date.now().toString(),
      verified: false // New beneficiaries need verification
    }
    
    beneficiaries.push(newBeneficiary)
    return newBeneficiary
  },

  // Bill Payment
  async payBill(billerName: string, billId: string, amount: number): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (accountBalance.inr < amount) {
      throw new Error('Insufficient balance')
    }
    
    const transaction = await this.addTransaction({
      type: 'bill_payment',
      amount,
      currency: 'INR',
      description: `Bill payment to ${billerName}`,
      status: 'completed',
      metadata: { biller: billerName, billId }
    })
    
    return transaction
  },

  // Transfer to Indian Bank
  async transferToBank(beneficiaryId: string, amount: number, description: string): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (accountBalance.inr < amount) {
      throw new Error('Insufficient balance')
    }
    
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId)
    if (!beneficiary) {
      throw new Error('Beneficiary not found')
    }
    
    const transaction = await this.addTransaction({
      type: 'transfer',
      amount,
      currency: 'INR',
      description: description || `Transfer to ${beneficiary.name}`,
      status: 'completed',
      metadata: { 
        beneficiaryId,
        beneficiaryName: beneficiary.name,
        accountNumber: beneficiary.accountNumber,
        ifsc: beneficiary.ifsc
      }
    })
    
    return transaction
  }
}

// Local storage helpers
export const storage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  setItem: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore storage errors
    }
  }
}
