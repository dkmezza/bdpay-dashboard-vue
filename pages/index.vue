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

        <!-- Main dashboard content -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <!-- Money Flow Chart - Takes 2 columns -->
          <div class="xl:col-span-2">
            <MoneyFlowChart />
          </div>

          <!-- Statistics Card - Takes 1 column -->
          <div>
            <StatisticsCard />
          </div>
        </div>

        <!-- Bottom section - Progress and info -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Progress info - Takes 2 columns -->
          <div class="xl:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Dashboard Progress</h2>
              <p class="text-gray-600 mb-6">
                We're building an amazing BDPay dashboard with real functionality and beautiful design.
              </p>
              
              <!-- Progress cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-blue-900 mb-1">✅</div>
                  <h3 class="text-sm font-semibold text-blue-900 mb-1">Step 1</h3>
                  <p class="text-blue-700 text-xs">Basic Structure</p>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-green-900 mb-1">✅</div>
                  <h3 class="text-sm font-semibold text-green-900 mb-1">Step 2</h3>
                  <p class="text-green-700 text-xs">Navigation</p>
                </div>
                
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-purple-900 mb-1">✅</div>
                  <h3 class="text-sm font-semibold text-purple-900 mb-1">Step 3</h3>
                  <p class="text-purple-700 text-xs">Account Cards</p>
                </div>

                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-orange-900 mb-1">✅</div>
                  <h3 class="text-sm font-semibold text-orange-900 mb-1">Step 4</h3>
                  <p class="text-orange-700 text-xs">Money Flow Chart</p>
                </div>
              </div>

              <!-- Features showcase -->
              <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h4 class="font-medium text-gray-900 mb-4">🎯 New in Step 4: Interactive Money Flow Chart</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div class="space-y-2">
                    <div class="flex items-center text-blue-600">
                      <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Interactive bar chart with hover tooltips
                    </div>
                    <div class="flex items-center text-blue-600">
                      <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Period selector (Year/Month/Day)
                    </div>
                    <div class="flex items-center text-blue-600">
                      <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Income vs Expense visualization
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center text-purple-600">
                      <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Statistics panel with progress bars
                    </div>
                    <div class="flex items-center text-purple-600">
                      <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Action buttons (Send, Receive, etc.)
                    </div>
                    <div class="flex items-center text-purple-600">
                      <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Real-time calculations and totals
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary sidebar - Takes 1 column -->
          <div class="space-y-6">
            <!-- Progress tracker -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Dashboard Metrics</h3>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Accounts</span>
                  <span class="font-semibold text-gray-900">4</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Balance</span>
                  <span class="font-semibold text-green-600">$28,535.51</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Monthly Income</span>
                  <span class="font-semibold text-blue-600">$2,865</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Monthly Expenses</span>
                  <span class="font-semibold text-pink-500">$3,115</span>
                </div>
                <div class="h-px bg-gray-200"></div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Net Flow</span>
                  <span class="font-semibold text-red-600">-$250</span>
                </div>
              </div>
            </div>

            <!-- Next steps -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">🚀 Coming Next</h3>
              
              <div class="space-y-3 text-sm">
                <div class="flex items-center text-gray-400">
                  <ClockIcon class="w-4 h-4 mr-2" />
                  <span>Step 5: Enhanced Statistics</span>
                </div>
                <div class="flex items-center text-gray-400">
                  <ClockIcon class="w-4 h-4 mr-2" />
                  <span>Step 6: Transactions Table</span>
                </div>
                <div class="flex items-center text-gray-400">
                  <ClockIcon class="w-4 h-4 mr-2" />
                  <span>Step 7: API Integration</span>
                </div>
              </div>

              <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div class="text-sm font-medium text-green-900 mb-1">🎉 Great Progress!</div>
                <div class="text-xs text-green-700">4/7 components completed with professional styling and functionality.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon } from '@heroicons/vue/24/outline'

// Explicit imports
import TopNavigation from '~/components/navigation/TopNavigation.vue'
import Sidebar from '~/components/navigation/Sidebar.vue'
import AccountCardsSection from '~/components/dashboard/AccountCardsSection.vue'
import MoneyFlowChart from '~/components/dashboard/MoneyFlowChart.vue'
import StatisticsCard from '~/components/dashboard/StatisticsCard.vue'

useHead({
  title: 'Dashboard'
})

console.log('Dashboard with Money Flow Chart loaded!')
</script>