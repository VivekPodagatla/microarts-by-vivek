const express =
  require("express")

const PersonalizedProduct =
  require("../models/PersonalizedProduct")

const { generateUniqueSlug } =
  require("../utils/productSlug")

const authMiddleware =
  require("../middleware/authMiddleware")

const artistMiddleware =
  require("../middleware/artistMiddleware")

const upload =
  require("../middleware/uploadMiddleware")

const {
  uploadImage,
  deleteImage,
} =
  require("../utils/cloudinaryHelpers")


const router =
  express.Router()


// =====================================================
// PUBLIC - GET ACTIVE PERSONALIZED PRODUCTS
// =====================================================

router.get(
  "/",
  async (req, res) => {
    try {

      const products =
        await PersonalizedProduct
          .find({
            active: true,
          })
          .sort({
            displayOrder: 1,
            createdAt: -1,
          })


      return res.json(
        products
      )

    } catch (error) {

      console.error(
        "Get personalized products error:",
        error
      )


      return res.status(500).json({
        message:
          "Failed to fetch personalized products",
      })
    }
  }
)
// =====================================================
// PUBLIC - GET PERSONALIZED PRODUCT BY SLUG
// =====================================================

router.get(
  "/slug/:slug",
  async (req, res) => {
    try {
      const product =
        await PersonalizedProduct.findOne({
          slug: req.params.slug,
          active: true,
        })

      if (!product) {
        return res.status(404).json({
          message: "Personalized product not found",
        })
      }

      return res.json(product)

    } catch (error) {
      console.error(
        "Get personalized product by slug error:",
        error
      )

      return res.status(500).json({
        message: "Failed to fetch personalized product",
      })
    }
  }
)

// =====================================================
// ARTIST - GET ALL PERSONALIZED PRODUCTS
// =====================================================

router.get(
  "/artist/all",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {

      const products =
        await PersonalizedProduct
          .find()
          .sort({
            displayOrder: 1,
            createdAt: -1,
          })


      return res.json(
        products
      )

    } catch (error) {

      console.error(
        "Get artist products error:",
        error
      )


      return res.status(500).json({
        message:
          "Failed to fetch personalized products",
      })
    }
  }
)


// =====================================================
// ARTIST - ADD PERSONALIZED PRODUCT
// =====================================================

router.post(
  "/",
  authMiddleware,
  artistMiddleware,
  upload.single("image"),

  async (req, res) => {

    let cloudinaryResult =
      null


    try {

      const {
        title,
        description,
        basePrice,
        pricePerLetter,
        minimumPrice,
        displayOrder,
        active,
      } = req.body


      // ================= REQUIRED FIELDS =================

      if (
        !title ||
        !description ||
        basePrice === undefined
      ) {
        return res.status(400).json({
          message:
            "Title, description and base price are required",
        })
      }


      if (!req.file) {
        return res.status(400).json({
          message:
            "Product image is required",
        })
      }


      // ================= VALIDATE PRICES =================

      const cleanBasePrice =
        Number(basePrice)

      const cleanPricePerLetter =
        Number(
          pricePerLetter || 0
        )

      const cleanMinimumPrice =
        Number(
          minimumPrice || 0
        )


      if (
        !Number.isFinite(
          cleanBasePrice
        ) ||
        cleanBasePrice < 0 ||
        !Number.isFinite(
          cleanPricePerLetter
        ) ||
        cleanPricePerLetter < 0 ||
        !Number.isFinite(
          cleanMinimumPrice
        ) ||
        cleanMinimumPrice < 0
      ) {
        return res.status(400).json({
          message:
            "Please enter valid prices.",
        })
      }


      // ================= CLOUDINARY UPLOAD =================

      cloudinaryResult =
        await uploadImage(
          req.file.buffer,
          "microarts/products"
        )


      // ================= CREATE PRODUCT =================

      const slug = await generateUniqueSlug(
        title,
        PersonalizedProduct
      )

      const product =
        await PersonalizedProduct.create({
          slug,

          title:
            title.trim(),

          description:
            description.trim(),

          image:
            cloudinaryResult.secure_url,

          imagePublicId:
            cloudinaryResult.public_id,

          basePrice:
            cleanBasePrice,

          pricePerLetter:
            cleanPricePerLetter,

          minimumPrice:
            cleanMinimumPrice,

          displayOrder:
            Math.max(
              1,
              Number(
                displayOrder
              ) || 9999
            ),

          active:
            active === undefined
              ? true
              : active === "true",

          inStock:
            req.body.inStock === undefined
              ? true
              : req.body.inStock === "true",
        })


      return res
        .status(201)
        .json({
          message:
            "Personalized product created successfully",

          product,
        })

    } catch (error) {

      console.error(
        "Create personalized product error:",
        error
      )


      // If upload worked but database save failed,
      // remove the unused Cloudinary image.

      if (
        cloudinaryResult
          ?.public_id
      ) {
        await deleteImage(
          cloudinaryResult.public_id
        )
      }


      return res.status(500).json({
        message:
          "Failed to create personalized product",
      })
    }
  }
)


