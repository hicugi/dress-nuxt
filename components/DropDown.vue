<script>
export default {
  props: {
    items: { type: Array, default: [] },
    initItem: { type: Object, default: null },
    change: { type: Function, required: true },
    index: { type: String, required: true, default: "" },
  },
  data() {
    return {
      hiddenItems: true,
      currentItem:
        this.initItem || (this.items.length ? this.items[0] : { title: "" }),
    };
  },
  watch: {
    initItem(value) {
      this.currentItem = value;
    },
  },
};
</script>

<template>
  <div class="relative" @click="hiddenItems = !hiddenItems">
    <!-- https://www.hyperui.dev/components/application-ui/dropdown -->
    <div
      class="inline-flex items-center overflow-hidden rounded-md border bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700"
    >
      <a href="#" class="px-4 <sm:pl-2 <sm:pr-0 py-2 text-sm leading-none">
        {{ currentItem.title.replace(" ", "&nbsp;") }}
      </a>

      <button class="h-full p-2 <sm:px-1">
        <span class="sr-only">Menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div
      v-show="!hiddenItems"
      class="absolute right-0 z-1 mt-2 p-2 w-auto rounded-md border border-gray-100 bg-white shadow-lg"
      @mouseleave="hiddenItems = true"
    >
      <div v-for="(item, key) in items" :key="key">
        <a
          href="#"
          class="block rounded-lg px-4 py-2 <sm:py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          @click="
            (e) => {
              e.stopPropagation();
              this.currentItem = item;
              this.hiddenItems = true;
              this.change(item);
            }
          "
        >
          {{ item.title.replace(" ", "&nbsp;") }}
        </a>
      </div>
    </div>
  </div>
</template>
