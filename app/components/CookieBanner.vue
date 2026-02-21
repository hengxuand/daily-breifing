<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  // Check if user has already accepted cookies
  const hasAccepted = localStorage.getItem('cookie-consent')
  if (!hasAccepted) {
    // Small delay so it doesn't pop up instantly
    setTimeout(() => {
      isVisible.value = true
    }, 1000)
  }
})

const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'true')
  isVisible.value = false
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="cookie-banner">
      <div class="cookie-content">
        <p>
          We use essential cookies and analytics to improve your experience. 
          By continuing to use this site, you agree to our 
          <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink> and 
          <NuxtLink to="/terms-of-service">Terms of Service</NuxtLink>.
        </p>
        <button @click="acceptCookies" class="accept-btn">Got it</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-primary-dark);
  color: white;
  padding: 1rem;
  z-index: 9999;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.cookie-content p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.cookie-content a {
  color: white;
  text-decoration: underline;
  font-weight: 500;
}

.cookie-content a:hover {
  color: #ccc;
}

.accept-btn {
  background-color: white;
  color: var(--color-primary-dark);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
}

.accept-btn:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

/* Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .cookie-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .accept-btn {
    width: 100%;
  }
}
</style>