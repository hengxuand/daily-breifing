/**
 * useTheme — manages light/dark mode with localStorage persistence and
 * `prefers-color-scheme` as default. Applies the chosen theme via a
 * `data-theme` attribute on the `<html>` element.
 */

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'color-theme'

// Shared reactive state across all component instances
const isDark = ref(false)

function applyTheme(dark: boolean) {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    }
}

export function useTheme() {
    function init() {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
        const prefersDark =
            stored === 'dark' ||
            (stored === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
        isDark.value = prefersDark
        applyTheme(prefersDark)
    }

    function toggle() {
        isDark.value = !isDark.value
        applyTheme(isDark.value)
        localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    }

    return { isDark: readonly(isDark), toggle, init }
}
