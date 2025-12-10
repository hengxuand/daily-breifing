<template>
    <div class="container">
        <div class="header">
            <div class="header-top">
                <h1>Daily Briefing - {{ lang === 'en' ? 'English News' : '中文报道' }}</h1>
                <div class="lang-switcher">
                    <NuxtLink :to="`/zh/${currentDate}`" class="lang-button" :class="{ active: lang !== 'en' }">中文</NuxtLink>
                    <NuxtLink :to="`/en/${currentDate}`" class="lang-button" :class="{ active: lang === 'en' }">English</NuxtLink>
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

                <NuxtLink :to="`/${lang}/${nextDate}`" class="nav-button" :class="{ disabled: isToday }">
                    {{ lang === 'en' ? 'Next Day →' : '后一天 →' }}
                </NuxtLink>
            </div>
        </div>

        <div v-if="pending" class="loading">{{ lang === 'en' ? 'Loading news items...' : '加载新闻中...' }}</div>

        <div v-else-if="error" class="error">
            {{ lang === 'en' ? 'Error loading news:' : '加载新闻出错:' }} {{ error.message }}
        </div>

        <div v-else-if="newsItems && newsItems.length > 0" class="news-list">
            <article v-for="item in newsItems" :key="item.id" class="news-item" :class="{ expanded: isExpanded(item.id) }">
                <div class="news-summary" @click="toggleItem(item.id)">
                    <div class="summary-content">
                        <div class="news-header">
                            <span v-if="item.category" class="category">{{ item.category }}</span>
                            <span class="source">{{ item.source }}</span>
                        </div>
                        <h2>{{ item.title }}</h2>
                    </div>
                    <div class="summary-meta">
                        <time v-if="item.pub_date" :datetime="item.pub_date">
                            {{ formatTime(item.pub_date) }}
                        </time>
                        <div class="chevron">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div v-show="isExpanded(item.id)" class="news-details">
                    <div v-if="item.google_link" class="original-link-wrapper">
                        <a :href="item.google_link" target="_blank" class="original-link">
                            {{ lang === 'en' ? 'Read full article' : '阅读全文' }} →
                        </a>
                    </div>
                    
                    <div v-if="item.google_rss_description" class="related-articles">
                        <h3>{{ lang === 'en' ? 'Related Articles:' : '相关报道:' }}</h3>
                        <div v-html="item.google_rss_description"></div>
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
interface NewsItem {
    id: string
    category: string | null
    title: string | null
    source: string | null
    created_at: string
    guid: string
    google_link: string | null
    pub_date: string | null
    google_rss_description: string | null
}

const route = useRoute()
const supabase = useSupabaseClient()

// Get language from route param
const lang = computed(() => (route.params.lang === 'en' ? 'en' : 'zh'))

// Get the date from the route parameter
const currentDate = computed(() => route.params.date as string)

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
    // Parse as UTC by appending 'Z'
    const date = new Date(currentDate.value + 'T00:00:00Z')
    return date.toLocaleDateString(lang.value === 'en' ? 'en-US' : 'zh-CN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Force UTC display to match the canonical content
    })
})

// Fetch news items for the selected date
const { data: newsItems, pending, error } = await useAsyncData(
    `news-items-${currentDate.value}-${lang.value}`,
    async () => {
        // Get start and end of the day in UTC (Canonical Timezone)
        // This ensures consistent Static Site Generation (SSG) results regardless of server/client location
        const startOfDay = `${currentDate.value}T00:00:00.000Z`
        const endOfDay = `${currentDate.value}T23:59:59.999Z`

        const tableName = lang.value === 'en' ? 'news_items_en' : 'news_items_zh'

        console.log(`Querying ${tableName} (Canonical UTC) -> Range: ${startOfDay} to ${endOfDay}`)

        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .gte('pub_date', startOfDay)
            .lte('pub_date', endOfDay)
            .order('pub_date', { ascending: false })

        if (error) throw error

        console.group(`Fetched ${data?.length} items from ${tableName} for date ${currentDate.value}`)
        data?.forEach((item, index) => {
            console.log(`Item ${index + 1}:`, { title: item.title, pub_date: item.pub_date })
        })
        console.groupEnd()

        return data as NewsItem[]
    },
    {
        watch: [currentDate, lang]
    }
)

const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })
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

h1 {
    color: #2c3e50;
    margin: 0;
    font-size: 2.5rem;
}

.lang-switcher {
    display: flex;
    gap: 0.5rem;
}

.lang-button {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #2c3e50;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.lang-button:hover {
    background: #f5f7fa;
}

.lang-button.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

.date-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.current-date {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
}

.center-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.today-link {
    font-size: 0.875rem;
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
}

.today-link:hover {
    text-decoration: underline;
}

.nav-button {
    padding: 0.75rem 1.5rem;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    transition: background 0.2s;
    white-space: nowrap;
}

.nav-button:hover:not(.disabled) {
    background: #2980b9;
}

.nav-button.disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    pointer-events: none;
}

.loading,
.error,
.empty {
    padding: 2rem;
    text-align: center;
    font-size: 1.2rem;
}

.error {
    color: #a93226;
    background: #fadbd8;
    border-radius: 8px;
}

.news-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.news-item {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.2s;
}

.news-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-summary {
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.summary-content {
    flex: 1;
}

.summary-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #95a5a6;
    font-size: 0.875rem;
    white-space: nowrap;
    padding-top: 0.25rem;
}

.chevron {
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    color: #95a5a6;
}

.news-item.expanded .chevron {
    transform: rotate(180deg);
}

.news-details {
    padding: 0 1.5rem 1.5rem 1.5rem;
    border-top: 1px solid #f0f2f5;
    background: #fcfdfd;
}

.news-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.category {
    background: #3498db;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-weight: 600;
}

.source {
    color: #7f8c8d;
}

.news-item h2 {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.4;
    color: #2c3e50;
}

.original-link-wrapper {
    margin: 1rem 0;
}

.original-link {
    display: inline-block;
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
}

.original-link:hover {
    text-decoration: underline;
}

.related-articles {
    margin: 1rem 0 0 0;
    padding: 1rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
}

.related-articles h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    color: #555;
    font-weight: 600;
}

.related-articles :deep(ol) {
    margin: 0;
    padding-left: 1.5rem;
    list-style: decimal;
}

.related-articles :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

.related-articles :deep(a) {
    color: #2980b9;
    text-decoration: none;
    font-weight: 500;
}

.related-articles :deep(a:hover) {
    color: #3498db;
    text-decoration: underline;
}

.related-articles :deep(font) {
    color: #7f8c8d;
    font-size: 0.875rem;
    margin-left: 0.5rem;
}
</style>
