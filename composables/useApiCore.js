import { useAuthStore } from "~/stores/AuthStore";

export default async (url, options = {}) => {
  const config = useRuntimeConfig();
  //console.log(config.public.NUXT_API_URL + url);
  console.log("access_token", useAuthStore().access_token);
  const { data, error } = await useFetch(url, {
    baseURL: config.public.NUXT_API_URL,
    ...options,
    headers: { authorization: `Bearer ${useAuthStore().access_token}` },
    // onRequest({ request, options }) {
    //   // Set the request headers
    //   if (useAuthStore().access_token) {
    //     options.headers = options.headers || {};
    //     options.headers.authorization = "...";
    //   }
    // },
    onRequestError({ request, options, error }) {
      console.log("onResponseError", error);
    },
    onResponseError({ request, response, options }) {
      console.log("onResponseError", response);
      // Handle the response errors
    },
    async onResponseError({ response, options }) {
      console.log("onResponseError", response, options);
      // if (response.status === 401) {
      //   await useFetch('/auth/refresh', {
      //     baseURL: config.public.apiBaseUrl,
      //     method: 'POST',
      //     server: false,
      //     credentials: 'include',
      //     onResponse({ response }) {
      //       setToken(response._data.token) // store token
      //     },
      //   },
      // }
    },
  });

  if (error?.value?.data?.error) {
    switch (error?.value?.data?.error) {
      case "jwt_token_not_received":
        break;
      case "jwt_expired_token":
        navigateTo("auth");
        break;
      case "jwt_invalid_token":
        navigateTo("auth");
        break;
    }
  }

  console.log("=========");
  console.log("apiCore", url);
  console.log("data", data.value);
  console.log("error", error.value);
  return { data, error };
};
