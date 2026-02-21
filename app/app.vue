<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
</script>

<template>
  <div>
    <NuxtPage />
    <Footer />
    <SpeedInsights />
    <Analytics />
  </div>
</template>
