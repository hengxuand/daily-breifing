<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { Analytics } from '@vercel/analytics/nuxt'
import { onMounted } from 'vue'

// Convert UTC times to relative time (e.g., "2 hours ago")
onMounted(() => {
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

  const convertTimeElement = (el: Element) => {
    const utcTime = el.getAttribute('data-utc-time')
    const lang = el.getAttribute('data-lang') || 'en'
    
    if (!utcTime) return
    
    const relativeTime = formatRelativeTime(utcTime, lang)
    el.textContent = relativeTime
  }
  
  // Convert any existing time elements
  const timeElements = document.querySelectorAll('time[data-utc-time]')
  timeElements.forEach(convertTimeElement)
  
  // Watch for new time elements added to the DOM (e.g., during page transitions)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const el = node as Element
          if (el.matches('time[data-utc-time]')) {
            convertTimeElement(el)
          }
          // Also check children
          el.querySelectorAll('time[data-utc-time]').forEach(convertTimeElement)
        }
      })
    })
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
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
