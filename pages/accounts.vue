<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <TopNavigation 
      page-title="My Accounts"
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
              <h1 class="text-2xl font-bold text-gray-900">My Accounts</h1>
              <p class="text-gray-600">Manage your financial accounts</p>
            </div>
            <button
              @click="openCreateModal"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon class="w-5 h-5" />
              <span>Add Account</span>
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">Loading accounts...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 class="text-red-800 font-medium">Error loading accounts</h3>
                <p class="text-red-700 text-sm">{{ error }}</p>
                <button 
                  @click="loadAccounts"
                  class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="accounts.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <WalletIcon class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
            <p class="text-gray-500 mb-6">Get started by creating your first account</p>
            <button
              @click="openCreateModal"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          </div>

          <!-- Accounts Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="account in accounts" 
              :key="account.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <!-- Account Header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                       :class="getAccountTypeStyle(account.accountType)">
                    <component :is="getAccountIcon(account.accountType)" class="w-5 h-5" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ account.accountName }}</h3>
                    <p class="text-sm text-gray-500">{{ formatAccountType(account.accountType) }}</p>
                  </div>
                </div>
                
                <!-- Actions Dropdown -->
                <div class="relative">
                  <button 
                    @click="toggleAccountMenu(account.id)"
                    class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <EllipsisVerticalIcon class="w-5 h-5" />
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div 
                    v-if="activeAccountMenu === account.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                  >
                    <button
                      @click="editAccount(account)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <PencilIcon class="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      @click="viewAccountDetails(account)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <EyeIcon class="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <hr class="my-1">
                    <button
                      @click="confirmDeleteAccount(account)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <TrashIcon class="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Balance -->
              <div class="mb-4">
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatCurrency(account.currentBalance) }}
                </p>
                <div class="flex items-center mt-1" v-if="account.percentageChange !== undefined">
                  <component 
                    :is="account.percentageChange >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" 
                    class="w-4 h-4 mr-1"
                    :class="account.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'"
                  />
                  <span 
                    class="text-sm font-medium"
                    :class="account.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ Math.abs(account.percentageChange) }}%
                  </span>
                  <span class="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>

              <!-- Account Details -->
              <div class="space-y-2">
                <div v-if="account.accountType === 'WALLET'" class="text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Spending Limit:</span>
                    <span class="text-gray-900">{{ formatCurrency(account.spendingLimit || '0') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Total Limit:</span>
                    <span class="text-gray-900">{{ formatCurrency(account.totalLimit || '0') }}</span>
                  </div>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Created:</span>
                  <span class="text-gray-900">{{ formatDate(account.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Account Modal -->
    <div 
      v-if="showAccountModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? 'Edit Account' : 'Create New Account' }}
          </h3>
          <button @click="closeAccountModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="saveAccount" class="space-y-4">
          <!-- Account Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
            <input
              v-model="accountForm.accountName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter account name"
            />
          </div>

          <!-- Account Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              v-model="accountForm.accountType"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select account type</option>
              <option value="BUSINESS">Business Account</option>
              <option value="TAX_RESERVE">Tax Reserve</option>
              <option value="SAVINGS">Savings</option>
              <option value="WALLET">Wallet</option>
            </select>
          </div>

          <!-- Initial Balance -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ isEditMode ? 'Current Balance' : 'Initial Balance' }}
            </label>
            <input
              v-model="accountForm.currentBalance"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <!-- Wallet-specific fields -->
          <div v-if="accountForm.accountType === 'WALLET'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Spending Limit</label>
              <input
                v-model="accountForm.spendingLimit"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Limit</label>
              <input
                v-model="accountForm.totalLimit"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
              <select
                v-model="accountForm.cardType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="VISA">VISA</option>
                <option value="MASTERCARD">MASTERCARD</option>
                <option value="AMEX">American Express</option>
              </select>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="formError" class="text-red-600 text-sm">{{ formError }}</div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeAccountModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Account' : 'Create Account') }}
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
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Account</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete "{{ accountToDelete?.accountName }}"? This action cannot be undone.
          </p>
          <div class="flex items-center justify-center space-x-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteAccount"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete Account' }}
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


<script setup lang="ts">
import { 
  PlusIcon, 
  EllipsisVerticalIcon, 
  PencilIcon, 
  EyeIcon, 
  TrashIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'

// Protect this route
definePageMeta({
  middleware: 'auth'
})

// Imports
import TopNavigation from '~/components/navigation/TopNavigation.vue'
import Sidebar from '~/components/navigation/Sidebar.vue'

// Composables
const { user, logout } = useAuth()
const { 
  fetchAccounts, 
  createAccount, 
  updateAccount, 
  deleteAccount: deleteAccountApi  // ✅ Fix #2 & #4: Rename to avoid conflict
} = useApi()

// Types
interface Account {
  id: number
  accountName: string
  accountType: string
  currentBalance: string
  previousBalance?: string
  percentageChange?: number
  spendingLimit?: string
  totalLimit?: string
  cardType?: string
  cardNumber?: string
  createdAt?: string
  updatedAt?: string
}

// Component state
const loading = ref(true)
const error = ref('')
const accounts = ref<Account[]>([])
const showAccountModal = ref(false)
const isEditMode = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const formError = ref('')
const activeAccountMenu = ref<number | null>(null)
const showDeleteConfirm = ref(false)
const accountToDelete = ref<Account | null>(null)
const successMessage = ref('')

// Form data
const accountForm = reactive({
  id: null as number | null,
  accountName: '',
  accountType: '',
  currentBalance: '',
  spendingLimit: '',
  totalLimit: '',
  cardType: 'VISA'
})

// Helper functions
const formatCurrency = (amount: string | number) => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatAccountType = (type: string) => {
  const types = {
    'BUSINESS': 'Business Account',
    'TAX_RESERVE': 'Tax Reserve',
    'SAVINGS': 'Savings',
    'WALLET': 'Wallet'
  }
  return types[type as keyof typeof types] || type
}

const getAccountTypeStyle = (type: string) => {
  const styles = {
    'BUSINESS': 'bg-blue-100 text-blue-600',
    'TAX_RESERVE': 'bg-orange-100 text-orange-600',
    'SAVINGS': 'bg-green-100 text-green-600',
    'WALLET': 'bg-purple-100 text-purple-600'
  }
  return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-600'
}

const getAccountIcon = (type: string) => {
  const icons = {
    'BUSINESS': BuildingOffice2Icon,
    'TAX_RESERVE': BanknotesIcon,
    'SAVINGS': BanknotesIcon,
    'WALLET': CreditCardIcon
  }
  return icons[type as keyof typeof icons] || WalletIcon
}

// Load accounts
const loadAccounts = async () => {
  if (!user.value?.id) return

  loading.value = true
  error.value = ''

  try {
    const response = await fetchAccounts(user.value.id)
    accounts.value = response.accounts || []
  } catch (err: any) {
    console.error('Error loading accounts:', err)
    error.value = err.message || 'Failed to load accounts'
  } finally {
    loading.value = false
  }
}

// Modal functions
const openCreateModal = () => {
  isEditMode.value = false
  resetForm()
  showAccountModal.value = true
}

const editAccount = (account: Account) => {
  isEditMode.value = true
  accountForm.id = account.id
  accountForm.accountName = account.accountName
  accountForm.accountType = account.accountType
  accountForm.currentBalance = account.currentBalance
  accountForm.spendingLimit = account.spendingLimit || ''
  accountForm.totalLimit = account.totalLimit || ''
  accountForm.cardType = account.cardType || 'VISA'
  showAccountModal.value = true
  activeAccountMenu.value = null
}

const closeAccountModal = () => {
  showAccountModal.value = false
  resetForm()
}

const resetForm = () => {
  accountForm.id = null
  accountForm.accountName = ''
  accountForm.accountType = ''
  accountForm.currentBalance = ''
  accountForm.spendingLimit = ''
  accountForm.totalLimit = ''
  accountForm.cardType = 'VISA'
  formError.value = ''
}

// CRUD operations
const saveAccount = async () => {
  if (!user.value?.id) return

  isSaving.value = true
  formError.value = ''

  try {
    if (isEditMode.value && accountForm.id) {
      // ✅ FIX: Type assertion for updateAccount response
      const updateData = {
        accountName: accountForm.accountName,
        currentBalance: parseFloat(accountForm.currentBalance),
        spendingLimit: accountForm.spendingLimit ? parseFloat(accountForm.spendingLimit) : null,
        totalLimit: accountForm.totalLimit ? parseFloat(accountForm.totalLimit) : null,
        cardType: accountForm.cardType
      }
      
      const updatedAccount = await updateAccount(accountForm.id, updateData) as Account
      
      // Update local state with response from backend
      const index = accounts.value.findIndex(a => a.id === accountForm.id)
      if (index !== -1) {
        accounts.value[index] = updatedAccount
      }
      
      showSuccessMessage('Account updated successfully!')
    } else {
      // ✅ FIX: Type assertion for createAccount response
      const createData = {
        accountName: accountForm.accountName,
        accountType: accountForm.accountType,
        initialBalance: parseFloat(accountForm.currentBalance),
        // Wallet-specific fields
        ...(accountForm.accountType === 'WALLET' && {
          spendingLimit: accountForm.spendingLimit ? parseFloat(accountForm.spendingLimit) : null,
          totalLimit: accountForm.totalLimit ? parseFloat(accountForm.totalLimit) : null,
          cardType: accountForm.cardType
        })
      }
      
      const newAccount = await createAccount(user.value.id, createData) as Account
      
      // Add the new account returned from backend to local state
      accounts.value.push(newAccount)
      showSuccessMessage('Account created successfully!')
    }

    closeAccountModal()
  } catch (err: any) {
    console.error('Error saving account:', err)
    formError.value = err.message || 'Failed to save account'
  } finally {
    isSaving.value = false
  }
}

const confirmDeleteAccount = (account: Account) => {
  accountToDelete.value = account
  showDeleteConfirm.value = true
  activeAccountMenu.value = null
}

// ✅ Fix #1, #2, #4: Renamed function and fixed parameter type
const handleDeleteAccount = async () => {
  if (!accountToDelete.value) return

  isDeleting.value = true

  try {
    // Call the API to delete the account
    await deleteAccountApi(accountToDelete.value.id)
    
    // Remove from local state
    accounts.value = accounts.value.filter(a => a.id !== accountToDelete.value!.id)
    showSuccessMessage('Account deleted successfully!')
    cancelDelete()
  } catch (err: any) {
    console.error('Error deleting account:', err)
    formError.value = 'Failed to delete account'
  } finally {
    isDeleting.value = false
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  accountToDelete.value = null
}

// Menu functions
const toggleAccountMenu = (accountId: number) => {
  activeAccountMenu.value = activeAccountMenu.value === accountId ? null : accountId
}

const viewAccountDetails = (account: Account) => {
  console.log('View account details:', account)
  activeAccountMenu.value = null
  // Navigate to account details page or show modal
}

// Utility functions
const showSuccessMessage = (message: string) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const handleLogout = async () => {
  await logout()
}

// Close menu when clicking outside
onMounted(() => {
  loadAccounts()
  
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      activeAccountMenu.value = null
    }
  })
})

// Set page title
useHead({
  title: 'My Accounts - BDPay'
})

console.log('💳 Accounts management page loaded')
</script>
