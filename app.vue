<script setup>
const { NUXT_SITE_NAME: siteName, NUXT_PUBLIC_SITE_URL: siteUrl } =
  useRuntimeConfig().public;
const route = useRoute();
const i18n = useI18n();
useHead(() => ({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${siteName}` : `${siteName}`;
  },
  htmlAttrs: {
    lang: i18n?.locale?.value,
  },
  link: [
    {
      rel: "canonical",
      href: siteUrl + route.path,
    },
    {
      rel: "icon",
      type: "image/ico",
      href: "/favicon.ico",
    },
  ],
  meta: [
    {
      hid: "robots",
      name: "robots",
      content: "index,follow",
    },
  ],
}));
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtErrorBoundary>
      <template #error="{ error }">
        <p>An error occurred: {{ error }}</p>
      </template>
      <NuxtPage />
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
