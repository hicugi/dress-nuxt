<script setup>
import { useDressCatalog } from "~/stores/DressCatalog";
import ItemDressCatalog from "~/components/rent/catalog/ItemDressCatalog.vue";

const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
const $t = useI18n().t;

const store = useDressCatalog();

if (!store.categories.length) await store.loadCategories();

const categories = store.categories;
const route = useRoute();
const findedCategory = categories.find((c) => c.slug === route.params.slug) || {
  category_id: undefined,
};
await store.setCategory(findedCategory);
const category = computed(() => store.category);

const title = computed(
  () => $t("rent.common_title") + " " + category.value.title.toLowerCase()
);

const description = computed(() => category.value.description);

const dresses = computed(() => store.dresses);
const categoryImgPath = computed(
  () =>
    store.dresses?.[0]?.photo?.[0].image || runtimeConfig + "/img/og-image.jpg"
);

useMetaSeo({
  title: title.value,
  description: description.value,
  imgPath: categoryImgPath,
});

const switchCategory = store.switchCategory;
</script>

<!-- from https://tailblocks.cc/ ECOMMERCE section -->
<template>
  <section class="text-gray-600 body-font" v-if="category">
    <div class="container px-5 mx-auto">
      <div class="flex mb-5 <sm:mb-3">
        <div class="flex-grow">
          <h1 class="pt-2 text-xl >sm:font-bold <sm:text-sm">
            {{ title }}
          </h1>
        </div>
        <DropDown
          v-if="categories.length"
          :init-item="category"
          :items="categories"
          :change="switchCategory"
          index="category_id"
        />
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
        <ItemDressCatalog
          v-for="(dress, key) in dresses"
          :dress="dress"
          :key="key"
        />
      </div>
    </div>
  </section>
</template>
