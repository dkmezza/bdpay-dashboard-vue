export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
