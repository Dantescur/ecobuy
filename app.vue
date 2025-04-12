<script lang="ts" setup>
const { t } = useI18n()

useSeoMeta({
  title: "KoiShop",
  description: t('description'),
  keywords: 'KoiShop, e-commerce, online store, shopping',
  twitterCard: 'summary_large_image',
  ogTitle: 'KoiShop',
  ogDescription: t('description'),
  ogImage: '/images/og-image.png',
  ogUrl: 'https://koishop.com',
  ogType: 'website',
  ogSiteName: 'KoiShop',
  ogLocale: 'en_US',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterSite: '@KoiShop',
  twitterCreator: '@KoiShop',
  twitterImage: '/images/twitter-image.png',
  twitterImageAlt: 'KoiShop - Your Online Store',
  twitterImageWidth: 1200,
  twitterImageHeight: 630,
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout />
  </div>
</template>

<style>
body {
  scroll-behavior: smooth;
}
</style>