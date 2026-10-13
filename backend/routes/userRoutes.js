const express = require("express")

const authMiddleware =
  require("../middleware/authMiddleware")

const artistMiddleware =
  require("../middleware/artistMiddleware")


const router = express.Router()


// =========================================================
// GET ARTIST PROFILE
// =========================================================

router.get(
  "/profile",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {

      // artistMiddleware already verified the user
      // and attached the artist to req.user

      const artist = req.user


      return res.status(200).json({
        success: true,

        user: {
          id: artist._id,
          name: artist.name,
          email: artist.email,
          phone: artist.phone || "",
          role: artist.role,
        },
      })

    } catch (error) {

      console.error(
        "Artist profile error:",
        error
      )


      return res.status(500).json({
        success: false,
        message:
          "Unable to load artist profile.",
      })
    }
  }
)


module.exports = router