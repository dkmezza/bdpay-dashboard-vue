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
        <h2 class="text-xl font-semibold text-gray-900">Create your account</h2>
        <p class="mt-2 text-sm text-gray-600">Join BDPay and start managing your finances</p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Name Fields -->
        <div class="grid grid-cols-2 gap-4">
          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
              :class="{ 'border-red-500': errors.firstName }"
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
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
          </div>
        </div>

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
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password"
              :class="{ 'border-red-500': errors.password }"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
              <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div class="mt-1">
            <div class="text-xs text-gray-500 space-y-1">
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
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your password"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-600">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="acceptTerms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="acceptTerms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="text-blue-600 hover:text-blue-500 underline">Terms and Conditions</a>
            and
            <a href="#" class="text-blue-600 hover:text-blue-500 underline">Privacy Policy</a>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-md p-3">
          {{ success }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <!-- Demo Account Info -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 class="text-sm font-medium text-blue-900 mb-2">Already have an account?</h4>
        <p class="text-xs text-blue-800 mb-2">
          You can use our demo account to explore the dashboard:
        </p>
        <div class="text-xs text-blue-800 space-y-1 mb-2">
          <div><strong>Email:</strong> leo@bdpay.com</div>
          <div><strong>Password:</strong> password123</div>
        </div>
        <NuxtLink 
          to="/login" 
          class="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Go to login page
        </NuxtLink>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

// Set layout to none for register page
definePageMeta({
  layout: false
})

const { register } = useAuth()

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// Component state
const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)

// Form validation
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Password validation
const passwordValidation = computed(() => ({
  length: form.password.length >= 6,
  uppercase: /[A-Z]/.test(form.password),
  lowercase: /[a-z]/.test(form.password)
}))

// Form validation
const isFormValid = computed(() => {
  return form.firstName.trim() !== '' &&
         form.lastName.trim() !== '' &&
         form.email.trim() !== '' &&
         form.password.length >= 6 &&
         form.password === form.confirmPassword &&
         form.acceptTerms &&
         passwordValidation.value.length &&
         passwordValidation.value.uppercase &&
         passwordValidation.value.lowercase
})

// Validate individual fields
const validateField = (field: string) => {
  switch (field) {
    case 'firstName':
      errors.firstName = form.firstName.trim().length < 2 ? 'First name must be at least 2 characters' : ''
      break
    case 'lastName':
      errors.lastName = form.lastName.trim().length < 2 ? 'Last name must be at least 2 characters' : ''
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      errors.email = !emailRegex.test(form.email) ? 'Please enter a valid email address' : ''
      break
    case 'password':
      if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      } else if (!passwordValidation.value.uppercase || !passwordValidation.value.lowercase) {
        errors.password = 'Password must contain uppercase and lowercase letters'
      } else {
        errors.password = ''
      }
      break
    case 'confirmPassword':
      errors.confirmPassword = form.password !== form.confirmPassword ? 'Passwords do not match' : ''
      break
  }
}

// Watch form fields for validation
watch(() => form.firstName, () => validateField('firstName'))
watch(() => form.lastName, () => validateField('lastName'))
watch(() => form.email, () => validateField('email'))
watch(() => form.password, () => {
  validateField('password')
  if (form.confirmPassword) validateField('confirmPassword')
})
watch(() => form.confirmPassword, () => validateField('confirmPassword'))

// Handle registration
const handleRegister = async () => {
  // Validate all fields
  Object.keys(errors).forEach(field => validateField(field))
  
  // Check if there are any errors
  const hasErrors = Object.values(errors).some(error => error !== '')
  if (hasErrors) {
    error.value = 'Please fix the errors above'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password
    })
    
    if (result.success) {
      success.value = 'Account created successfully! Redirecting to dashboard...'
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo('/')
      }, 1500)
    } else {
      error.value = result.error
    }
  } catch (err: any) {
    console.error('Registration error:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

// Set page title
useHead({
  title: 'Register - BDPay'
})
</script>