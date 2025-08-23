<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Statistics</h3>
      <div class="flex items-center space-x-2">
        <!-- Period Selector -->
        <select 
          v-model="selectedPeriod"
          @change="loadStatistics"
          class="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          :disabled="loading"
        >
          <option value="current">This Month</option>
          <option value="last">Last Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        
        <button 
          @click="loadStatistics"
          :disabled="loading"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div class="space-y-4">
          <div v-for="i in 4" :key="i" class="flex justify-between items-center">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-2">⚠️</div>
      <p class="text-sm text-gray-600 mb-2">{{ error }}</p>
      <button 
        @click="loadStatistics"
        class="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Try again
      </button>
    </div>

    <!-- Statistics Content -->
    <div v-else>
      <!-- Total amount -->
      <div class="mb-6">
        <div class="text-2xl font-bold text-gray-900 mb-2">{{ formatCurrency(totalAmount) }}</div>
        <div class="text-sm text-gray-600">Total {{ selectedPeriodLabel }}</div>
      </div>
      
      <!-- Statistics items with progress bars -->
      <div class="space-y-4 mb-6">
        <StatisticItem 
          v-for="(item, index) in processedStatistics"
          :key="item.category"
          :label="item.category"
          :amount="item.amount"
          :color="getCategoryColor(index)"
          :percentage="item.percentage"
        />
      </div>

      <!-- Empty State for Categories -->
      <div v-if="processedStatistics.length === 0" class="text-center py-8">
        <div class="text-gray-400 mb-2">
          <ChartPieIcon class="w-8 h-8 mx-auto" />
        </div>
        <h4 class="text-sm font-medium text-gray-900 mb-1">No spending data</h4>
        <p class="text-xs text-gray-500">Your spending categories will appear here.</p>
      </div>

      <!-- Action buttons -->
      <div class="grid grid-cols-2 gap-3">
        <ActionButton 
          icon="paper-airplane"
          text="Send"
          @click="handleAction('send')"
        />
        <ActionButton 
          icon="arrow-down-tray"
          text="Receive"
          @click="handleAction('receive')"
        />
        <ActionButton 
          icon="document-text"
          text="Invoicing"
          @click="handleAction('invoicing')"
        />
        <ActionButton 
          icon="squares-2x2"
          text="More"
          @click="handleAction('more')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, ChartPieIcon } from '@heroicons/vue/24/outline'
import StatisticItem from './StatisticItem.vue'
import ActionButton from './ActionButton.vue'

interface StatisticsResponse {
  categories: Array<{
    category: string
    amount: number
  }>
  total: number
}

interface ProcessedStatistic {
  category: string
  amount: number
  percentage: number
}

interface Props {
  userId?: number
}

const props = defineProps<Props>()

// Composables
const { user } = useAuth()
const { fetchStatistics } = useApi()

// Component state
const loading = ref(true)
const error = ref('')
const rawStatistics = ref<StatisticsResponse | null>(null)
const selectedPeriod = ref('current')

// Period labels
const periodLabels = {
  current: 'This Month',
  last: 'Last Month', 
  quarter: 'This Quarter',
  year: 'This Year'
}

const selectedPeriodLabel = computed(() => 
  periodLabels[selectedPeriod.value as keyof typeof periodLabels] || 'This Month'
)

// Color palette for categories
const categoryColors = [
  'bg-blue-600',
  'bg-purple-500', 
  'bg-pink-400',
  'bg-cyan-400',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500'
]

// Process statistics for display
const processedStatistics = computed((): ProcessedStatistic[] => {
  if (!rawStatistics.value?.categories) return []

  const categories = rawStatistics.value.categories
  const total = rawStatistics.value.total

  // Sort by amount descending and take top 6
  const sortedCategories = categories
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)

  return sortedCategories.map(cat => ({
    category: formatCategoryName(cat.category),
    amount: cat.amount,
    percentage: total > 0 ? Math.round((cat.amount / total) * 100) : 0
  }))
})

// Calculate total amount
const totalAmount = computed(() => rawStatistics.value?.total || 0)

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatCategoryName = (category: string): string => {
  if (!category) return 'Others'
  
  // Convert common category names to more readable format
  const categoryMap: { [key: string]: string } = {
    'Health & Fitness': 'Health',
    'Food & Dining': 'Food',
    'Marketing': 'Marketing',
    'Banking': 'Banking',
    'Business': 'Business',
    'Payment': 'Payments',
    'Deposit': 'Income',
    'Entertainment': 'Entertainment',
    'Transport': 'Transport',
    'Shopping': 'Shopping',
    'Utilities': 'Utilities',
    'Groceries': 'Groceries'
  }
  
  return categoryMap[category] || category
}

const getCategoryColor = (index: number): string => {
  return categoryColors[index % categoryColors.length] || 'bg-gray-500'
}

// Load statistics from API
const loadStatistics = async () => {
  const userId = props.userId || user.value?.id
  if (!userId) {
    error.value = 'User ID not available'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log(`📊 Loading statistics for user ${userId}, period: ${selectedPeriod.value}`)
    
    // Note: Backend currently returns current month data regardless of period
    // In future, i WILL extend the API to support: 
    // /transactions/statistics/user/${userId}?period=${selectedPeriod.value}
    const response = await fetchStatistics(userId)
    rawStatistics.value = response
    
    console.log('✅ Statistics loaded:', {
      total: response.total,
      categories: response.categories?.length || 0,
      period: selectedPeriod.value
    })
    
  } catch (err: any) {
    console.error('❌ Error loading statistics:', err)
    error.value = err.message || 'Failed to load statistics'
  } finally {
    loading.value = false
  }
}

// Handle action button clicks
const handleAction = (action: string) => {
  console.log(`📋 Action clicked: ${action}`)
  
  // Emit events for parent to handle
  emit('action', action)
  
  // Handle different actions
  switch (action) {
    case 'send':
      // Handle send money
      break
    case 'receive':
      // Handle receive money
      break
    case 'invoicing':
      // Handle invoicing
      break
    case 'more':
      // Handle more options
      break
  }
}

// Define emits
const emit = defineEmits<{
  action: [action: string]
}>()

// Watch for user changes
watch(() => user.value?.id, (newUserId) => {
  if (newUserId) {
    loadStatistics()
  }
}, { immediate: true })

// Watch for prop changes
watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    loadStatistics()
  }
})

// Load data on mount
onMounted(() => {
  if (props.userId || user.value?.id) {
    loadStatistics()
  }
})

console.log('📈 StatisticsCard component initialized with real API integration')
</script>