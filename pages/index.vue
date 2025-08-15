<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Enhanced Top Navigation -->
    <TopNavigation 
      page-title="Dashboard"
      user-name="Leo DiCaprio"
    />

    <div class="flex">
      <!-- Enhanced Sidebar -->
      <Sidebar />

      <!-- Main content -->
      <main class="flex-1 p-6">
        <!-- Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to BDPay Dashboard!</h2>
          <p class="text-gray-600 mb-6">
            This is your dashboard homepage. We'll be building the components step by step.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">✅ Step 1 Complete</h3>
              <p class="text-blue-700">Basic page structure working!</p>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-green-900 mb-2">🚀 Step 2 Complete</h3>
              <p class="text-green-700">Enhanced sidebar with real icons!</p>
            </div>
            
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-purple-900 mb-2">⏳ Step 3 Next</h3>
              <p class="text-purple-700">Account cards coming up!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Explicit imports to fix auto-import issues
import TopNavigation from '~/components/navigation/TopNavigation.vue'
import Sidebar from '~/components/navigation/Sidebar.vue'

useHead({
  title: 'Dashboard'
})

console.log('Dashboard page with enhanced sidebar loaded!')
</script>