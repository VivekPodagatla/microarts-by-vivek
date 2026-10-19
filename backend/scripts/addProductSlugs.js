require("dotenv").config()

const mongoose = require("mongoose")

const PersonalizedProduct =
  require("../models/PersonalizedProduct")

const { generateUniqueSlug } =
  require("../utils/productSlug")

const addProductSlugs = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    )

    console.log("Connected to MongoDB")

    const products =
      await PersonalizedProduct.find({
        $or: [
          { slug: { $exists: false } },
          { slug: null },
          { slug: "" },
        ],
      }).sort({ _id: 1 })

    console.log(
      `Found ${products.length} products without slugs`
    )

    for (const product of products) {
      const slug = await generateUniqueSlug(
        product.title,
        PersonalizedProduct
      )

      await PersonalizedProduct.updateOne(
        { _id: product._id },
        { $set: { slug } }
      )

      console.log(
        `${product.title} -> ${slug}`
      )
    }

    console.log("Slug migration completed")
  } catch (error) {
    console.error(
      "Slug migration failed:",
      error
    )

    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

addProductSlugs()