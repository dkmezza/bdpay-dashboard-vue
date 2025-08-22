<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <!-- Header with title and period selector -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Money Flow</h3>
      <div class="flex space-x-2">
        <button 
          v-for="period in availablePeriods" 
          :key="period.value"
          class="px-3 py-1 text-sm rounded-md transition-colors"
          :class="selectedPeriod === period.value 
            ? 'bg-blue-100 text-blue-700 font-medium' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
          @click="changePeriod(period.value)"
          :disabled="loading"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="h-64 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-600">Loading chart data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="h-64 flex items-center justify-center">
      <div class="text-center">
        <div class="text-red-500 mb-2">⚠️</div>
        <p class="text-sm text-gray-600">{{ error }}</p>
        <button 
          @click="loadChartData"
          class="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Try again
        </button>
      </div>
    </div>

    <!-- Chart container -->
    <div v-else class="h-64 flex items-end justify-between space-x-2 mb-4 px-2">
      <div 
        v-for="(month, index) in processedChartData" 
        :key="month.name"
        class="flex flex-col items-center flex-1 group"
      >
        <!-- Bars container -->
        <div class="w-full flex flex-col items-center justify-end h-48 mb-2 relative">
          <!-- Income bar (blue) -->
          <div 
            class="w-4/5 bg-blue-600 rounded-t-sm mb-1 transition-all duration-300 hover:bg-blue-700 relative group-hover:shadow-lg"
            :style="{ height: `${getBarHeight(month.income)}px` }"
            @mouseenter="showTooltip(month, 'income', $event)"
            @mouseleave="hideTooltip"
          >
            <!-- Tooltip for income -->
            <div 
              v-if="tooltip.show && tooltip.month === month.name && tooltip.type === 'income'"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-blue-900 text-white text-xs rounded whitespace-nowrap z-10"
            >
              Income: {{ formatCurrency(month.income) }}
            </div>
          </div>
          
          <!-- Expense bar (pink) -->
          <div 
            class="w-4/5 bg-pink-400 rounded-t-sm transition-all duration-300 hover:bg-pink-500 relative group-hover:shadow-lg"
            :style="{ height: `${getBarHeight(month.expense)}px` }"
            @mouseenter="showTooltip(month, 'expense', $event)"
            @mouseleave="hideTooltip"
          >
            <!-- Tooltip for expense -->
            <div 
              v-if="tooltip.show && tooltip.month === month.name && tooltip.type === 'expense'"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-pink-900 text-white text-xs rounded whitespace-nowrap z-10"
            >
              Expense: {{ formatCurrency(month.expense) }}
            </div>
          </div>
        </div>
        
        <!-- Month label -->
        <span class="text-xs text-gray-500 font-medium">{{ month.name }}</span>
      </div>
    </div>
    
    <!-- Legend -->
    <div v-if="!loading && !error" class="flex items-center justify-center space-x-6 mb-6">
      <div class="flex items-center">
        <div class="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600 font-medium">Income</span>
      </div>
      <div class="flex items-center">
        <div class="w-3 h-3 bg-pink-400 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600 font-medium">Expense</span>
      </div>
    </div>

    <!-- Summary stats -->
    <div v-if="!loading && !error" class="pt-4 border-t border-gray-200">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-lg font-bold text-blue-600">{{ formatCurrency(totalIncome) }}</div>
          <div class="text-xs text-gray-500">Total Income</div>
        </div>
        <div>
          <div class="text-lg font-bold text-pink-500">{{ formatCurrency(totalExpense) }}</div>
          <div class="text-xs text-gray-500">Total Expense</div>
        </div>
        <div>
          <div class="text-lg font-bold" :class="netIncome >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatCurrency(Math.abs(netIncome)) }}
          </div>
          <div class="text-xs text-gray-500">{{ netIncome >= 0 ? 'Net Income' : 'Net Loss' }}</div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && totalIncome === 0 && totalExpense === 0" class="text-center py-12">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-900 mb-2">No transaction data</h4>
      <p class="text-gray-500">Your money flow chart will appear here once you have transactions.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChartDataResponse {
  income: number[]
  expense: number[]
  months: string[]
}

