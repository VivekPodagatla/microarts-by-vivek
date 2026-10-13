const cloudinary =
  require("../config/cloudinary")


// =====================================================
// UPLOAD IMAGE
// =====================================================

const uploadImage =
  (
    imageBuffer,
    folder
  ) => {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type:
                "image",
            },

            (
              error,
              result
            ) => {

              if (error) {
                return reject(
                  error
                )
              }


              return resolve(
                result
              )
            }
          )


        uploadStream.end(
          imageBuffer
        )
      }
    )
  }


// =====================================================
// DELETE IMAGE
// =====================================================

const deleteImage =
  async (
    publicId
  ) => {

    if (!publicId) {
      return
    }


    try {

      await cloudinary
        .uploader
        .destroy(
          publicId,
          {
            resource_type:
              "image",

            invalidate:
              true,
          }
        )

    } catch (error) {

      console.error(
        "Cloudinary image deletion error:",
        error.message
      )
    }
  }


// =====================================================

module.exports = {
  uploadImage,
  deleteImage,
}