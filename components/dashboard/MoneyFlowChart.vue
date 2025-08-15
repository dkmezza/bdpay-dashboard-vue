<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <!-- Header with title and period selector -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Money Flow</h3>
      <div class="flex space-x-2">
        <button 
          v-for="period in ['Year', 'Month', 'Day']" 
          :key="period"
          class="px-3 py-1 text-sm rounded-md transition-colors"
          :class="selectedPeriod === period 
            ? 'bg-blue-100 text-blue-700 font-medium' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
          @click="selectedPeriod = period"
        >
          {{ period }}
        </button>
      </div>
    </div>
    
    <!-- Chart container -->
    <div class="h-64 flex items-end justify-between space-x-2 mb-4 px-2">
      <div 
        v-for="(month, index) in chartData" 
        :key="month.name"
        class="flex flex-col items-center flex-1 group"
      >
        <!-- Bars container -->
        <div class="w-full flex flex-col items-center justify-end h-48 mb-2 relative">
          <!-- Income bar (blue) -->
          <div 
            class="w-4/5 bg-blue-600 rounded-t-sm mb-1 transition-all duration-300 hover:bg-blue-700 relative group-hover:shadow-lg"
            :style="{ height: `${(month.income / maxValue) * 180}px` }"
            @mouseenter="showTooltip(month, 'income', $event)"
            @mouseleave="hideTooltip"
          >
            <!-- Tooltip for income -->
            <div 
              v-if="tooltip.show && tooltip.month === month.name && tooltip.type === 'income'"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-blue-900 text-white text-xs rounded whitespace-nowrap z-10"
            >
              Income: ${{ month.income.toLocaleString() }}
            </div>
          </div>
          
          <!-- Expense bar (pink) -->
          <div 
            class="w-4/5 bg-pink-400 rounded-t-sm transition-all duration-300 hover:bg-pink-500 relative group-hover:shadow-lg"
            :style="{ height: `${(month.expense / maxValue) * 180}px` }"
            @mouseenter="showTooltip(month, 'expense', $event)"
            @mouseleave="hideTooltip"
          >
            <!-- Tooltip for expense -->
            <div 
              v-if="tooltip.show && tooltip.month === month.name && tooltip.type === 'expense'"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-pink-900 text-white text-xs rounded whitespace-nowrap z-10"
            >
              Expense: ${{ month.expense.toLocaleString() }}
            </div>
          </div>
        </div>
        
        <!-- Month label -->
        <span class="text-xs text-gray-500 font-medium">{{ month.name }}</span>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="flex items-center justify-center space-x-6">
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
    <div class="mt-6 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-lg font-bold text-blue-600">${{ totalIncome.toLocaleString() }}</div>
          <div class="text-xs text-gray-500">Total Income</div>
        </div>
        <div>
          <div class="text-lg font-bold text-pink-500">${{ totalExpense.toLocaleString() }}</div>
          <div class="text-xs text-gray-500">Total Expense</div>
        </div>
        <div>
          <div class="text-lg font-bold" :class="netIncome >= 0 ? 'text-green-600' : 'text-red-600'">
            ${{ Math.abs(netIncome).toLocaleString() }}
          </div>
          <div class="text-xs text-gray-500">{{ netIncome >= 0 ? 'Net Income' : 'Net Loss' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChartData {
  name: string
  income: number
  expense: number
}

// Selected period tracking
const selectedPeriod = ref('Month')

// Tooltip state
const tooltip = ref({
  show: false,
  month: '',
  type: '',
  x: 0,
  y: 0
})

// Sample data - matches the original design values
const chartData: ChartData[] = [
  { name: 'Jan', income: 50, expense: 200 },
  { name: 'Feb', income: 100, expense: 150 },
  { name: 'Mar', income: 45, expense: 40 },
  { name: 'Apr', income: 450, expense: 120 },
  { name: 'May', income: 100, expense: 60 },
  { name: 'Jun', income: 40, expense: 120 },
  { name: 'July', income: 400, expense: 180 },
  { name: 'Aug', income: 30, expense: 150 },
  { name: 'Sep', income: 650, expense: 1500 },
  { name: 'Oct', income: 120, expense: 300 },
  { name: 'Nov', income: 800, expense: 200 },
  { name: 'Dec', income: 180, expense: 100 }
]

// Calculate maximum value for scaling
const maxValue = computed(() => 
  Math.max(...chartData.map(d => Math.max(d.income, d.expense)))
)

// Calculate totals
const totalIncome = computed(() => 
  chartData.reduce((sum, month) => sum + month.income, 0)
)

const totalExpense = computed(() => 
  chartData.reduce((sum, month) => sum + month.expense, 0)
)

const netIncome = computed(() => totalIncome.value - totalExpense.value)

// Tooltip functions
const showTooltip = (month: ChartData, type: string, event: MouseEvent) => {
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

// Handle period change (for future API integration)
watch(selectedPeriod, (newPeriod) => {
  console.log(`Period changed to: ${newPeriod}`)
  // Later we'll fetch new data here:
  // await fetchChartData(newPeriod)
})
</script>