interface ChartMonth {
  name: string
  income: number
  expense: number
}

interface Props {
  userId?: number
}

const props = defineProps<Props>()

// Composables
const { user } = useAuth()
const { fetchChartData } = useApi()

// Component state
const loading = ref(true)
const error = ref('')
const selectedPeriod = ref(new Date().getFullYear())
const rawChartData = ref<ChartDataResponse | null>(null)

// Available periods (years)
const availablePeriods = computed(() => {
  const currentYear = new Date().getFullYear()
  return [
    { label: `${currentYear - 1}`, value: currentYear - 1 },
    { label: `${currentYear}`, value: currentYear },
    { label: `${currentYear + 1}`, value: currentYear + 1 }
  ]
})

// Tooltip state
const tooltip = ref({
  show: false,
  month: '',
  type: '',
  x: 0,
  y: 0
})

// Process chart data for display
const processedChartData = computed((): ChartMonth[] => {
  if (!rawChartData.value) return []

  const { income, expense, months } = rawChartData.value
  
  return months.map((month, index) => ({
    name: month,
    income: income[index] || 0,
    expense: expense[index] || 0
  }))
})

// Calculate maximum value for scaling bars
const maxValue = computed(() => {
  if (processedChartData.value.length === 0) return 100
  
  const allValues = processedChartData.value.flatMap(d => [d.income, d.expense])
  const max = Math.max(...allValues)
  return max > 0 ? max : 100
})

// Calculate totals
const totalIncome = computed(() => 
  processedChartData.value.reduce((sum, month) => sum + month.income, 0)
)

const totalExpense = computed(() => 
  processedChartData.value.reduce((sum, month) => sum + month.expense, 0)
)

const netIncome = computed(() => totalIncome.value - totalExpense.value)

// Helper functions
const getBarHeight = (value: number): number => {
  if (maxValue.value === 0) return 0
  return Math.max((value / maxValue.value) * 180, 2) // Minimum height of 2px for visibility
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Tooltip functions
const showTooltip = (month: ChartMonth, type: string, event: MouseEvent) => {
  tooltip.value = {
    show: true,
    month: month.name,
    type: type,
    x: event.clientX,
    y: event.clientY
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}

// Load chart data from API
const loadChartData = async () => {
  const userId = props.userId || user.value?.id
  if (!userId) {
    error.value = 'User ID not available'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log(`📊 Loading chart data for user ${userId}, year ${selectedPeriod.value}`)
    
    const response = await fetchChartData(userId, selectedPeriod.value)
    rawChartData.value = response
    
    console.log('✅ Chart data loaded:', response)
    
    // If no data, show message but don't treat as error
    if (!response.income?.length && !response.expense?.length) {
      console.log('ℹ️ No transaction data available for selected period')
    }
    
  } catch (err: any) {
    console.error('❌ Error loading chart data:', err)
    error.value = err.message || 'Failed to load chart data'
  } finally {
    loading.value = false
  }
}

// Change period and reload data
const changePeriod = async (year: number) => {
  if (selectedPeriod.value === year || loading.value) return
  
  selectedPeriod.value = year
  await loadChartData()
}

// Watch for user changes
watch(() => user.value?.id, (newUserId) => {
  if (newUserId) {
    loadChartData()
  }
}, { immediate: true })

// Watch for prop changes
watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    loadChartData()
  }
})

// Load data on mount
onMounted(() => {
  if (props.userId || user.value?.id) {
    loadChartData()
  }
})

// Set selectedPeriod to current year on mount
selectedPeriod.value = new Date().getFullYear()

console.log('💰 MoneyFlowChart component initialized with real API integration')
</script>