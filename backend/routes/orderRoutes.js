const express = require("express")

const Order = require("../models/Order")
const authMiddleware = require("../middleware/authMiddleware")
const artistMiddleware = require("../middleware/artistMiddleware")
const mongoose = require("mongoose")
const PersonalizedProduct = require("../models/PersonalizedProduct")

const router = express.Router()


// ================= CREATE ORDER REQUEST =================
// Public route - customer does not need to be logged in

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      items,
    } = req.body


    // ================= CUSTOMER VALIDATION =================

    const cleanName =
      String(fullName || "").trim()

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase()

    const cleanPhone =
      String(phone || "").trim()

    const cleanAddress =
      String(address || "").trim()


    // Check required customer information
    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPhone ||
      !cleanAddress
    ) {
      return res.status(400).json({
        message:
          "Please provide all customer details.",
      })
    }


    // Validate full name
    if (
      cleanName.length < 2 ||
      cleanName.length > 100
    ) {
      return res.status(400).json({
        message:
          "Full name must be between 2 and 100 characters.",
      })
    }


    // Validate email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      cleanEmail.length > 150 ||
      !emailPattern.test(cleanEmail)
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid email address.",
      })
    }


    // Validate phone number
    const phonePattern =
      /^[0-9+() .-]{7,25}$/

    if (!phonePattern.test(cleanPhone)) {
      return res.status(400).json({
        message:
          "Please enter a valid phone number.",
      })
    }


    // Validate shipping address
    if (
      cleanAddress.length < 10 ||
      cleanAddress.length > 500
    ) {
      return res.status(400).json({
        message:
          "Shipping address must be between 10 and 500 characters.",
      })
    }


    // ================= CART VALIDATION =================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Your order must contain at least one item.",
      })
    }


    // Prevent excessively large order requests
    if (items.length > 50) {
      return res.status(400).json({
        message:
          "Your order contains too many different items.",
      })
    }


    const orderItems = []
    let totalPrice = 0


    // ================= CHECK EVERY PRODUCT =================

    for (const item of items) {

      const personalizedText =
        String(item.text || "").trim()

      const quantity =
        Number(item.quantity)


      // Validate product ID
      if (
        !item.productId ||
        !mongoose.Types.ObjectId.isValid(
          item.productId
        )
      ) {
        return res.status(400).json({
          message:
            "One of the products is invalid.",
        })
      }


      // Validate personalization
      if (!personalizedText) {
        return res.status(400).json({
          message:
            "Personalized text is required.",
        })
      }


      // Prevent excessively long personalization
      if (personalizedText.length > 200) {
        return res.status(400).json({
          message:
            "Personalized text cannot exceed 200 characters.",
        })
      }


      // Validate quantity
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return res.status(400).json({
          message:
            "Product quantity must be between 1 and 100.",
        })
      }


      // ================= PRODUCT DATABASE CHECK =================

      // Always get the real product information
      // and pricing from MongoDB
      const product =
        await PersonalizedProduct.findById(
          item.productId
        )

      if (!product || !product.active) {
        return res.status(400).json({
          message:
            "One of the selected products is no longer available.",
        })
      }
      // ================= STOCK AVAILABILITY CHECK =================

      if (product.inStock === false) {
        return res.status(409).json({
          message:
            `"${product.title}" is currently out of stock. Please remove it from your cart before submitting your order.`,
        })
      }


      // ================= PRICE CALCULATION =================

      // Count characters without spaces
      const letterCount =
        personalizedText.replace(
          /\s/g,
          ""
        ).length

      if (letterCount === 0) {
        return res.status(400).json({
          message:
            "Personalized text must contain at least one character.",
        })
      }


      // Use pricing stored in MongoDB
      const basePrice =
        Number(product.basePrice) || 0

      const minimumPrice =
        Number(product.minimumPrice) || 0

      const pricePerLetter =
        Number(product.pricePerLetter) || 0


      const itemPrice =
        Math.max(
          basePrice,
          minimumPrice,
          letterCount * pricePerLetter
        )


      // Add to estimated order total
      totalPrice +=
        itemPrice * quantity


      // Save product snapshot with the order
      orderItems.push({
        productId: product._id,
        product: product.title,
        text: personalizedText,
        image: product.image,
        price: itemPrice,
        quantity,
      })
    }


    // ================= CREATE ORDER =================

    const order = await Order.create({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      address: cleanAddress,
      items: orderItems,
      totalPrice,
    })


    res.status(201).json({
      message:
        "Order request submitted successfully!",
      order,
    })

  } catch (error) {
    console.error(
      "Create order error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to submit order request.",
    })
  }
})

// ================= GET ALL ORDERS =================
// Artist only

router.get(
  "/",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })

      res.json(orders)
    } catch (error) {
      console.error(
        "Load orders error:",
        error
      )

      res.status(500).json({
        message:
          "Failed to load customer orders.",
      })
    }
  }
)


// ================= UPDATE ORDER STATUS =================
// Artist only

router.patch(
  "/:id/status",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {
      const allowedStatuses = [
        "Pending",
        "Contacted",
        "Confirmed",
        "In Progress",
        "Completed",
        "Cancelled",
      ]

      const { status } = req.body

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status.",
        })
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        )

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        })
      }

      res.json({
        message:
          "Order status updated successfully.",
        order,
      })
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      )

      res.status(500).json({
        message:
          "Failed to update order status.",
      })
    }
  }
)

/* =====================================================
   ARTIST - DELETE PERSONALIZED ARTWORK REQUEST
===================================================== */

router.delete(
  "/:id",
  authMiddleware,
  artistMiddleware,
  async (req, res) => {
    try {
      // Validate MongoDB order ID
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        })
      }

      // Permanently delete the order
      const deletedOrder = await Order.findByIdAndDelete(
        req.params.id
      )

      if (!deletedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Personalized artwork request deleted successfully.",
      })

    } catch (error) {
      console.error("Delete order error:", error)

      return res.status(500).json({
        success: false,
        message: "Failed to delete personalized artwork request.",
      })
    }
  }
)



module.exports = router