export default function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-\u0600-\u06FF]/gi, "");
}
