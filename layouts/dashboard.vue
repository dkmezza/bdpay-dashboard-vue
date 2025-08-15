<template>
  <div class="min-h-screen bg-gray-50">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Change this import
import { useHead } from 'nuxt/app'

// Layout-specific logic
useHead({
  titleTemplate: '%s - BDPay Dashboard'
})
</script>