const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()


// ================= HELPERS =================

const normalizePhone = (phone = "") => {
  return phone.replace(/\D/g, "")
}


// ================= PUBLIC REGISTRATION DISABLED =================

router.post("/register", (req, res) => {
  return res.status(403).json({
    success: false,
    message:
      "Public account registration is not available.",
  })
})


// ================= ARTIST LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const {
      identifier,
      password,
    } = req.body


    // ================= VALIDATE INPUT =================

    if (
      !identifier ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      })
    }


    const cleanIdentifier =
      String(identifier).trim()


    if (!cleanIdentifier) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      })
    }


    let user = null


    // ================= FIND ARTIST BY EMAIL =================

    if (
      cleanIdentifier.includes("@")
    ) {
      const cleanEmail =
        cleanIdentifier.toLowerCase()

      user = await User.findOne({
        email: cleanEmail,
        role: "artist",
      })
    }


    // ================= FIND ARTIST BY PHONE =================
    // Kept for compatibility if you ever want
    // to sign in using your phone number.

    else {
      const cleanPhone =
        normalizePhone(
          cleanIdentifier
        )

      if (
        cleanPhone.length >= 7 &&
        cleanPhone.length <= 15
      ) {
        user = await User.findOne({
          phone: cleanPhone,
          role: "artist",
        })


        // Try final 10 digits only if an exact
        // artist phone number was not found.
        if (!user && cleanPhone.length >= 10) {
          const last10Digits =
            cleanPhone.slice(-10)

          const matchingArtists =
            await User.find({
              role: "artist",
              phone: {
                $regex:
                  `${last10Digits}$`,
              },
            })


          if (
            matchingArtists.length === 1
          ) {
            user =
              matchingArtists[0]
          }
        }
      }
    }


    // ================= ARTIST NOT FOUND =================

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid artist email or password.",
      })
    }


    // ================= SAFETY ROLE CHECK =================

    if (user.role !== "artist") {
      return res.status(403).json({
        success: false,
        message:
          "Artist access required.",
      })
    }


    // ================= CHECK PASSWORD =================

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      )


    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid artist email or password.",
      })
    }


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


    // ================= CREATE ARTIST TOKEN =================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: "artist",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )


    // ================= LOGIN SUCCESS =================

    return res.status(200).json({
      success: true,

      message:
        "Artist login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone:
          user.phone || "",
        role: user.role,
      },
    })

  } catch (error) {
    console.error(
      "Artist login error:",
      error
    )

    return res.status(500).json({
      success: false,
      message:
        "Unable to log in. Please try again.",
    })
  }
})


module.exports = router