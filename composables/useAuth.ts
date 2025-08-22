interface LoginResponse {
  message: string
  token: string
  user: User
}

interface RegisterResponse {
  message: string
  token: string
  user: User
}

interface UserResponse extends User {
  createdAt: string
}

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  fullName: string
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth-token', {
    default: () => null,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  const user = useState<User | null>('auth.user', () => null)

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        baseURL: 'http://localhost:8080',
        body: { email, password }
      })

      token.value = response.token
      user.value = response.user
      
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.data?.error || 'Login failed' 
      }
    }
  }

  // Register function
  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => {
    try {
      const response = await $fetch<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        baseURL: 'http://localhost:8080',
        body: userData
      })

      token.value = response.token
      user.value = response.user
      
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.data?.error || 'Registration failed' 
      }
    }
  }

  // Logout function
  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Get current user
  const getCurrentUser = async () => {
    if (!token.value) return null

    try {
      const response = await $fetch<UserResponse>('/api/auth/me', {
        baseURL: 'http://localhost:8080',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      user.value = response
      return response
    } catch (error) {
      console.error('Get user error:', error)
      logout()
      return null
    }
  }

  return {
    token: readonly(token),
    user: readonly(user),
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser
  }
}
