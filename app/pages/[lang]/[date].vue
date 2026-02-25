<template>
    <div class="container">
        <div class="header">
            <div class="header-top">
                <div class="logo">
                    <img src="~/assets/images/logo.png" alt="Happened.info" />
                    <h1>Happened.info</h1>
                </div>
                <div class="lang-switcher">
                    <NuxtLink :to="`/zh/${paramDate}`" class="lang-button" :class="{ active: lang !== 'en' }">中文
                    </NuxtLink>
                    <NuxtLink :to="`/en/${paramDate}`" class="lang-button" :class="{ active: lang === 'en' }">English
                    </NuxtLink>
                </div>
            </div>

            <div class="date-navigation">
                <NuxtLink :to="`/${lang}/${previousDate}`" class="nav-button">
                    {{ lang === 'en' ? '← Previous Day' : '← 前一天' }}
                </NuxtLink>

                <div class="center-group">
                    <div class="current-date">
                        {{ formattedCurrentDate }}
                    </div>
                    <NuxtLink v-if="!isToday" :to="`/${lang}/${todayDate}`" class="today-link">
                        {{ lang === 'en' ? 'Jump to Today' : '回到今天' }}
                    </NuxtLink>
                </div>

                <NuxtLink :to="`/${lang}/${nextDate}`" class="nav-button" :class="{ disabled: isFuture }">
                    {{ lang === 'en' ? 'Next Day →' : '后一天 →' }}
                </NuxtLink>
            </div>
        </div>

        <!-- Category Filter Bar -->
        <div v-if="!pending && !error && categories.length > 0" class="category-filter">
            <button @click="selectedCategory = null" class="filter-button"
                :class="{ active: selectedCategory === null }">
                {{ lang === 'en' ? 'All' : '全部' }}
                <span class="count">{{ newsItems?.length || 0 }}</span>
            </button>
            <button v-for="category in categories" :key="category" @click="selectedCategory = category"
                class="filter-button" :class="{ active: selectedCategory === category }">
                {{ translateTopic(category) }}
                <span class="count">{{ getCategoryCount(category) }}</span>
            </button>
            <div class="search-box">
                <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    :class="{ 'has-value': searchQuery.length > 0 }"
                    placeholder="Search"
                    aria-label="Search"
                />
                <button
                    v-if="searchQuery.length > 0"
                    class="search-clear"
                    @click="searchQuery = ''"
                    aria-label="Clear search"
                >&#x2715;</button>
            </div>
        </div>

        <div v-if="pending" class="loading">{{ lang === 'en' ? 'Loading news items...' : '加载新闻中...' }}</div>

        <div v-else-if="error" class="error">
            {{ lang === 'en' ? 'Error loading news:' : '加载新闻出错:' }} {{ error.message }}
        </div>

        <div v-else-if="filteredNewsItems && filteredNewsItems.length > 0" class="news-list">
            <article v-for="item in filteredNewsItems" :key="item.id" class="news-item"
                :class="{ expanded: isExpanded(item.id) }">
                <div class="news-summary" @click="toggleItem(item.id)">
                    <div class="summary-content">
                        <h2>
                            <span v-if="item.topic" class="category">{{ translateTopic(item.topic) }}</span>
                            <span class="source">{{ item.source }}</span>
                        </h2>
                        <h2 class="title">{{ item.title }}</h2>
                    </div>
                    <div class="summary-meta">
                        <time v-if="item.pub_date" :datetime="item.pub_date" :data-utc-time="item.pub_date" :data-lang="lang">
                            {{ displayTime(item.pub_date) }}
                        </time>
                        <div class="chevron">
                            <svg width="28" height="28" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div v-show="isExpanded(item.id)" class="news-details">
                    <div v-if="item.description" class="related-articles">
                        <h3>{{ lang === 'en' ? 'Related Articles:' : '相关报道:' }}</h3>
                        <div v-html="item.description"></div>
                    </div>
                </div>
            </article>
        </div>

        <div v-else class="empty">
            {{ lang === 'en' ? 'No news items found for this date.' : '当天没有新闻' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTopics } from '~/composables/useTopics'
import type { NewsItem, SupportedLang } from '~/types'
import { getTodayDateString, getOffsetDateString, formatDisplayDate, formatTimeUTC } from '~/utils/date'

// ─── Route & reactive state ───────────────────────────────────────────────────

const route    = useRoute()
const supabase = useSupabaseClient()

const lang      = computed<SupportedLang>(() => route.params.lang === 'en' ? 'en' : 'zh')
const paramDate = computed(() => route.params.date as string)

const { translateTopic } = useTopics(lang)

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Today's date as YYYY-MM-DD (local time). */
const todayDate = computed(getTodayDateString)

const isToday  = computed(() => paramDate.value === todayDate.value)
const isFuture = computed(() => paramDate.value >  todayDate.value)

const previousDate        = computed(() => getOffsetDateString(paramDate.value, -1))
const nextDate            = computed(() => getOffsetDateString(paramDate.value, +1))
const formattedCurrentDate = computed(() =>
    formatDisplayDate(paramDate.value, lang.value === 'en' ? 'en-US' : 'zh-CN')
)

// ─── Data fetching ────────────────────────────────────────────────────────────

const { data: newsItems, pending, error } = await useAsyncData(
    `news-${paramDate.value}-${lang.value}`,
    async () => {
        // Use explicit UTC boundaries so SSG output is consistent regardless of
        // the server/client timezone.
        const startOfDay = `${paramDate.value}T00:00:00.000Z`
        const endOfDay   = `${paramDate.value}T23:59:59.999Z`

        const { data, error } = await supabase
            .from('google_news_rss')
            .select('*')
            .eq('language', lang.value)
            .gte('pub_date', startOfDay)
            .lte('pub_date', endOfDay)
            .order('pub_date', { ascending: false })

        if (error) throw error
        return data as NewsItem[]
    },
    { watch: [paramDate, lang] }
)

// ─── Time display ─────────────────────────────────────────────────────────────

/** SSR fallback: displays raw UTC time until the client plugin converts it to a relative string. */
const displayTime = (dateString: string) =>
    formatTimeUTC(dateString, lang.value === 'en' ? 'en-US' : 'zh-CN')

// ─── Category & search filtering ─────────────────────────────────────────────

const selectedCategory = ref<string | null>(null)
const searchQuery      = ref('')

const categories = computed<string[]>(() => {
    if (!newsItems.value) return []
    return [...new Set(
        newsItems.value
            .map(item => item.topic)
            .filter((t): t is string => Boolean(t))
    )].sort()
})

const filteredNewsItems = computed<NewsItem[]>(() => {
    let items = newsItems.value ?? []

    if (selectedCategory.value !== null) {
        items = items.filter(item => item.topic === selectedCategory.value)
    }

    const query = searchQuery.value.trim().toLowerCase()
    if (query.length >= 3) {
        items = items.filter(item => item.title.toLowerCase().includes(query))
    }

    return items
})

const getCategoryCount = (category: string): number =>
    newsItems.value?.filter(item => item.topic === category).length ?? 0

// ─── Expand / collapse ────────────────────────────────────────────────────────

const expandedItems = ref(new Set<string>())

const toggleItem  = (id: string) => {
    if (expandedItems.value.has(id)) expandedItems.value.delete(id)
    else expandedItems.value.add(id)
}
const isExpanded = (id: string) => expandedItems.value.has(id)

// ─── SEO / hreflang ───────────────────────────────────────────────────────────

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string

useHead(computed(() => {
    const date   = paramDate.value
    const isEn   = lang.value === 'en'
    const zhUrl  = `${siteUrl}/zh/${date}`
    const enUrl  = `${siteUrl}/en/${date}`
    const canonical = isEn ? enUrl : zhUrl

    const pageTitle = isEn
        ? `World News – ${formattedCurrentDate.value} | Happened.info`
        : `每日新闻 – ${formattedCurrentDate.value} | Happened.info`

    const description = isEn
        ? `A curated daily digest of global news headlines for ${formattedCurrentDate.value}. Read today's top stories in English.`
        : `${formattedCurrentDate.value} 的全球新闻摘要，为海外华人提供中文每日资讯。`

    const ogImage = `${siteUrl}/og-image.png`

    return {
        htmlAttrs: { lang: isEn ? 'en' : 'zh-Hans' },
        title: pageTitle,
        meta: [
            { name: 'description', content: description },
            // Open Graph
            { property: 'og:title',            content: pageTitle },
            { property: 'og:description',       content: description },
            { property: 'og:url',               content: canonical },
            { property: 'og:type',              content: 'website' },
            { property: 'og:image',             content: ogImage },
            { property: 'og:locale',            content: isEn ? 'en_US' : 'zh_CN' },
            { property: 'og:locale:alternate',  content: isEn ? 'zh_CN' : 'en_US' },
            // Twitter / X Card
            { name: 'twitter:card',        content: 'summary_large_image' },
            { name: 'twitter:title',       content: pageTitle },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image',       content: ogImage },
        ],
        link: [
            // Canonical – always points to the current language URL
            { rel: 'canonical', href: canonical },
            // hreflang alternates – tell Google which URL serves which language/region
            { rel: 'alternate', hreflang: 'zh',        href: zhUrl },
            { rel: 'alternate', hreflang: 'zh-Hans',   href: zhUrl },   // Simplified Chinese explicitly
            { rel: 'alternate', hreflang: 'en',        href: enUrl },
            // x-default: the fallback for users whose language is not explicitly listed
            { rel: 'alternate', hreflang: 'x-default', href: enUrl },
        ]
    }
}))
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
}

