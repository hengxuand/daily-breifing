<template>
    <footer class="footer">
        <div class="footer-content">
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    margin-top: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    border-top: 1px solid #eee;
    text-align: center;
}

.footer-content {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.footer-content a {
    color: #0066cc;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-content a:hover {
    color: #0052a3;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .footer {
        margin-top: 1rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    .footer-content {
        gap: 1rem;
    }
}
</style>
