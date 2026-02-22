/**
 * Client-only plugin that converts `<time data-utc-time="..." data-lang="...">` elements
 * into human-readable relative timestamps (e.g. "2 hours ago" / "2小时前").
 *
 * Runs on mount and watches for dynamically inserted elements via MutationObserver,
 * so it works seamlessly across page transitions.
 */
export default defineNuxtPlugin(() => {
    type TimeUnit = { divisor: number; en: string; zh: string }

    const TIME_UNITS: TimeUnit[] = [
        { divisor: 31_536_000, en: 'year', zh: '年' },
        { divisor: 2_592_000, en: 'month', zh: '个月' },
        { divisor: 86_400, en: 'day', zh: '天' },
        { divisor: 3_600, en: 'hour', zh: '小时' },
        { divisor: 60, en: 'minute', zh: '分钟' },
    ]

    function formatRelativeTime(utcDateString: string, lang: string): string {
        const seconds = Math.floor((Date.now() - new Date(utcDateString).getTime()) / 1000)

        for (const { divisor, en, zh } of TIME_UNITS) {
            const count = Math.floor(seconds / divisor)
            if (count >= 1) {
                return lang === 'zh'
                    ? `${count}${zh}前`
                    : `${count} ${en}${count > 1 ? 's' : ''} ago`
            }
        }

        return lang === 'zh' ? '刚刚' : 'just now'
    }

    function convertTimeElement(el: Element): void {
        const utcTime = el.getAttribute('data-utc-time')
        const lang = el.getAttribute('data-lang') ?? 'en'
        if (utcTime) el.textContent = formatRelativeTime(utcTime, lang)
    }

    // Convert any elements already in the DOM
    document.querySelectorAll('time[data-utc-time]').forEach(convertTimeElement)

    // Watch for elements added during page transitions
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue
                const el = node as Element
                if (el.matches('time[data-utc-time]')) convertTimeElement(el)
                el.querySelectorAll('time[data-utc-time]').forEach(convertTimeElement)
            }
        }
    })

    observer.observe(document.body, { childList: true, subtree: true })
})
