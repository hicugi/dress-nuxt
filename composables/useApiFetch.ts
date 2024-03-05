import { defu } from "defu";

import type { UseFetchOptions } from "#app";

export async function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const accessToken = useCookie("access_token");
  //console.log("useCookie accessToken", accessToken.value);
  const config = useRuntimeConfig();

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.NUXT_API_URL,
    key: url,

    // set user token if connected
    headers: accessToken.value
      ? {
          Authorization: `Bearer ${accessToken.value}`,
          //...useRequestHeaders(["referer", "coockie"]),
        }
      : {},
    //credentials: "include",

    onResponse(_ctx) {
      // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
    },

    onResponseError(_ctx) {
      //console.log("_ctx", _ctx);
      // throw new myBusinessError()
    },
  };

  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults);

  const { data, error } = await useFetch(url, params);

  if (error?.value?.data?.error) {
    switch (error?.value?.data?.error) {
      case "jwt_token_not_received":
        navigateTo("/ru/auth");
        break;
      case "jwt_expired_token":
        navigateTo("/ru/auth");
        break;
      case "jwt_invalid_token":
        navigateTo("/ru/auth");
        break;
    }
  }
  // console.log("=========");
  // console.log("apiCore", url);
  // console.log("data", data.value);
  // console.log("error", error);
  // console.log("=========");
  return { data, error };
}
