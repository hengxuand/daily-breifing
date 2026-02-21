<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const lastUpdatedDate = config.public.legalLastUpdated

useHead({
    title: 'Terms of Service - Happened.info',
    link: [
        { rel: 'canonical', href: `${siteUrl}/terms-of-service` }
    ],
    meta: [
        { name: 'description', content: 'Terms of Service for Happened.info news aggregation service.' },
        { name: 'robots', content: 'noindex, follow' }
    ]
})
</script>

<template>
    <div class="terms-of-service">
        <div class="container">
            <h1>Terms of Service</h1>
            <p class="last-updated">Last updated: {{ lastUpdatedDate }}</p>

            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using Happened.info ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
            </section>

            <section>
                <h2>2. Description of Service</h2>
                <p>Happened.info is a news aggregation service that collects and displays headlines and links from various public RSS feeds and news sources. We do not host the full content of the articles; we only provide links to the original publishers.</p>
            </section>

            <section>
                <h2>3. Intellectual Property and Copyright</h2>
                <p>All news headlines, snippets, and images displayed on Happened.info are the property of their respective publishers and authors. We link to these sources under the principles of fair use for the purpose of news reporting and aggregation.</p>
                <p>If you are a publisher and wish to have your content removed from our aggregation service, please contact us, and we will promptly comply with your request.</p>
            </section>

            <section>
                <h2>4. Disclaimer of Warranties</h2>
                <p>The service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the news content linked on our site. We do not endorse the views or opinions expressed in the articles we link to.</p>
            </section>

            <section>
                <h2>5. Limitation of Liability</h2>
                <p>In no event shall Happened.info or its operators be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of our service or the content of the third-party sites we link to.</p>
            </section>

            <section>
                <h2>6. External Links</h2>
                <p>Our service consists primarily of links to external websites. We have no control over the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by your use of any such content or services available on or through any such websites.</p>
            </section>

            <section>
                <h2>7. Changes to Terms</h2>
                <p>We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date at the top of this page. Your continued use of the service after such modifications constitutes your acknowledgment and acceptance of the modified terms.</p>
            </section>

            <section>
                <h2>8. Contact Information</h2>
                <p>If you have any questions about these Terms of Service, please contact us at:</p>
                <ul>
                    <li><strong>Email:</strong> legal@happened.info</li>
                </ul>
            </section>
        </div>
    </div>
</template>

<style scoped>
.terms-of-service {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
}

.container {
    background: var(--color-bg-primary);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
}

.last-updated {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    margin-bottom: 3rem;
    border-bottom: 1px solid var(--color-border-primary);
    padding-bottom: 1rem;
}

section {
    margin-bottom: 2.5rem;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
}

p {
    margin-bottom: 1rem;
}

ul {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
}

li {
    margin-bottom: 0.5rem;
}

strong {
    color: var(--color-text-primary);
}

@media (max-width: 768px) {
    .terms-of-service {
        padding: 1.5rem 1rem;
    }
    
    .container {
        padding: 1.5rem;
    }

    h1 {
        font-size: 2rem;
    }
}
</style>