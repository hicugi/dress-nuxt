<script>
import { mapState } from "pinia";
import { useCurrencyStore } from "~/stores/CurrencyStore.js";
import CategoriesTemplate from "~/components/CategoriesTemplate.vue";

export default {
  components: {
    CategoriesTemplate,
  },
  props: {
    dress: { type: Object, default: {} },
    category: { type: Object },
  },
  computed: {
    ...mapState(useCurrencyStore, ["currentCurrency"]),
  },
};
</script>

<template>
  <div
    class="group 2xl:w-1/4 xl:w-1/4 lg:w-1/3 md:w-1/2 <sm:w-1/2 <sm:p-2 p-4 w-full"
  >
    <div class="relative block h-128 <sm:h-70 rounded-xl overflow-hidden">
      <NuxtLink
        :to="
          localePath({
            name: 'rent-dress-dress_id',
            params: {
              dress_id: dress.dress_id,
            },
          })
        "
      >
        <img
          v-if="dress.photos.length > 0"
          class="group-hover:scale-110 transform duration-1000 object-cover w-full h-full"
          :src="dress.photos[0].image"
          :alt="dress.title"
          placeholder="/img/placeholder.gif"
        />
      </NuxtLink>
    </div>
    <div class="mt-4 <sm:mt-2">
      <h3
        v-if="category.slug == 'all'"
        class="text-gray-500 text-xs tracking-widest title-font mb-1"
      >
        <CategoriesTemplate :categories="dress.categories" />
      </h3>
      <h2 class="text-gray-900 title-font text-lg font-medium <sm:text-sm">
        <NuxtLink
          :to="
            localePath({
              name: 'rent-dress-dress_id',
              params: {
                dress_id: dress.dress_id,
              },
            })
          "
        >
          {{ dress.title }}
        </NuxtLink>
      </h2>
      <p class="mt-1 <sm:text-sm">
        {{ currentCurrency ? currentCurrency.symbol : "" }}
        {{
          dress.price
            .toLocaleString("kk", {
              //style: "currency",
              //currency: currencyCode,
              minimumFractionDigits: Math.ceil(dress.price % 1) * 2,
            })
            .replace(" ", ",")
        }}
      </p>
    </div>
  </div>
</template>
