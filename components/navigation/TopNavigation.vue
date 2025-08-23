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
        <div class="relative">
          <button 
            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            @click="toggleDropdown"
          >
            <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">{{ userInitials }}</span>
            </div>
            <span class="text-gray-700 font-medium">{{ userName }}</span>
            <ChevronDownIcon 
              class="w-4 h-4 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': isDropdownOpen }"
            />
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <!-- User Info Header -->
            <div class="px-4 py-3 border-b border-gray-100">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium">{{ userInitials }}</span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ userName }}</div>
                  <div class="text-sm text-gray-500">{{ userEmail }}</div>
                </div>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="py-1">
              <button
                @click="handleMenuAction('profile')"
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon class="w-4 h-4 mr-3 text-gray-400" />
                My Profile
              </button>
              
              <button
                @click="handleMenuAction('settings')"
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Cog6ToothIcon class="w-4 h-4 mr-3 text-gray-400" />
                Settings
              </button>
              
              <button
                @click="handleMenuAction('help')"
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <QuestionMarkCircleIcon class="w-4 h-4 mr-3 text-gray-400" />
                Help & Support
              </button>

              <!-- Divider -->
              <div class="border-t border-gray-100 my-1"></div>
              
              <!-- Logout -->
              <button
                @click="handleLogout"
                :disabled="isLoggingOut"
                class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                <span v-if="isLoggingOut">Logging out...</span>
                <span v-else>Logout</span>
              </button>
            </div>
          </div>

          <!-- Overlay to close dropdown when clicking outside -->
          <div 
            v-if="isDropdownOpen"
            class="fixed inset-0 z-40"
            @click="closeDropdown"
          ></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  pageTitle?: string
  userName?: string
  userEmail?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
  userName: 'Leo DiCaprio',
  userEmail: 'leo@bdpay.com'
})

const emit = defineEmits<{
  logout: []
}>()

// Dropdown state
const isDropdownOpen = ref(false)
const isLoggingOut = ref(false)

// Generate user initials
const userInitials = computed(() => {
  return props.userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
})

// Dropdown functions
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Handle menu actions
const handleMenuAction = (action: string) => {
  closeDropdown()
  
  switch (action) {
    case 'profile':
      console.log('Navigate to profile')
      navigateTo('/profile')
      break
    case 'settings':
      console.log('Navigate to settings')
      // navigateTo('/settings')
      break
    case 'help':
      console.log('Navigate to help')
      // navigateTo('/help')
      break
  }
}

// Handle logout
const handleLogout = async () => {
  isLoggingOut.value = true
  closeDropdown()
  
  try {
    emit('logout')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}

// Close dropdown on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDropdown()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>