<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
import { onMounted, nextTick } from 'vue'

// Convert UTC times to relative time (e.g., "2 hours ago")
onMounted(async () => {
  // Wait for all child components to finish rendering
  await nextTick()
  
  const timeElements = document.querySelectorAll('time[data-utc-time]')
  
  const formatRelativeTime = (utcDateString: string, lang: string): string => {
    const utcDate = new Date(utcDateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - utcDate.getTime()) / 1000)
    
    let interval = seconds / 31536000 // years
    if (interval >= 1) {
      const count = Math.floor(interval)
      return lang === 'zh' ? `${count}年前` : `${count} year${count > 1 ? 's' : ''} ago`
    }
    
    interval = seconds / 2592000 // months
    if (interval >= 1) {
      const count = Math.floor(interval)
      return lang === 'zh' ? `${count}个月前` : `${count} month${count > 1 ? 's' : ''} ago`
    }
    
    interval = seconds / 86400 // days
    if (interval >= 1) {
      const count = Math.floor(interval)
      return lang === 'zh' ? `${count}天前` : `${count} day${count > 1 ? 's' : ''} ago`
    }
    
    interval = seconds / 3600 // hours
    if (interval >= 1) {
      const count = Math.floor(interval)
      return lang === 'zh' ? `${count}小时前` : `${count} hour${count > 1 ? 's' : ''} ago`
    }
    
    interval = seconds / 60 // minutes
    if (interval >= 1) {
      const count = Math.floor(interval)
      return lang === 'zh' ? `${count}分钟前` : `${count} minute${count > 1 ? 's' : ''} ago`
    }
    
    return lang === 'zh' ? '刚刚' : 'just now'
  }
  
  timeElements.forEach((el) => {
    const utcTime = el.getAttribute('data-utc-time')
    const lang = el.getAttribute('data-lang') || 'en'
    
    if (!utcTime) return
    
    const relativeTime = formatRelativeTime(utcTime, lang)
    el.textContent = relativeTime
  })
})
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
