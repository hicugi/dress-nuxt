<script setup>
const props = defineProps({
  categories: Object,
});
</script>
<template>
  <template v-for="(category, index) in props.categories">
    <NuxtLink
      :to="
        localePath({
          name: 'rent-c-slug',
          params: {
            slug: stringToSlug(category.title),
          },
        })
      "
      class="decoration underline text-gray-500 title-font mb-1"
    >
      {{ category.title }}</NuxtLink
    >{{
      categories.length > 1 && index != props.categories.length - 1 ? ", " : ""
    }}
  </template>
</template>