.header {
    margin-bottom: 2rem;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.logo img {
    height: 48px;
    width: auto;
}

h1 {
    color: var(--color-text-primary);
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
}

.lang-switcher {
    display: flex;
    gap: 0.5rem;
}

.lang-button {
    padding: var(--spacing-sm) var(--spacing-md);
    text-decoration: none;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    transition: var(--transition-fast);
}

.lang-button:hover {
    background: var(--color-bg-hover);
    border-color: var(--color-primary);
}

.lang-button.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.date-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--gradient-bg);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-md);
}

.current-date {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-align: center;
}

.center-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
}

.today-link {
    font-size: 0.875rem;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
}

.today-link:hover {
    text-decoration: underline;
}

.nav-button {
    padding: 0.75rem var(--spacing-lg);
    background: var(--gradient-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: var(--transition-fast);
    white-space: nowrap;
    box-shadow: var(--shadow-sm);
}

.nav-button:hover:not(.disabled) {
    background: var(--gradient-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
}

.nav-button.disabled {
    background: var(--color-disabled);
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
}

.loading,
.error,
.empty {
    padding: var(--spacing-xl);
    text-align: center;
    font-size: 1.2rem;
}

.error {
    color: var(--color-error);
    background: var(--color-error-bg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-error-border);
}

.news-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.news-item {
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: var(--transition-fast);
}

.news-item:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-light);
}

