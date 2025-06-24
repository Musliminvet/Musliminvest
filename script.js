// Global variables
let currentPlan = "starter"
const planData = {
  starter: { percentage: 2.5, min: 10, max: 999, duration: 30 },
  business: { percentage: 3.5, min: 1000, max: 4999, duration: 45 },
  professional: { percentage: 5.0, min: 5000, max: 50000, duration: 60 },
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize App
function initializeApp() {
  // Login form handler
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Show password functionality
  const showPasswordBtn = document.getElementById("showPassword")
  const showPasswordCheck = document.getElementById("showPasswordCheck")

  if (showPasswordBtn) {
    showPasswordBtn.addEventListener("click", togglePasswordVisibility)
  }

  if (showPasswordCheck) {
    showPasswordCheck.addEventListener("change", togglePasswordVisibility)
  }

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
    loadTheme()
  }

  // Investment calculator
  if (document.getElementById("investAmount")) {
    calculateProfit()
  }

  // Initialize deposit page
  if (window.location.pathname.includes("deposit-crypto.html")) {
    initializeDepositPage()
  }
}

// Login Handler
function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (email && password) {
    // Simulate login success
    showNotification("Login successful! Redirecting...", "success")
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)
  } else {
    showNotification("Please fill in all fields", "error")
  }
}

// Password Visibility Toggle
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password")
  const showPasswordBtn = document.getElementById("showPassword")
  const showPasswordCheck = document.getElementById("showPasswordCheck")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    if (showPasswordBtn) {
      showPasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>'
    }
    if (showPasswordCheck) {
      showPasswordCheck.checked = true
    }
  } else {
    passwordInput.type = "password"
    if (showPasswordBtn) {
      showPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>'
    }
    if (showPasswordCheck) {
      showPasswordCheck.checked = false
    }
  }
}

// Theme Toggle
function toggleTheme() {
  const body = document.body
  const themeToggle = document.getElementById("themeToggle")

  if (body.classList.contains("light-theme")) {
    body.classList.remove("light-theme")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    localStorage.setItem("theme", "dark")
  } else {
    body.classList.add("light-theme")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    localStorage.setItem("theme", "light")
  }
}

// Load Theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme")
  const body = document.body
  const themeToggle = document.getElementById("themeToggle")

  if (savedTheme === "light") {
    body.classList.add("light-theme")
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }
  }
}

// Deposit Modal Functions
function openDepositModal() {
  const modal = document.getElementById("depositModal")
  if (modal) {
    modal.classList.add("active")
  }
}

function closeDepositModal() {
  const modal = document.getElementById("depositModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function proceedToDeposit() {
  const amount = document.getElementById("depositAmount").value
  const coin = document.getElementById("cryptoCoin").value

  if (!amount || amount < 10) {
    showNotification("Please enter a valid amount (minimum $10)", "error")
    return
  }

  // Store deposit data and redirect
  localStorage.setItem("depositAmount", amount)
  localStorage.setItem("depositCoin", coin)
  window.location.href = "deposit-crypto.html"
}

// Initialize Deposit Page
function initializeDepositPage() {
  const amount = localStorage.getItem("depositAmount") || "100"
  const coin = localStorage.getItem("depositCoin") || "BTC"

  // Update display based on stored data
  updateDepositDisplay(amount, coin)
}

function updateDepositDisplay(amount, coin) {
  const exactAmountEl = document.getElementById("exactAmount")
  const summaryAmountEl = document.getElementById("summaryAmount")
  const summaryCurrencyEl = document.getElementById("summaryCurrency")
  const walletAddressEl = document.getElementById("walletAddress")
  const usdtAddressEl = document.getElementById("usdtAddress")

  if (exactAmountEl) {
    if (coin === "BTC") {
      const btcAmount = (Number.parseFloat(amount) / 43000).toFixed(8) // Approximate BTC price
      exactAmountEl.innerHTML = `
                <span class="crypto-amount">${btcAmount}</span>
                <span class="crypto-symbol">BTC</span>
            `
      walletAddressEl.style.display = "flex"
      usdtAddressEl.style.display = "none"
    } else {
      exactAmountEl.innerHTML = `
                <span class="crypto-amount">${amount}</span>
                <span class="crypto-symbol">USDT</span>
            `
      walletAddressEl.style.display = "none"
      usdtAddressEl.style.display = "flex"
    }
  }

  if (summaryAmountEl) {
    summaryAmountEl.textContent = `$${amount}`
  }

  if (summaryCurrencyEl) {
    summaryCurrencyEl.textContent = coin === "BTC" ? "Bitcoin (BTC)" : "USDT (TRC20)"
  }
}

// Copy to Clipboard
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId)
  let textToCopy = ""

  if (element.tagName === "INPUT") {
    textToCopy = element.value
  } else {
    const addressText = element.querySelector(".address-text")
    textToCopy = addressText ? addressText.textContent : element.textContent
  }

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      showNotification("Copied to clipboard!", "success")

      // Visual feedback
      const copyBtn = element.querySelector(".copy-btn") || element.nextElementSibling
      if (copyBtn) {
        copyBtn.classList.add("copy-success")
        setTimeout(() => {
          copyBtn.classList.remove("copy-success")
        }, 2000)
      }
    })
    .catch(() => {
      showNotification("Failed to copy", "error")
    })
}

