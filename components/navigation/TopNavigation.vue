<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left side: Logo + Page title -->
      <div class="flex items-center space-x-4">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">BD</span>
          </div>
          <span class="text-xl font-semibold text-gray-900">BDPay</span>
        </div>
        
        <h1 class="text-lg font-medium text-gray-600 ml-8">{{ pageTitle }}</h1>
      </div>
      
      <!-- Right side: Search + Notifications + User profile -->
      <div class="flex items-center space-x-4">
        <!-- Search button -->
        <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <MagnifyingGlassIcon class="w-5 h-5" />
        </button>
        
        <!-- Notifications button -->
        <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
          <BellIcon class="w-5 h-5" />
          <!-- Notification dot -->
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <!-- User profile dropdown -->
        <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
          <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
            <span class="text-white font-medium text-sm">{{ userInitials }}</span>
          </div>
          <span class="text-gray-700 font-medium">{{ userName }}</span>
          <ChevronDownIcon class="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChevronDownIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  pageTitle?: string
  userName?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
  userName: 'Leo DiCaprio'
})

// Generate user initials
const userInitials = computed(() => {
  return props.userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
})
</script>