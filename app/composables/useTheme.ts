/**
 * useTheme — light / dark theme manager
 * Default: dark. Persists to localStorage.
 */
const isDark = ref(true)

export function useTheme() {
  function applyTheme(dark: boolean) {
    isDark.value = dark
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }

  function initTheme() {
    const stored = localStorage.getItem('portfolio-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored !== null ? stored === 'dark' : prefersDark
    applyTheme(dark)
  }

  function toggleTheme() {
    const next = !isDark.value
    applyTheme(next)
    localStorage.setItem('portfolio-theme', next ? 'dark' : 'light')
  }

  return { isDark: readonly(isDark), toggleTheme, initTheme }
}
