<template>
  <aside class="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
    <!-- Main Navigation -->
    <nav class="flex-1 p-4">
      <div class="space-y-1">
        <SidebarItem 
          :active="$route.path === '/'"
          icon="home"
          text="Dashboard"
          @click="handleNavClick('/')"
        />
        
        <SidebarItem 
          :active="$route.path === '/accounts'"
          icon="wallet"
          text="My Accounts"
          @click="handleNavClick('/accounts')"
        />
        
        <SidebarItem 
          :active="$route.path === '/transactions'"
          icon="activity"
          text="Transactions"
          @click="handleNavClick('/transactions')"
        />
        
        <SidebarItem 
          :active="$route.path === '/invoices'"
          icon="invoices"
          text="Invoices"
          @click="handleNavClick('/invoices')"
        />
        
        <SidebarItem 
          :active="$route.path === '/inbox'"
          icon="inbox"
          text="Inbox"
          :badge="1"
          @click="handleNavClick('/inbox')"
        />
        
        <SidebarItem 
          :active="$route.path === '/analytics'"
          icon="analytics"
          text="Analytics"
          @click="handleNavClick('/analytics')"
        />
      </div>
    </nav>
    
    <!-- Bottom Navigation -->
    <div class="p-4 border-t border-gray-200">
      <div class="space-y-1">
        <SidebarItem 
          icon="help"
          text="Get Help"
          @click="handleNavClick('/help')"
        />
        
        <SidebarItem 
          :active="$route.path === '/profile'"
          icon="settings"
          text="Profile"
          @click="handleNavClick('/profile')"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import SidebarItem from '../ui/SidebarItem.vue'

// Handle navigation clicks
const handleNavClick = (path: string) => {
  console.log(`Navigating to: ${path}`)
  navigateTo(path)
}
</script>