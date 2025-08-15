export default defineNuxtConfig({
  compatibilityDate: '2025-08-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  // css: ['~/assets/css/main.css'],
  typescript: {
    strict: true
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8080/api'
    }
  }
})