<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <TopNavigation 
      :page-title="'Profile'"
      :user-name="user?.fullName || 'Loading...'"
      :user-email="user?.email || ''"
      @logout="handleLogout"
    />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main content -->
      <main class="flex-1 p-6">
        <div class="max-w-4xl mx-auto">
          <!-- Page Header -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p class="text-gray-600">Manage your account information and preferences</p>
          </div>

          <!-- Profile Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Profile Card -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <!-- Avatar Section -->
                <div class="text-center mb-6">
                  <div class="relative inline-block">
                    <div class="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                      <span class="text-white font-bold text-2xl">{{ userInitials }}</span>
                    </div>
                    <button 
                      class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
                      @click="handleAvatarChange"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ user?.fullName }}</h3>
                  <p class="text-gray-500">{{ user?.email }}</p>
                </div>

                <!-- Quick Stats -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Member since</span>
                    <span class="text-gray-900 font-medium">{{ formatDate(user?.createdAt) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Account Status</span>
                    <span class="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Total Accounts</span>
                    <span class="text-gray-900 font-medium">{{ totalAccounts }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Personal Information -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <button 
                    v-if="!isEditing"
                    @click="enableEditing"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>

                <form @submit.prevent="handleSaveProfile" class="space-y-6">
                  <!-- First Name -->
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      v-model="profileForm.firstName"
                      type="text"
                      :disabled="!isEditing"
                      :class="[
                        'w-full px-3 py-2 border rounded-md shadow-sm text-sm',
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                      ]"
                      :placeholder="isEditing ? 'Enter your first name' : ''"
                    />
                    <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      v-model="profileForm.lastName"
                      type="text"
                      :disabled="!isEditing"
                      :class="[
                        'w-full px-3 py-2 border rounded-md shadow-sm text-sm',
                        isEditing 
                          ? 'border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                      ]"
                      :placeholder="isEditing ? 'Enter your last name' : ''"
                    />
                    <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
                  </div>

                  <!-- Email (read-only) -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      :value="user?.email"
                      type="email"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-700 rounded-md shadow-sm text-sm cursor-not-allowed"
                    />
                    <p class="mt-1 text-xs text-gray-500">Email cannot be changed for security reasons</p>
                  </div>

                  <!-- Action Buttons -->
                  <div v-if="isEditing" class="flex items-center space-x-3 pt-4">
                    <button
                      type="submit"
                      :disabled="isSaving"
                      class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="isSaving" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                      <span v-else>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      @click="cancelEditing"
                      class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <!-- Change Password Section -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Password</h3>
                    <p class="text-sm text-gray-600">Update your password to keep your account secure</p>
                  </div>
                  <button 
                    v-if="!isChangingPassword"
                    @click="enablePasswordChange"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Change Password
                  </button>
                </div>

                <!-- Password Change Form -->
                <form v-if="isChangingPassword" @submit.prevent="handleChangePassword" class="space-y-4">
                  <!-- Current Password -->
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your current password"
                    />
                    <p v-if="errors.currentPassword" class="mt-1 text-xs text-red-600">{{ errors.currentPassword }}</p>
                  </div>

                  <!-- New Password -->
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your new password"
                    />
                    <div class="mt-1 text-xs text-gray-500 space-y-1">
                      <div :class="passwordValidation.length ? 'text-green-600' : 'text-gray-500'">
                        ✓ At least 6 characters
                      </div>
                      <div :class="passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'">
                        ✓ One uppercase letter
                      </div>
                      <div :class="passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'">
                        ✓ One lowercase letter
                      </div>
                    </div>
                    <p v-if="errors.newPassword" class="mt-1 text-xs text-red-600">{{ errors.newPassword }}</p>
                  </div>

                  <!-- Confirm New Password -->
                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm your new password"
                    />
                    <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-600">{{ errors.confirmPassword }}</p>
                  </div>

                  <!-- Password Action Buttons -->
                  <div class="flex items-center space-x-3 pt-4">
                    <button
                      type="submit"
                      :disabled="isChangingPasswordSubmit || !isPasswordFormValid"
                      class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="isChangingPasswordSubmit" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                      <span v-else>Update Password</span>
                    </button>
                    <button
                      type="button"
                      @click="cancelPasswordChange"
                      class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <!-- Password Status -->
                <div v-else class="text-sm text-gray-600">
                  <p>••••••••••••••••</p>
                  <p class="text-xs text-gray-500 mt-1">Password last changed 30 days ago</p>
                </div>
              </div>

              <!-- Account Statistics -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Account Overview</h3>
                <div class="grid grid-cols-2 gap-6">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ totalBalance }}</div>
                    <div class="text-sm text-gray-500">Total Balance</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">{{ totalTransactions }}</div>
                    <div class="text-sm text-gray-500">Total Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <CheckCircleIcon class="h-5 w-5 text-green-400 mr-3" />
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>

          <div v-if="errorMessage" class="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mr-3" />
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PencilIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

