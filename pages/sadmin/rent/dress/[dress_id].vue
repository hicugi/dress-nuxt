<script setup>
import { useLangStore } from "~/stores/LangStore";
import { useAdminRentDressCatalogStore } from "~/stores/admin/DressCatalogRentAdmin";
const storeLang = useLangStore();
const storeDressCatalog = useAdminRentDressCatalogStore();
storeDressCatalog.getCategories();
storeDressCatalog.getColors();
storeDressCatalog.getSizes();

const dress_id = useRoute().params.dress_id;
await storeDressCatalog.getDress(dress_id);

const form = ref({
  dress_id,
  quantity: storeDressCatalog.dress?.quantity || 0,
  categories:
    storeDressCatalog.dress?.category.map((category) => category.category_id) ||
    [],
  colors: storeDressCatalog.dress?.color.map((color) => color.color_id) || [],
  sizes: storeDressCatalog.dress?.size.map((size) => size.size_id) || [],
  translations: [],
  photos: storeDressCatalog.dress?.photo.map((photo) => photo.image) || [],
});

storeLang.languages.map((language) => {
  const translation = storeDressCatalog.dress.translations.find(
    ({ language: locale }) => locale == language.locale
  );
  form.value.translations.push({
    locale: language.locale,
    title: translation?.title || "",
    description: translation?.description || "",
    placeholder: language.title,
  });
});

const categories = computed(() => storeDressCatalog.categories);
const colors = computed(() => storeDressCatalog.colors);
const sizes = computed(() => storeDressCatalog.sizes);
const errors = computed(() => storeDressCatalog.errors);

const previewImage = (event) => {
  Object.keys(event.target.files).forEach((key) => {
    const file = event.target.files[key];
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log("e", e);
      form.value.photos.push(e.target.result);
    };

    reader.readAsDataURL(file);
  });
};

console.log("form", form.value);
</script>
<template>
  <div>
    <form @submit.prevent="storeDressCatalog.saveDress(form)">
      <div class="mb-6">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{ $t("admin.dress_title") }}</label
        >
        <div class="flex w-full">
          <div
            v-for="(translation, key) in form.translations"
            class="mr-2 w-1/3"
          >
            <input
              :name="`translations[${translation.locale}]`"
              :value="translation.title"
              @input="translation.title = $event.target.value"
              :key="key"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              :placeholder="translation.placeholder"
              :class="
                errors?.[`translations.${translation.locale}.title`]
                  ? 'border-red-500 bg-red-50'
                  : ''
              "
            />
            <div
              v-if="errors?.[`translations.${translation.locale}.title`]"
              class="mt-2 text-sm font-medium text-red-600 dark:text-red-500"
            >
              {{
                errors?.[`translations.${translation.locale}.title`]
                  .map((item) => $t(`validation.${item}`))
                  .join(",")
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <label
          for="message"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{ $t("admin.dress_description") }}</label
        >
        <div class="flex w-full">
          <div
            v-for="(translation, key) in form.translations"
            class="mr-2 w-1/3"
          >
            <textarea
              :name="`translations[${translation.locale}]`"
              :value="translation.description"
              @input="translation.description = $event.target.value"
              :key="key"
              id="message"
              rows="10"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              :placeholder="translation.placeholder"
              :class="
                errors?.[`translations.${translation.locale}.description`]
                  ? 'border-red-500 bg-red-50'
                  : ''
              "
            />
            <div
              v-if="errors?.[`translations.${translation.locale}.description`]"
              class="mt-2 text-sm font-medium text-red-600 dark:text-red-500"
            >
              {{
                errors?.[`translations.${translation.locale}.description`]
                  .map((item) => $t(`validation.${item}`))
                  .join(",")
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{ $t("admin.dress_quantity") }}</label
        >
        <div>
          <input
            type="number"
            v-model="form.quantity"
            id="quantity"
            class="w-30 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="$t(`admin.dress_quantity`)"
            :class="errors?.quantity ? 'border-red-500 bg-red-50' : ''"
          />
          <div
            v-if="errors?.quantity"
            class="mt-2 text-sm font-medium text-red-600 dark:text-red-500"
          >
            {{
              errors?.quantity.map((item) => $t(`validation.${item}`)).join(",")
            }}
          </div>
        </div>
      </div>

      <div class="mb-5">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{ $t("admin.dress_categories") }}</label
        >
        <div
          v-if="errors?.categories"
          class="my-2 text-sm font-medium text-red-600 dark:text-red-500"
        >
          {{
            errors?.categories.map((item) => $t(`validation.${item}`)).join(",")
          }}
        </div>
        <div class="w-full flex flex-wrap items-center mb-4">
          <div v-for="category in categories" class="w-1/3">
            <input
              type="checkbox"
              v-model="form.categories"
              :id="`category[${category.category_id}]`"
              :value="category.category_id"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              :for="`category[${category.category_id}]`"
              class="ml-1 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {{ category.title }}</label
            >
          </div>
        </div>
      </div>

      <div class="mb-5">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{ $t("admin.dress_colors") }}</label
        >
        <div
          v-if="errors?.colors"
          class="my-2 text-sm font-medium text-red-600 dark:text-red-500"
        >
          {{ errors?.colors.map((item) => $t(`validation.${item}`)).join(",") }}
        </div>

        <div class="w-full flex flex-wrap items-center mb-4">
          <div v-for="color in colors" class="w-1/3">
            <input
              type="checkbox"
              v-model="form.colors"
              :id="`color[${color.color_id}]`"
              :name="`color[${color.color_id}]`"
              :value="color.color_id"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              :for="`color[${color.color_id}]`"
              class="ml-1 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {{ color.title }}
            </label>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{ $t("admin.dress_sizes") }}</label
        >
        <div
          v-if="errors?.sizes"
          class="my-2 text-sm font-medium text-red-600 dark:text-red-500"
        >
          {{ errors?.sizes.map((item) => $t(`validation.${item}`)).join(",") }}
        </div>
        <div class="w-full flex flex-wrap items-center mb-4">
          <div v-for="size in sizes" class="w-1/3">
            <input
              type="checkbox"
              v-model="form.sizes"
              :id="`size${size.size_id}`"
              :value="size.size_id"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              :for="`size${size.size_id}`"
              class="ml-1 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 ver"
            >
              {{ size.size }}</label
            >
          </div>
        </div>
      </div>

      <div class="mb-5">
        <input type="file" @change="previewImage" accept="image/*" multiple />
        <div class="flex">
          <img v-for="photo in form.photos" :src="photo" class="w-50 mr-2" />
        </div>
      </div>
      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {{ $t("admin.dress_save_button") }}
      </button>
    </form>
  </div>
</template>
