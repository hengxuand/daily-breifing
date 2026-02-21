// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  css: ['~/assets/css/theme.css'],
  runtimeConfig: {
    public: {
      siteUrl: 'https://happened.info',
      // NOTE: Update this date whenever terms-of-service.vue or privacy-policy.vue are modified.
      legalLastUpdated: 'February 21, 2026'
    }
  },
  app: {
    head: {
      title: 'Happened.info',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL || 'https://pmpfhubylpukgdbzwvpy.supabase.co',
    key: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcGZodWJ5bHB1a2dkYnp3dnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTg1MjMsImV4cCI6MjA3OTY3NDUyM30.REWKSCKdZZTG_F9SEYaJzU5uflBDbqqz0WUtcaMYh8M'
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
          routes.push(`/zh/${dateStr}`, `/en/${dateStr}`)
        }
        return routes
      })()
    }
  }
})
