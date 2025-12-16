<script setup lang="ts">
// Detect browser language and redirect accordingly
const getBrowserLanguage = () => {
    if (typeof navigator !== 'undefined') {
        const languages = navigator.languages || [navigator.language]
        for (const lang of languages) {
            if (lang.startsWith('zh')) return 'zh'
            if (lang.startsWith('en')) return 'en'
        }
    }
    // Default to Chinese if no match found
    return 'zh'
}

// Redirect to today's date
const d = new Date()
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const browserLang = getBrowserLanguage()
navigateTo(`/${browserLang}/${today}`, { replace: true, external: false })
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
