export default (url, options) => {
  const config = useRuntimeConfig();
  //console.log(config.public.NUXT_API_URL + url);
  return useFetch(url, { baseURL: config.public.NUXT_API_URL, ...options });
};
