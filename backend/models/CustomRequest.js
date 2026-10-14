const mongoose = require("mongoose")

const customRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    requestDetails: {
      type: String,
      trim: true,
      default: "",
    },

    requestType: {
      type: String,
      enum: [
        "custom-art",
        "contact",
      ],
      default: "custom-art",
    },

    artworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "CustomRequest",
  customRequestSchema
)