const jwt = require("jsonwebtoken")


const authMiddleware = (
  req,
  res,
  next
) => {
  try {

    // ================= CHECK JWT SECRET =================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured."
      )

      return res.status(500).json({
        success: false,
        message:
          "Server configuration error.",
      })
    }


    // ================= GET AUTH HEADER =================

    const authHeader =
      req.headers.authorization


    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      })
    }


    // ================= CHECK BEARER TOKEN =================

    const parts =
      authHeader.split(" ")


    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer" ||
      !parts[1]
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      })
    }


    const token =
      parts[1]


    // ================= VERIFY TOKEN =================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      )


    if (
      !decoded ||
      !decoded.userId
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      })
    }


    // ================= ATTACH USER ID =================

    req.userId =
      decoded.userId

    req.tokenRole =
      decoded.role || null


    next()

  } catch (error) {

    if (
      error.name ===
        "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Your session has expired. Please log in again.",
      })
    }


    if (
      error.name ===
        "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      })
    }


    console.error(
      "Authentication middleware error:",
      error
    )


    return res.status(401).json({
      success: false,
      message:
        "Authentication failed.",
    })
  }
}


module.exports = authMiddleware