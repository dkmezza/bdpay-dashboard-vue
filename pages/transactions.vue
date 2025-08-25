<script setup lang="ts">
import {
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CheckIcon,
  BanknotesIcon,
  ShoppingCartIcon,
} from '@heroicons/vue/24/outline'

// Protect this route
definePageMeta({ middleware: 'auth' })

// Imports
import TopNavigation from '~/components/navigation/TopNavigation.vue'
import Sidebar from '~/components/navigation/Sidebar.vue'

// Composables
const { user, logout } = useAuth()
const {
  fetchAccounts,
  fetchTransactions,
  createTransaction,
  updateTransactionStatus: updateStatus,
  deleteTransaction: deleteTransactionApi,
} = useApi()

// Types
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

interface Account {
  id: number
  accountName: string
  currentBalance: string
}

// Component state
const loading = ref(true)
const error = ref('')
const transactions = ref<Transaction[]>([])
const accounts = ref<Account[]>([])
const showTransactionModal = ref(false)
const isEditMode = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const formError = ref('')
const activeTransactionMenu = ref<number | null>(null)
const showDeleteConfirm = ref(false)
const transactionToDelete = ref<Transaction | null>(null)
const successMessage = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const totalTransactions = ref(0)
const totalPages = ref(1)

// Filters
const filters = reactive({
  type: '',
  status: '',
  category: '',
  search: '',
})

// Form data
const transactionForm = reactive({
  id: null as number | null,
  accountId: '' as string | number,
  businessName: '',
  category: '',
  transactionType: 'EXPENSE' as 'INCOME' | 'EXPENSE',
  amount: '',
  description: '',
})

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadTransactions()
  }, 500)
}

// Computed
const hasFilters = computed(
  () => !!(filters.type || filters.status || filters.category || filters.search),
)

// Helpers
const formatCurrency = (amount: string | number) => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  if (Number.isNaN(value)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const getStatusClasses = (status: string) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    SUCCESS: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getTransactionTypeStyle = (type: string) =>
  type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'

const getTransactionIcon = (type: string) =>
  type === 'INCOME' ? BanknotesIcon : ShoppingCartIcon

// Mock data so the table renders before backend is wired
const mockTransactions: Transaction[] = [
  {
    id: 1,
    businessName: 'Netflix',
    category: 'Entertainment',
    amount: '15.99',
    transactionType: 'EXPENSE',
    status: 'SUCCESS',
    description: 'Monthly subscription',
    transactionDate: new Date().toISOString(),
    accountId: 1,
  },
  {
    id: 2,
    businessName: 'Stripe Payout',
    category: 'Business',
    amount: '420.00',
    transactionType: 'INCOME',
    status: 'PENDING',
    description: 'August revenue',
    transactionDate: new Date().toISOString(),
    accountId: 1,
  },
]

// Loaders
const loadAccounts = async () => {
  if (!user.value?.id) return
  try {
    const response = await fetchAccounts(user.value.id)
    accounts.value = response?.accounts || []
  } catch (err) {
    console.error('Error loading accounts:', err)
  }
}

const applyClientFilters = (rows: Transaction[]) => {
  let filtered = rows
  if (filters.type) filtered = filtered.filter(t => t.transactionType === filters.type)
  if (filters.status) filtered = filtered.filter(t => t.status === filters.status)
  if (filters.category) filtered = filtered.filter(t => t.category === filters.category)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      t =>
        t.businessName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    )
  }
  return filtered
}

const loadTransactions = async () => {
  if (!user.value?.id) return
  loading.value = true
  error.value = ''

  try {
    // In real implementation, pass filters/page to backend:
    // const response = await fetchTransactions(user.value.id, currentPage.value - 1, pageSize.value, filters)
    // const rows: Transaction[] = response?.transactions ?? []
    // For now, use mock and pretend this is the response:
    const rows: Transaction[] = mockTransactions

    const filtered = applyClientFilters(rows)
    transactions.value = filtered
    totalTransactions.value = filtered.length
    totalPages.value = Math.max(1, Math.ceil(totalTransactions.value / pageSize.value))
  } catch (err) {
    console.error('Error loading transactions:', err)
    error.value = 'Failed to load transactions.'
  } finally {
    loading.value = false
  }
}

