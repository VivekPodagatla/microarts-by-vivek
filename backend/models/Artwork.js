const mongoose =
  require("mongoose")


const artworkSchema =
  new mongoose.Schema(
    {

      title: {
        type: String,
        required: true,
        trim: true,
      },


      description: {
        type: String,
        required: true,
        trim: true,
      },


      image: {
        type: String,
        required: true,
        trim: true,
      },


      // Cloudinary public ID
      // Existing old artworks may not have this yet.

      imagePublicId: {
        type: String,
        trim: true,
        default: "",
      },


      size: {
        type: String,
        trim: true,
        default: "",
      },


      material: {
        type: String,
        trim: true,
        default: "",
      },


      category: {
        type: String,
        required: true,
        trim: true,
      },


      timeTaken: {
        type: String,
        trim: true,
        default: "",
      },


      featured: {
        type: Boolean,
        default: false,
      },


      featuredOrder: {
        type: Number,
        default: 9999,
        min: 1,
      },

    },

    {
      timestamps: true,
    }
  )


const Artwork =
  mongoose.model(
    "Artwork",
    artworkSchema
  )


module.exports =
  Artwork