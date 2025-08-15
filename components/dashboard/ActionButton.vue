<template>
  <button 
    class="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
    @click="$emit('click')"
  >
    <div class="w-6 h-6 mb-2 text-gray-600 group-hover:text-gray-800 transition-colors">
      <component :is="iconComponent" class="w-full h-full" />
    </div>
    <span class="text-xs text-gray-600 group-hover:text-gray-800 transition-colors font-medium">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import { 
  PaperAirplaneIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'

interface Props {
  icon: 'paper-airplane' | 'arrow-down-tray' | 'document-text' | 'squares-2x2'
  text: string
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

// Icon mapping
const iconMap = {
  'paper-airplane': PaperAirplaneIcon,
  'arrow-down-tray': ArrowDownTrayIcon,
  'document-text': DocumentTextIcon,
  'squares-2x2': Squares2X2Icon
}

const iconComponent = computed(() => iconMap[props.icon])
</script>