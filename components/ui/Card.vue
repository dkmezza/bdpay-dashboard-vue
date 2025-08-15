<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div v-if="$slots.header" class="p-6 border-b border-gray-200">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="p-6 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>