// Template handlers
const handleLogout = () => logout()

const openCreateModal = () => {
  isEditMode.value = false
  transactionForm.id = null
  transactionForm.accountId = ''
  transactionForm.businessName = ''
  transactionForm.category = ''
  transactionForm.transactionType = 'EXPENSE'
  transactionForm.amount = ''
  transactionForm.description = ''
  formError.value = ''
  showTransactionModal.value = true
}

const closeTransactionModal = () => {
  showTransactionModal.value = false
  formError.value = ''
}

const toggleTransactionMenu = (id: number) => {
  activeTransactionMenu.value = activeTransactionMenu.value === id ? null : id
}

const editTransaction = (t: Transaction) => {
  isEditMode.value = true
  transactionForm.id = t.id
  transactionForm.accountId = t.accountId
  transactionForm.businessName = t.businessName
  transactionForm.category = t.category
  transactionForm.transactionType = t.transactionType
  transactionForm.amount = t.amount
  transactionForm.description = t.description
  showTransactionModal.value = true
}

const updateTransactionStatus = async (
  id: number,
  s: 'SUCCESS' | 'FAILED',
) => {
  try {
    await updateStatus(id, s)
    successMessage.value = `Transaction marked ${s.toLowerCase()}`
    setTimeout(() => (successMessage.value = ''), 2000)
    await loadTransactions()
  } catch (err) {
    console.error('Failed to update status', err)
  } finally {
    activeTransactionMenu.value = null
  }
}

const confirmDeleteTransaction = (t: Transaction) => {
  transactionToDelete.value = t
  showDeleteConfirm.value = true
  activeTransactionMenu.value = null
}

const cancelDelete = () => {
  transactionToDelete.value = null
  showDeleteConfirm.value = false
}

const deleteTransaction = async () => {
  if (!transactionToDelete.value) return
  try {
    isDeleting.value = true
    await deleteTransactionApi(transactionToDelete.value.id)
    successMessage.value = 'Transaction deleted'
    setTimeout(() => (successMessage.value = ''), 2000)
    await loadTransactions()
  } catch (err) {
    console.error('Delete failed', err)
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
    transactionToDelete.value = null
  }
}

const saveTransaction = async () => {
  formError.value = ''
  isSaving.value = true
  try {
    const payload = {
      accountId: Number(transactionForm.accountId),
      businessName: transactionForm.businessName.trim(),
      category: transactionForm.category,
      transactionType: transactionForm.transactionType,
      amount: parseFloat(transactionForm.amount), // ✅ Converting to number
      description: transactionForm.description,
    }

    if (!payload.accountId) throw new Error('Please select an account.')

    if (isEditMode.value && transactionForm.id) {
      await createTransaction({ id: transactionForm.id, ...payload })
      successMessage.value = 'Transaction updated'
    } else {
      await createTransaction(payload)
      successMessage.value = 'Transaction created'
    }
    setTimeout(() => (successMessage.value = ''), 2000)

    showTransactionModal.value = false
    await loadTransactions()
  } catch (err: any) {
    console.error('Transaction save error:', err) // ✅ Will add better error logging
    formError.value = err?.message || 'Failed to save transaction.'
  } finally {
    isSaving.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadTransactions()
  }
}
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadTransactions()
  }
}

