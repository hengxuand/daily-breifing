// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirect: false
  },
  nitro: {
    prerender: {
      crawlLinks: false, // Disable crawling to prevent infinite history generation
      routes: (() => {
        // Generate historical archives (from Yesterday up to 30 days ago)
        // Only Today is skipped so it remains dynamic (SSR/CSR)
        const routes = []
        const today = new Date()
        
        // Start from i=1 (Yesterday)
        for (let i = 1; i < 30; i++) {
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
