const slugify = (title) => {
  const slug = String(title || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "personalized-gift"
}

const generateUniqueSlug = async (
  title,
  ProductModel
) => {
  const baseSlug = slugify(title)

  let slug = baseSlug
  let counter = 2

  while (await ProductModel.exists({ slug })) {
    slug = `${baseSlug}-${counter}`
    counter += 1
  }

  return slug
}

module.exports = {
  slugify,
  generateUniqueSlug,
}