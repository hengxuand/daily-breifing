// https://nuxt.com/docs/api/configuration/nuxt-config

/**
 * Generates prerender routes for the last `days` days in all supported languages.
 * Pages beyond this window are generated on-demand via ISR.
 */
function getPrerenderRoutes(days = 7): string[] {
  const routes: string[] = []
  const today = new Date()
  for (let i = 1; i <= days; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    routes.push(`/zh/${dateStr}`, `/en/${dateStr}`)
  }
  return routes
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@nuxt/icon'],
  css: ['~/assets/css/theme.css'],
  runtimeConfig: {
    public: {
      siteUrl: 'https://happened.info',
      // NOTE: Update this date whenever terms-of-service.vue or privacy-policy.vue are modified.
      legalLastUpdated: 'February 21, 2026',
      // Override with NUXT_PUBLIC_DEV_MODE=false to disable dev mode behaviour in staging/prod.
      devMode: process.env.NODE_ENV !== 'production'
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
      routes: getPrerenderRoutes()
    }
  }
})
