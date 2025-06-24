// API Base URL
const API_BASE = window.location.origin + "/api"

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeAuth()
})

// Initialize Authentication
function initializeAuth() {
  // Check if user is already logged in
  const token = localStorage.getItem("authToken")
  if (token && !isTokenExpired(token)) {
    // If on login/register page and already logged in, redirect to dashboard
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html" ||
      window.location.pathname === "/register.html"
    ) {
      window.location.href = "/dashboard"
      return
    }
  } else {
    // If not logged in and trying to access protected pages, redirect to login
    const protectedPages = [
      "/dashboard",
      "/dashboard.html",
      "/invest.html",
      "/transactions.html",
      "/referral.html",
      "/settings.html",
    ]
    if (protectedPages.some((page) => window.location.pathname.includes(page))) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      window.location.href = "/"
      return
    }
  }

  // Login form handler
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Register form handler
  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }

  // Password visibility toggles
  setupPasswordToggles()

  // Load user data if logged in
  if (token && !isTokenExpired(token)) {
    loadUserData()
  }
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const loginBtn = document.getElementById("loginBtn")

  if (!email || !password) {
    showNotification("Please fill in all fields", "error")
    return
  }

  // Show loading state
  const originalText = loginBtn.textContent
  loginBtn.textContent = "Logging in..."
  loginBtn.disabled = true

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store token and user data
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("userData", JSON.stringify(data.user))

      showNotification("Login successful! Redirecting...", "success")

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } else {
      showNotification(data.error || "Login failed", "error")
    }
  } catch (error) {
    console.error("Login error:", error)
    showNotification("Network error. Please try again.", "error")
  } finally {
    loginBtn.textContent = originalText
    loginBtn.disabled = false
  }
}

// Handle Register
async function handleRegister(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)
  const registerBtn = document.getElementById("registerBtn")

  // Validation
  if (!data.fullName || !data.email || !data.username || !data.password) {
    showNotification("Please fill in all required fields", "error")
    return
  }

  if (data.password.length < 6) {
    showNotification("Password must be at least 6 characters", "error")
    return
  }

  if (data.password !== data.confirmPassword) {
    showNotification("Passwords do not match", "error")
    return
  }

  if (!document.getElementById("agreeTerms").checked) {
    showNotification("Please agree to the Terms & Conditions", "error")
    return
  }

  // Show loading state
  const originalText = registerBtn.textContent
  registerBtn.textContent = "Creating Account..."
  registerBtn.disabled = true

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password,
        phone: data.phone,
      }),
    })

    const result = await response.json()

    if (response.ok) {
      // Store token and user data
      localStorage.setItem("authToken", result.token)
      localStorage.setItem("userData", JSON.stringify(result.user))

      showNotification("Account created successfully! Redirecting...", "success")

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } else {
      showNotification(result.error || "Registration failed", "error")
    }
  } catch (error) {
    console.error("Registration error:", error)
    showNotification("Network error. Please try again.", "error")
  } finally {
    registerBtn.textContent = originalText
    registerBtn.disabled = false
  }
}

// Setup Password Toggles
function setupPasswordToggles() {
  const toggles = [
    { btn: "showPassword", input: "password" },
    { btn: "showConfirmPassword", input: "confirmPassword" },
    { btn: "showPasswordCheck", input: "password" },
  ]

  toggles.forEach(({ btn, input }) => {
    const button = document.getElementById(btn)
    const inputField = document.getElementById(input)

    if (button && inputField) {
      button.addEventListener("click", () => togglePasswordVisibility(input, btn))
    }
  })

  // Checkbox toggle for login page
  const showPasswordCheck = document.getElementById("showPasswordCheck")
  if (showPasswordCheck) {
    showPasswordCheck.addEventListener("change", () => {
      togglePasswordVisibility("password", "showPassword")
    })
  }
}

// Toggle Password Visibility
function togglePasswordVisibility(inputId, buttonId) {
  const input = document.getElementById(inputId)
  const button = document.getElementById(buttonId)

  if (input.type === "password") {
    input.type = "text"
    if (button && button.querySelector("i")) {
      button.querySelector("i").className = "fas fa-eye-slash"
    }
  } else {
    input.type = "password"
    if (button && button.querySelector("i")) {
      button.querySelector("i").className = "fas fa-eye"
    }
  }
}

// Load User Data
async function loadUserData() {
  const token = localStorage.getItem("authToken")
  if (!token) return

  try {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const userData = await response.json()
      localStorage.setItem("userData", JSON.stringify(userData))
      updateUIWithUserData(userData)
    } else if (response.status === 401 || response.status === 403) {
      // Token expired or invalid
      logout()
    }
  } catch (error) {
    console.error("Error loading user data:", error)
  }
}

// Update UI with User Data
function updateUIWithUserData(userData) {
  // Update user name in header
  const userNameEl = document.querySelector(".user-name")
  if (userNameEl) {
    userNameEl.textContent = userData.fullName
  }

  // Update user balance in header
  const userBalanceEl = document.querySelector(".user-balance")
  if (userBalanceEl) {
    userBalanceEl.textContent = `$${userData.balance.toFixed(2)}`
  }

  // Update profile form if on settings page
  const fullNameInput = document.getElementById("fullName")
  const phoneInput = document.getElementById("phone")
  const emailInput = document.getElementById("email")
  const usernameInput = document.getElementById("username")

  if (fullNameInput) fullNameInput.value = userData.fullName || ""
  if (phoneInput) phoneInput.value = userData.phone || ""
  if (emailInput) emailInput.value = userData.email || ""
  if (usernameInput) usernameInput.value = userData.username || ""
}

// Check if token is expired
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 < Date.now()
  } catch (error) {
    return true
  }
}

// Logout function
function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userData")
  window.location.href = "/"
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("authToken")

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, finalOptions)

    if (response.status === 401 || response.status === 403) {
      logout()
      return null
    }

    return response
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "9999",
    maxWidth: "300px",
    wordWrap: "break-word",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  })

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.backgroundColor = "#28a745"
      break
    case "error":
      notification.style.backgroundColor = "#dc3545"
      break
    case "warning":
      notification.style.backgroundColor = "#ffc107"
      notification.style.color = "#000"
      break
    default:
      notification.style.backgroundColor = "#17a2b8"
  }

  // Add to page
  document.body.appendChild(notification)

  // Remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.opacity = "0"
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        notification.parentNode.removeChild(notification)
      }, 300)
    }
  }, 4000)
}

// Export functions for use in other scripts
window.apiRequest = apiRequest
window.logout = logout
window.showNotification = showNotification