.news-summary {
    padding: var(--spacing-lg);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
}

.summary-content {
    flex: 1;
}

.summary-content h2.title {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--color-text-primary);
    margin-top: var(--spacing-md);
}

.summary-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    color: var(--color-text-muted);
    font-size: 1.125rem;
    white-space: nowrap;
    padding-top: var(--spacing-xs);
}

.chevron {
    transition: var(--transition-smooth);
    display: flex;
    align-items: center;
    color: var(--color-text-muted);
}

.news-item.expanded .chevron {
    transform: rotate(180deg);
}

.news-details {
    padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
    border-top: 1px solid var(--color-border-secondary);
    background: var(--color-bg-detail);
}

.news-item h2 {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--color-text-primary);
}

.news-item h2 .category {
    background: var(--gradient-primary);
    color: white;
    padding: var(--spacing-xs) 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
}

.news-item h2 .source {
    font-weight: 400;
    font-size: 0.95rem;
    color: var(--color-text-secondary);
}

.related-articles {
    margin: var(--spacing-md) 0 0 0;
    padding: var(--spacing-md);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
}

.related-articles h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    color: var(--color-text-secondary);
    font-weight: 600;
}

.related-articles :deep(ol) {
    margin: 0;
    padding-left: var(--spacing-lg);
    list-style: decimal;
}

