// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirect: false
  },
  routeRules: {
    // Today's page: always fresh (SSR on every request)
    '/:lang(en|zh)/:date(\\d{4}-\\d{2}-\\d{2})': { 
      isr: 3600 // Revalidate every hour (3600 seconds)
    }
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: (() => {
        // Pre-build only the last 7 days for faster initial deployment
        // Other pages will be generated on-demand via ISR
        const routes = []
        const today = new Date()
        
        // Pre-build last 7 days
        for (let i = 1; i <= 7; i++) {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            routes.push(`/zh/${dateStr}`)
            routes.push(`/en/${dateStr}`)
        }
        return routes
      })()
    }
  }
})
