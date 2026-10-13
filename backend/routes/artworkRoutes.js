const express =
  require("express")

const mongoose =
  require("mongoose")

const Artwork =
  require("../models/Artwork")

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
// PUBLIC - GET ALL ARTWORKS
// =====================================================

router.get(
  "/",
  async (req, res) => {
    try {

      const artworks =
        await Artwork.find()
          .sort({
            featured: -1,
            featuredOrder: 1,
            createdAt: -1,
          })


      return res.json({
        success: true,
        artworks,
      })

    } catch (error) {

      console.error(
        "Get artworks error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Server error",
      })
    }
  }
)


// =====================================================
// PUBLIC - GET FEATURED ARTWORKS
// =====================================================

router.get(
  "/featured",
  async (req, res) => {
    try {

      const artworks =
        await Artwork.find({
          featured: true,
        }).sort({
          featuredOrder: 1,
          createdAt: -1,
        })


      return res.json({
        success: true,
        artworks,
      })

    } catch (error) {

      console.error(
        "Get featured artworks error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Server error",
      })
    }
  }
)


// =====================================================
// PUBLIC - GET ONE ARTWORK
// =====================================================

router.get(
  "/:id",
  async (req, res) => {
    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid artwork.",
        })
      }


      const artwork =
        await Artwork.findById(
          req.params.id
        )


      if (!artwork) {
        return res.status(404).json({
          success: false,
          message:
            "Artwork not found",
        })
      }


      return res.json({
        success: true,
        artwork,
      })

    } catch (error) {

      console.error(
        "Get artwork error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Server error",
      })
    }
  }
)


// =====================================================
// ARTIST - CREATE ARTWORK
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
        size,
        material,
        category,
        timeTaken,
        featured,
        featuredOrder,
      } = req.body


      if (
        !title ||
        !description ||
        !category ||
        !req.file
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, description, category and image are required",
        })
      }


      const cleanTitle =
        String(title).trim()

      const cleanDescription =
        String(description).trim()

      const cleanCategory =
        String(category).trim()


      if (
        !cleanTitle ||
        !cleanDescription ||
        !cleanCategory
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, description and category are required",
        })
      }


      const isFeatured =
        featured === "true"


      // ================= CLOUDINARY UPLOAD =================

      cloudinaryResult =
        await uploadImage(
          req.file.buffer,
          "microarts/artworks"
        )


      // ================= CREATE ARTWORK =================

      const artwork =
        await Artwork.create({

          title:
            cleanTitle,

          description:
            cleanDescription,

          image:
            cloudinaryResult.secure_url,

          imagePublicId:
            cloudinaryResult.public_id,

          size:
            String(size || "").trim(),

          material:
            String(material || "").trim(),

          category:
            cleanCategory,

          timeTaken:
            String(timeTaken || "").trim(),

          featured:
            isFeatured,

          featuredOrder:
            isFeatured
              ? Math.max(
                  1,
                  Number(
                    featuredOrder
                  ) || 1
                )
              : 9999,
        })


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Artwork created successfully",

          artwork,
        })

    } catch (error) {

      console.error(
        "Create artwork error:",
        error
      )


      // If Cloudinary upload succeeded
      // but MongoDB save failed,
      // remove the unused image.

      if (
        cloudinaryResult
          ?.public_id
      ) {
        await deleteImage(
          cloudinaryResult
            .public_id
        )
      }


      return res.status(500).json({
        success: false,
        message:
          "Server error",
      })
    }
  }
)


// =====================================================
// ARTIST - UPDATE ARTWORK
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

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid artwork.",
        })
      }


      const artwork =
        await Artwork.findById(
          req.params.id
        )


      if (!artwork) {
        return res.status(404).json({
          success: false,
          message:
            "Artwork not found",
        })
      }


      const oldImagePublicId =
        artwork.imagePublicId


      const {
        title,
        description,
        size,
        material,
        category,
        timeTaken,
        featured,
        featuredOrder,
      } = req.body


      // ================= TITLE =================

      if (
        title !== undefined
      ) {

        const cleanTitle =
          String(title).trim()


        if (!cleanTitle) {
          return res.status(400).json({
            success: false,
            message:
              "Artwork title is required.",
          })
        }


        artwork.title =
          cleanTitle
      }


      // ================= DESCRIPTION =================

      if (
        description !== undefined
      ) {

        const cleanDescription =
          String(
            description
          ).trim()


        if (!cleanDescription) {
          return res.status(400).json({
            success: false,
            message:
              "Artwork description is required.",
          })
        }


        artwork.description =
          cleanDescription
      }


      // ================= SIZE =================

      if (
        size !== undefined
      ) {
        artwork.size =
          String(size).trim()
      }


      // ================= MATERIAL =================

      if (
        material !== undefined
      ) {
        artwork.material =
          String(material).trim()
      }


      // ================= CATEGORY =================

      if (
        category !== undefined
      ) {

        const cleanCategory =
          String(category).trim()


        if (!cleanCategory) {
          return res.status(400).json({
            success: false,
            message:
              "Artwork category is required.",
          })
        }


        artwork.category =
          cleanCategory
      }


      // ================= TIME TAKEN =================

      if (
        timeTaken !== undefined
      ) {
        artwork.timeTaken =
          String(
            timeTaken
          ).trim()
      }


      // ================= FEATURED SETTINGS =================

      if (
        featured !== undefined
      ) {

        artwork.featured =
          featured === "true"


        artwork.featuredOrder =
          artwork.featured
            ? Math.max(
                1,
                Number(
                  featuredOrder
                ) || 1
              )
            : 9999
      }


      // ================= NEW IMAGE =================

      if (req.file) {

        newCloudinaryImage =
          await uploadImage(
            req.file.buffer,
            "microarts/artworks"
          )


        artwork.image =
          newCloudinaryImage.secure_url

        artwork.imagePublicId =
          newCloudinaryImage.public_id
      }


      // ================= SAVE =================

      await artwork.save()


      // Delete the previous Cloudinary image
      // only after MongoDB saves successfully.

      if (
        req.file &&
        oldImagePublicId &&
        oldImagePublicId !==
          artwork.imagePublicId
      ) {
        await deleteImage(
          oldImagePublicId
        )
      }


      return res.json({
        success: true,

        message:
          "Artwork updated successfully",

        artwork,
      })

    } catch (error) {

      console.error(
        "Update artwork error:",
        error
      )


      // If a new Cloudinary image uploaded,
      // but saving failed, remove it.

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
        success: false,
        message:
          "Server error",
      })
    }
  }
)


// =====================================================
// ARTIST - DELETE ARTWORK
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  artistMiddleware,

  async (req, res) => {
    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid artwork.",
        })
      }


      const artwork =
        await Artwork.findById(
          req.params.id
        )


      if (!artwork) {
        return res.status(404).json({
          success: false,
          message:
            "Artwork not found",
        })
      }


      const imagePublicId =
        artwork.imagePublicId


      // Delete MongoDB record first.

      await artwork.deleteOne()


      // Then delete Cloudinary image.

      if (imagePublicId) {
        await deleteImage(
          imagePublicId
        )
      }


      return res.json({
        success: true,

        message:
          "Artwork deleted successfully",
      })

    } catch (error) {

      console.error(
        "Delete artwork error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Server error",
      })
    }
  }
)


module.exports =
  router