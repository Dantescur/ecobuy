// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  image: {
    format: ["webp"]
  },
  fonts: {
    defaults: {
      subsets: ['Inter', 'sans-serif'],
    },
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    bundle: {
      optimizeTranslationDirective: false
    },
    defaultLocale: 'es',
    locales: [
      { code: 'es', name: 'Spanish', file: 'es.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ]
  }
})