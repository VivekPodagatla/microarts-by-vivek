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
// ARTIST - GET ALL CUSTOM ART REQUESTS
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
        "Get custom requests error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch custom requests.",
      })
    }
  }
)


// =====================================================
// PUBLIC - SUBMIT CUSTOM ART REQUEST
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


      // ================= REQUIRED FIELDS =================

      if (
        !cleanName ||
        !cleanPhone ||
        !cleanEmail ||
        !cleanRequestDetails ||
        !cleanArtworkId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required.",
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

      if (
        cleanRequestDetails.length < 5 ||
        cleanRequestDetails.length > 2000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Request details must be between 5 and 2000 characters.",
        })
      }


      // ================= ARTWORK ID VALIDATION =================

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


      // ================= VERIFY ARTWORK EXISTS =================

      const artwork =
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


      // ================= CREATE REQUEST =================

      const customRequest =
        await CustomRequest.create({
          fullName:
            cleanName,

          phone:
            cleanPhone,

          email:
            cleanEmail,

          requestDetails:
            cleanRequestDetails,

          artworkId:
            artwork._id,
        })


      // ================= SUCCESS =================

      return res.status(201).json({
        success: true,

        message:
          "Custom art request submitted successfully.",

        request:
          customRequest,
      })

    } catch (error) {

      console.error(
        "Custom request error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Failed to submit custom art request.",
      })
    }
  }
)


// =====================================================
// ARTIST - UPDATE CUSTOM REQUEST STATUS
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
            "Invalid custom request.",
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
            "Custom request not found.",
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
        "Update custom request error:",
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


module.exports = router