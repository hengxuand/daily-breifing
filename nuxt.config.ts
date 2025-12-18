// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  css: ['~/assets/css/theme.css'],
  app: {
    head: {
      title: 'Happened.info',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  supabase: {
    redirect: false
  },
  routeRules: {
    // Date pages with ISR (Incremental Static Regeneration)
    '/:date(\\d{4}-\\d{2}-\\d{2})': { 
      isr: 3600 // Revalidate every hour (3600 seconds)
    },
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
        
        // Pre-build last 7 days for both-language view
        for (let i = 0; i <= 7; i++) {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            routes.push(`/${dateStr}`)
        }
        return routes
      })()
    }
  }
})
