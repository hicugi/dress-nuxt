import { useAuthStore } from "~/stores/AuthStore";

export default (url, options) => {
  const config = useRuntimeConfig();
  //console.log(config.public.NUXT_API_URL + url);
  return useFetch(url, {
    baseURL: config.public.NUXT_API_URL,
    ...options,
    headers: { authorization: `Bearer ${useAuthStore().access_token}` },
  });
};
