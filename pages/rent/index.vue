<script setup>
import Categories from "~/components/rent/Categories.vue";
import { useDressCatalog } from "~/stores/DressCatalog";
//import VueDatePicker from "@vuepic/vue-datepicker";
import useMetaSeo from "~/composables/useMetaSeo";
const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
const $t = useI18n().t;

if (
  !useDressCatalog().categories.length ||
  useDressCatalog().locale != useI18n().locale.value
)
  useDressCatalog().loadCategories();

const categories = computed(() => useDressCatalog().categories);

const title = computed(
  () =>
    $t("rent.common_title") +
    " " +
    $t("rent.category_list_all_categories").toLowerCase()
);

useMetaSeo({
  title: title.value,
  description: useI18n().t("rent.common_description"),
  imgPath: runtimeConfig + "/img/og-image.jpg",
});
</script>

<!-- from https://tailblocks.cc/ ECOMMERCE section -->
<template>
  <section class="text-gray-600 body-font">
    <div class="container px-5 mx-auto">
      <div class="flex mb-5 <sm:mb-3">
        <div class="flex-grow">
          <h1 class="pt-2 text-xl >sm:font-bold <sm:text-sm">
            {{ title }}
          </h1>
        </div>

        <!-- <div class="mr-2 w-auto">
          <VueTailwindDatepicker
            as-single
            overlay
            :placeholder="$i18n.t('rent.dress_catalog_filter_date')"
            @update:modelValue="changeDate"
            :formatter="{ date: 'DD.MM.YYYY', month: 'MMM' }"
            :i18n="$i18n.locale"
            :start-from="new Date()"
            input-classes="w-40 h-8.5 pl-3 <sm:w-35 text-sm rounded-md border border-gray-200 focus:border-0 focus:ring-inset leading-none"
            :options="{
              footer: {
                cancel: `${$i18n.t('rent.dress_catalog_datepicker_close')}`,
              },
            }"
          />
        </div> -->
      </div>
      <div class="flex flex-wrap -m-4">
        <template v-for="(category, index) in categories">
          <Categories :category="category" :key="index" v-if="index" />
        </template>
        <Categories v-if="categories[0]" :category="categories[0]" :key="0" />
      </div>
    </div>
  </section>
</template>

<!-- <style src="@vuepic/vue-datepicker/dist/main.css" />

<style>
.dp__input {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  border-radius: 0.375rem !important;
  border-color: #e5e7eb !important;
  font-family: inherit !important;
  font-size: 0.875rem !important;
  color: rgba(75, 85, 99, var(--tw-text-opacity)) !important;
}
</style> -->
