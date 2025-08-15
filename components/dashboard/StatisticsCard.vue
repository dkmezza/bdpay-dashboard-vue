<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Statistics</h3>
      <button class="text-gray-500 hover:text-gray-700 transition-colors">
        <EllipsisHorizontalIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Total amount -->
    <div class="mb-6">
      <div class="text-2xl font-bold text-gray-900 mb-2">${{ totalAmount.toLocaleString() }}</div>
      <div class="text-sm text-gray-600">Total</div>
    </div>
    
    <!-- Statistics items with progress bars -->
    <div class="space-y-4 mb-6">
      <StatisticItem 
        v-for="item in statisticsData"
        :key="item.label"
        :label="item.label"
        :amount="item.amount"
        :color="item.color"
        :percentage="item.percentage"
      />
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
</template>

<script setup lang="ts">
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import StatisticItem from './StatisticItem.vue'
import ActionButton from './ActionButton.vue'

// Statistics data matching the original design
const statisticsData = [
  {
    label: 'Home',
    amount: 3250,
    color: 'bg-blue-600',
    percentage: 86
  },
  {
    label: 'Shopping', 
    amount: 725,
    color: 'bg-purple-500',
    percentage: 19
  },
  {
    label: 'Food',
    amount: 2350,
    color: 'bg-pink-400', 
    percentage: 62
  },
  {
    label: 'Others',
    amount: 210,
    color: 'bg-cyan-400',
    percentage: 6
  }
]

// Calculate total
const totalAmount = computed(() => 
  statisticsData.reduce((sum, item) => sum + item.amount, 0)
)

// Handle action button clicks
const handleAction = (action: string) => {
  console.log(`Action clicked: ${action}`)
  // Handle different actions here
}
</script>

