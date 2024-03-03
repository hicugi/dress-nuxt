import { useAuthStore } from "../stores/AuthStore";

export default defineNuxtPlugin(async (nuxtApp) => {
  const storeAuth = useAuthStore();

  if (!storeAuth.user) {
    await storeAuth.getAuthUser();
  }
});