// Protect this route
definePageMeta({
  middleware: 'auth'
})

// Imports
import TopNavigation from '~/components/navigation/TopNavigation.vue'
import Sidebar from '~/components/navigation/Sidebar.vue'
import type { User } from '~/composables/useAuth'

// Composables
const { user, logout, updateUserData } = useAuth()
const { fetchAccounts, updateUserProfile, changeUserPassword } = useApi()

// Component state
const isEditing = ref(false)
const isSaving = ref(false)
const isChangingPassword = ref(false)
const isChangingPasswordSubmit = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const totalAccounts = ref(0)
const totalBalance = ref('$0')
const totalTransactions = ref(0)

// Form data
const profileForm = reactive({
  firstName: '',
  lastName: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Form errors
const errors = reactive({
  firstName: '',
  lastName: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed properties
const userInitials = computed(() => {
  if (!user.value) return 'U'
  return user.value.fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
})

// Password validation
const passwordValidation = computed(() => ({
  length: passwordForm.newPassword.length >= 6,
  uppercase: /[A-Z]/.test(passwordForm.newPassword),
  lowercase: /[a-z]/.test(passwordForm.newPassword)
}))

const isPasswordFormValid = computed(() => {
  return passwordForm.currentPassword.length > 0 &&
         passwordValidation.value.length &&
         passwordValidation.value.uppercase &&
         passwordValidation.value.lowercase &&
         passwordForm.newPassword === passwordForm.confirmPassword
})

// Helper functions
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  })
}

// Profile editing functions
const enableEditing = () => {
  isEditing.value = true
  // Populate form with current user data
  if (user.value) {
    profileForm.firstName = user.value.firstName
    profileForm.lastName = user.value.lastName
  }
}

const cancelEditing = () => {
  isEditing.value = false
  // Reset form
  profileForm.firstName = ''
  profileForm.lastName = ''
  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// Password change functions
const enablePasswordChange = () => {
  isChangingPassword.value = true
}

const cancelPasswordChange = () => {
  isChangingPassword.value = false
  // Reset password form
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  // Clear errors
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
}

// Form validation
const validateProfileForm = () => {
  let isValid = true
  
  if (profileForm.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
    isValid = false
  } else {
    errors.firstName = ''
  }
  
  if (profileForm.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
    isValid = false
  } else {
    errors.lastName = ''
  }
  
  return isValid
}

// Handle profile save
const handleSaveProfile = async () => {
  if (!validateProfileForm() || !user.value?.id) return

  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Call backend API to update user profile
    const response = await updateUserProfile(user.value.id, {
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim()
    })
    
    // Update user state with response data
    updateUserData({
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      fullName: `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`
    })
    
    successMessage.value = 'Profile updated successfully!'
    isEditing.value = false
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    console.error('Profile update error:', error)
    errorMessage.value = error.message || 'Failed to update profile'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isSaving.value = false
  }
}

// Handle password change
const handleChangePassword = async () => {
  if (!isPasswordFormValid.value || !user.value?.id) return

  isChangingPasswordSubmit.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Call backend API to change password
    await changeUserPassword(user.value.id, {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    successMessage.value = 'Password updated successfully!'
    cancelPasswordChange()
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    console.error('Password change error:', error)
    errorMessage.value = error.message || 'Failed to change password'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isChangingPasswordSubmit.value = false
  }
}

// Handle avatar change
const handleAvatarChange = () => {
  console.log('Avatar change clicked - would open file picker')
  // In a real implementation, this would open a file picker
  // and upload the new avatar image
}

// Handle logout
const handleLogout = async () => {
  await logout()
}

// Load account statistics
const loadAccountStats = async () => {
  if (!user.value?.id) return

  try {
    const accountsResponse = await fetchAccounts(user.value.id)
    const accounts = accountsResponse.accounts || []
    
    totalAccounts.value = accounts.length
    
    const total = accounts.reduce((sum: number, account: any) => 
      sum + parseFloat(account.currentBalance), 0)
    
    totalBalance.value = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(total)
    
    // For now, set a placeholder for transactions
    totalTransactions.value = 15 // This would come from an API call
    
  } catch (error) {
    console.error('Error loading account stats:', error)
  }
}

// Load data on mount
onMounted(() => {
  if (user.value) {
    loadAccountStats()
  }
})

// Set page title
useHead({
  title: 'Profile - BDPay'
})

console.log('👤 Profile page loaded')
</script>