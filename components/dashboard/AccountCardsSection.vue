<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Business Account -->
    <AccountCard 
      title="Business account"
      :amount="24098.00"
      :change="-0.90"
      period="vs Last month"
    />
    
    <!-- Tax Reserve -->
    <AccountCard 
      title="Tax Reserve"
      :amount="2456.89"
      :change="2.5"
      period="vs Last month"
    />
    
    <!-- Savings -->
    <AccountCard 
      title="Savings"
      :amount="1980.00"
      :change="1.25"
      period="vs Last month"
    />
    
    <!-- Wallet Card -->
    <WalletCard 
      owner-name="Leo DiCaprio"
      :balance="1550.62"
      :spending-limit="9800.00"
      :total-limit="13000.00"
    />
  </div>
</template>

<script setup lang="ts">
import AccountCard from './AccountCard.vue'
import WalletCard from './WalletCard.vue'

// Later this data would come from an API
interface AccountData {
  businessAccount: number
  taxReserve: number
  savings: number
  businessAccountChange: number
  taxReserveChange: number
  savingsChange: number
}

</script>