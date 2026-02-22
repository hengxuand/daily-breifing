<script setup lang="ts">
import { getTodayDateString } from '~/utils/date';
import { detectBrowserLanguage } from '~/utils/language';

// Detect browser language and redirect to today's news page.
onMounted(() => {
    const lang = detectBrowserLanguage()
    navigateTo(`/${lang}/${getTodayDateString()}`, { replace: true })
})
</script>

<template>
    <div class="loading">Redirecting to today's news...</div>
</template>

<style scoped>
.loading {
    padding: 2rem;
    text-align: center;
    font-size: 1.2rem;
}
</style>
