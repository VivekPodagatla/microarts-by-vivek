require("dotenv").config()

const mongoose = require("mongoose")

const Artwork = require("../models/Artwork")

const { generateUniqueSlug } =
  require("../utils/productSlug")

const addArtworkSlugs = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    )

    console.log("Connected to MongoDB")

    const artworks = await Artwork.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" },
      ],
    }).sort({ _id: 1 })

    console.log(
      `Found ${artworks.length} artworks without slugs`
    )

    for (const artwork of artworks) {
      const slug = await generateUniqueSlug(
        artwork.title,
        Artwork
      )

      await Artwork.updateOne(
        { _id: artwork._id },
        { $set: { slug } }
      )

      console.log(
        `${artwork.title} -> ${slug}`
      )
    }

    console.log("Artwork slug migration completed")

  } catch (error) {
    console.error(
      "Artwork slug migration failed:",
      error
    )

    process.exitCode = 1

  } finally {
    await mongoose.disconnect()
  }
}

addArtworkSlugs()