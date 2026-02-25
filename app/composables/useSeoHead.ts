import type { ComputedRef } from 'vue'
import type { SupportedLang } from '~/types'

export function useSeoHead(
    paramDate: ComputedRef<string>,
    lang: ComputedRef<SupportedLang>,
    formattedCurrentDate: ComputedRef<string>,
) {
    const config = useRuntimeConfig()
    const siteUrl = config.public.siteUrl as string

    useHead(computed(() => {
        const date = paramDate.value
        const isEn = lang.value === 'en'
        const zhUrl = `${siteUrl}/zh/${date}`
        const enUrl = `${siteUrl}/en/${date}`
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
                { property: 'og:title', content: pageTitle },
                { property: 'og:description', content: description },
                { property: 'og:url', content: canonical },
                { property: 'og:type', content: 'website' },
                { property: 'og:image', content: ogImage },
                { property: 'og:locale', content: isEn ? 'en_US' : 'zh_CN' },
                { property: 'og:locale:alternate', content: isEn ? 'zh_CN' : 'en_US' },
                // Twitter / X Card
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: pageTitle },
                { name: 'twitter:description', content: description },
                { name: 'twitter:image', content: ogImage },
            ],
            link: [
                // Canonical – always points to the current language URL
                { rel: 'canonical', href: canonical },
                // hreflang alternates – tell Google which URL serves which language/region
                { rel: 'alternate', hreflang: 'zh', href: zhUrl },
                { rel: 'alternate', hreflang: 'zh-Hans', href: zhUrl }, // Simplified Chinese explicitly
                { rel: 'alternate', hreflang: 'en', href: enUrl },
                // x-default: the fallback for users whose language is not explicitly listed
                { rel: 'alternate', hreflang: 'x-default', href: enUrl },
            ],
        }
    }))
}
