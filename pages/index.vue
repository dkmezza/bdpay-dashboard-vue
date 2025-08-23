<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Enhanced Top Navigation with working logout -->
    <TopNavigation 
      :page-title="'Dashboard'"
      :user-name="user?.fullName || 'Loading...'"
      :user-email="user?.email || ''"
      @logout="handleLogout"
    />

    <div class="flex">
      <!-- Enhanced Sidebar -->
      <Sidebar />

      <!-- Main content -->
      <main class="flex-1 p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-center">
            <div class="text-red-600 mr-3">⚠️</div>
            <div>
              <h3 class="text-red-800 font-medium">Error loading dashboard</h3>
              <p class="text-red-700 text-sm">{{ error }}</p>
              <button 
                @click="loadDashboardData"
                class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else>
          <!-- Account Cards Section with real data -->
          <AccountCardsSection :user-id="user?.id" />

          <!-- Main dashboard content -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <!-- Money Flow Chart with real data -->
            <div class="xl:col-span-2">
              <MoneyFlowChart :user-id="user?.id" />
            </div>

            <!-- Statistics Card with real data -->
            <div>
              <StatisticsCard :user-id="user?.id" @action="handleStatisticsAction" />
            </div>
          </div>

          <!-- Recent Transactions Table with real data -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <select 
                  v-model="selectedPeriod"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  @change="loadTransactions"
                >
                  <option value="current">Current Month</option>
                  <option value="last">Last Month</option>
                  <option value="last3">Last 3 Months</option>
                </select>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="transaction in transactions" 
                    :key="transaction.id" 
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div 
                          class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium"
                          :class="getIconBackground(transaction.transactionType)"
                        >
                          <component :is="getTransactionIcon(transaction.transactionType)" class="w-4 h-4" />
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ transaction.businessName }}</div>
                          <div class="text-xs text-gray-500">{{ transaction.category }}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(transaction.transactionDate) }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span 
                        :class="transaction.transactionType === 'INCOME' ? 'text-green-600' : 'text-gray-900'"
                      >
                        {{ transaction.transactionType === 'INCOME' ? '+' : '' }}${{ parseFloat(transaction.amount).toLocaleString() }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusClasses(transaction.status)"
                      >
                        {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1).toLowerCase() }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        class="text-gray-400 hover:text-gray-600 transition-colors"
                        @click="handleTransactionAction(transaction.id)"
                      >
                        <EllipsisVerticalIcon class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty state -->
            <div v-if="transactions.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-2">
                <DocumentTextIcon class="w-12 h-12 mx-auto" />
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">No transactions found</h4>
              <p class="text-gray-500">Your recent transactions will appear here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Logout Confirmation Modal (optional) -->
    <div 
      v-if="showLogoutConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
        <p class="text-gray-600 mb-4">Are you sure you want to logout from your account?</p>
        <div class="flex space-x-3">
          <button
            @click="confirmLogout"
            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
          <button
            @click="cancelLogout"
            class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  EllipsisVerticalIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline'

// Protect this route
definePageMeta({
  middleware: 'auth'
})

// Explicit imports
import TopNavigation from '~/components/navigation/TopNavigation.vue'
import Sidebar from '~/components/navigation/Sidebar.vue'
import AccountCardsSection from '~/components/dashboard/AccountCardsSection.vue'
import MoneyFlowChart from '~/components/dashboard/MoneyFlowChart.vue'
import StatisticsCard from '~/components/dashboard/StatisticsCard.vue'

const { user, logout } = useAuth()
const { 
  fetchRecentTransactions 
} = useApi()

// Types for API responses
interface Account {
  id: number
  accountName: string
  accountType: string
  currentBalance: string
  previousBalance: string
  percentageChange: number
}

interface Transaction {
  id: number
  businessName: string
  category: string
  amount: string
  transactionType: 'INCOME' | 'EXPENSE'
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  description: string
  transactionDate: string
  accountId: number
}

// Reactive data
const loading = ref(true)
const error = ref('')
const transactions = ref<Transaction[]>([])
const selectedPeriod = ref('current')

// Logout confirmation
const showLogoutConfirm = ref(false)

// Load all dashboard data
const loadDashboardData = async () => {
  if (!user.value?.id) return

  loading.value = true
  error.value = ''

  try {
    // Load transactions
    await loadTransactions()

  } catch (err: any) {
    console.error('Error loading dashboard:', err)
    error.value = err.message || 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

// Load transactions
const loadTransactions = async () => {
  if (!user.value?.id) return

  try {
    const response = await fetchRecentTransactions(user.value.id)
    transactions.value = response.transactions || []
  } catch (err: any) {
    console.error('Error loading transactions:', err)
  }
}

// Helper functions
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const getStatusClasses = (status: string) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    SUCCESS: 'bg-green-100 text-green-800', 
    FAILED: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getIconBackground = (type: string) => {
  return type === 'INCOME' 
    ? 'bg-green-100 text-green-600'
    : 'bg-orange-100 text-orange-600'
}

const getTransactionIcon = (type: string) => {
  return type === 'INCOME' ? BanknotesIcon : ShoppingCartIcon
}

const handleTransactionAction = (transactionId: number) => {
  console.log(`Action for transaction: ${transactionId}`)
  // Implement transaction actions (view, edit, delete)
}

const handleStatisticsAction = (action: string) => {
  console.log(`Statistics action: ${action}`)
  // Handle statistics card actions
  switch (action) {
    case 'send':
      // Navigate to send money page or open modal
      break
    case 'receive':
      // Navigate to receive money page or open modal
      break
    case 'invoicing':
      // Navigate to invoicing page
      break
    case 'more':
      // Show more options menu
      break
  }
}

// Logout handling
const handleLogout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = async () => {
  showLogoutConfirm.value = false
  try {
    await logout()
    console.log('✅ User logged out successfully')
  } catch (error) {
    console.error('❌ Logout error:', error)
  }
}

const cancelLogout = () => {
  showLogoutConfirm.value = false
}

// Load data on mount
onMounted(() => {
  if (user.value) {
    loadDashboardData()
  }
})

// Set page title
useHead({
  title: 'Dashboard - BDPay'
})

console.log('🎉 Dashboard loaded with working logout functionality!')
</script>