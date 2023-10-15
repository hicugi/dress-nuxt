export default ({ title, description, imgPath, server = false }) => {
  const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
  const localeRoute = useLocalePath();

  let tags = {};

  if (title)
    tags = {
      title: title,
      ogTitle: title,
      twitterTitle: title,
    };

  if (description)
    tags = {
      ...tags,
      description: description,
      ogDescription: description,
      twitterDescription: description,
    };

  if (imgPath)
    tags = {
      ...tags,
      ogImage: imgPath,
      twitterImage: imgPath,
    };

  if (server)
    useServerSeoMeta({
      ...tags,
      ogUrl: runtimeConfig + localeRoute(),
      twitterCard: "summary_large_image",
    });
  else
    useSeoMeta({
      ...tags,
      ogUrl: runtimeConfig + localeRoute(),
      twitterCard: "summary_large_image",
    });
};