// Init
onMounted(async () => {
  await loadAccounts()
  await loadTransactions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <TopNavigation
      page-title="Transactions"
      :user-name="user?.fullName || 'Loading...'"
      :user-email="user?.email || ''"
      @logout="handleLogout"
    />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main content -->
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
              <p class="text-gray-600">Manage your financial transactions</p>
            </div>
            <button
              @click="openCreateModal"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon class="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
          </div>

          <!-- Filters -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div class="flex flex-wrap items-center gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  v-model="filters.type"
                  @change="loadTransactions"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="filters.status"
                  @change="loadTransactions"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  v-model="filters.category"
                  @change="loadTransactions"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Banking">Banking</option>
                  <option value="Business">Business</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  v-model="filters.search"
                  @input="debounceSearch"
                  type="text"
                  placeholder="Search transactions..."
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
              ></div>
              <p class="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 class="text-red-800 font-medium">Error loading transactions</h3>
                <p class="text-red-700 text-sm">{{ error }}</p>
                <button
                  @click="loadTransactions"
                  class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="transactions.length === 0" class="text-center py-12">
            <div
              class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <DocumentTextIcon class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p class="text-gray-500 mb-6">
              {{ hasFilters ? 'Try adjusting your filters' : 'Get started by creating your first transaction' }}
            </p>
            <button
              @click="openCreateModal"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Transaction
            </button>
          </div>

          <!-- Transactions Table -->
          <div
            v-else
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="transaction in transactions"
                    :key="transaction.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <!-- Business Name -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium"
                          :class="getTransactionTypeStyle(transaction.transactionType)"
                        >
                          <component
                            :is="getTransactionIcon(transaction.transactionType)"
                            class="w-4 h-4"
                          />
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ transaction.businessName }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ transaction.description }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Category -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                      >
                        {{ transaction.category }}
                      </span>
                    </td>

                    <!-- Amount -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        :class="transaction.transactionType === 'INCOME' ? 'text-green-600' : 'text-gray-900'"
                      >
                        {{ transaction.transactionType === 'INCOME' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                      </span>
                    </td>

                    <!-- Type -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="transaction.transactionType === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ transaction.transactionType }}
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusClasses(transaction.status)"
                      >
                        {{ transaction.status }}
                      </span>
                    </td>

                    <!-- Date -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(transaction.transactionDate) }}
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="relative">
                        <button
                          @click="toggleTransactionMenu(transaction.id)"
                          class="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <EllipsisVerticalIcon class="w-5 h-5" />
                        </button>

                        <!-- Dropdown Menu -->
                        <div
                          v-if="activeTransactionMenu === transaction.id"
                          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                        >
                          <button
                            @click="editTransaction(transaction)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <PencilIcon class="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            v-if="transaction.status === 'PENDING'"
                            @click="updateTransactionStatus(transaction.id, 'SUCCESS')"
                            class="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                          >
                            <CheckIcon class="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            v-if="transaction.status === 'PENDING'"
                            @click="updateTransactionStatus(transaction.id, 'FAILED')"
                            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <XMarkIcon class="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <hr class="my-1" />
                          <button
                            @click="confirmDeleteTransaction(transaction)"
                            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <TrashIcon class="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                  Showing {{ Math.min(transactions.length, pageSize) }} of
                  {{ totalTransactions }} transactions
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage >= totalPages"
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Transaction Modal -->
    <div
      v-if="showTransactionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? 'Edit Transaction' : 'Create New Transaction' }}
          </h3>
          <button @click="closeTransactionModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="saveTransaction" class="space-y-4">
          <!-- Account Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Account</label>
            <select
              v-model="transactionForm.accountId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select account</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.accountName }} ({{ formatCurrency(account.currentBalance) }})
              </option>
            </select>
          </div>

          <!-- Business Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              v-model="transactionForm.businessName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter business name"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="transactionForm.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select category</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Marketing">Marketing</option>
              <option value="Banking">Banking</option>
              <option value="Business">Business</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>

          <!-- Transaction Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="transactionForm.transactionType"
                  type="radio"
                  value="INCOME"
                  class="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">Income</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="transactionForm.transactionType"
                  type="radio"
                  value="EXPENSE"
                  class="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">Expense</span>
              </label>
            </div>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              v-model="transactionForm.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              v-model="transactionForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter transaction description"
            />
          </div>

          <!-- Error Message -->
          <div v-if="formError" class="text-red-600 text-sm">{{ formError }}</div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeTransactionModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Transaction' : 'Create Transaction') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-sm w-full p-6">
        <div class="text-center">
          <ExclamationTriangleIcon class="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Transaction</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <div class="flex items-center justify-center space-x-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="deleteTransaction"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete Transaction' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {{ successMessage }}
    </div>
  </div>
</template>
