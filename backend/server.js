const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
require("dotenv").config()


// =====================================================
// ROUTES
// =====================================================

const authRoutes =
  require("./routes/authRoutes")

const userRoutes =
  require("./routes/userRoutes")

const artworkRoutes =
  require("./routes/artworkRoutes")

const customRequestRoutes =
  require("./routes/customRequestRoutes")

const personalizedProductRoutes =
  require("./routes/personalizedProductRoutes")

const orderRoutes =
  require("./routes/orderRoutes")


const app = express()


// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

const PORT =
  process.env.PORT || 5000

const MONGODB_URI =
  process.env.MONGODB_URI

const JWT_SECRET =
  process.env.JWT_SECRET


// =====================================================
// CHECK REQUIRED ENV VARIABLES
// =====================================================

if (!MONGODB_URI) {
  console.error(
    "MONGODB_URI is missing from the environment variables."
  )

  process.exit(1)
}


if (!JWT_SECRET) {
  console.error(
    "JWT_SECRET is missing from the environment variables."
  )

  process.exit(1)
}


// =====================================================
// SECURITY / SERVER SETTINGS
// =====================================================

// Hide Express information from response headers
app.disable("x-powered-by")


// Render and other hosting services place the app
// behind a reverse proxy.
//
// This allows Express / express-rate-limit to correctly
// identify the visitor IP address.
app.set("trust proxy", 1)


// =====================================================
// CORS
// =====================================================

// FRONTEND_URL can contain one or multiple URLs.
//
// Development example:
// FRONTEND_URL=http://localhost:5173
//
// Production example:
// FRONTEND_URL=https://microartsbyvivek.com,https://www.microartsbyvivek.com

const allowedOrigins =
  String(
    process.env.FRONTEND_URL ||
      "http://localhost:5173"
  )
    .split(",")
    .map((origin) =>
      origin.trim()
    )
    .filter(Boolean)


const corsOptions = {
  origin: (origin, callback) => {

    // Requests without an Origin header
    // can include Postman, server requests, health checks, etc.
    if (!origin) {
      return callback(
        null,
        true
      )
    }


    if (
      allowedOrigins.includes(
        origin
      )
    ) {
      return callback(
        null,
        true
      )
    }


    console.warn(
      `Blocked by CORS: ${origin}`
    )


    return callback(
      new Error(
        "Not allowed by CORS"
      )
    )
  },

  methods: [
    "GET",
    "POST",
    "PATCH",
    "DELETE",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
}


app.use(
  cors(corsOptions)
)


// =====================================================
// BODY PARSING
// =====================================================

app.use(
  express.json({
    limit: "1mb",
  })
)


// =====================================================
// STATIC UPLOADS
// =====================================================

// Works locally.
//
// IMPORTANT:
// Render's normal filesystem is not permanent.
// We will replace local image storage with Cloudinary
// before production deployment.




// =====================================================
// RATE LIMITERS
// =====================================================


// ---------------- ARTIST LOGIN LIMITER ----------------

const authLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 20,

    standardHeaders:
      "draft-7",

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many login attempts. Please try again later.",
    },
  })


// ---------------- PUBLIC REQUEST LIMITER ----------------
//
// Only POST requests are limited.
//
// Artist GET / PATCH requests are not counted,
// so normal dashboard usage will not be affected.

const publicSubmissionLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 30,

    standardHeaders:
      "draft-7",

    legacyHeaders:
      false,

    skip: (req) =>
      req.method !== "POST",

    message: {
      success: false,
      message:
        "Too many requests have been submitted. Please try again later.",
    },
  })


// =====================================================
// API ROUTES
// =====================================================


// ---------------- AUTH ----------------

app.use(
  "/api/auth",
  authLimiter,
  authRoutes
)


// ---------------- ARTIST PROFILE ----------------

app.use(
  "/api/users",
  userRoutes
)


// ---------------- ARTWORKS ----------------

app.use(
  "/api/artworks",
  artworkRoutes
)


// ---------------- CUSTOM ART REQUESTS ----------------

app.use(
  "/api/custom-requests",
  publicSubmissionLimiter,
  customRequestRoutes
)


// ---------------- PERSONALIZED PRODUCTS ----------------

app.use(
  "/api/personalized-products",
  personalizedProductRoutes
)


// ---------------- PERSONALIZED GIFT REQUESTS ----------------

app.use(
  "/api/orders",
  publicSubmissionLimiter,
  orderRoutes
)


// =====================================================
// ROOT ROUTE
// =====================================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "MicroArts API is running",
    })
  }
)


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (req, res) => {

    const databaseConnected =
      mongoose.connection.readyState === 1


    res.status(
      databaseConnected
        ? 200
        : 503
    ).json({
      success:
        databaseConnected,

      message:
        databaseConnected
          ? "MicroArts backend is working"
          : "Database is not connected",
    })
  }
)


// =====================================================
// API ROUTE NOT FOUND
// =====================================================

app.use(
  "/api",
  (req, res) => {
    return res.status(404).json({
      success: false,
      message:
        "API route not found.",
    })
  }
)


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "Server error:",
      error.message
    )


    // ---------------- CORS ----------------

    if (
      error.message ===
        "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Request origin is not allowed.",
      })
    }


    // ---------------- FILE TOO LARGE ----------------

    if (
      error.code ===
        "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({
        success: false,
        message:
          "The uploaded image is too large.",
      })
    }


    // ---------------- MULTER ----------------

    if (
      error.name ===
        "MulterError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Image upload failed.",
      })
    }


    // Artwork image validation
    if (
      error.message ===
      "Only JPG, PNG and WEBP images are allowed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      })
    }


    // ---------------- DEFAULT ----------------

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong on the server.",
    })
  }
)


// =====================================================
// CONNECT TO MONGODB
// =====================================================

mongoose
  .connect(
    MONGODB_URI
  )
  .then(() => {

    console.log(
      "MongoDB connected successfully"
    )


    app.listen(
      PORT,
      () => {

        console.log(
          `MicroArts backend running on port ${PORT}`
        )

        console.log(
          `Allowed frontend origins: ${allowedOrigins.join(", ")}`
        )
      }
    )

  })
  .catch((error) => {

    console.error(
      "MongoDB connection failed:"
    )

    console.error(
      error.message
    )

    process.exit(1)
  })