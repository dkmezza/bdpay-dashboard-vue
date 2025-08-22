<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">BD</span>
          </div>
          <span class="text-2xl font-bold text-gray-900">BDPay</span>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-600">Welcome back to your dashboard</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign in</span>
        </button>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 class="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
        <div class="text-xs text-blue-800 space-y-1">
          <div><strong>Email:</strong> leo@bdpay.com</div>
          <div><strong>Password:</strong> password123</div>
        </div>
        <button
          @click="fillDemoCredentials"
          class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Fill demo credentials
        </button>
      </div>

      <!-- Register Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            Sign up here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set layout to none for login page
definePageMeta({
  layout: false
})

const { login } = useAuth()

// Form state
const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

// Handle login
const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await login(form.email, form.password)
    
    if (result.success) {
      // Redirect to dashboard
      await navigateTo('/')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

// Fill demo credentials
const fillDemoCredentials = () => {
  form.email = 'leo@bdpay.com'
  form.password = 'password123'
}

// Set page title
useHead({
  title: 'Login - BDPay'
})
</script>