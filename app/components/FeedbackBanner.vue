<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const STORAGE_KEY = 'feedback-banner-dismissed'
const { public: { devMode } } = useRuntimeConfig()

onMounted(() => {
  const dismissed = localStorage.getItem(STORAGE_KEY)
  if (!dismissed) {
    // Delay slightly so it doesn't stack on top of cookie banner animation
    setTimeout(() => {
      isVisible.value = true
    }, 1800)
  }
})

const dismiss = () => {
  if (!devMode) {
    localStorage.setItem(STORAGE_KEY, 'true')
  }
  isVisible.value = false
}
</script>

<template>
  <Transition name="slide-down">
    <div v-if="isVisible" class="feedback-banner" role="banner">
      <div class="feedback-content">
        <div class="feedback-text">
          <span class="badge">Early Access</span>
          <span>This is a personal project, still in early development. Got ideas or feedback? I'd love to hear from you at <b>SHAUNDO@gmail.com</b>!</span>
        </div>
        <div class="feedback-actions">
          <button class="close-btn" @click="dismiss" aria-label="Dismiss">
            <Icon name="lucide:x" size="16" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.feedback-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--gradient-primary);
  color: white;
  padding: 0.7rem 1rem;
  z-index: 9998;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.feedback-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.feedback-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  flex: 1;
}

.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
}

.feedback-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.email-btn {
  background: white;
  color: var(--color-primary-dark);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  white-space: nowrap;
}

.email-btn:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.close-btn {
  background-color: white;
  color: var(--color-primary-dark);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

/* Slide-down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (max-width: 600px) {
  .feedback-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .feedback-actions {
    width: 100%;
    justify-content: space-between;
  }

  .email-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
