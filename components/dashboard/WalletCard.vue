<template>
  <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white relative overflow-hidden">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-10">
      <svg class="w-full h-full" viewBox="0 0 200 100" fill="none">
        <circle cx="160" cy="20" r="40" fill="currentColor"/>
        <circle cx="40" cy="80" r="25" fill="currentColor"/>
        <circle cx="180" cy="70" r="15" fill="currentColor"/>
      </svg>
    </div>
    
    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium opacity-90">{{ cardType }}</span>
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium">⚡ Wellcoins</span>
        </div>
      </div>
      
      <!-- User info -->
      <div class="mb-4">
        <div class="text-xs opacity-75 mb-1">Id</div>
        <div class="text-sm font-medium">{{ ownerName }}</div>
      </div>
      
      <!-- Balance -->
      <div class="mb-6">
        <div class="text-xs opacity-75 mb-1">Balance</div>
        <div class="text-2xl font-bold">{{ formattedBalance }}</div>
      </div>
      
      <!-- Card type and chip -->
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm opacity-90">{{ cardBrand }}</span>
        <div class="w-8 h-5 bg-white bg-opacity-20 rounded flex items-center justify-center">
          <div class="w-6 h-3 bg-white bg-opacity-30 rounded-sm"></div>
        </div>
      </div>
    </div>
    
    <!-- Spending limit section -->
    <div class="relative z-10 pt-4 border-t border-white border-opacity-20">
      <div class="text-xs opacity-75 mb-2">Spending Limit</div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-lg font-semibold">{{ formattedSpendingLimit }}</span>
        <span class="text-xs opacity-75">used from {{ formattedTotalLimit }}</span>
      </div>
      <div class="w-full bg-white bg-opacity-20 rounded-full h-2">
        <div 
          class="bg-white h-2 rounded-full transition-all duration-300" 
          :style="{ width: `${spendingPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  cardType?: string
  ownerName?: string
  balance?: number
  spendingLimit?: number
  totalLimit?: number
  cardBrand?: string
}

const props = withDefaults(defineProps<Props>(), {
  cardType: 'Wallet',
  ownerName: 'Leo DiCaprio',
  balance: 1550.62,
  spendingLimit: 9800.00,
  totalLimit: 13000.00,
  cardBrand: 'VISA'
})

// Format currency values
const formattedBalance = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(props.balance)
})

const formattedSpendingLimit = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(props.spendingLimit)
})

const formattedTotalLimit = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(props.totalLimit)
})

// Calculate spending percentage
const spendingPercentage = computed(() => {
  const used = props.totalLimit - props.spendingLimit
  return Math.round((used / props.totalLimit) * 100)
})
</script>
