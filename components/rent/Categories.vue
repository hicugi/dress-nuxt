<script setup>
import { defineProps } from "vue";

const props = defineProps({
  category: Object,
});
</script>

<template>
  <div
    class="group 2xl:w-1/6 xl:w-1/6 lg:w-1/5 md:w-1/3 <sm:w-1/2 <sm:p-2 p-4 w-1/2"
  >
    <NuxtLink
      :to="
        localePath({
          name: 'rent-c-slug',
          params: {
            slug: category.slug,
          },
        })
      "
    >
      <div
        class="relative block lg:h-100 md:h-80 <sm:h-50 rounded-xl overflow-hidden"
      >
        <img
          v-if="category.photos.length > 0"
          class="group-hover:scale-110 transform duration-1000 object-cover w-full h-full"
          :src="category.photos[0].image"
          :alt="category.title"
          placeholder="/img/placeholder.gif"
        />
      </div>
      <div class="mt-4 <sm:mt-2">
        <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">
          {{ category.title }}
        </h3>
      </div>
    </NuxtLink>
  </div>
</template>
