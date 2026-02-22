<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const lastUpdatedDate = config.public.legalLastUpdated

useHead({
    title: 'Privacy Policy - Happened.info',
    link: [
        { rel: 'canonical', href: `${siteUrl}/privacy-policy` }
    ],
    meta: [
        { name: 'description', content: 'Privacy policy for Happened.info news aggregation service. Learn how we handle your data in compliance with 2026 standards.' },
        { name: 'robots', content: 'noindex, follow' } // Standard practice for legal pages
    ]
})
</script>

<template>
    <div class="privacy-policy">
        <div class="container">
            <h1>Privacy Policy</h1>
            <p class="last-updated">Last updated: {{ lastUpdatedDate }}</p>

            <section>
                <h2>1. Introduction</h2>
                <p>Happened.info ("we," "our," or "us") is a news aggregation service. We respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit Happened.info.</p>
            </section>

            <section>
                <h2>2. Information We Collect</h2>
                <p>We collect minimal information to provide and improve our service:</p>
                <ul>
                    <li><strong>Language Preference:</strong> We store your choice between Chinese and English news feeds to provide a consistent experience.</li>
                    <li><strong>Technical Data:</strong> Like most websites, we collect anonymous data such as IP addresses (anonymized), browser type, and device information to ensure site security and performance.</li>
                    <li><strong>Usage Data:</strong> We use anonymous analytics to understand page views and session duration. This data cannot be used to identify you personally.</li>
                </ul>
            </section>

            <section>
                <h2>3. Data Sources & External Links</h2>
                <p>Happened.info aggregates headlines and links from public RSS feeds. Our service functions as a directory:</p>
                <ul>
                    <li>We only store the <strong>news title</strong> and the <strong>original source URL</strong>.</li>
                    <li>When you click a headline, you are directed to the original publisher's website.</li>
                    <li>We are not responsible for the privacy practices or content of these third-party websites. We encourage you to read the privacy policies of any site you visit.</li>
                </ul>
            </section>

            <section>
                <h2>4. Data Retention</h2>
                <p>In compliance with 2026 privacy standards, we disclose our retention periods:</p>
                <ul>
                    <li><strong>Preference Data:</strong> Your language settings are stored in your browser's local storage and remain until you clear your cache.</li>
                    <li><strong>Analytics Data:</strong> Anonymous technical logs are retained for a maximum of 12 months before being aggregated or deleted.</li>
                </ul>
            </section>

            <section>
                <h2>5. California Privacy Rights (CCPA/CPRA)</h2>
                <p>If you are a California resident, you have specific rights regarding your personal information:</p>
                <ul>
                    <li><strong>Right to Know:</strong> You can request to know what categories of data we have collected.</li>
                    <li><strong>Right to Delete:</strong> You can request that we delete the minimal data we hold.</li>
                    <li><strong>Right to Correct:</strong> You have the right to request that we correct inaccurate information (e.g., if your language preference is incorrectly saved).</li>
                    <li><strong>Right to Opt-Out:</strong> We do not "sell" your data. However, we honor <strong>Global Privacy Control (GPC)</strong> signals. If your browser sends a GPC signal, we automatically opt you out of any non-essential analytics tracking.</li>
                </ul>
            </section>

            <section>
                <h2>6. Cookies and Local Storage</h2>
                <p>We use essential local storage to remember your language choice. We do not use "tracking cookies" for cross-site advertising. You can manage or disable these through your browser settings, though some features of the site may not function correctly without them.</p>
            </section>

            <section>
                <h2>7. Children's Privacy</h2>
                <p>Our service is a general audience news aggregator and is not directed to children under the age of 13. We do not knowingly collect personal information from children.</p>
            </section>

            <section>
                <h2>8. Contact Us</h2>
                <p>To exercise your privacy rights or ask questions, please contact us via the following methods:</p>
                <ul>
                    <li><strong>Email:</strong> privacy@happened.info</li>
                    <li><strong>GitHub:</strong> Open an issue in our official repository for public transparency.</li>
                </ul>
            </section>
        </div>
    </div>

</template>

<style scoped>
.privacy-policy {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
    font-family: system-ui, -apple-system, sans-serif;
}

.container {
    background: var(--color-bg-primary);
    padding: 3rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border-primary);
    box-shadow: var(--shadow-sm);
}

h1 {
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
    font-weight: 800;
}

h2 {
    color: var(--color-text-primary);
    margin-top: 2.5rem;
    margin-bottom: 1.2rem;
    font-size: 1.6rem;
    border-bottom: 1px solid var(--color-border-secondary);
    padding-bottom: 0.5rem;
}

.last-updated {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    margin-bottom: 3rem;
    display: block;
}

section {
    margin-bottom: 2.5rem;
}

ul {
    padding-left: 1.5rem;
    margin-top: 1rem;
}

li {
    margin-bottom: 0.8rem;
}

p {
    margin-bottom: 1.2rem;
}

strong {
    color: var(--color-text-primary);
}

@media (max-width: 768px) {
    .privacy-policy {
        padding: 1rem;
    }

    .container {
        padding: 1.5rem;
    }

    h1 {
        font-size: 2rem;
    }
}
</style>