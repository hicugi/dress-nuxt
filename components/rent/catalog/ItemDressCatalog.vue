<script>
import { mapState } from "pinia";
import { useCurrencyStore } from "~/stores/CurrencyStore.js";

export default {
  components: {},
  props: {
    dress: { type: Object, default: {} },
  },
  computed: {
    ...mapState(useCurrencyStore, ["currentCurrency"]),
  },
};
</script>

<template>
  <div class="group 2xl:w-1/4 xl:w-1/4 lg:w-1/3 md:w-1/2 p-4 w-full">
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
      <div class="relative block h-128 rounded-xl overflow-hidden">
        <NuxtImg
          v-if="dress.photo.length > 0"
          class="group-hover:scale-110 transform duration-1000 object-cover w-full h-full"
          :src="dress.photo[0].image"
          :alt="dress.title"
          placeholder="/img/placeholder.gif"
          preload
        />
      </div>
      <div class="mt-4">
        <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">
          {{ dress.category.map((item) => item.title).join(", ") }}
        </h3>
        <h2 class="text-gray-900 title-font text-lg font-medium">
          {{ dress.title }}
        </h2>
        <p class="mt-1">
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
    </NuxtLink>
  </div>
</template>
