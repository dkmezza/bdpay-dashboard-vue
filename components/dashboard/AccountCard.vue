<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <!-- Header with title and menu -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-600">{{ title }}</h3>
      <button class="text-gray-400 hover:text-gray-600 transition-colors">
        <EllipsisHorizontalIcon class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Amount -->
    <div class="mb-3">
      <div class="text-2xl font-bold text-gray-900">{{ formattedAmount }}</div>
    </div>
    
    <!-- Change indicator -->
    <div class="flex items-center text-sm">
      <div 
        class="flex items-center"
        :class="changeType === 'up' ? 'text-green-600' : 'text-red-600'"
      >
        <!-- Up arrow -->
        <ArrowTrendingUpIcon 
          v-if="changeType === 'up'" 
          class="w-4 h-4 mr-1" 
        />
        <!-- Down arrow -->
        <ArrowTrendingDownIcon 
          v-else 
          class="w-4 h-4 mr-1" 
        />
        <span class="font-medium">{{ Math.abs(change) }}%</span>
      </div>
      <span class="text-gray-500 ml-1">{{ period }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  EllipsisHorizontalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'

interface Props {
  title: string
  amount: number
  change: number
  period: string
}

const props = defineProps<Props>()

// Determine if change is up or down
const changeType = computed(() => props.change >= 0 ? 'up' : 'down')

// Format amount as currency
const formattedAmount = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(props.amount)
})
</script>

