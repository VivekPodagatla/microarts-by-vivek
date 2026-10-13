import { useState, useEffect } from "react"
import "./App.css"
const API_URL =
  import.meta.env.VITE_API_URL
const getImageUrl = (image) => {
  if (!image) {
    return ""
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image
  }

  return `${API_URL}${image}`
}

const getArtworkImageUrl = (image) => {
  if (!image) {
    return ""
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image
  }

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`
  }

  return image
}

function App() {
  const [artworks, setArtworks] = useState([])

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/artworks`
        )

        const data = await response.json()

        if (!response.ok) {
          console.error(
            "Failed to load artworks:",
            data.message
          )
          return
        }

        setArtworks(data.artworks)
      } catch (error) {
        console.error(
          "Artwork loading error:",
          error
        )
      }
    }

    loadArtworks()
  }, [])

  useEffect(() => {
    const loadPersonalizedProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/personalized-products`
        )

        const data = await response.json()

        if (!response.ok) {
          console.error(
            "Failed to load personalized products:",
            data.message
          )
          return
        }

        setPersonalizedProducts(data)
      } catch (error) {
        console.error(
          "Personalized products loading error:",
          error
        )
      }
    }

  loadPersonalizedProducts()
}, [])

  const [selectedArtwork, setSelectedArtwork] =
    useState(null)

  const [customRequestArtwork, setCustomRequestArtwork] = useState(null)

  const [showRequestForm, setShowRequestForm] =
    useState(false)

  const [requestSubmitted, setRequestSubmitted] =
    useState(false)

  const [showPersonalized, setShowPersonalized] =
    useState(false)

  const [showProduct, setShowProduct] =
    useState(false)

  const [customText, setCustomText] =
    useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  

  // ================= AUTH PROFILE =================

  useEffect(() => {
    const token =
      localStorage.getItem("authToken")

    if (!token) {
      return
    }

    const loadUserProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          localStorage.removeItem(
            "authToken"
          )

          setAuthToken(null)
          setIsLoggedIn(false)
          setUser(null)

          return
        }

        if (data.user?.role !== "artist") {
          localStorage.removeItem("authToken")
          setAuthToken(null)
          setIsLoggedIn(false)
          setUser(null)
          return
        }

        setUser(data.user)
        setIsLoggedIn(true)
        setAuthToken(token)
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        )
      }
    }

    loadUserProfile()
  }, [])

  // ================= REQUESTS CART =================

  const [cart, setCart] = useState([])
  const [showCart, setShowCart] =
    useState(false)

  // ================= CHECKOUT =================

  const [showCheckout, setShowCheckout] =
    useState(false)

  const [checkoutName, setCheckoutName] =
    useState("")

  const [checkoutEmail, setCheckoutEmail] =
    useState("")

  const [checkoutPhone, setCheckoutPhone] =
    useState("")
  const [checkoutCountryCode, setCheckoutCountryCode] =
  useState("+1")

  const [checkoutAddress, setCheckoutAddress] =
    useState("")
  // ================= ORDER SUBMITTING =================

  const [isSubmittingOrder, setIsSubmittingOrder] =
    useState(false)

    // ================= ORDER SUCCESS =================

  const [orderSubmitted, setOrderSubmitted] =
    useState(false)

  const [submittedOrder, setSubmittedOrder] =
    useState(null)

  // ================= ARTIST AUTHENTICATION UI =================

  const [showLogin, setShowLogin] =
    useState(false)

  const [showArtistDashboard, setShowArtistDashboard] = useState(false)
  const [customRequests, setCustomRequests] = useState([])
  // ================= CUSTOMER ORDERS =================

  const [orders, setOrders] = useState([])

  const [personalizedProducts, setPersonalizedProducts] = useState([])
  const [selectedPersonalizedProduct,setSelectedPersonalizedProduct,] = useState(null)
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [showAddArtworkForm, setShowAddArtworkForm] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState(null)

  const [artistDashboardSection, setArtistDashboardSection] = useState("home")

  const [isLoggedIn, setIsLoggedIn] =
    useState(false)

  const [user, setUser] = useState(null)

  const [authToken, setAuthToken] =
    useState(
      localStorage.getItem("authToken")
    )

  // ================= LOGIN FIELDS =================

  const [loginEmail, setLoginEmail] =
    useState("")

  const [loginPassword, setLoginPassword] =
    useState("")

  // ================= MICROARTS NOTIFICATIONS =================

  const [notification, setNotification] =
    useState(null)

  const [confirmDialog, setConfirmDialog] =
    useState(null)

  useEffect(() => {
    if (!notification) {
      return
    }

    const timer = window.setTimeout(() => {
      setNotification(null)
    }, 3500)

    return () => {
      window.clearTimeout(timer)
    }
  }, [notification])

  const showNotification = (
    message,
    forcedType = null,
    forcedTitle = null
  ) => {
    const notificationMessage =
      String(
        message ||
          "Something went wrong."
      )

    const normalizedMessage =
      notificationMessage.toLowerCase()

    let type = forcedType

    if (!type) {
      if (
        normalizedMessage.includes(
          "success"
        ) ||
        normalizedMessage.includes(
          "added"
        ) ||
        normalizedMessage.includes(
          "updated"
        ) ||
        normalizedMessage.includes(
          "deleted"
        ) ||
        normalizedMessage.includes(
          "logged out"
        ) ||
        normalizedMessage.includes(
          "submitted"
        )
      ) {
        type = "success"
      } else if (
        normalizedMessage.includes(
          "please"
        ) ||
        normalizedMessage.includes(
          "empty"
        ) ||
        normalizedMessage.includes(
          "artist only"
        ) ||
        normalizedMessage.includes(
          "required"
        )
      ) {
        type = "warning"
      } else if (
        normalizedMessage.includes(
          "failed"
        ) ||
        normalizedMessage.includes(
          "unable"
        ) ||
        normalizedMessage.includes(
          "invalid"
        ) ||
        normalizedMessage.includes(
          "error"
        )
      ) {
        type = "error"
      } else {
        type = "info"
      }
    }

    const titleByType = {
      success: "Success",
      error: "Something went wrong",
      warning: "Please check",
      info: "MicroArts",
    }

    setNotification({
      message:
        notificationMessage,
      type,
      title:
        forcedTitle ||
        titleByType[type] ||
        "MicroArts",
    })
  }

  const showConfirm = ({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
  }) => {
    return new Promise(
      (resolve) => {
        setConfirmDialog({
          title,
          message,
          confirmText,
          cancelText,
          danger,
          resolve,
        })
      }
    )
  }

  const closeConfirmDialog = (
    result
  ) => {
    if (!confirmDialog) {
      return
    }

    const resolve =
      confirmDialog.resolve

    setConfirmDialog(null)

    resolve(result)
  }

 // ================= PRICING =================

  const letterCount =
    customText.replace(/\s/g, "").length
  

  // ================= NAVIGATION =================

  const goHome = () => {
    setShowCart(false)
    setShowProduct(false)
    setShowPersonalized(false)
    setShowLogin(false)
    setShowArtistDashboard(false)

    // Close checkout
    setShowCheckout(false)

    // Clear order success screen
    setOrderSubmitted(false)
    setSubmittedOrder(null)

    // Clear selected artwork/product
    setSelectedArtwork(null)
    setSelectedPersonalizedProduct(null)

    // Clear personalized text
    setCustomText("")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const openPersonalized = async () => {
    setShowCart(false)
    setShowProduct(false)
    setShowLogin(false)
    setShowArtistDashboard(false)
    setShowCheckout(false)
    setShowPersonalized(true)

    setOrderSubmitted(false)
    setSubmittedOrder(null)

    setSelectedArtwork(null)

    try {
      const response = await fetch(
        `${API_URL}/api/personalized-products`
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to load personalized products"
        )
        return
      }

      setPersonalizedProducts(data)

    } catch (error) {
      console.error(
        "Personalized products loading error:",
        error
      )

      showNotification(
        "Unable to load personalized products."
      )
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  const openCart = () => {
    setShowCart(true)
    setShowProduct(false)
    setShowPersonalized(false)
    setShowLogin(false)
    setShowArtistDashboard(false)
    setShowCheckout(false)

    setOrderSubmitted(false)
    setSubmittedOrder(null)

    setSelectedArtwork(null)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const openLogin = () => {
    setShowLogin(true)
    setShowCart(false)
    setShowProduct(false)
    setShowPersonalized(false)
    setShowArtistDashboard(false)
    setShowCheckout(false)

    setOrderSubmitted(false)
    setSubmittedOrder(null)

    setSelectedArtwork(null)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const openArtistDashboard = async (tokenOverride = authToken) => {
    const dashboardToken = tokenOverride

    setShowArtistDashboard(true)
    setArtistDashboardSection("home")

    setShowCart(false)
    setShowProduct(false)
    setShowPersonalized(false)
    setShowLogin(false)
    setSelectedArtwork(null)
    setShowRequestForm(false)
    setRequestSubmitted(false)

    try {
      // Load customized art requests
      const requestsResponse = await fetch(
        `${API_URL}/api/custom-requests`,
        {
          headers: {
            Authorization: `Bearer ${dashboardToken}`,
          },
        }
      )

      const requestsData =
        await requestsResponse.json()

      if (!requestsResponse.ok) {
        showNotification(
          requestsData.message ||
            "Failed to load custom requests"
        )
        return
      }

      // Load personalized products
      const productsResponse = await fetch(
        `${API_URL}/api/personalized-products/artist/all`,
        {
          headers: {
            Authorization: `Bearer ${dashboardToken}`,
          },
        }
      )

      const productsData =
        await productsResponse.json()

      if (!productsResponse.ok) {
        showNotification(
          productsData.message ||
            "Failed to load personalized products"
        )
        return
      }
      const ordersResponse = await fetch(
        `${API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${dashboardToken}`,
          },
        }
      )

      const ordersData = await ordersResponse.json()

      if (!ordersResponse.ok) {
        showNotification(
          ordersData.message ||
            "Failed to load customer orders"
        )
        return
      }

      setCustomRequests(requestsData)
      setPersonalizedProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      console.error(
        "Artist dashboard error:",
        error
      )

      showNotification(
        "Unable to load Artist Dashboard"
      )
    }
  }
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(
        `${API_URL}/api/custom-requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(data.message || "Failed to update status")
        return
      }

      setCustomRequests((currentRequests) =>
        currentRequests.map((request) =>
          request._id === requestId
            ? data.request
            : request
        )
      )
    } catch (error) {
      console.error("Status update error:", error)
      showNotification("Unable to update request status")
    }
  }
  // ================= UPDATE ORDER STATUS =================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to update order status."
        )
        return
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      )

    } catch (error) {
      console.error(
        "Order status update error:",
        error
      )

      showNotification(
        "Unable to update order status."
      )
    }
  }

  const handleAddProduct = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(
        `${API_URL}/api/personalized-products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to add personalized product"
        )
        return
      }

      setPersonalizedProducts(
        (currentProducts) => [
          data.product,
          ...currentProducts,
        ]
      )

      setShowAddProductForm(false)

      form.reset()

      showNotification(
        "Personalized MicroArt added successfully!"
      )
    } catch (error) {
      console.error(
        "Add personalized product error:",
        error
      )

      showNotification(
        "Unable to add personalized product"
      )
    }
  }
  const toggleProductActive = async (product) => {
    try {
      const formData = new FormData()

      formData.append(
        "active",
        String(!product.active)
      )

      const response = await fetch(
        `${API_URL}/api/personalized-products/${product._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to update product"
        )
        return
      }

      setPersonalizedProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct._id === product._id
            ? data.product
            : currentProduct
        )
      )
    } catch (error) {
      console.error(
        "Update product status error:",
        error
      )

      showNotification("Unable to update product")
    }
  }

  const deleteProduct = async (product) => {
    const confirmed =
      await showConfirm({
        title:
          "Delete Personalized Art?",
        message:
          `Are you sure you want to permanently delete "${product.title}"? This action cannot be undone.`,
        confirmText:
          "Delete",
        cancelText:
          "Cancel",
        danger: true,
      })

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/personalized-products/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to delete product"
        )
        return
      }

      setPersonalizedProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) =>
            currentProduct._id !== product._id
        )
      )

      showNotification("Product deleted successfully!")
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      )

      showNotification("Unable to delete product")
    }
  }

  const handleEditProduct = async (event) => {
    event.preventDefault()

    if (!editingProduct) {
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(
        `${API_URL}/api/personalized-products/${editingProduct._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to update personalized product"
        )
        return
      }

      setPersonalizedProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === editingProduct._id
            ? data.product
            : product
        )
      )

      setEditingProduct(null)

      showNotification("Product updated successfully!")
    } catch (error) {
      console.error(
        "Edit personalized product error:",
        error
      )

      showNotification("Unable to update personalized product")
    }
  }
  // ================= FEATURED ARTWORK MANAGEMENT =================

  const handleAddArtwork = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(
        `${API_URL}/api/artworks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to add artwork"
        )
        return
      }

      const newArtwork = data.artwork || data

      setArtworks((currentArtworks) => [
        ...currentArtworks,
        newArtwork,
      ])

      setShowAddArtworkForm(false)
      form.reset()

      showNotification("Artwork added successfully!")
    } catch (error) {
      console.error(
        "Add artwork error:",
        error
      )

      showNotification("Unable to add artwork")
    }
  }


  const handleEditArtwork = async (event) => {
    event.preventDefault()

    if (!editingArtwork) {
      return
    }

    const formData = new FormData(
      event.currentTarget
    )

    try {
      const response = await fetch(
        `${API_URL}/api/artworks/${editingArtwork._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to update artwork"
        )
        return
      }

      const updatedArtwork =
        data.artwork || data

      setArtworks((currentArtworks) =>
        currentArtworks.map((artwork) =>
          artwork._id === updatedArtwork._id
            ? updatedArtwork
            : artwork
        )
      )

      setEditingArtwork(null)

      showNotification("Artwork updated successfully!")
    } catch (error) {
      console.error(
        "Edit artwork error:",
        error
      )

      showNotification("Unable to update artwork")
    }
  }


  const toggleArtworkFeatured = async (artwork) => {
    const formData = new FormData()

    formData.append(
      "featured",
      String(!artwork.featured)
    )

    if (!artwork.featured) {
      formData.append(
        "featuredOrder",
        String(artwork.featuredOrder || 1)
      )
    }

    try {
      const response = await fetch(
        `${API_URL}/api/artworks/${artwork._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to update featured artwork"
        )
        return
      }

      const updatedArtwork =
        data.artwork || data

      setArtworks((currentArtworks) =>
        currentArtworks.map((currentArtwork) =>
          currentArtwork._id === updatedArtwork._id
            ? updatedArtwork
            : currentArtwork
        )
      )
    } catch (error) {
      console.error(
        "Featured artwork update error:",
        error
      )

      showNotification("Unable to update featured artwork")
    }
  }


  const deleteArtwork = async (artwork) => {
    const confirmed =
      await showConfirm({
        title:
          "Delete Artwork?",
        message:
          `Are you sure you want to permanently delete "${artwork.title}"? This action cannot be undone.`,
        confirmText:
          "Delete",
        cancelText:
          "Cancel",
        danger: true,
      })

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/artworks/${artwork._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to delete artwork"
        )
        return
      }

      setArtworks((currentArtworks) =>
        currentArtworks.filter(
          (currentArtwork) =>
            currentArtwork._id !== artwork._id
        )
      )

      showNotification("Artwork deleted successfully!")
    } catch (error) {
      console.error(
        "Delete artwork error:",
        error
      )

      showNotification("Unable to delete artwork")
    }
  }


  const displayedArtworks = [...artworks].sort(
    (firstArtwork, secondArtwork) => {
      const firstFeatured = Boolean(
        firstArtwork.featured
      )
      const secondFeatured = Boolean(
        secondArtwork.featured
      )

      if (firstFeatured !== secondFeatured) {
        return firstFeatured ? -1 : 1
      }

      if (firstFeatured && secondFeatured) {
        return (
          Number(firstArtwork.featuredOrder || 9999) -
          Number(secondArtwork.featuredOrder || 9999)
        )
      }

      return 0
    }
  )

  const displayedPersonalizedProducts =
    [...personalizedProducts].sort(
      (firstProduct, secondProduct) => {

        const firstOrder =
          Number(
            firstProduct.displayOrder
          ) || 9999

        const secondOrder =
          Number(
            secondProduct.displayOrder
          ) || 9999

        return (
          firstOrder -
          secondOrder
        )
      }
    )

  // ================= ARTWORK DETAIL =================

  const openArtwork = (artwork) => {
    setSelectedArtwork(artwork)

    setShowCart(false)
    setShowProduct(false)
    setShowPersonalized(false)
    setShowLogin(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const backToGallery = () => {
    setSelectedArtwork(null)

    setTimeout(() => {
      document
        .getElementById("gallery")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
    }, 50)
  }

  // ================= ARTIST LOGIN =================

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: loginEmail,
            password: loginPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Invalid email or password."
        )
        return
      }

      if (data.user?.role !== "artist") {
        localStorage.removeItem("authToken")
        setAuthToken(null)
        setUser(null)
        setIsLoggedIn(false)
        setLoginPassword("")

        showNotification(
          "This login is for the artist only."
        )
        return
      }

      localStorage.setItem(
        "authToken",
        data.token
      )

      setAuthToken(data.token)
      setUser(data.user)
      setIsLoggedIn(true)

      setLoginEmail("")
      setLoginPassword("")
      setShowLogin(false)

      await openArtistDashboard(data.token)

    } catch (error) {
      console.error(
        "Artist login error:",
        error
      )

      showNotification(
        "Unable to connect to the server. Make sure the backend is running."
      )
    }
  }

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem(
      "authToken"
    )

    setAuthToken(null)
    setIsLoggedIn(false)
    setUser(null)

    // Close Artist Dashboard and clear artist-only data
    setShowArtistDashboard(false)
    setCustomRequests([])
    setOrders([])

    // Return to the homepage
    goHome()

    showNotification(
      "You have been logged out."
    )
  }

  // ================= REQUESTS CART =================

  const calculatePersonalizedPrice = (product, text) => {
    if (!product) {
      return 0
    }

    const letters = text.replace(/\s/g, "").length

    const basePrice =
      Number(product.basePrice) || 0

    const minimumPrice =
      Number(product.minimumPrice) || 0

    const pricePerLetter =
      Number(product.pricePerLetter) || 0

    return Math.max(
      basePrice,
      minimumPrice,
      letters * pricePerLetter
    )
  }


  // ================= ADD TO REQUESTS =================

  const addToCart = () => {
    if (!selectedPersonalizedProduct) {
      showNotification("Please select a product.")
      return
    }

    if (letterCount === 0) {
      showNotification(
        "Please enter a name or message before adding to requests."
      )
      return
    }

    const itemPrice =
      calculatePersonalizedPrice(
        selectedPersonalizedProduct,
        customText
      )

    const newItem = {
      id:
        `${selectedPersonalizedProduct._id}-${Date.now()}`,

      productId:
        selectedPersonalizedProduct._id,

      product:
        selectedPersonalizedProduct.title,

      text:
        customText.trim(),

      price:
        itemPrice,

      quantity:
        1,

      image:
        selectedPersonalizedProduct.image,
    }

    setCart((previousCart) => [
      ...previousCart,
      newItem,
    ])

    setCustomText("")
    setSelectedPersonalizedProduct(null)

    setShowProduct(false)
    setShowPersonalized(false)
    setShowCart(true)
  }


  // ================= INCREASE QUANTITY =================

  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }


  // ================= DECREASE QUANTITY =================

  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }


  // ================= REMOVE FROM CART =================

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== id
      )
    )
  }


  // ================= REQUEST ITEM COUNT =================

  const cartItemCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  )


  // ================= REQUEST TOTAL =================

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )
  // ================= SUBMIT ORDER REQUEST =================

  const handleSubmitOrder = async (event) => {
    event.preventDefault()

    // Prevent duplicate submissions
    if (isSubmittingOrder) {
      return
    }

    if (cart.length === 0) {
      showNotification("Your requests cart is empty.")
      return
    }

    setIsSubmittingOrder(true)

    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: checkoutName,
            email: checkoutEmail,
            phone:
              `${checkoutCountryCode}${checkoutPhone}`,
            address: checkoutAddress,

            items: cart.map((item) => ({
              productId: item.productId,
              text: item.text,
              quantity: item.quantity,
            })),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          data.message ||
            "Failed to submit order request."
        )

        setIsSubmittingOrder(false)
        return
      }

      // Save submitted order
      setSubmittedOrder(data.order)

      // Show success screen
      setOrderSubmitted(true)

      // Clear cart
      setCart([])

      // Clear checkout form
      setCheckoutName("")
      setCheckoutEmail("")
      setCheckoutPhone("")
      setCheckoutCountryCode("+1")
      setCheckoutAddress("")

      // Close checkout
      setShowCheckout(false)

      // Submission finished
      setIsSubmittingOrder(false)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })

    } catch (error) {
      console.error(
        "Order submission error:",
        error
      )

      setIsSubmittingOrder(false)

      showNotification(
        "Unable to submit your order request. Please try again."
      )
    }
  }


  // ================= PAGE =================

  return (
    <div className="app">

      {/* ================= MICROARTS POPUP STYLES ================= */}

      <style>
        {`
          .microarts-toast {
            position: fixed;
            top: 96px;
            right: 24px;
            z-index: 12000;

            width: min(
              390px,
              calc(100vw - 32px)
            );

            display: flex;
            align-items: flex-start;
            gap: 12px;

            padding: 15px 16px;

            background: #fffdfb;
            border: 1px solid #eaded3;
            border-radius: 14px;

            box-shadow:
              0 16px 40px
              rgba(0, 0, 0, 0.16);

            animation:
              microartsToastIn
              0.22s ease-out;
          }

          .microarts-toast-success {
            border-left:
              5px solid #8b5e3c;
          }

          .microarts-toast-error {
            border-left:
              5px solid #b42318;
          }

          .microarts-toast-warning {
            border-left:
              5px solid #b7791f;
          }

          .microarts-toast-info {
            border-left:
              5px solid #667085;
          }

          .microarts-toast-icon {
            width: 32px;
            height: 32px;

            flex: 0 0 32px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background: #f3eee9;
            color: #8b5e3c;

            font-size: 18px;
            font-weight: 800;
          }

          .microarts-toast-error
          .microarts-toast-icon {
            background: #fff0ee;
            color: #b42318;
          }

          .microarts-toast-warning
          .microarts-toast-icon {
            background: #fff7e8;
            color: #9a6700;
          }

          .microarts-toast-info
          .microarts-toast-icon {
            background: #f2f4f7;
            color: #475467;
          }

          .microarts-toast-content {
            flex: 1;
            min-width: 0;
          }

          .microarts-toast-content
          strong {
            display: block;

            margin-bottom: 3px;

            color: #1f1f1f;
            font-size: 15px;
            line-height: 1.3;
          }

          .microarts-toast-content
          p {
            margin: 0;

            color: #5e5e5e;
            font-size: 13px;
            line-height: 1.45;
          }

          .microarts-toast-close {
            width: 28px;
            height: 28px;

            flex: 0 0 28px;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 0;

            border: none;
            border-radius: 50%;

            background: transparent;
            color: #777777;

            font-size: 20px;
            line-height: 1;

            cursor: pointer;
          }

          .microarts-toast-close:hover {
            background: #f3eee9;
            color: #222222;
          }

          .microarts-confirm-overlay {
            position: fixed;
            inset: 0;
            z-index: 13000;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background:
              rgba(17, 17, 17, 0.48);

            backdrop-filter:
              blur(4px);
          }

          .microarts-confirm-card {
            width: min(
              440px,
              100%
            );

            padding: 28px;

            background: #fffdfb;
            border: 1px solid #eaded3;
            border-radius: 18px;

            box-shadow:
              0 24px 70px
              rgba(0, 0, 0, 0.24);

            animation:
              microartsDialogIn
              0.2s ease-out;
          }

          .microarts-confirm-symbol {
            width: 46px;
            height: 46px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-bottom: 18px;

            border-radius: 50%;

            background: #f6eee8;
            color: #8b5e3c;

            font-size: 22px;
            font-weight: 800;
          }

          .microarts-confirm-card
          h2 {
            margin: 0 0 10px;

            color: #1f1f1f;
            font-size: 24px;
            line-height: 1.2;
          }

          .microarts-confirm-card
          p {
            margin: 0;

            color: #606060;
            font-size: 14px;
            line-height: 1.6;
          }

          .microarts-confirm-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;

            margin-top: 24px;
          }

          .microarts-confirm-actions
          button {
            min-width: 100px;

            padding: 11px 16px;

            border-radius: 9px;

            font-weight: 700;
            cursor: pointer;
          }

          .microarts-confirm-cancel {
            border:
              1px solid #d8c5b5;

            background: #ffffff;
            color: #5b4637;
          }

          .microarts-confirm-cancel:hover {
            background: #f7f2ee;
          }

          .microarts-confirm-primary {
            border:
              1px solid #8b5e3c;

            background: #8b5e3c;
            color: #ffffff;
          }

          .microarts-confirm-primary:hover {
            background: #744b30;
          }

          .microarts-confirm-danger {
            border:
              1px solid #b42318;

            background: #b42318;
            color: #ffffff;
          }

          .microarts-confirm-danger:hover {
            background: #912018;
          }

          @keyframes
          microartsToastIn {
            from {
              opacity: 0;
              transform:
                translateY(-8px)
                translateX(10px);
            }

            to {
              opacity: 1;
              transform:
                translateY(0)
                translateX(0);
            }
          }

          @keyframes
          microartsDialogIn {
            from {
              opacity: 0;
              transform:
                translateY(8px)
                scale(0.98);
            }

            to {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          @media
          (max-width: 600px) {
            .microarts-toast {
              top: 74px;
              right: 16px;
              left: 16px;

              width: auto;
            }

            .microarts-confirm-card {
              padding: 22px;
            }

            .microarts-confirm-actions {
              flex-direction: column-reverse;
            }

            .microarts-confirm-actions
            button {
              width: 100%;
            }
          }
        `}
      </style>


      {/* ================= MICROARTS NOTIFICATION ================= */}

      {notification && (
        <div
          className={`microarts-toast microarts-toast-${notification.type}`}
          role="status"
          aria-live="polite"
        >
          <div className="microarts-toast-icon">
            {notification.type === "success"
              ? "✓"
              : notification.type === "error"
                ? "!"
                : notification.type === "warning"
                  ? "!"
                  : "i"}
          </div>

          <div className="microarts-toast-content">
            <strong>
              {notification.title}
            </strong>

            <p>
              {notification.message}
            </p>
          </div>

          <button
            type="button"
            className="microarts-toast-close"
            onClick={() =>
              setNotification(null)
            }
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}


      {/* ================= MICROARTS CONFIRMATION ================= */}

      {confirmDialog && (
        <div
          className="microarts-confirm-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeConfirmDialog(false)
            }
          }}
        >
          <div
            className="microarts-confirm-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="microarts-confirm-title"
          >
            <div className="microarts-confirm-symbol">
              ?
            </div>

            <h2 id="microarts-confirm-title">
              {confirmDialog.title}
            </h2>

            <p>
              {confirmDialog.message}
            </p>

            <div className="microarts-confirm-actions">
              <button
                type="button"
                className="microarts-confirm-cancel"
                onClick={() =>
                  closeConfirmDialog(false)
                }
              >
                {confirmDialog.cancelText}
              </button>

              <button
                type="button"
                className={
                  confirmDialog.danger
                    ? "microarts-confirm-danger"
                    : "microarts-confirm-primary"
                }
                onClick={() =>
                  closeConfirmDialog(true)
                }
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        {/* LOGO */}
        <button
          className="logo"
          onClick={() => {
            setMobileMenuOpen(false)
            goHome()
          }}
          aria-label="MicroArts by Vivek Podagatla - Home"
        >
          <img
            className="navbar-logo-image"
            src="/images/microarts-navbar-logo.png"
            alt="MicroArts by Vivek Podagatla"
          />
        </button>


        {/* MOBILE HAMBURGER */}
        <button
          className={`mobile-menu-button ${
            mobileMenuOpen ? "open" : ""
          }`}
          onClick={() =>
            setMobileMenuOpen((previous) => !previous)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>


        {/* NAVIGATION LINKS */}
        <div
          className={`nav-links ${
            mobileMenuOpen ? "nav-links-open" : ""
          }`}
        >

          <button
            onClick={() => {
              setMobileMenuOpen(false)
              goHome()
            }}
          >
            Home
          </button>


          <button
            onClick={() => {
              setMobileMenuOpen(false)

              goHome()

              setTimeout(() => {
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }, 50)
            }}
          >
            Gallery
          </button>


          <button
            onClick={() => {
              setMobileMenuOpen(false)

              goHome()

              setTimeout(() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }, 50)
            }}
          >
            About
          </button>


          <button
            onClick={() => {
              setMobileMenuOpen(false)

              goHome()

              setTimeout(() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }, 50)
            }}
          >
            Contact
          </button>


          {/* ================= ARTIST LOGIN ================= */}

          {isLoggedIn && user?.role === "artist" ? (
            <>
              <button
                className="artist-dashboard-button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openArtistDashboard()
                }}
              >
                🎨 Artist Dashboard
              </button>

              <button
                className="login-button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-button"
              onClick={() => {
                setMobileMenuOpen(false)
                openLogin()
              }}
            >
              Artist Login
            </button>
          )}


          {/* REQUESTS CART */}

          <button
            className="cart-button"
            onClick={() => {
              setMobileMenuOpen(false)
              openCart()
            }}
          >
            🎁 Requests

            {cartItemCount > 0 && (
              <span className="cart-count">
                {cartItemCount}
              </span>
            )}
          </button>

        </div>

      </nav>


      {/* ================= LOGIN ================= */}

      {orderSubmitted && submittedOrder ? (

        /* ================= ORDER SUCCESS ================= */

        <section className="checkout-page">

          <div className="checkout-container">

            <div className="checkout-form-section order-success-card">

              <div className="order-success-icon">
                ✓
              </div>

              <h1>
                Request Submitted!
              </h1>

              <p>
                Thank you, {submittedOrder.fullName}.
                Your personalized MicroArt request
                has been received successfully.
              </p>

              <p>
                The artist will contact you using the
                phone number or email you provided to
                confirm the request details.
              </p>

              <div className="order-confirmation-details">

                <h2>
                  Request Details
                </h2>

                <div className="confirmation-row">
                  <span>Status</span>

                  <strong className="order-status-badge">
                    {submittedOrder.status}
                  </strong>
                </div>

                <div className="confirmation-row">
                  <span>Estimated Total</span>

                  <strong className="confirmation-total">
                    $
                    {Number(
                      submittedOrder.totalPrice
                    ).toFixed(2)}
                  </strong>
                </div>

              </div>

              <div className="success-button-container">
                <button
                  className="checkout-button"
                  onClick={() => {
                    setOrderSubmitted(false)
                    setSubmittedOrder(null)
                    goHome()
                  }}
                >
                  Continue to Home
                </button>
              </div>

            </div>

          </div>

        </section>

      ) : showCheckout ? (

        /* ================= CHECKOUT ================= */
        <section className="checkout-page">

          <button
            className="back-button"
            onClick={() => {
              setShowCheckout(false)
              setShowCart(true)
            }}
          >
            ← Back to Requests Cart
          </button>

          <div className="checkout-container">

            <div className="checkout-form-section">

              <h1>Submit Request</h1>

              <p>
                Enter your contact and shipping information.
                The artist will contact you to confirm your
                personalized MicroArt request.
              </p>

              <form
                className="checkout-form"
                onSubmit={handleSubmitOrder}
              >

                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    required
                    minLength="2"
                    maxLength="100"
                    value={checkoutName}
                    onChange={(event) =>
                      setCheckoutName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>


                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    required
                    maxLength="150"
                    value={checkoutEmail}
                    onChange={(event) =>
                      setCheckoutEmail(event.target.value)
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>


                <div className="form-group">
                  <label>Phone Number</label>

                  <div className="phone-input-row">

                    <input
                      type="text"
                      required
                      value={checkoutCountryCode}
                      onChange={(event) => {
                        let value = event.target.value

                        if (!value.startsWith("+")) {
                          value =
                            "+" +
                            value.replace(/\D/g, "")
                        } else {
                          value =
                            "+" +
                            value
                              .slice(1)
                              .replace(/\D/g, "")
                        }

                        setCheckoutCountryCode(
                          value.slice(0, 5)
                        )
                      }}
                      pattern="\+[0-9]{1,4}"
                      title="Enter a valid country code, for example +1 or +91."
                      className="country-code-input"
                      placeholder="+1"
                    />

                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      minLength="10"
                      maxLength="15"
                      pattern="[0-9]{10,15}"
                      title="Phone number must contain 10 to 15 digits."
                      value={checkoutPhone}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 15)

                        setCheckoutPhone(value)
                      }}
                      placeholder="Phone number"
                      autoComplete="tel"
                    />

                  </div>

                  <div className="country-code-shortcuts">

                    <button
                      type="button"
                      onClick={() =>
                        setCheckoutCountryCode("+1")
                      }
                    >
                      US +1
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCheckoutCountryCode("+91")
                      }
                    >
                      India +91
                    </button>

                  </div>
                </div>


                <div className="form-group">
                  <label>Shipping Address</label>

                  <textarea
                    required
                    minLength="10"
                    maxLength="500"
                    rows="5"
                    value={checkoutAddress}
                    onChange={(event) =>
                      setCheckoutAddress(event.target.value)
                    }
                    placeholder="Street address, apartment/unit, city, state, ZIP code, country"
                    autoComplete="street-address"
                  />
                </div>

                <button
                  type="submit"
                  className="checkout-button"
                  disabled={isSubmittingOrder}
                >
                  {isSubmittingOrder
                    ? "Submitting..."
                    : "Submit Request"}
                </button>

              </form>

            </div>


            {/* ================= ORDER SUMMARY ================= */}

            <aside className="cart-summary">

              <h2>Request Summary</h2>

              {cart.map((item) => (

                <div
                  className="checkout-summary-item"
                  key={item.id}
                >

                  <strong>
                    {item.quantity} × {item.product}
                  </strong>

                  <p>
                    Personalization: "{item.text}"
                  </p>

                  <p>
                    $
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>

                </div>

              ))}

              <hr />

              <div className="summary-row">
                <span>Items</span>

                <span>
                  {cartItemCount}
                </span>
              </div>

              <div className="summary-total">

                <span>
                  Estimated Total
                </span>

                <strong>
                  ${cartTotal.toFixed(2)}
                </strong>

              </div>

              <p>
                No payment is collected online.
                The artist will contact you to confirm
                the order details.
              </p>

            </aside>

          </div>

        </section>

      ) : showLogin ? (

        /* ================= ARTIST LOGIN ================= */

        <section className="auth-page">

          <div className="auth-card">

            <button
              className="back-button"
              onClick={goHome}
            >
              ← Back to Home
            </button>

            <h1>
              Artist Login
            </h1>

            <p className="auth-description">
              Sign in to manage MicroArts.
            </p>

            <form
              className="auth-form"
              onSubmit={handleLogin}
            >

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(event) =>
                    setLoginEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter your email"
                  autoComplete="username"
                />

              </div>

              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(event) =>
                    setLoginPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

              </div>

              <button
                className="auth-submit-button"
                type="submit"
              >
                Artist Login
              </button>

            </form>

          </div>

        </section>

      ) : showCart ? (

        /* ================= REQUESTS CART ================= */

        <section className="cart-page">

          <button
            className="back-button"
            onClick={
              openPersonalized
            }
          >
            ← Back to Gifts
          </button>

          <div className="cart-header">

            <h1>
              Your Requests Cart
            </h1>

            <p>
              {cartItemCount}{" "}
              {cartItemCount ===
              1
                ? "item"
                : "items"}{" "}
              in your requests cart
            </p>

          </div>

          {cart.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-cart-icon">
                🛒
              </div>

              <h2>
                Your requests cart is empty
              </h2>

              <p>
                Explore our personalized
                MicroArts and create
                something unique.
              </p>

              <button
                className="continue-shopping-button"
                onClick={
                  openPersonalized
                }
              >
                Explore Personalized MicroArts
              </button>

            </div>

          ) : (

            <div className="cart-layout">

              <div className="cart-items">

                {cart.map(
                  (item) => (

                    <article
                      className="cart-item"
                      key={item.id}
                    >

                      <div className="cart-item-image">

                      <img
                        src={getImageUrl(item.image)}
                        alt={item.product}
                      />

                      </div>

                      <div className="cart-item-info">

                        <h3>
                          {
                            item.product
                          }
                        </h3>

                        <p className="cart-custom-text">
                          Custom text:{" "}
                          <strong>
                            "{item.text}"
                          </strong>
                        </p>

                        <p className="cart-item-price">
                          $
                          {
                            item.price
                          }{" "}
                          each
                        </p>

                        <div className="quantity-controls">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                        <button
                          className="remove-cart-item"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                      <div className="cart-item-total">

                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(
                          2
                        )}

                      </div>

                    </article>

                  )
                )}

              </div>

              <aside className="cart-summary">

                <h2>
                  Order Summary
                </h2>

                <div className="summary-row">

                  <span>
                    Items
                  </span>

                  <span>
                    {
                      cartItemCount
                    }
                  </span>

                </div>

                <div className="summary-row">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    $
                    {cartTotal.toFixed(
                      2
                    )}
                  </span>

                </div>

                <div className="summary-row">

                  <span>
                    Shipping
                  </span>

                  <span>
                    Will be confirmed by artist
                  </span>

                </div>

                <hr />

                <div className="summary-total">

                  <span>
                    Confirmed by artist
                  </span>

                  <strong>
                    $
                    {cartTotal.toFixed(
                      2
                    )}
                  </strong>

                </div>

                <button
                  className="checkout-button"
                  onClick={() => {
                    setShowCheckout(true)
                    setShowCart(false)

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }}
                >
                  Proceed to Request
                </button>

              </aside>

            </div>

          )}

        </section>

      ) : showArtistDashboard ? (

        /* ================= ARTIST DASHBOARD ================= */

        <section className="artist-dashboard">

          <button
            className="back-button"
            onClick={
              artistDashboardSection === "home"
                ? goHome
                : () => setArtistDashboardSection("home")
            }
          >
            {artistDashboardSection === "home"
              ? "← Back to Home"
              : "← Back to Dashboard"}
          </button>


          {/* ========== DASHBOARD HOME ========== */}

          {artistDashboardSection === "home" && (

            <>

              <div className="artist-dashboard-header">

                <h1>
                  Artist Dashboard
                </h1>

                <p>
                  Manage your MicroArts products and customer requests.
                </p>

              </div>


              <div className="dashboard-options">

                <button
                  className="dashboard-option-card"
                  onClick={() =>
                    setArtistDashboardSection("requests")
                  }
                >

                  <span className="dashboard-option-icon">
                    📩
                  </span>

                  <h2>
                    Customized Art Requests
                  </h2>

                  <p>
                    View customer requests, contact details,
                    artwork information and update request status.
                  </p>

                  <strong>
                    {customRequests.length} Requests →
                  </strong>

                </button>


                {/* ================= CUSTOMER ORDERS ================= */}

                <button
                  className="dashboard-option-card"
                  onClick={() =>
                    setArtistDashboardSection("orders")
                  }
                >

                  <span className="dashboard-option-icon">
                    🛒
                  </span>

                  <h2>
                    Personalized Gift Requests
                  </h2>

                  <p>
                    View personalized MicroArt requests,
                    customer contact details, shipping information
                    and update order status.
                  </p>

                  <strong>
                    {orders.length} Requests →
                  </strong>

                </button>


                <button 
                  className="dashboard-option-card" 
                  onClick={() => 
                    setArtistDashboardSection("products") 
                  } 
                >

                  <span className="dashboard-option-icon">
                    🛍️
                  </span>

                  <h2>
                    Manage Personalized Arts
                  </h2>

                  <p>
                    Add, edit, deactivate or delete personalized
                    MicroArt products and manage pricing.
                  </p>

                  <strong>
                    {personalizedProducts.length} Products →
                  </strong>

                </button>


                <button
                  className="dashboard-option-card"
                  onClick={() =>
                    setArtistDashboardSection("artworks")
                  }
                >

                  <span className="dashboard-option-icon">
                    🖼️
                  </span>

                  <h2>
                    Manage Featured Arts
                  </h2>

                  <p>
                    Add or edit gallery artworks and choose which
                    artworks are pinned to the top of Featured MicroArts.
                  </p>

                  <strong>
                    {artworks.length} Artworks →
                  </strong>

                </button>

              </div>

            </>

          )}


          {/* ========== CUSTOM REQUESTS ========== */}

          {artistDashboardSection === "requests" && (

            <>

              <div className="artist-dashboard-header">

                <h1>
                  Customized Art Requests
                </h1>

                <p>
                  Manage customer customized MicroArt requests.
                </p>

              </div>


              {customRequests.length === 0 ? (

                <div className="empty-dashboard">

                  <h2>
                    No Custom Requests
                  </h2>

                  <p>
                    There are currently no customized artwork requests.
                  </p>

                </div>

              ) : (

                <div className="custom-requests-list">

                  {customRequests.map((request) => (

                    <article
                      className="custom-request-card"
                      key={request._id}
                    >

                      {request.artworkId?.image && (

                        <div className="request-artwork-image">

                          <img
                            src={getArtworkImageUrl(request.artworkId.image)}
                            alt={request.artworkId.title}
                          />

                        </div>

                      )}


                      <h2>
                        {request.fullName}
                      </h2>


                      <p>
                        <strong>Phone:</strong>{" "}
                        {request.phone}
                      </p>


                      <p>
                        <strong>Email:</strong>{" "}
                        {request.email}
                      </p>


                      <p>
                        <strong>Request:</strong>{" "}
                        {request.requestDetails}
                      </p>


                      <p>
                        <strong>Artwork:</strong>{" "}
                        {request.artworkId?.title || "Artwork"}
                      </p>


                      <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(
                          request.createdAt
                        ).toLocaleString()}
                      </p>


                      <div className="request-status">

                        <label>
                          <strong>Status:</strong>
                        </label>

                        <select
                          value={request.status}
                          onChange={(event) =>
                            updateRequestStatus(
                              request._id,
                              event.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Completed">
                            Completed
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </>

          )}


          {/* ========== CUSTOMER ORDERS ========== */}

          {artistDashboardSection === "orders" && (

            <>

              <div className="artist-dashboard-header">

                <h1>
                  Personalized Gift Requests
                </h1>

                <p>
                  Manage personalized MicroArt gift requests.
                </p>

              </div>


              {orders.length === 0 ? (

                <div className="empty-dashboard">

                  <h2>
                    No Personalized Gift Requests
                  </h2>

                  <p>
                    There are currently no personalized MicroArt
                    order requests.
                  </p>

                </div>

              ) : (

                <div className="custom-requests-list customer-orders-list">

                  {orders.map((order) => (

                    <article
                      className="custom-request-card"
                      key={order._id}
                    >

                      {/* ================= DESKTOP CUSTOMER DETAILS ================= */}

                      <div className="order-customer-section desktop-order-customer">

                        <h2>
                          Customer Details
                        </h2>

                        <p>
                          <strong>Name:</strong>{" "}
                          {order.fullName}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {order.email}
                        </p>

                        <p>
                          <strong>Phone:</strong>{" "}
                          {order.phone}
                        </p>

                      </div>


                      <div className="order-shipping-section desktop-order-customer">

                        <h3>
                          Shipping Address
                        </h3>

                        <p>
                          {order.address}
                        </p>

                      </div>


                      <div className="order-date-section desktop-order-customer">

                        <p>
                          <strong>Submitted:</strong>{" "}
                          {new Date(
                            order.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>


                      {/* ================= ORDER ITEMS ================= */}

                      <div className="order-items">

                        <h3 className="order-items-heading">
                          Ordered MicroArts
                        </h3>

                        {order.items.map(
                          (item, index) => (

                            <div
                              className="order-item"
                              key={`${order._id}-${index}`}
                            >

                              {item.image && (

                                <div className="order-item-image">

                                  <img
                                    src={getImageUrl(item.image)}
                                    alt={item.product}
                                  />

                                </div>

                              )}


                              <div className="order-item-details">

                                <h3>
                                  {item.product}
                                </h3>

                                <p className="order-personalization">
                                  <strong>
                                    Personalization:
                                  </strong>{" "}
                                  "{item.text}"
                                </p>

                                <p className="order-item-quantity">
                                  <strong>
                                    Quantity:
                                  </strong>{" "}
                                  {item.quantity}
                                </p>

                                <p className="order-item-price">
                                  <strong>
                                    Price Each:
                                  </strong>{" "}
                                  ${Number(item.price).toFixed(2)}
                                </p>

                                <p className="order-item-subtotal">
                                  <strong>
                                    Item Total:
                                  </strong>{" "}
                                  $
                                  {(
                                    Number(item.price) *
                                    item.quantity
                                  ).toFixed(2)}
                                </p>

                              </div>

                            </div>
                          )
                        )}

                      </div>


                      {/* ================= MOBILE CUSTOMER DETAILS ================= */}

                      <details className="mobile-customer-details">

                        <summary>
                          Customer Details
                        </summary>

                        <div className="mobile-customer-details-content">

                          <p>
                            <strong>Name:</strong>{" "}
                            {order.fullName}
                          </p>

                          <p>
                            <strong>Email:</strong>{" "}
                            {order.email}
                          </p>

                          <p>
                            <strong>Phone:</strong>{" "}
                            {order.phone}
                          </p>

                          <p>
                            <strong>Address:</strong>{" "}
                            {order.address}
                          </p>

                        </div>

                      </details>


                      {/* ================= ORDER MANAGEMENT ================= */}

                      <div className="order-management-section">

                        <div className="order-total-row">

                          <span>
                            Estimated Order Total
                          </span>

                          <strong>
                            ${Number(
                              order.totalPrice
                            ).toFixed(2)}
                          </strong>

                        </div>


                        <div className="order-status-control">

                          <label>
                            Order Status
                          </label>

                          <select
                            className={`order-status-select status-${order.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            value={order.status}
                            onChange={(event) =>
                              updateOrderStatus(
                                order._id,
                                event.target.value
                              )
                            }
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Contacted">
                              Contacted
                            </option>

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Completed">
                              Completed
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                        </div>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </>

          )}


          {/* ========== PERSONALIZED PRODUCTS ========== */}

          {artistDashboardSection === "products" && (

            <>
              {showAddProductForm && (

                <div className="product-form-overlay">

                  <div className="product-form-card">

                    <h2>
                      Add Personalized MicroArt
                    </h2>

                    <p>
                      Add a new personalized artwork for customers to order.
                    </p>

                    <form onSubmit={handleAddProduct}>

                      <div className="form-group">
                        <label>Product Title</label>

                        <input
                          type="text"
                          name="title"
                          required
                          placeholder="Example: Name Carved on 0.7 mm Pencil Lead"
                        />
                      </div>


                      <div className="form-group">
                        <label>Description</label>

                        <textarea
                          name="description"
                          required
                          rows="4"
                          placeholder="Describe the personalized artwork"
                        />
                      </div>


                      <div className="form-group">
                        <label>Product Image</label>

                        <input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png,image/webp"
                          required
                        />
                      </div>


                      <div className="form-group">
                        <label>Base Price ($)</label>

                        <input
                          type="number"
                          name="basePrice"
                          min="0"
                          step="0.01"
                          required
                          placeholder="30"
                        />
                      </div>


                      <div className="form-group">
                        <label>Price Per Letter ($)</label>

                        <input
                          type="number"
                          name="pricePerLetter"
                          min="0"
                          step="0.01"
                          placeholder="5"
                        />
                      </div>


                      <div className="form-group">
                        <label>Minimum Price ($)</label>

                        <input
                          type="number"
                          name="minimumPrice"
                          min="0"
                          step="0.01"
                          placeholder="30"
                        />
                      </div>

                      <div className="form-group">

                        <label>
                          Display Priority
                        </label>

                        <input
                          type="number"
                          name="displayOrder"
                          min="1"
                          required
                          defaultValue={
                            personalizedProducts.length + 1
                          }
                        />

                        <small>
                          1 appears first, 2 appears second, and so on.
                        </small>

                      </div>

                      <div className="product-form-actions">

                        <button
                          type="button"
                          onClick={() =>
                            setShowAddProductForm(false)
                          }
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="save-product-button"
                        >
                          Add Product
                        </button>

                      </div>

                    </form>

                  </div>

                </div>

              )}

              {editingProduct && (
                <div className="product-form-overlay">
                  <div className="product-form-card">
                    <h2>Edit Personalized MicroArt</h2>

                    <p>
                      Update the product information below.
                      Upload a new image only if you want to replace
                      the current image.
                    </p>

                    <form onSubmit={handleEditProduct}>
                      <div className="form-group">
                        <label>Product Title</label>

                        <input
                          type="text"
                          name="title"
                          defaultValue={editingProduct.title}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>

                        <textarea
                          name="description"
                          rows="4"
                          defaultValue={editingProduct.description}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Current Image</label>

                        <img
                          src={getImageUrl(editingProduct.image)}
                          alt={editingProduct.title}
                          style={{
                            width: "140px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            display: "block",
                            marginTop: "8px",
                            marginBottom: "12px",
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Replace Image (Optional)</label>

                        <input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png,image/webp"
                        />
                      </div>

                      <div className="form-group">
                        <label>Base Price ($)</label>

                        <input
                          type="number"
                          name="basePrice"
                          min="0"
                          step="0.01"
                          defaultValue={editingProduct.basePrice}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Price Per Letter ($)</label>

                        <input
                          type="number"
                          name="pricePerLetter"
                          min="0"
                          step="0.01"
                          defaultValue={editingProduct.pricePerLetter}
                        />
                      </div>

                      <div className="form-group">
                        <label>Minimum Price ($)</label>

                        <input
                          type="number"
                          name="minimumPrice"
                          min="0"
                          step="0.01"
                          defaultValue={editingProduct.minimumPrice}
                        />
                      </div>

                      <div className="form-group">

                        <label>
                          Display Priority
                        </label>

                        <input
                          type="number"
                          name="displayOrder"
                          min="1"
                          required
                          defaultValue={
                            editingProduct.displayOrder || ""
                          }
                        />

                        <small>
                          1 appears first, 2 appears second, and so on.
                        </small>

                      </div>

                      <div className="product-form-actions">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="save-product-button"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="artist-dashboard-header">

                <h1>
                  Manage Personalized MicroArts
                </h1>

                <p>
                  Add, edit and manage the personalized products
                  available to your customers.
                </p>

                <button
                  className="add-product-button"
                  onClick={() =>
                    setShowAddProductForm(true)
                  }
                >
                  + Add New Product
                </button>

              </div>


              {personalizedProducts.length === 0 ? (

                <div className="empty-dashboard">

                  <h2>
                    No Personalized Products
                  </h2>

                  <p>
                    Add your first personalized MicroArt product.
                  </p>

                </div>

              ) : (

                <div className="personalized-products-admin">

                  {displayedPersonalizedProducts.map((product) => (

                    <article
                      className="admin-product-card"
                      key={product._id}
                    >

                      <img
                        src={getImageUrl(product.image)}
                        alt={product.title}
                      />

                      <h2>
                        {product.title}
                      </h2>

                      <p>
                        {product.description}
                      </p>

                      <p>
                        <strong>
                          Base Price:
                        </strong>{" "}
                        ${product.basePrice}
                      </p>

                      <p>
                        <strong>
                          Price Per Letter:
                        </strong>{" "}
                        ${product.pricePerLetter}
                      </p>

                      <p>
                        <strong>
                          Minimum Price:
                        </strong>{" "}
                        ${product.minimumPrice}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {product.active
                          ? "Active"
                          : "Inactive"}
                      </p>
                      <p>
                        <strong>
                          Priority:
                        </strong>{" "}
                        {product.displayOrder || "Not set"}
                      </p>

                      <div className="admin-product-actions">

                        <button
                          onClick={() =>
                            setEditingProduct(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => toggleProductActive(product)}
                        >
                          {product.active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => deleteProduct(product)}
                        >
                          Delete
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </>

          )}


          {/* ========== MANAGE FEATURED ARTS ========== */}

          {artistDashboardSection === "artworks" && (

            <>

              {showAddArtworkForm && (
                <div className="product-form-overlay">
                  <div className="product-form-card">

                    <h2>Add New Artwork</h2>

                    <form onSubmit={handleAddArtwork}>

                      <div className="form-group">
                        <label>Artwork Title</label>
                        <input
                          type="text"
                          name="title"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          rows="4"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Size</label>
                        <input
                          type="text"
                          name="size"
                          placeholder="Example: 2 mm"
                        />
                      </div>

                      <div className="form-group">
                        <label>Material</label>
                        <input
                          type="text"
                          name="material"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category</label>
                        <input
                          type="text"
                          name="category"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Time Taken</label>
                        <input
                          type="text"
                          name="timeTaken"
                          placeholder="Example: 8 Hours"
                        />
                      </div>

                      <div className="form-group">
                        <label>Artwork Image</label>
                        <input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png,image/webp"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            name="featured"
                            value="true"
                          />{" "}
                          Pin this artwork to the top
                        </label>
                      </div>

                      <div className="form-group">
                        <label>Featured Priority</label>
                        <input
                          type="number"
                          name="featuredOrder"
                          min="1"
                          defaultValue="1"
                        />
                        <small>
                          1 appears first, 2 appears second, and so on.
                        </small>
                      </div>

                      <div className="product-form-actions">
                        <button
                          type="button"
                          onClick={() =>
                            setShowAddArtworkForm(false)
                          }
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="save-product-button"
                        >
                          Add Artwork
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}


              {editingArtwork && (
                <div className="product-form-overlay">
                  <div className="product-form-card">

                    <h2>Edit Artwork</h2>

                    <form onSubmit={handleEditArtwork}>

                      <div className="form-group">
                        <label>Artwork Title</label>
                        <input
                          type="text"
                          name="title"
                          defaultValue={editingArtwork.title}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          rows="4"
                          defaultValue={editingArtwork.description}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Size</label>
                        <input
                          type="text"
                          name="size"
                          defaultValue={editingArtwork.size || ""}
                        />
                      </div>

                      <div className="form-group">
                        <label>Material</label>
                        <input
                          type="text"
                          name="material"
                          defaultValue={editingArtwork.material || ""}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category</label>
                        <input
                          type="text"
                          name="category"
                          defaultValue={editingArtwork.category || ""}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Time Taken</label>
                        <input
                          type="text"
                          name="timeTaken"
                          defaultValue={editingArtwork.timeTaken || ""}
                        />
                      </div>

                      <div className="form-group">
                        <label>Current Image</label>
                        <img
                          src={getArtworkImageUrl(editingArtwork.image)}
                          alt={editingArtwork.title}
                          style={{
                            width: "140px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            display: "block",
                            marginTop: "8px",
                            marginBottom: "12px",
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Replace Image (Optional)</label>
                        <input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png,image/webp"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            name="featured"
                            value="true"
                            defaultChecked={Boolean(editingArtwork.featured)}
                          />{" "}
                          Pin this artwork to the top
                        </label>
                      </div>

                      <div className="form-group">
                        <label>Featured Priority</label>
                        <input
                          type="number"
                          name="featuredOrder"
                          min="1"
                          defaultValue={editingArtwork.featuredOrder || 1}
                        />
                        <small>
                          1 appears first, 2 appears second, and so on.
                        </small>
                      </div>

                      <div className="product-form-actions">
                        <button
                          type="button"
                          onClick={() => setEditingArtwork(null)}
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="save-product-button"
                        >
                          Save Changes
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}


              <div className="artist-dashboard-header">

                <h1>Manage Featured Arts</h1>

                <p>
                  Add and edit gallery artworks. Pin selected artworks
                  to the top and use priority 1, 2, 3... to control their order.
                </p>

                <button
                  className="add-product-button"
                  onClick={() =>
                    setShowAddArtworkForm(true)
                  }
                >
                  + Add New Artwork
                </button>

              </div>


              {artworks.length === 0 ? (

                <div className="empty-dashboard">
                  <h2>No Artworks</h2>
                  <p>Add your first gallery artwork.</p>
                </div>

              ) : (

                <div className="personalized-products-admin">

                  {displayedArtworks.map((artwork) => (

                    <article
                      className="admin-product-card"
                      key={artwork._id}
                    >

                      <img
                        src={getArtworkImageUrl(artwork.image)}
                        alt={artwork.title}
                      />

                      <h2>{artwork.title}</h2>

                      <p>{artwork.description}</p>

                      <p>
                        <strong>Category:</strong>{" "}
                        {artwork.category || "—"}
                      </p>

                      <p>
                        <strong>Featured:</strong>{" "}
                        {artwork.featured ? "Yes" : "No"}
                      </p>

                      {artwork.featured && (
                        <p>
                          <strong>Priority:</strong>{" "}
                          {artwork.featuredOrder || 1}
                        </p>
                      )}

                      <div className="admin-product-actions">

                        <button
                          onClick={() =>
                            setEditingArtwork(artwork)
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleArtworkFeatured(artwork)
                          }
                        >
                          {artwork.featured
                            ? "Unpin from Top"
                            : "Pin to Top"}
                        </button>

                        <button
                          onClick={() =>
                            deleteArtwork(artwork)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </>

          )}

        </section>





      ) : selectedArtwork ? (

        /* ================= ARTWORK DETAIL ================= */

        <section className="artwork-detail">

          <button
            className="back-button"
            onClick={backToGallery}
          >
            ← Back to Gallery
          </button>

          <div className="artwork-detail-content">

            {/* ARTWORK IMAGE */}

            <div className="artwork-detail-image">

              <img
                src={getArtworkImageUrl(selectedArtwork.image)}
                alt={selectedArtwork.title}
              />

            </div>

            {/* ARTWORK INFORMATION */}

            <div className="artwork-detail-info">

              <h2>
                {selectedArtwork.title}
              </h2>

              <p className="artwork-detail-size">
                {selectedArtwork.size}
              </p>

              <div className="artwork-description">

                <h3>
                  About This Artwork
                </h3>

                <p>
                  {selectedArtwork.description}
                </p>

              </div>

              <div className="artwork-details">

                <h3>
                  Artwork Details
                </h3>

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {selectedArtwork.category}
                </p>

                <p>
                  <strong>
                    Material:
                  </strong>{" "}
                  {selectedArtwork.material || "Not specified"}
                </p>

                <p>
                  <strong>
                    Size:
                  </strong>{" "}
                  {selectedArtwork.size || "Not specified"}
                </p>

                <p>
                  <strong>
                    Time Taken:
                  </strong>{" "}
                  {selectedArtwork.timeTaken || "Not specified"}
                </p>

                <p>
                  <strong>
                    Artist:
                  </strong>{" "}
                  Vivek Podagatla
                </p>

              </div>

            </div>

            {/* CUSTOM ART BOX */}

            <div className="custom-art-box">

              <div className="custom-art-content">

                <h3>
                  Create Your Own MicroArt
                </h3>

                <p>
                  Create personalized miniature artwork made
                  especially for you. Names, messages, portraits,
                  and unique miniature designs can be created as
                  custom artwork.
                </p>

              </div>

              <button
                onClick={() => {
                  setCustomRequestArtwork(selectedArtwork)
                  setSelectedArtwork(null)

                  setRequestSubmitted(false)

                  setShowRequestForm(true)
                }}
              >
                Request Customized Art
              </button>

            </div>

          </div>

        </section>

      ) : showProduct && selectedPersonalizedProduct ? (

        /* ================= PRODUCT DETAIL ================= */

        <section className="personalized-product-page">

          <button
            className="back-button"
            onClick={() => {
              setShowProduct(false)
              setSelectedPersonalizedProduct(null)
              setCustomText("")
            }}
          >
            ← Back to Personalized Gifts
          </button>

          <div className="personalized-product-detail">

            <div className="personalized-product-image">

              <img
                src={getImageUrl(selectedPersonalizedProduct.image)}
                alt={selectedPersonalizedProduct.title}
              />

            </div>

            <div className="personalized-product-info">

              <h1>
                {selectedPersonalizedProduct.title}
              </h1>

              <p className="product-description">
                {selectedPersonalizedProduct.description}
              </p>

              <div className="pricing-rule">

                <strong>
                  Pricing
                </strong>

                <p>
                  ${selectedPersonalizedProduct.pricePerLetter} per letter
                </p>

                <p>
                  Minimum price: $
                  {selectedPersonalizedProduct.minimumPrice}
                </p>

                <p>
                  Spaces are not counted.
                </p>

              </div>

              <div className="name-input-section">

                <label htmlFor="customText">
                  Enter the name or short message
                </label>

                <input
                  id="customText"
                  type="text"
                  value={customText}
                  onChange={(event) =>
                    setCustomText(event.target.value)
                  }
                  placeholder="Example: Vivek Podagatla"
                  maxLength="50"
                />

                <p className="letter-count">
                  {letterCount}{" "}
                  {letterCount === 1
                    ? "letter"
                    : "letters"}
                </p>

              </div>

              <div className="product-price-box">

                <span>
                  Price
                </span>

                <strong>
                  $
                  {Math.max(
                    Number(
                      selectedPersonalizedProduct.minimumPrice
                    ) || 0,
                    Number(
                      selectedPersonalizedProduct.basePrice
                    ) || 0,
                    letterCount *
                      (Number(
                        selectedPersonalizedProduct.pricePerLetter
                      ) || 0)
                  )}
                </strong>

              </div>

              <button
                className="add-to-cart-button"
                onClick={addToCart}
              >
                🎁 Add to Requests
              </button>

            </div>

          </div>

        </section>




      ) : showPersonalized ? (

        /* ================= PERSONALIZED MICROARTS ================= */

        <section className="personalized-page">

          <button
            className="back-button"
            onClick={
              goHome
            }
          >
            ← Back to Home
          </button>

          <h2>
            Personalized Gifts
          </h2>

          <p className="section-description">
            Turn a name or special message into a one-of-a-kind miniature artwork,
            handcrafted to create a gift they will always remember.
          </p>

          <div className="personalized-products">

            {personalizedProducts.length === 0 ? (

              <div className="empty-personalized-products">

                <h3>
                  No Personalized MicroArts Available
                </h3>

                <p>
                  New personalized artworks will be
                  available soon.
                </p>

              </div>

            ) : (

              displayedPersonalizedProducts.map((product) => (

                <article
                  className="personalized-card"
                  key={product._id}
                  onClick={() => {
                    setCustomText("")
                    setSelectedPersonalizedProduct(product)
                    setShowProduct(true)
                  }}
                >

                  <img
                    src={getImageUrl(product.image)}
                    alt={product.title}
                  />

                  <div className="personalized-info">

                    <h3>
                      {product.title}
                    </h3>

                    <p>
                      {product.description}
                    </p>

                    <p className="personalized-price">
                      <span>Starting at</span>
                      <strong>
                        ${Math.max(
                          product.basePrice || 0,
                          product.minimumPrice || 0
                        )}
                      </strong>
                    </p>

                  </div>

                </article>

              ))

            )}

          </div>

        </section>


      ) : (

        /* ================= HOME ================= */

        <>

          {/* HERO */}

          <section className="hero">

            <div className="hero-container">

              <div className="hero-content">

                <p className="hero-label">
                  HANDCRAFTED MINIATURE ART
                </p>

                <h1>
                  Art Beyond the
                  Limits of Size
                </h1>

                <p className="hero-description">
                  Extraordinary handmade artwork
                  created at an extraordinary
                  miniature scale.
                </p>

                <div className="hero-gift-cta">

                  <p className="hero-gift-text">
                    Gift your loved ones in a unique way.
                  </p>

                  <button
                    className="hero-button"
                    onClick={openPersonalized}
                  >
                    Explore Personalized Gifts
                  </button>

                </div>

              </div>

              <div className="hero-image">

                <img
                  src="/images/couple-under-umbrella.jpg"
                  alt="Miniature couple under an umbrella carved from a pencil"
                />

                

              </div>

            </div>

          </section>

          {/* GALLERY */}

          <section
            id="gallery"
            className="section gallery-section"
          >

            <h2>
              Featured MicroArts
            </h2>

            <p className="section-description">
              Explore miniature artworks created
              with precision, patience and creativity.
            </p>

            <div className="products">

              {displayedArtworks.map(
                (artwork) => (

                  <article
                    className="product-card"
                    key={artwork._id}
                    onClick={() =>
                      openArtwork(artwork)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        openArtwork(artwork)
                      }
                    }}
                  >

                    <img
                      src={getArtworkImageUrl(artwork.image)}
                      alt={artwork.title}
                    />

                    <div className="product-info">

                      <h3>
                        {artwork.title}
                      </h3>

                      <p className="product-size">
                        {artwork.size}
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>


          {/* CUSTOMIZED ART */}

          <section
            id="custom"
            className="section custom-section"
          >

            <div className="custom-content">

              <h2>
                Create a Customized MicroArt
              </h2>

              <p>
                Have a unique idea?
                I can create a miniature
                artwork based on your concept.
              </p>

              <button
                onClick={() => {
                  setRequestSubmitted(
                    false
                  )

                  setShowRequestForm(
                    true
                  )
                }}
              >
                Request Customized Art
              </button>

            </div>

          </section>


          

          {/* ABOUT */}

          <section
            id="about"
            className="section about-section"
          >

            <h2>
              About
            </h2>

            <p>
              I’m Vivek Podagatla, a miniature artist
              creating handcrafted artworks on tiny
              surfaces with patience, precision, and creativity.
            </p>

            <p>
              Each piece is carefully handcrafted to
              capture fine details, creativity, and character.
            </p>

            <p>
              The goal of MicroArts is to show how much
              creativity can exist in even the smallest
              possible space.
            </p>

          </section>


          {/* CONTACT */}

          <section
            id="contact"
            className="section contact-section"
          >

            <h2>
              Contact
            </h2>

            <p>
              Interested in a personalized
              or customized MicroArt?
            </p>

            <button
              onClick={() => {
                setRequestSubmitted(
                  false
                )

                setShowRequestForm(
                  true
                )
              }}
            >
              Contact the Artist
            </button>
            <div className="contact-socials">

              <a
                href="https://www.instagram.com/microarts__vivek?stkn=MWZ4d21tMHpuNnF1Yg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm10.25 1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/share/1ESu6uJaPq/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1 .28-1.75 1.8-1.75H17V2.38C16.7 2.34 15.67 2.25 14.45 2.25c-2.55 0-4.3 1.56-4.3 4.42V9.5H7.25V13h2.9v9h3.35z" />
                </svg>
              </a>

            </div>

          </section>

        </>

      )}


      {/* ================= CUSTOM REQUEST MODAL ================= */}

      {showRequestForm && (

        <div className="request-modal">

          <div className="request-modal-content">

            {customRequestArtwork && (
              <p>
                Requesting customization for:{" "}
                <strong>{customRequestArtwork.title}</strong>
              </p>
            )}

            <button
              className="close-modal"
              onClick={() =>
                setShowRequestForm(
                  false
                )
              }
            >
              ×
            </button>

            {!requestSubmitted ? (

              <>

                <h2>
                  Request Customized Art
                </h2>

                <p>
                  Tell us how we can contact
                  you about your customized
                  MicroArt.
                </p>

                <form
                  className="custom-request-form"
                  onSubmit={async (event) => {
                    event.preventDefault()

                    const form = event.currentTarget

                    const formData = new FormData(form)

                    const requestData = {
                      fullName: formData.get("fullName"),
                      phone:
                        `${formData.get("countryCode")}${formData.get("phone")}`,
                      email: formData.get("email"),
                      requestDetails: formData.get("requestDetails"),
                      artworkId: customRequestArtwork?._id,
                    }

                    try {
                      const response = await fetch(
                        `${API_URL}/api/custom-requests`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(requestData),
                        }
                      )

                      const data = await response.json()

                      if (!response.ok) {
                        showNotification(data.message || "Failed to submit request")
                        return
                      }

                      setRequestSubmitted(true)
                    } catch (error) {
                      console.error("Custom request submission error:", error)

                      showNotification(
                        "Unable to submit your request. Please try again."
                      )
                    }
                  }}
                >

                  <div className="form-group">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Enter your full name"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Phone Number
                    </label>

                    <div className="phone-input-row">

                      <input
                        type="text"
                        name="countryCode"
                        defaultValue="+1"
                        required
                        maxLength="5"
                        pattern="\+[0-9]{1,4}"
                        title="Enter a valid country code, for example +1 or +91."
                        placeholder="+1"
                        className="country-code-input"
                        onInput={(event) => {
                          let value = event.currentTarget.value

                          if (!value.startsWith("+")) {
                            value =
                              "+" +
                              value.replace(/\D/g, "")
                          } else {
                            value =
                              "+" +
                              value
                                .slice(1)
                                .replace(/\D/g, "")
                          }

                          event.currentTarget.value =
                            value.slice(0, 5)
                        }}
                      />

                      <input
                        type="tel"
                        name="phone"
                        required
                        inputMode="numeric"
                        minLength="10"
                        maxLength="15"
                        pattern="[0-9]{10,15}"
                        title="Phone number must contain 10 to 15 digits."
                        placeholder="Phone number"
                        onInput={(event) => {
                          event.currentTarget.value =
                            event.currentTarget.value
                              .replace(/\D/g, "")
                              .slice(0, 15)
                        }}
                      />

                    </div>

                    <div className="country-code-shortcuts">

                      <button
                        type="button"
                        onClick={(event) => {
                          const input =
                            event.currentTarget
                              .closest(".form-group")
                              .querySelector(
                                ".country-code-input"
                              )

                          input.value = "+1"
                        }}
                      >
                        US +1
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          const input =
                            event.currentTarget
                              .closest(".form-group")
                              .querySelector(
                                ".country-code-input"
                              )

                          input.value = "+91"
                        }}
                      >
                        India +91
                      </button>

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email address"
                    />

                  </div>
                  <div className="form-group">

                    <label>
                      Request Details
                    </label>

                    <textarea
                      name="requestDetails"
                      required
                      placeholder="Describe the customized MicroArt you would like"
                      rows="5"
                    />

                  </div>

                  <button type="submit">
                    Submit Request
                  </button>

                </form>

              </>

            ) : (

              <div className="request-success">

                <div className="success-icon">
                  ✓
                </div>

                <h2>
                  Request Submitted!
                </h2>

                <p>
                  Thank you for your interest
                  in customized MicroArt.
                </p>

                <p>
                  The artist will contact you
                  to discuss your customized
                  art ideas and how they can
                  be implemented.
                </p>

                <button
                  onClick={() =>
                    setShowRequestForm(
                      false
                    )
                  }
                >
                  Close
                </button>

              </div>

            )}

          </div>

        </div>

      )}
    <footer className="footer">
      <p>
        © MicroArts by Vivek Podagatla. All rights reserved.
      </p>
    </footer>

    </div>
  )
}

export default App