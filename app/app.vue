<script setup lang="ts">
// Relative time conversion for <time data-utc-time="..."> elements is handled
// by the relativeTime.client plugin (app/plugins/relativeTime.client.ts).
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
</script>

<template>
  <div>
    <NuxtPage />
    <Footer />
    <CookieBanner />
    <SpeedInsights />
    <Analytics />
  </div>
</template>
