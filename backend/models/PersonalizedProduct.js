const mongoose =
  require("mongoose")


const personalizedProductSchema =
  new mongoose.Schema(
    {

      title: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true,
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
      // Existing old products may not have this yet.

      imagePublicId: {
        type: String,
        trim: true,
        default: "",
      },


      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },


      pricePerLetter: {
        type: Number,
        default: 0,
        min: 0,
      },


      minimumPrice: {
        type: Number,
        default: 0,
        min: 0,
      },


      displayOrder: {
        type: Number,
        default: 9999,
        min: 1,
      },


      active: {
        type: Boolean,
        default: true,
      },

    },

    {
      timestamps: true,
    }
  )


module.exports =
  mongoose.model(
    "PersonalizedProduct",
    personalizedProductSchema
  )