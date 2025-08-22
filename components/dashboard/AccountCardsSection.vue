<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Loading State -->
    <div v-if="loading" class="col-span-full">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="col-span-full">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="text-red-600 mr-2">⚠️</div>
          <div>
            <p class="text-red-800 font-medium">Error loading accounts</p>
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
    </div>

    <!-- Account Cards with Real Data -->
    <template v-else>
      <!-- Regular Account Cards -->
      <AccountCard 
        v-for="account in regularAccounts" 
        :key="account.id"
        :title="account.accountName"
        :amount="parseFloat(account.currentBalance)"
        :change="account.percentageChange || 0"
        :period="'vs Last month'"
      />
      
      <!-- Wallet Card (if exists) -->
      <WalletCard 
        v-if="walletAccount"
        :key="walletAccount.id"
        :owner-name="user?.fullName || 'User'"
        :balance="parseFloat(walletAccount.currentBalance)"
        :spending-limit="parseFloat(walletAccount.spendingLimit || '0')"
        :total-limit="parseFloat(walletAccount.totalLimit || '0')"
        :card-type="walletAccount.cardType || 'VISA'"
      />

      <!-- Empty State -->
      <div v-if="accounts.length === 0" class="col-span-full text-center py-12">
        <div class="text-gray-400 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
        <h4 class="text-lg font-medium text-gray-900 mb-2">No accounts found</h4>
        <p class="text-gray-500">Your account cards will appear here.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AccountCard from './AccountCard.vue'
import WalletCard from './WalletCard.vue'

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
}

interface Props {
  userId?: number
}

const props = defineProps<Props>()

// Composables
const { user } = useAuth()
const { fetchAccounts, fetchWalletAccount } = useApi()

// Component state
const loading = ref(true)
const error = ref('')
const accounts = ref<Account[]>([])
const walletAccount = ref<Account | null>(null)

// Computed properties
const regularAccounts = computed(() => 
  accounts.value.filter(account => account.accountType !== 'WALLET')
)

// Load accounts data
const loadAccounts = async () => {
  const userId = props.userId || user.value?.id
  if (!userId) {
    error.value = 'User ID not available'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log(`💳 Loading accounts for user ${userId}`)
    
    // Load all accounts
    const accountsResponse = await fetchAccounts(userId)
    const allAccounts = accountsResponse.accounts || []
    
    // Separate wallet from other accounts
    const wallet = allAccounts.find(account => account.accountType === 'WALLET')
    const others = allAccounts.filter(account => account.accountType !== 'WALLET')
    
    accounts.value = others
    walletAccount.value = wallet || null
    
    console.log('✅ Accounts loaded:', {
      total: allAccounts.length,
      regular: others.length,
      wallet: wallet ? 1 : 0
    })
    
  } catch (err: any) {
    console.error('❌ Error loading accounts:', err)
    error.value = err.message || 'Failed to load accounts'
  } finally {
    loading.value = false
  }
}

// Watch for user changes
watch(() => user.value?.id, (newUserId) => {
  if (newUserId) {
    loadAccounts()
  }
}, { immediate: true })

// Watch for prop changes
watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    loadAccounts()
  }
})

// Load data on mount
onMounted(() => {
  if (props.userId || user.value?.id) {
    loadAccounts()
  }
})

console.log('💰 AccountCardsSection component initialized with real API integration')
</script>