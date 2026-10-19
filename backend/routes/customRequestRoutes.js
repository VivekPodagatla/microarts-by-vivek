const express = require("express")
const mongoose = require("mongoose")

const CustomRequest =
  require("../models/CustomRequest")

const Artwork =
  require("../models/Artwork")

const authMiddleware =
  require("../middleware/authMiddleware")

const artistMiddleware =
  require("../middleware/artistMiddleware")


const router = express.Router()


// =====================================================
// ARTIST - GET ALL CUSTOM ART / CONTACT REQUESTS
// =====================================================

router.get(
  "/",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {

      const requests =
        await CustomRequest.find()
          .populate(
            "artworkId",
            "title image category material size timeTaken"
          )
          .sort({
            createdAt: -1,
          })


      return res.status(200).json(
        requests
      )

    } catch (error) {

      console.error(
        "Get requests error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch requests.",
      })
    }
  }
)


// =====================================================
// PUBLIC - SUBMIT CUSTOM ART / CONTACT REQUEST
// No customer login required
// =====================================================

router.post(
  "/",
  async (req, res) => {
    try {

      const {
        fullName,
        phone,
        email,
        requestDetails,
        artworkId,
        requestType,
      } = req.body


      // ================= CLEAN INPUT =================

      const cleanName =
        String(fullName || "").trim()

      const cleanPhone =
        String(phone || "").trim()

      const cleanEmail =
        String(email || "")
          .trim()
          .toLowerCase()

      const cleanRequestDetails =
        String(requestDetails || "").trim()

      const cleanArtworkId =
        String(artworkId || "").trim()

      const cleanRequestType =
        String(
          requestType || "custom-art"
        )
          .trim()
          .toLowerCase()


      // ================= REQUEST TYPE =================

      const allowedRequestTypes = [
        "custom-art",
        "contact",
      ]


      if (
        !allowedRequestTypes.includes(
          cleanRequestType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid request type.",
        })
      }


      // ================= REQUIRED FIELDS =================

      if (
        !cleanName ||
        !cleanPhone ||
        !cleanEmail
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, phone, and email are required.",
        })
      }


      // ================= NAME VALIDATION =================

      if (
        cleanName.length < 2 ||
        cleanName.length > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Full name must be between 2 and 100 characters.",
        })
      }


      // ================= EMAIL VALIDATION =================

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/


      if (
        cleanEmail.length > 150 ||
        !emailPattern.test(
          cleanEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid email address.",
        })
      }


      // ================= PHONE VALIDATION =================

      const phonePattern =
        /^[0-9+() .-]{7,25}$/


      if (
        !phonePattern.test(
          cleanPhone
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid phone number.",
        })
      }


      // ================= REQUEST DETAILS VALIDATION =================

      // Custom artwork requests require details.

      if (
        cleanRequestType === "custom-art" &&
        (
          cleanRequestDetails.length < 5 ||
          cleanRequestDetails.length > 2000
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please describe the customized MicroArt you would like.",
        })
      }


      // General contact reason is optional.

      if (
        cleanRequestType === "contact" &&
        cleanRequestDetails.length > 2000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Your message cannot exceed 2000 characters.",
        })
      }


      // ================= OPTIONAL ARTWORK =================

      let artwork = null


      /*
        General contact:
        No artwork should be attached.

        Custom art:
        An artwork may be attached if the customer
        is requesting customization of an existing piece.

        A completely new custom-art idea can also
        be submitted without an artwork.
      */

      if (
        cleanRequestType === "custom-art" &&
        cleanArtworkId
      ) {

        // Validate MongoDB artwork ID

        if (
          !mongoose.Types.ObjectId.isValid(
            cleanArtworkId
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid artwork.",
          })
        }


        // Verify artwork exists

        artwork =
          await Artwork.findById(
            cleanArtworkId
          )


        if (!artwork) {
          return res.status(404).json({
            success: false,
            message:
              "The selected artwork could not be found.",
          })
        }
      }


      // ================= CREATE REQUEST =================

      const newRequest =
        await CustomRequest.create({
          fullName:
            cleanName,

          phone:
            cleanPhone,

          email:
            cleanEmail,

          requestDetails:
            cleanRequestDetails,

          requestType:
            cleanRequestType,

          artworkId:
            artwork
              ? artwork._id
              : null,
        })


      // ================= SUCCESS MESSAGE =================

      const successMessage =
        cleanRequestType === "contact"
          ? "Message sent successfully."
          : "Custom art request submitted successfully."


      // ================= SUCCESS =================

      return res.status(201).json({
        success: true,

        message:
          successMessage,

        request:
          newRequest,
      })

    } catch (error) {

      console.error(
        "Request submission error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Failed to submit your request.",
      })
    }
  }
)


// =====================================================
// ARTIST - UPDATE REQUEST STATUS
// =====================================================

router.patch(
  "/:id/status",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {

      // ================= VALIDATE REQUEST ID =================

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid request.",
        })
      }


      const {
        status,
      } = req.body


      // Keep these values synchronized
      // with the CustomRequest model.

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ]


      // ================= VALIDATE STATUS =================

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid request status.",
        })
      }


      // ================= UPDATE REQUEST =================

      const request =
        await CustomRequest.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "artworkId",
          "title image category material size timeTaken"
        )


      if (!request) {
        return res.status(404).json({
          success: false,
          message:
            "Request not found.",
        })
      }


      // ================= SUCCESS =================

      return res.status(200).json({
        success: true,

        message:
          "Request status updated successfully.",

        request,
      })

    } catch (error) {

      console.error(
        "Update request error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Failed to update request status.",
      })
    }
  }
)


/* =====================================================
   ARTIST - DELETE CUSTOM ART / CONTACT REQUEST
===================================================== */

router.delete(
  "/:id",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {

      // Validate MongoDB request ID
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid request ID.",
        })
      }

      // Delete the request from MongoDB
      const deletedRequest =
        await CustomRequest.findByIdAndDelete(
          req.params.id
        )

      // Request does not exist
      if (!deletedRequest) {
        return res.status(404).json({
          success: false,
          message: "Request not found.",
        })
      }

      // Successfully deleted
      return res.status(200).json({
        success: true,
        message: "Request deleted successfully.",
      })

    } catch (error) {

      console.error(
        "Delete custom request error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Failed to delete request.",
      })
    }
  }
)

module.exports = router