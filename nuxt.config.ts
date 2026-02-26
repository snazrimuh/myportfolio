import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    preset: 'vercel',
  },


  runtimeConfig: {
    // Server-side only: used for SSR fetch inside Docker network
    apiBaseInternal: process.env.NUXT_API_BASE_INTERNAL || '',
    public: {
      // Client-side (browser) visible: must point to publicly accessible URL
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    },
  },

  modules: ['shadcn-nuxt'],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      script: [
        {
          // Anti-flash: apply stored/preferred theme before first paint
          innerHTML: `(function(){var s=localStorage.getItem('portfolio-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.add(d?'dark':'light');})();`,
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;1,14..32,400&display=swap',
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss() as any],
  },
})