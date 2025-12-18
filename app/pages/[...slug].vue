<script setup lang="ts">
// Catch-all route for unknown URLs - redirect to home page
definePageMeta({
    middleware: () => {
        return navigateTo('/', { replace: true })
    }
})
</script>

<template>
    <div></div>
</template>
