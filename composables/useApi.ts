// Types for API responses
interface AccountsResponse {
  accounts: Array<{
    id: number
    accountName: string
    accountType: string
    currentBalance: string
    previousBalance: string
    percentageChange: number
  }>
  totalBalance: number
}

interface TransactionsResponse {
  transactions: Array<{
    id: number
    businessName: string
    category: string
    amount: string
    transactionType: 'INCOME' | 'EXPENSE'
    status: 'PENDING' | 'SUCCESS' | 'FAILED'
    description: string
    transactionDate: string
    accountId: number
  }>
}

interface ChartDataResponse {
  income: number[]
  expense: number[]
  months: string[]
}

interface StatisticsResponse {
  categories: Array<{
    category: string
    amount: number
  }>
  total: number
}

// Extended User type for profile management
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  fullName: string
  createdAt?: string
  updatedAt?: string
}

export const useApi = () => {
  const { token } = useAuth()

  // Create authenticated fetch wrapper
  const authenticatedFetch = async <T>(url: string, options: any = {}): Promise<T> => {
    if (!token.value) {
      throw new Error('No authentication token')
    }

    return await $fetch<T>(url, {
      baseURL: 'http://localhost:8080/api',
      headers: {
        Authorization: `Bearer ${token.value}`,
        ...options.headers
      },
      ...options
    })
  }

  // Account API calls
  const fetchAccounts = async (userId: number): Promise<AccountsResponse> => {
    return await authenticatedFetch<AccountsResponse>(`/accounts/user/${userId}`)
  }

  const fetchWalletAccount = async (userId: number) => {
    return await authenticatedFetch(`/accounts/wallet/user/${userId}`)
  }

  const createAccount = async (userId: number, accountData: any) => {
    // Backend expects: { accountName, accountType, initialBalance }
    return await authenticatedFetch(`/accounts/user/${userId}`, {
      method: 'POST',
      body: {
        accountName: accountData.accountName,
        accountType: accountData.accountType,
        initialBalance: accountData.initialBalance
      }
    })
  }

  const updateAccount = async (accountId: number, accountData: any) => {
    // Use the full account update endpoint
    return await authenticatedFetch(`/accounts/${accountId}`, {
      method: 'PUT',
      body: {
        accountName: accountData.accountName,
        currentBalance: accountData.currentBalance,
        spendingLimit: accountData.spendingLimit,
        totalLimit: accountData.totalLimit,
        cardType: accountData.cardType
      }
    })
  }

  const deleteAccount = async (accountId: number) => {
    return await authenticatedFetch(`/accounts/${accountId}`, {
      method: 'DELETE'
    })
  }

  // Transaction API calls
  const fetchRecentTransactions = async (userId: number): Promise<TransactionsResponse> => {
    return await authenticatedFetch<TransactionsResponse>(`/transactions/recent/user/${userId}`)
  }

  const fetchTransactions = async (userId: number, page = 0, size = 10) => {
    return await authenticatedFetch(`/transactions/user/${userId}?page=${page}&size=${size}`)
  }

  const fetchChartData = async (userId: number, year?: number): Promise<ChartDataResponse> => {
    const yearParam = year ? `?year=${year}` : ''
    return await authenticatedFetch<ChartDataResponse>(`/transactions/chart/user/${userId}${yearParam}`)
  }

  const fetchStatistics = async (userId: number): Promise<StatisticsResponse> => {
    return await authenticatedFetch<StatisticsResponse>(`/transactions/statistics/user/${userId}`)
  }

  // Transaction actions
  const createTransaction = async (transactionData: any) => {
    return await authenticatedFetch('/transactions', {
      method: 'POST',
      body: transactionData
    })
  }

  const updateTransactionStatus = async (transactionId: number, status: string) => {
    return await authenticatedFetch(`/transactions/${transactionId}/status`, {
      method: 'PUT',
      body: { status }
    })
  }

  const deleteTransaction = async (transactionId: number) => {
    return await authenticatedFetch(`/transactions/${transactionId}`, {
      method: 'DELETE'
    })
  }

  // User profile API calls
  const updateUserProfile = async (userId: number, profileData: { firstName: string, lastName: string }) => {
    return await authenticatedFetch(`/users/${userId}`, {
      method: 'PUT',
      body: profileData
    })
  }

  const changeUserPassword = async (userId: number, passwordData: { currentPassword: string, newPassword: string }) => {
    return await authenticatedFetch(`/users/${userId}/password`, {
      method: 'PUT', 
      body: passwordData
    })
  }

  const uploadUserAvatar = async (userId: number, formData: FormData) => {
    return await authenticatedFetch(`/users/${userId}/avatar`, {
      method: 'POST',
      body: formData
    })
  }

  return {
    fetchAccounts,
    fetchWalletAccount,
    createAccount,
    updateAccount,
    deleteAccount,
    fetchRecentTransactions,
    fetchTransactions,
    fetchChartData,
    fetchStatistics,
    createTransaction,
    updateTransactionStatus,
    deleteTransaction,
    updateUserProfile,
    changeUserPassword,
    uploadUserAvatar
  }
}