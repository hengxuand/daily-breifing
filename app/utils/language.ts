/**
 * Detects the user's preferred language from the browser, returning either
 * 'zh' (Chinese) or 'en' (English). Falls back to 'en' if no match is found.
 */
export function detectBrowserLanguage(): 'en' | 'zh' {
    if (typeof navigator === 'undefined') return 'en'

    for (const lang of navigator.languages ?? [navigator.language]) {
        if (lang.startsWith('zh')) return 'zh'
        if (lang.startsWith('en')) return 'en'
    }

    return 'en'
}
