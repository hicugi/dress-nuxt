<script>
import DropDown from "~/components/DropDown.vue";
import ItemDressCatalog from "~/components/catalog/ItemDressCatalog.vue";
import { mapActions, mapState, mapWritableState } from "pinia";
import { useDressCatalog } from "~/stores/DressCatalog";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
//import VueDatePicker from "@vuepic/vue-datepicker";

export default {
  components: {
    ItemDressCatalog,
    DropDown,
    VueTailwindDatepicker,
    //VueDatePicker,
  },
  data() {
    return {};
  },
  methods: {
    dDate(date) {
      return date < new Date() || date > new Date(2023, 0, 8);
    },
    ...mapActions(useDressCatalog, [
      "loadDressCatalog",
      "loadCategories",
      "changeCategory",
      "changeDate",
    ]),
  },
  computed: {
    ...mapState(useDressCatalog, ["dresses", "categories", "category"]),
    ...mapWritableState(useDressCatalog, ["date"]),
  },
  created() {
    useSeoMeta({
      title: useI18n().t("content.common_title"),
      description: useI18n().t("content.common_title"),
    });
    this.loadDressCatalog();
    this.loadCategories();
  },
};
</script>

<!-- from https://tailblocks.cc/ ECOMMERCE section -->
<template>
  <section class="text-gray-600 body-font">
    <div class="container px-5 mx-auto">
      <div class="flex flex-row-reverse mb-5 <sm:mb-3">
        <DropDown
          v-if="categories.length"
          :init-item="category"
          :items="categories"
          :change="changeCategory"
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
