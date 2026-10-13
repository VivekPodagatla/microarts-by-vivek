const User = require("../models/User")


const artistMiddleware = async (
  req,
  res,
  next
) => {
  try {

    // ================= REQUIRE AUTHENTICATED USER =================

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      })
    }


    // ================= FIND USER =================

    const user =
      await User.findById(
        req.userId
      ).select(
        "_id name email phone role"
      )


    // ================= USER NOT FOUND =================

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication account not found.",
      })
    }


    // ================= REQUIRE ARTIST ROLE =================

    if (
      user.role !== "artist"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Artist access required.",
      })
    }


    // ================= ATTACH ARTIST =================

    req.user =
      user


    next()

  } catch (error) {
    console.error(
      "Artist middleware error:",
      error
    )


    return res.status(500).json({
      success: false,
      message:
        "Unable to verify artist access.",
    })
  }
}


module.exports = artistMiddleware