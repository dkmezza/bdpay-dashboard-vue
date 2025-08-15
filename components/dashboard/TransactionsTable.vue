<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <select 
          v-model="selectedPeriod"
          class="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="handlePeriodChange"
        >
          <option value="current">Current Month</option>
          <option value="last">Last Month</option>
          <option value="last3">Last 3 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>
    
    <!-- Table -->
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
            v-for="transaction in filteredTransactions" 
            :key="transaction.id" 
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Business Name with Icon -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium"
                  :class="getIconBackground(transaction.type)"
                >
                  <component :is="getTransactionIcon(transaction.type)" class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ transaction.businessName }}</div>
                  <div class="text-xs text-gray-500">{{ transaction.category }}</div>
                </div>
              </div>
            </td>
            
            <!-- Date -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(transaction.date) }}
            </td>
            
            <!-- Amount -->
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <span 
                :class="transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'"
              >
                {{ formatAmount(transaction.amount) }}
              </span>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClasses(transaction.status)"
              >
                {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
              </span>
            </td>
            
            <!-- Action Menu -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="relative">
                <button 
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                  @click="toggleActionMenu(transaction.id)"
                >
                  <EllipsisVerticalIcon class="w-5 h-5" />
                </button>
                
                <!-- Dropdown Menu -->
                <div 
                  v-if="activeMenu === transaction.id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                >
                  <div class="py-1">
                    <button 
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      @click="handleAction('view', transaction)"
                    >
                      View Details
                    </button>
                    <button 
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      @click="handleAction('download', transaction)"
                    >
                      Download Receipt
                    </button>
                    <button 
                      v-if="transaction.status === 'pending'"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      @click="handleAction('cancel', transaction)"
                    >
                      Cancel Transaction
                    </button>
                    <button 
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      @click="handleAction('delete', transaction)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="filteredTransactions.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-2">
        <DocumentTextIcon class="w-12 h-12 mx-auto" />
      </div>
      <h4 class="text-lg font-medium text-gray-900 mb-2">No transactions found</h4>
      <p class="text-gray-500">Try adjusting your date filter or check back later.</p>
    </div>

    <!-- Pagination footer -->
    <div class="px-6 py-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ Math.min(filteredTransactions.length, itemsPerPage) }} of {{ filteredTransactions.length }} transactions
        </div>
        <div class="flex space-x-2">
          <button 
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </button>
          <button 
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            Next
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
  HomeIcon,
  ShoppingCartIcon,
  BuildingOfficeIcon,
  GiftIcon
} from '@heroicons/vue/24/outline'

interface Transaction {
  id: string
  businessName: string
  category: string
  date: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  type: 'income' | 'expense'
}

// Component state
const selectedPeriod = ref('current')
const activeMenu = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Sample transactions data - matches the original design
const transactions: Transaction[] = [
  {
    id: '1',
    businessName: 'Gym Payment',
    category: 'Health & Fitness',
    date: '2022-07-29',
    amount: 300.00,
    status: 'pending',
    type: 'expense'
  },
  {
    id: '2', 
    businessName: 'Al-Bank Deposit',
    category: 'Banking',
    date: '2022-07-27',
    amount: 890.00,
    status: 'success',
    type: 'income'
  },
  {
    id: '3',
    businessName: 'Facebook Ads Payment',
    category: 'Marketing',
    date: '2022-07-19',
    amount: 123.00,
    status: 'failed',
    type: 'expense'
  },
  {
    id: '4',
    businessName: 'Freelance Project',
    category: 'Income',
    date: '2022-07-25',
    amount: 1500.00,
    status: 'success',
    type: 'income'
  },
  {
    id: '5',
    businessName: 'Grocery Shopping',
    category: 'Food & Dining',
    date: '2022-07-24',
    amount: 85.50,
    status: 'success',
    type: 'expense'
  },
  {
    id: '6',
    businessName: 'Office Rent',
    category: 'Business',
    date: '2022-07-20',
    amount: 1200.00,
    status: 'success',
    type: 'expense'
  }
]

// Computed properties
const filteredTransactions = computed(() => {
  // Later we'll filter by selectedPeriod here
  return transactions
})

const totalPages = computed(() => 
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
)

// Helper functions
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getStatusClasses = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800', 
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getIconBackground = (type: string) => {
  return type === 'income' 
    ? 'bg-green-100 text-green-600'
    : 'bg-orange-100 text-orange-600'
}

const getTransactionIcon = (type: string) => {
  const iconMap = {
    income: BanknotesIcon,
    expense: ShoppingCartIcon
  }
  return iconMap[type as keyof typeof iconMap] || DocumentTextIcon
}

// Event handlers
const handlePeriodChange = () => {
  console.log(`Period changed to: ${selectedPeriod.value}`)
  // Later we'll fetch filtered data here
}

const toggleActionMenu = (transactionId: string) => {
  activeMenu.value = activeMenu.value === transactionId ? null : transactionId
}

const handleAction = (action: string, transaction: Transaction) => {
  console.log(`Action: ${action} for transaction:`, transaction)
  activeMenu.value = null
  
  // Handle different actions
  switch (action) {
    case 'view':
      // Open transaction details modal
      break
    case 'download':
      // Download receipt
      break
    case 'cancel':
      // Cancel pending transaction
      break
    case 'delete':
      // Delete transaction (with confirmation)
      break
  }
}

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      activeMenu.value = null
    }
  })
})
</script>