// =====================================================
// ARTIST - EDIT PERSONALIZED PRODUCT
// =====================================================

router.patch(
  "/:id",
  authMiddleware,
  artistMiddleware,
  upload.single("image"),

  async (req, res) => {

    let newCloudinaryImage =
      null


    try {

      const product =
        await PersonalizedProduct
          .findById(
            req.params.id
          )


      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        })
      }


      const oldImagePublicId =
        product.imagePublicId


      // ================= TITLE =================

      if (
        req.body.title !==
        undefined
      ) {

        const cleanTitle =
          String(
            req.body.title
          ).trim()


        if (!cleanTitle) {
          return res.status(400).json({
            message:
              "Product title is required.",
          })
        }


        product.title =
          cleanTitle
      }


      // ================= DESCRIPTION =================

      if (
        req.body.description !==
        undefined
      ) {

        const cleanDescription =
          String(
            req.body.description
          ).trim()


        if (!cleanDescription) {
          return res.status(400).json({
            message:
              "Product description is required.",
          })
        }


        product.description =
          cleanDescription
      }


      // ================= BASE PRICE =================

      if (
        req.body.basePrice !==
        undefined
      ) {

        const value =
          Number(
            req.body.basePrice
          )


        if (
          !Number.isFinite(value) ||
          value < 0
        ) {
          return res.status(400).json({
            message:
              "Invalid base price.",
          })
        }


        product.basePrice =
          value
      }


      // ================= PRICE PER LETTER =================

      if (
        req.body.pricePerLetter !==
        undefined
      ) {

        const value =
          Number(
            req.body.pricePerLetter
          )


        if (
          !Number.isFinite(value) ||
          value < 0
        ) {
          return res.status(400).json({
            message:
              "Invalid price per letter.",
          })
        }


        product.pricePerLetter =
          value
      }


      // ================= MINIMUM PRICE =================

      if (
        req.body.minimumPrice !==
        undefined
      ) {

        const value =
          Number(
            req.body.minimumPrice
          )


        if (
          !Number.isFinite(value) ||
          value < 0
        ) {
          return res.status(400).json({
            message:
              "Invalid minimum price.",
          })
        }


        product.minimumPrice =
          value
      }


      // ================= DISPLAY ORDER =================

      if (
        req.body.displayOrder !==
        undefined
      ) {

        product.displayOrder =
          Math.max(
            1,
            Number(
              req.body.displayOrder
            ) || 9999
          )
      }


      // ================= ACTIVE STATUS =================

      if (
        req.body.active !==
        undefined
      ) {

        product.active =
          req.body.active ===
          "true"
      }

      // ================= STOCK AVAILABILITY =================

      if (req.body.inStock !== undefined) {
        if (
          req.body.inStock !== "true" &&
          req.body.inStock !== "false"
        ) {
          return res.status(400).json({
            message: "Invalid stock availability.",
          })
        }

        product.inStock = req.body.inStock === "true"
      }


      // ================= NEW IMAGE =================

      if (req.file) {

        newCloudinaryImage =
          await uploadImage(
            req.file.buffer,
            "microarts/products"
          )


        product.image =
          newCloudinaryImage
            .secure_url

        product.imagePublicId =
          newCloudinaryImage
            .public_id
      }


      // ================= SAVE =================

      await product.save()


      // Delete the previous Cloudinary image
      // only after MongoDB saves successfully.

      if (
        req.file &&
        oldImagePublicId &&
        oldImagePublicId !==
          product.imagePublicId
      ) {
        await deleteImage(
          oldImagePublicId
        )
      }


      return res.json({
        message:
          "Personalized product updated successfully",

        product,
      })

    } catch (error) {

      console.error(
        "Update personalized product error:",
        error
      )


      // If a new Cloudinary image uploaded
      // but saving failed, remove that new image.

      if (
        newCloudinaryImage
          ?.public_id
      ) {
        await deleteImage(
          newCloudinaryImage
            .public_id
        )
      }


      return res.status(500).json({
        message:
          "Failed to update personalized product",
      })
    }
  }
)


// =====================================================
// ARTIST - DELETE PERSONALIZED PRODUCT
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  artistMiddleware,

  async (req, res) => {

    try {

      const product =
        await PersonalizedProduct
          .findById(
            req.params.id
          )


      if (!product) {
        return res.status(404).json({
          message:
            "Personalized product not found",
        })
      }


      const imagePublicId =
        product.imagePublicId


      // Delete database record first.
      await product.deleteOne()


      // Then remove its Cloudinary image.
      if (imagePublicId) {
        await deleteImage(
          imagePublicId
        )
      }


      return res.json({
        message:
          "Personalized product deleted successfully",
      })

    } catch (error) {

      console.error(
        "Delete personalized product error:",
        error
      )


      return res.status(500).json({
        message:
          "Failed to delete personalized product",
      })
    }
  }
)


module.exports =
  router