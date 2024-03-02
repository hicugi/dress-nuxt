<script setup>
import { useAdminRentDressCatalogStore } from "~/stores/admin/DressCatalog";
const storeDressCatalog = useAdminRentDressCatalogStore();

await storeDressCatalog.loadDressCatalog({});
</script>

<template>1</template>