// File Upload Handler
function updateFileName() {
  const fileInput = document.getElementById("paymentProof")
  const fileName = document.getElementById("fileName")

  if (fileInput && fileName) {
    if (fileInput.files.length > 0) {
      fileName.textContent = fileInput.files[0].name
    } else {
      fileName.textContent = "Choose file or drag here"
    }
  }
}

// Investment Plan Selection
function selectPlan(plan) {
  currentPlan = plan

  // Update active button
  const planBtns = document.querySelectorAll(".plan-btn")
  planBtns.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.plan === plan) {
      btn.classList.add("active")
    }
  })

  // Update slider limits
  const slider = document.getElementById("amountSlider")
  const maxAmountEl = document.getElementById("maxAmount")
  const investAmountInput = document.getElementById("investAmount")

  if (slider && maxAmountEl) {
    slider.min = planData[plan].min
    slider.max = planData[plan].max
    maxAmountEl.textContent = `$${planData[plan].max.toLocaleString()}`

    // Reset amount to minimum if current amount is below minimum
    const currentAmount = Number.parseInt(investAmountInput.value)
    if (currentAmount < planData[plan].min) {
      investAmountInput.value = planData[plan].min
      slider.value = planData[plan].min
    }
  }

  calculateProfit()
}

// Investment Calculator
function calculateProfit() {
  const amount = Number.parseFloat(document.getElementById("investAmount")?.value || 0)
  const dailyProfitEl = document.getElementById("dailyProfit")
  const totalProfitEl = document.getElementById("totalProfit")

  if (dailyProfitEl && totalProfitEl) {
    const dailyProfit = (amount * planData[currentPlan].percentage) / 100
    const totalProfit = dailyProfit * planData[currentPlan].duration

    dailyProfitEl.textContent = `$${dailyProfit.toFixed(2)}`
    totalProfitEl.textContent = `$${totalProfit.toFixed(2)}`
  }
}

function updateFromSlider() {
  const slider = document.getElementById("amountSlider")
  const investAmountInput = document.getElementById("investAmount")

  if (slider && investAmountInput) {
    investAmountInput.value = slider.value
    calculateProfit()
  }
}

// Settings Password Toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling

  if (input.type === "password") {
    input.type = "text"
    button.innerHTML = '<i class="fas fa-eye-slash"></i>'
  } else {
    input.type = "password"
    button.innerHTML = '<i class="fas fa-eye"></i>'
  }
}

// Delete Account Confirmation
function confirmDeleteAccount() {
  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    showNotification("Account deletion request submitted", "info")
  }
}

// Notification System
function showNotification(message, type = "info") {
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

  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

// Modal click outside to close
document.addEventListener("click", (e) => {
  const modal = document.getElementById("depositModal")
  if (modal && e.target === modal) {
    closeDepositModal()
  }
})

// Prevent form submission on enter in number inputs
document.addEventListener("keypress", (e) => {
  if (e.target.type === "number" && e.key === "Enter") {
    e.preventDefault()
  }
})

// Update investment amount when typing
document.addEventListener("input", (e) => {
  if (e.target.id === "investAmount") {
    const slider = document.getElementById("amountSlider")
    if (slider) {
      slider.value = e.target.value
    }
    calculateProfit()
  }
})

// Initialize tooltips and other interactive elements
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Add loading states to buttons
  document.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.addEventListener("click", function () {
      if (!this.disabled) {
        const originalText = this.textContent
        this.textContent = "Loading..."
        this.disabled = true

        setTimeout(() => {
          this.textContent = originalText
          this.disabled = false
        }, 2000)
      }
    })
  })
})
