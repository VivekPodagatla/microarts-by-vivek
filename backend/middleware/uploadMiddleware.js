const multer =
  require("multer")


// =====================================================
// MEMORY STORAGE
// =====================================================
//
// Images are temporarily kept in memory,
// then uploaded to Cloudinary.
//
// Nothing is permanently saved to backend/uploads.

const storage =
  multer.memoryStorage()


// =====================================================
// IMAGE VALIDATION
// =====================================================

const fileFilter =
  (
    req,
    file,
    callback
  ) => {

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]


    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      return callback(
        null,
        true
      )
    }


    return callback(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      ),
      false
    )
  }


// =====================================================
// MULTER
// =====================================================

const upload =
  multer({
    storage,

    fileFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
  })


module.exports = upload