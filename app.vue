<script setup lang="ts">
const siteName = useRuntimeConfig().public.NUXT_SITE_NAME;
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${siteName}` : `${siteName}`;
  },
  meta: [
    {
      hid: "robots",
      name: "robots",
      content: "index,follow",
    },
  ],
});
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
