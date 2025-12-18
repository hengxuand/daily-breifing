<template>
    <div class="container">
        <div class="header">
            <div class="header-top">
                <div class="logo">
                    <img src="~/assets/images/logo.png" alt="Happened.info" />
                    <h1>Happened.info</h1>
                </div>
                <div class="lang-switcher">
                    <button @click="toggleLanguage('zh')" class="lang-button"
                        :class="{ active: selectedLanguages.has('zh') }">
                        中文
                    </button>
                    <button @click="toggleLanguage('en')" class="lang-button"
                        :class="{ active: selectedLanguages.has('en') }">
                        English
                    </button>
                </div>
            </div>

            <div class="date-navigation">
                <NuxtLink :to="getNavigationUrl(previousDate)" class="nav-button">
                    {{ 'Previous Day' }}
                </NuxtLink>

                <div class="center-group">
                    <div class="current-date">
                        {{ formattedCurrentDate }}
                    </div>
                    <NuxtLink v-if="!isToday" :to="getNavigationUrl(todayDate)" class="today-link">
                        Jump to Today
                    </NuxtLink>
                </div>

                <NuxtLink :to="getNavigationUrl(nextDate)" class="nav-button" :class="{ disabled: isToday }">
                    Next Day →
                </NuxtLink>
            </div>
        </div>

        <!-- Category Filter Bar -->
        <div v-if="!pending && !error && categories.length > 0" class="category-filter">
            <button @click="selectedCategory = null" class="filter-button"
                :class="{ active: selectedCategory === null }">
                All
                <span class="count">{{ newsItems?.length || 0 }}</span>
            </button>
            <button v-for="category in categories" :key="category" @click="selectedCategory = category"
                class="filter-button" :class="{ active: selectedCategory === category }">
                {{ category }}
                <span class="count">{{ getCategoryCount(category) }}</span>
            </button>
        </div>

        <div v-if="pending" class="loading">Loading news items...</div>

        <div v-else-if="error" class="error">
            Error loading news: {{ error.message }}
        </div>

        <div v-else-if="filteredNewsItems && filteredNewsItems.length > 0" class="news-list">
            <article v-for="item in filteredNewsItems" :key="item.id" class="news-item"
                :class="{ expanded: isExpanded(item.id) }">
                <div class="news-summary" @click="toggleItem(item.id)">
                    <div class="summary-content">
                        <h2>
                            <span v-if="item.topic" class="category">{{ item.topic }}</span>
                            {{ item.source }}
                        </h2>
                        <h2 class="title">{{ item.title }}</h2>
                    </div>
                    <div class="summary-meta">
                        <time v-if="item.pub_date" :datetime="item.pub_date">
                            {{ formatTime(item.pub_date) }}
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
                        <h3>Related Articles:</h3>
                        <div v-html="item.description"></div>
                    </div>
                </div>
            </article>
        </div>

        <div v-else class="empty">
            No news items found for this date.
        </div>
    </div>
</template>

<script setup lang="ts">
interface NewsItem {
    id: string
    topic: string
    language: string
    title: string
    source: string
    pub_date: string
    guid: string
    link: string | null
    description: string | null
    created_at: string
}

const route = useRoute()
const supabase = useSupabaseClient()
const router = useRouter()

// Get the date from the route parameter
const currentDate = computed(() => route.params.date as string)

// Multi-select language filter - initialize from URL query or default to both
const initializeLanguages = () => {
    const langQuery = route.query.lang as string | undefined
    if (langQuery) {
        const langs = langQuery.split(',')
        return new Set(langs.filter(l => l === 'zh' || l === 'en'))
    }
    return new Set(['zh', 'en'])
}
const selectedLanguages = ref<Set<string>>(initializeLanguages())

const toggleLanguage = (language: string) => {
    if (selectedLanguages.value.has(language)) {
        selectedLanguages.value.delete(language)
        // If all languages are deselected, select all
        if (selectedLanguages.value.size === 0) {
            selectedLanguages.value = new Set(['zh', 'en'])
        }
    } else {
        selectedLanguages.value.add(language)
    }
    // Trigger reactivity
    selectedLanguages.value = new Set(selectedLanguages.value)

    // Update URL based on language selection
    const langArray = Array.from(selectedLanguages.value).sort()
    if (langArray.length === 2) {
        // Both languages selected - use /date format
        router.push(`/${currentDate.value}`)
    } else {
        // Single language selected - use /lang/date format
        router.push(`/${langArray[0]}/${currentDate.value}`)
    }
}

// Helper to generate navigation URLs based on current language selection
const getNavigationUrl = (date: string | undefined) => {
    if (!date) return '/'
    const langArray = Array.from(selectedLanguages.value).sort()
    if (langArray.length === 2) {
        return `/${date}`
    } else {
        return `/${langArray[0]}/${date}`
    }
}

// Get today's date in local time
const todayDate = computed(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// Check if current date is today
const isToday = computed(() => {
    return currentDate.value === todayDate.value
})

// Calculate previous and next dates
const previousDate = computed(() => {
    const date = new Date(currentDate.value)
    date.setDate(date.getDate() - 1)
    return date.toISOString().split('T')[0]
})

const nextDate = computed(() => {
    const date = new Date(currentDate.value)
    date.setDate(date.getDate() + 1)
    return date.toISOString().split('T')[0]
})

// Format the current date for display
const formattedCurrentDate = computed(() => {
    const date = new Date(currentDate.value + 'T00:00:00Z')
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    })
})

// Fetch news items for the selected date
const { data: newsItems, pending, error } = await useAsyncData(
    `news-items-${currentDate.value}-both`,
    async () => {
        const startOfDay = `${currentDate.value}T00:00:00.000Z`
        const endOfDay = `${currentDate.value}T23:59:59.999Z`

        const languages = Array.from(selectedLanguages.value)
        console.log(`Querying google_news_rss (languages: ${languages.join(', ')}) -> Range: ${startOfDay} to ${endOfDay}`)

        const { data, error } = await supabase
            .from('google_news_rss')
            .select('*')
            .in('language', languages)
            .gte('pub_date', startOfDay)
            .lte('pub_date', endOfDay)
            .order('pub_date', { ascending: false })

        if (error) throw error

        return data as NewsItem[]
    },
    {
        watch: [currentDate, selectedLanguages]
    }
)

const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Category filtering
const selectedCategory = ref<string | null>(null)

// Extract unique topics from news items
const categories = computed(() => {
    if (!newsItems.value) return []
    const uniqueTopics = new Set(
        newsItems.value
            .map(item => item.topic)
            .filter((topic): topic is string => topic !== null && topic !== '')
    )
    return Array.from(uniqueTopics).sort()
})

// Filter news items by selected category
const filteredNewsItems = computed(() => {
    if (!newsItems.value) return []
    if (selectedCategory.value === null) return newsItems.value
    return newsItems.value.filter(item => item.topic === selectedCategory.value)
})

// Get count of items in a category
const getCategoryCount = (category: string) => {
    if (!newsItems.value) return 0
    return newsItems.value.filter(item => item.topic === category).length
}

// Expanded state
const expandedItems = ref<Set<string>>(new Set())
const toggleItem = (id: string) => {
    if (expandedItems.value.has(id)) {
        expandedItems.value.delete(id)
    } else {
        expandedItems.value.add(id)
    }
}
const isExpanded = (id: string) => expandedItems.value.has(id)
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
    background: transparent;
    cursor: pointer;
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
}
</style>
