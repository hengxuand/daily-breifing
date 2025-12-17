<script setup lang="ts">
useHead({
    title: 'Privacy Policy - Daily Briefing',
    meta: [
        { name: 'description', content: 'Privacy policy for Daily Briefing news aggregation service' }
    ]
})
</script>

<template>
    <div class="privacy-policy">
        <div class="container">
            <h1>Privacy Policy</h1>

            <p class="last-updated">Last updated: {{ new Date().toLocaleDateString() }}</p>

            <section>
                <h2>Information We Collect</h2>
                <p>Daily Briefing is a news aggregation service that respects your privacy. We collect minimal
                    information necessary to provide our service:</p>
                <ul>
                    <li><strong>Language Preference:</strong> Your choice between Chinese and English news feeds</li>
                    <li><strong>Usage Data:</strong> Anonymous analytics to improve our service (page views, session
                        duration)</li>
                    <li><strong>Technical Data:</strong> Browser type, device information, and IP address (anonymized)
                    </li>
                </ul>
            </section>

            <section>
                <h2>How We Use Your Information</h2>
                <ul>
                    <li>To provide personalized news content in your preferred language</li>
                    <li>To improve our service performance and user experience</li>
                    <li>To analyze usage patterns and optimize content delivery</li>
                    <li>To ensure security and prevent abuse of our service</li>
                </ul>
            </section>

            <section>
                <h2>Data Sources</h2>
                <p>Our service aggregates news content from publicly available sources. We do not:</p>
                <ul>
                    <li>Store personal news reading preferences beyond language choice</li>
                    <li>Track individual articles you read</li>
                    <li>Create personal profiles based on your reading habits</li>
                </ul>
            </section>

            <section>
                <h2>Third-Party Services</h2>
                <p>We may use the following third-party services:</p>
                <ul>
                    <li><strong>Analytics:</strong> Anonymous usage tracking to understand how our service is used</li>
                    <li><strong>Content Delivery:</strong> News content from various public news sources</li>
                    <li><strong>Hosting:</strong> Cloud infrastructure providers for service delivery</li>
                </ul>
            </section>

            <section>
                <h2>Data Storage and Security</h2>
                <ul>
                    <li>Data is stored securely using industry-standard encryption</li>
                    <li>We retain data only as long as necessary to provide our service</li>
                    <li>Access to personal data is restricted to authorized personnel only</li>
                </ul>
            </section>

            <section>
                <h2>Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access information we hold about you</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of analytics tracking</li>
                    <li>Change your language preferences at any time</li>
                </ul>
            </section>

            <section>
                <h2>Cookies and Local Storage</h2>
                <p>We use minimal cookies and local storage for:</p>
                <ul>
                    <li>Remembering your language preference</li>
                    <li>Basic session management</li>
                    <li>Anonymous analytics tracking</li>
                </ul>
            </section>

            <section>
                <h2>Children's Privacy</h2>
                <p>Our service is not directed to children under 13. We do not knowingly collect personal information
                    from children under 13.</p>
            </section>

            <section>
                <h2>International Users</h2>
                <p>Our service may be accessed globally. Data processing follows applicable international privacy laws
                    and regulations.</p>
            </section>

            <section>
                <h2>Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify users of significant changes by
                    updating the date at the top of this policy.</p>
            </section>

            <section>
                <h2>Contact Us</h2>
                <p>If you have questions about this privacy policy or our data practices, please contact us:</p>
                <ul>
                    <li>Email: privacy@daily-briefing.com</li>
                    <li>GitHub: Create an issue in our repository</li>
                </ul>
            </section>
        </div>
    </div>
</template>

<style scoped>
.privacy-policy {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    line-height: 1.6;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
}

h2 {
    color: #34495e;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.5rem;
}

.last-updated {
    color: #7f8c8d;
    font-style: italic;
    margin-bottom: 2rem;
}

section {
    margin-bottom: 2rem;
}

ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

li {
    margin-bottom: 0.5rem;
}

p {
    margin-bottom: 1rem;
}

strong {
    color: #2c3e50;
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

    h2 {
        font-size: 1.3rem;
    }
}
</style>
