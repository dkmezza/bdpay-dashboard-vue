export interface Account {
  id: string
  title: string
  amount: number
  change: number
  changeType: 'up' | 'down'
  period: string
}

export interface Transaction {
  id: string
  businessName: string
  date: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  type: 'payment' | 'deposit'
  icon?: string
}

export interface WalletInfo {
  id: string
  ownerName: string
  balance: number
  spendingLimit: number
  usedAmount: number
  cardType: 'VISA' | 'MASTERCARD'
}

export interface ChartData {
  name: string
  income: number
  expense: number
}

export interface StatisticItem {
  label: string
  amount: number
  color: string
  percentage: number
}