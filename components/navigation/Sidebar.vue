<template>
  <aside class="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
    <!-- Main Navigation -->
    <nav class="flex-1 p-4">
      <div class="space-y-1">
        <SidebarItem 
          :active="currentPage === 'dashboard'"
          icon="home"
          text="Dashboard"
          @click="handleNavClick"
        />
        
        <SidebarItem 
          :active="currentPage === 'wallet'"
          icon="wallet"
          text="My Wallet"
          @click="handleNavClick"
        />
        
        <SidebarItem 
          :active="currentPage === 'activity'"
          icon="activity"
          text="Activity"
          :hasDropdown="true"
          @click="handleNavClick"
        />
        
        <SidebarItem 
          :active="currentPage === 'invoices'"
          icon="invoices"
          text="Invoices"
          @click="handleNavClick"
        />
        
        <SidebarItem 
          :active="currentPage === 'inbox'"
          icon="inbox"
          text="Inbox"
          :badge="1"
          @click="handleNavClick"
        />
        
        <SidebarItem 
          :active="currentPage === 'analytics'"
          icon="analytics"
          text="Analytics"
          @click="handleNavClick"
        />
      </div>
    </nav>
    
    <!-- Bottom Navigation -->
    <div class="p-4 border-t border-gray-200">
      <div class="space-y-1">
        <SidebarItem 
          icon="help"
          text="Get Help"
          @click="handleNavClick"
        />
        
        <SidebarItem 
          icon="settings"
          text="Settings"
          @click="handleNavClick"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Current page tracking 
const currentPage = ref('dashboard')

// Handle navigation clicks
const handleNavClick = (page: string) => {
  currentPage.value = page
  console.log(`Navigating to: ${page}`)
}
</script>
