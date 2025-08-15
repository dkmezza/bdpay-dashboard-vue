// Future API integration layer
export const useApi = () => {
  const baseURL = 'http://localhost:8080/api' // Your Spring Boot API
  
  const fetchAccounts = async () => {
    // This will connect to your Spring Boot backend later
    // For now, return mock data
    return {
      data: [
        {
          id: '1',
          title: 'Business account',
          amount: 24098.00,
          change: -0.90,
          changeType: 'down' as const,
          period: 'vs Last month'
        }
        // ... more mock data
      ]
    }
  }
  
  const fetchTransactions = async () => {
    // Mock data for now
    return {
      data: []
    }
  }
  
  return {
    fetchAccounts,
    fetchTransactions
  }
}