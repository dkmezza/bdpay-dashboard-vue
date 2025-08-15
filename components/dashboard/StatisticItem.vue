<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center flex-1">
      <div class="w-full">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">{{ label }}</span>
          <span class="text-sm font-semibold text-gray-900">${{ amount.toLocaleString() }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            :class="color" 
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${Math.min(percentage, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  amount: number
  color: string
  percentage: number
}

defineProps<Props>()
</script>