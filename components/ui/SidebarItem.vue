<template>
  <button 
    class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group"
    :class="active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
    @click="handleClick"
  >
    <!-- Icon -->
    <component 
      :is="iconComponent" 
      class="w-5 h-5 mr-3 flex-shrink-0"
      :class="active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'"
    />
    
    <!-- Text -->
    <span class="flex-1 text-left">{{ text }}</span>
    
    <!-- Badge -->
    <span 
      v-if="badge" 
      class="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center"
    >
      {{ badge }}
    </span>
    
    <!-- Dropdown arrow -->
    <ChevronDownIcon 
      v-if="hasDropdown" 
      class="w-4 h-4 ml-2 text-gray-400 transition-transform"
      :class="{ 'rotate-180': isDropdownOpen }"
    />
  </button>
</template>

<script setup lang="ts">
import { 
  HomeIcon, 
  WalletIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  InboxIcon, 
  ChartPieIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

interface Props {
  active?: boolean
  icon: 'home' | 'wallet' | 'activity' | 'invoices' | 'inbox' | 'analytics' | 'help' | 'settings'
  text: string
  badge?: number
  hasDropdown?: boolean
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  hasDropdown: false
})

// Track dropdown state
const isDropdownOpen = ref(false)

// Icon mapping
const iconMap = {
  home: HomeIcon,
  wallet: WalletIcon,
  activity: ChartBarIcon,
  invoices: DocumentTextIcon,
  inbox: InboxIcon,
  analytics: ChartPieIcon,
  help: QuestionMarkCircleIcon,
  settings: Cog6ToothIcon
}

const iconComponent = computed(() => iconMap[props.icon])

// Handle click events
const handleClick = () => {
  if (props.hasDropdown) {
    isDropdownOpen.value = !isDropdownOpen.value
  }
  
  if (props.href) {
    navigateTo(props.href)
  }
  
  // Emit click event for parent to handle
  emit('click', props.icon)
}

const emit = defineEmits<{
  click: [icon: string]
}>()
</script>

