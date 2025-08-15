<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header placeholder -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">BD</span>
            </div>
            <span class="text-xl font-semibold text-gray-900">BDPay</span>
          </div>
          <h1 class="text-lg font-medium text-gray-600 ml-8">Dashboard</h1>
        </div>
        
        <!-- User profile placeholder -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
            <span class="text-white font-medium text-sm">LD</span>
          </div>
          <span class="text-gray-700">Leo DiCaprio</span>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar placeholder -->
      <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
        <nav class="p-4">
          <div class="space-y-1">
            <!-- Dashboard item (active) -->
            <div class="bg-blue-50 text-blue-700 w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <div class="w-5 h-5 mr-3 bg-blue-600 rounded"></div>
              <span>Dashboard</span>
            </div>
            
            <!-- Other menu items (inactive) -->
            <div class="text-gray-700 hover:bg-gray-50 w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <div class="w-5 h-5 mr-3 bg-gray-400 rounded"></div>
              <span>My Wallet</span>
            </div>
            
            <div class="text-gray-700 hover:bg-gray-50 w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <div class="w-5 h-5 mr-3 bg-gray-400 rounded"></div>
              <span>Activity</span>
            </div>
            
            <div class="text-gray-700 hover:bg-gray-50 w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <div class="w-5 h-5 mr-3 bg-gray-400 rounded"></div>
              <span>Invoices</span>
            </div>
            
            <div class="text-gray-700 hover:bg-gray-50 w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <div class="w-5 h-5 mr-3 bg-gray-400 rounded"></div>
              <span>Inbox</span>
              <span class="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">1</span>
            </div>
            
            <div class="text-gray-700 hover:bg-gray-50 w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <div class="w-5 h-5 mr-3 bg-gray-400 rounded"></div>
              <span>Analytics</span>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-6">
        <!-- Content placeholder -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to BDPay Dashboard!</h2>
          <p class="text-gray-600 mb-6">
            This is your dashboard homepage. We'll be building the components step by step.
          </p>
          
          <!-- Test card to verify styling -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">Test Card 1</h3>
              <p class="text-blue-700">Tailwind CSS is working!</p>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-green-900 mb-2">Test Card 2</h3>
              <p class="text-green-700">Vue components are rendering!</p>
            </div>
            
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-purple-900 mb-2">Test Card 3</h3>
              <p class="text-purple-700">Nuxt 3 is working perfectly!</p>
            </div>
          </div>

          <!-- Next steps info -->
          <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Next Steps:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>✅ Step 1: Basic page structure (current)</li>
              <li>⏳ Step 2: Navigation sidebar with proper icons</li>
              <li>⏳ Step 3: Top navigation bar</li>
              <li>⏳ Step 4: Account cards</li>
              <li>⏳ Step 5: Wallet card</li>
              <li>⏳ Step 6: Money flow chart</li>
              <li>⏳ Step 7: Statistics section</li>
              <li>⏳ Step 8: Transactions table</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
// Set page title
useHead({
  title: 'Dashboard'
})

// Add any page-specific logic here
console.log('Dashboard page loaded successfully!')
</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>