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
        <!-- Account Cards Section -->
        <AccountCardsSection />

        <!-- Main content area -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Left section - Progress info -->
          <div class="xl:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to BDPay Dashboard!</h2>
              <p class="text-gray-600 mb-6">
                This is your dashboard homepage. We're building the components step by step.
              </p>
              
              <!-- Progress cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-blue-900 mb-2">✅ Step 1 Complete</h3>
                  <p class="text-blue-700 text-sm">Basic page structure working!</p>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-green-900 mb-2">✅ Step 2 Complete</h3>
                  <p class="text-green-700 text-sm">Enhanced sidebar with real icons!</p>
                </div>
                
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-purple-900 mb-2">✅ Step 3 Complete</h3>
                  <p class="text-purple-700 text-sm">Account cards with real data!</p>
                </div>
              </div>

              <!-- What's new section -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h4 class="font-medium text-gray-900 mb-4">🎯 What's New in Step 3:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div class="space-y-2">
                    <div class="flex items-center text-green-600">
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Business account card with trend indicator
                    </div>
                    <div class="flex items-center text-green-600">
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Tax Reserve with positive change (+2.5%)
                    </div>
                    <div class="flex items-center text-green-600">
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Savings account with growth indicator
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center text-green-600">
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Interactive wallet card with spending limit
                    </div>
                    <div class="flex items-center text-green-600">
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Proper currency formatting
                    </div>
                    <div class="flex items-center text-green-600">
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Responsive grid layout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right section - Next steps -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📋 Progress Tracker</h3>
            
            <!-- Progress list -->
            <div class="space-y-3 text-sm">
              <div class="flex items-center text-green-600">
                <CheckCircleIcon class="w-4 h-4 mr-2" />
                <span>Step 1: Basic page structure</span>
              </div>
              <div class="flex items-center text-green-600">
                <CheckCircleIcon class="w-4 h-4 mr-2" />
                <span>Step 2: Navigation sidebar with icons</span>
              </div>
              <div class="flex items-center text-green-600">
                <CheckCircleIcon class="w-4 h-4 mr-2" />
                <span>Step 3: Account cards</span>
              </div>
              <div class="flex items-center text-gray-400">
                <ClockIcon class="w-4 h-4 mr-2" />
                <span>Step 4: Money flow chart</span>
              </div>
              <div class="flex items-center text-gray-400">
                <ClockIcon class="w-4 h-4 mr-2" />
                <span>Step 5: Statistics section</span>
              </div>
              <div class="flex items-center text-gray-400">
                <ClockIcon class="w-4 h-4 mr-2" />
                <span>Step 6: Transactions table</span>
              </div>
            </div>

            <!-- Next step highlight -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="font-medium text-blue-900 mb-2">🔥 Up Next:</h4>
              <p class="text-blue-800 text-sm">Step 4 - Money Flow Chart with interactive bars showing income vs expenses by month</p>
            </div>

            <!-- Stats preview -->
            <div class="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 class="font-medium text-purple-900 mb-2">💰 Account Summary</h4>
              <div class="text-sm space-y-1">
                <div class="flex justify-between text-purple-800">
                  <span>Total Balance:</span>
                  <span class="font-semibold">$28,535.51</span>
                </div>
                <div class="flex justify-between text-purple-700">
                  <span>Available Credit:</span>
                  <span class="font-semibold">$9,800.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

// Explicit imports
import TopNavigation from '~/components/navigation/TopNavigation.vue'
import Sidebar from '~/components/navigation/Sidebar.vue'
import AccountCardsSection from '~/components/dashboard/AccountCardsSection.vue'

useHead({
  title: 'Dashboard'
})

console.log('Dashboard page with account cards loaded!')
</script>
