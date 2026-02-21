<template>
    <footer class="footer">
        <div class="footer-links">
            <span>© 2026 Happened.info</span>
            <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms-of-service">Terms of Service</NuxtLink>
            <NuxtLink to="/privacy-policy#opt-out">Your Privacy Choices</NuxtLink>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-top: 1px solid var(--color-border-primary);
    text-align: center;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
}

.footer-links,
.footer-links span,
.footer-links a {
    color: var(--color-text-primary);
    font-size: 0.9rem;
}

.footer-links a {
    text-decoration: none;
    transition: var(--transition-fast);
}

.footer-links a:hover {
    color: var(--color-text-secondary);
    opacity: 0.7;
}

@media (max-width: 768px) {
    .footer {
        margin-top: var(--spacing-lg);
        padding-top: var(--spacing-lg);
        padding-bottom: var(--spacing-lg);
    }

    .footer-links {
        gap: var(--spacing-md);
    }
}
</style>