.related-articles :deep(li) {
    margin-bottom: var(--spacing-sm);
    line-height: 1.6;
}

.related-articles :deep(a) {
    color: var(--color-primary-dark);
    text-decoration: none;
    font-weight: 500;
}

.related-articles :deep(a:hover) {
    color: var(--color-primary);
    text-decoration: underline;
}

.related-articles :deep(font) {
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    margin-left: var(--spacing-sm);
}

.category-filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    padding: var(--spacing-lg);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-xl);
}

.filter-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: var(--transition-fast);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.filter-button:hover {
    background: var(--color-bg-hover);
    border-color: var(--color-primary);
    transform: translateY(-1px);
}

.filter-button.active {
    background: var(--gradient-primary);
    color: white;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
}

.filter-button .count {
    background: var(--opacity-overlay);
    padding: 0.125rem var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    font-weight: 600;
}

.filter-button.active .count {
    background: var(--opacity-overlay-light);
}

.search-box {
    margin-left: auto;
    flex-shrink: 0;
    width: 200px;
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
    transition: var(--transition-fast);
}

.search-input.has-value {
    padding-right: 2rem;
}

.search-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
    background: var(--color-bg-primary);
}

.search-input::placeholder {
    color: var(--color-text-muted);
    font-weight: 400;
}

.search-clear {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    transition: var(--transition-fast);
}

.search-clear:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-hover);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .header-top {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .logo {
        width: 100%;
        justify-content: center;
    }

    .logo img {
        height: 36px;
    }

    h1 {
        font-size: 1.5rem;
    }

    .lang-switcher {
        width: 100%;
        justify-content: center;
    }

    .lang-button {
        flex: 1;
        text-align: center;
    }

    .date-navigation {
        flex-direction: column;
        gap: 0.75rem;
        padding: var(--spacing-md);
    }

    .nav-button {
        width: 100%;
        text-align: center;
        padding: 0.75rem var(--spacing-md);
    }

    .center-group {
        order: -1;
        width: 100%;
    }

    .current-date {
        font-size: 1.1rem;
    }

    .category-filter {
        gap: 0.5rem;
        padding: var(--spacing-md);
    }

    .filter-button {
        font-size: 0.85rem;
        padding: 0.4rem 0.75rem;
    }

    .search-box {
        width: 100%;
        flex-shrink: 1;
        margin-left: 0;
    }

    .news-summary {
        flex-direction: column;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
    }

    .summary-meta {
        width: 100%;
        justify-content: space-between;
        padding-top: 0;
    }

    .news-item h2 {
        font-size: 1.1rem;
    }

    .news-item h2 .category {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
    }

    .news-details {
        padding: 0 var(--spacing-md) var(--spacing-md) var(--spacing-md);
    }

    .related-articles {
        padding: var(--spacing-sm);
    }

    .related-articles h3 {
        font-size: 0.9rem;
    }

    .related-articles :deep(li) {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0.75rem;
    }

    h1 {
        font-size: 1.25rem;
    }

    .logo img {
        height: 32px;
    }

    .current-date {
        font-size: 1rem;
    }

    .news-item h2 {
        font-size: 1rem;
    }

    .summary-meta {
        font-size: 1rem;
    }

    .filter-button {
        font-size: 0.8rem;
        padding: 0.35rem 0.6rem;
    }

    .filter-button .count {
        font-size: 0.75rem;
    }

    .search-input {
        font-size: 0.8rem;
        padding: 0.35rem 0.6rem;
    }
}
</style>
