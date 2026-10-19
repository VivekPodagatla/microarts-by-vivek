
import fs from "node:fs/promises"
import path from "node:path"

const SITE_URL = "https://microartsbyvivek.com"
const API_URL = (
  process.env.VITE_API_URL ||
  "https://microarts-by-vivek-api.onrender.com"
).replace(/\/+$/, "")

const DIST = path.resolve("dist")

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const cleanText = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()

const fetchJson = async (endpoint) => {
  let lastError

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(
        `${API_URL}${endpoint}`,
        { signal: AbortSignal.timeout(90000) }
      )

      if (!response.ok) {
        throw new Error(
          `${endpoint} returned HTTP ${response.status}`
        )
      }

      return await response.json()
    } catch (error) {
      lastError = error
      console.warn(
        `Attempt ${attempt} failed for ${endpoint}:`,
        error.message
      )
    }
  }

  throw lastError
}

const replaceMeta = (html, attribute, key, value) => {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`
  const pattern = new RegExp(
    `<meta\\s+${attribute}=["']${key}["'][^>]*>`,
    "i"
  )

  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `  ${tag}\n</head>`)
}

const replaceCanonical = (html, url) => {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`

  return html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    tag
  )
}

const generatePage = (template, item, type) => {
  const isGift = type === "gift"
  const slug = item.slug

  const pageUrl = `${SITE_URL}/${
    isGift ? "gifts" : "artworks"
  }/${slug}`

  const title = isGift
    ? `${item.title} | Personalized Pencil Carving | MicroArts by Vivek`
    : `${item.title} | Handmade Miniature Art | MicroArts by Vivek`

  const description = cleanText(item.description)
    .slice(0, 155) ||
    `Discover ${item.title}, handmade miniature art by Vivek Podagatla.`

  let html = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  )

  html = replaceMeta(
    html, "name", "description", description
  )

  html = replaceCanonical(html, pageUrl)

  html = replaceMeta(
    html, "property", "og:type", "product"
  )
  html = replaceMeta(
    html, "property", "og:title", title
  )
  html = replaceMeta(
    html, "property", "og:description", description
  )
  html = replaceMeta(
    html, "property", "og:url", pageUrl
  )
  html = replaceMeta(
    html, "property", "og:image", item.image
  )
  html = replaceMeta(
    html, "property", "og:image:alt", item.title
  )

  html = replaceMeta(
    html, "name", "twitter:title", title
  )
  html = replaceMeta(
    html, "name", "twitter:description", description
  )
  html = replaceMeta(
    html, "name", "twitter:image", item.image
  )

  // Product images have different dimensions.
  // Remove homepage-specific image dimensions.
  html = html.replace(
    /<meta\s+property=["']og:image:(width|height)["'][^>]*>\s*/gi,
    ""
  )

  const structuredData = {
    "@context": "https://schema.org",
    "@type": isGift ? "Product" : "VisualArtwork",
    name: item.title,
    description,
    image: item.image,
    url: pageUrl,
    creator: {
      "@type": "Person",
      name: "Vivek Podagatla"
    }
  }

  // Avoid adding an Offer: prices for customized gifts
  // vary according to the customer's entered text.
  const jsonLd = JSON.stringify(structuredData)
    .replace(/</g, "\\u003c")

  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${jsonLd}</script>\n</head>`
  )

  return { html, pageUrl }
}

async function main() {
  const template = await fs.readFile(
    path.join(DIST, "index.html"),
    "utf8"
  )

  const [artworkData, giftData] = await Promise.all([
    fetchJson("/api/artworks"),
    fetchJson("/api/personalized-products")
  ])

  if (!Array.isArray(artworkData.artworks)) {
    throw new Error("Invalid artwork API response")
  }

  if (!Array.isArray(giftData)) {
    throw new Error("Invalid gift API response")
  }

  const entries = [
    ...artworkData.artworks.map((item) => ({
      item,
      type: "artwork",
      folder: "artworks"
    })),
    ...giftData
      .filter((item) => item.active)
      .map((item) => ({
        item,
        type: "gift",
        folder: "gifts"
      }))
  ]

  const urls = [SITE_URL + "/"]
  const seen = new Set()

  for (const { item, type, folder } of entries) {
    if (
      !item.slug ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)
    ) {
      throw new Error(
        `Missing or invalid slug for ${item.title}`
      )
    }

    const key = `${folder}/${item.slug}`

    if (seen.has(key)) {
      throw new Error(`Duplicate product URL: ${key}`)
    }

    seen.add(key)

    const { html, pageUrl } = generatePage(
      template, item, type
    )

    const outputDir = path.join(
      DIST, folder, item.slug
    )

    await fs.mkdir(outputDir, { recursive: true })

    await fs.writeFile(
      path.join(outputDir, "index.html"),
      html,
      "utf8"
    )

    urls.push(pageUrl)
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (url) => `  <url><loc>${escapeHtml(url)}</loc></url>`
    ),
    "</urlset>"
  ].join("\n")

  await fs.writeFile(
    path.join(DIST, "sitemap.xml"),
    sitemap,
    "utf8"
  )

  console.log(
    `SEO generated: ${entries.length} product pages and ${urls.length} sitemap URLs.`
  )
}

main().catch((error) => {
  console.error("SEO generation failed:", error)
  process.exitCode = 1
})
