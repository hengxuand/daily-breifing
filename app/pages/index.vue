<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
    const d = new Date()
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    navigateTo(`/${today}`, { replace: true, external: false })
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
