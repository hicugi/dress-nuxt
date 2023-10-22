import unidecode from "unidecode";
export default (string) => {
  const slug = unidecode(string);
  return slug
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
};
