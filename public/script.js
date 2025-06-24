// Include the original script.js content but update the login function
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
  // Check authentication
  checkAuth()

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

  // Load dashboard data if on dashboard
  if (window.location.pathname.includes("dashboard")) {
    loadDashboardData()
  }
}

// Check Authentication
function checkAuth() {
  const token = localStorage.getItem("authToken")
  const protectedPages = ["/dashboard", "/invest", "/transactions", "/referral", "/settings"]
  const currentPath = window.location.pathname

  if (!token && protectedPages.some((page) => currentPath.includes(page))) {
    window.location.href = "/"
    return
  }

  if (token && isTokenExpired(token)) {
    logout()
    return
  }
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

async function proceedToDeposit() {
  const amount = document.getElementById("depositAmount").value
  const coin = document.getElementById("cryptoCoin").value

  if (!amount || amount < 10) {
    showNotification("Please enter a valid amount (minimum $10)", "error")
    return
  }

  try {
    const response = await apiRequest("/deposit", {
      method: "POST",
      body: JSON.stringify({
        amount: Number.parseFloat(amount),
        cryptocurrency: coin,
      }),
    })

    if (response && response.ok) {
      const data = await response.json()
      localStorage.setItem("depositAmount", amount)
      localStorage.setItem("depositCoin", coin)
      showNotification("Deposit request created successfully", "success")
      window.location.href = "deposit-crypto.html"
    } else {
      const error = await response.json()
      showNotification(error.error || "Failed to create deposit", "error")
    }
  } catch (error) {
    console.error("Deposit error:", error)
    showNotification("Network error. Please try again.", "error")
  }
}

// Initialize Deposit Page
function initializeDepositPage() {
  const amount = localStorage.getItem("depositAmount") || "100"
  const coin = localStorage.getItem("depositCoin") || "BTC"
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
      const btcAmount = (Number.parseFloat(amount) / 43000).toFixed(8)
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

  const planBtns = document.querySelectorAll(".plan-btn")
  planBtns.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.plan === plan) {
      btn.classList.add("active")
    }
  })

  const slider = document.getElementById("amountSlider")
  const maxAmountEl = document.getElementById("maxAmount")
  const investAmountInput = document.getElementById("investAmount")

  if (slider && maxAmountEl) {
    slider.min = planData[plan].min
    slider.max = planData[plan].max
    maxAmountEl.textContent = `$${planData[plan].max.toLocaleString()}`

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

// Load Dashboard Data
async function loadDashboardData() {
  try {
    const response = await apiRequest("/dashboard")

    if (response && response.ok) {
      const data = await response.json()
      updateDashboardUI(data)
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error)
  }
}

// Update Dashboard UI
function updateDashboardUI(data) {
  const balanceAmount = document.querySelector(".balance-card .amount")
  if (balanceAmount) {
    balanceAmount.textContent = `$${data.balance.toFixed(2)}`
  }

  const profitAmount = document.querySelector(".profit-card .amount")
  if (profitAmount) {
    profitAmount.textContent = `+$${data.todayProfit.toFixed(2)}`
  }

  const transactionList = document.querySelector(".transaction-list")
  if (transactionList && data.recentTransactions) {
    transactionList.innerHTML = ""

    data.recentTransactions.forEach((transaction) => {
      const transactionEl = createTransactionElement(transaction)
      transactionList.appendChild(transactionEl)
    })
  }
}

// Create Transaction Element
function createTransactionElement(transaction) {
  const div = document.createElement("div")
  div.className = "transaction-item"

  const statusClass = getStatusClass(transaction.status)
  const typeIcon = getTypeIcon(transaction.type)
  const amountPrefix = transaction.amount >= 0 ? "+" : ""

  div.innerHTML = `
    <div class="transaction-icon ${statusClass}">
      <i class="${typeIcon}"></i>
    </div>
    <div class="transaction-details">
      <p class="transaction-type">${formatTransactionType(transaction.type)}</p>
      <p class="transaction-date">${formatDate(transaction.createdAt)}</p>
    </div>
    <div class="transaction-amount ${statusClass}">${amountPrefix}$${Math.abs(transaction.amount).toFixed(2)}</div>
  `

  return div
}

// Helper functions
function getStatusClass(status) {
  const statusMap = {
    successful: "successful",
    processing: "processing",
    pending: "pending",
    failed: "action-needed",
  }
  return statusMap[status] || "processing"
}

function getTypeIcon(type) {
  const iconMap = {
    deposit: "fas fa-arrow-up",
    withdrawal: "fas fa-arrow-down",
    investment: "fas fa-chart-line",
    profit: "fas fa-chart-line",
    referral_commission: "fas fa-users",
  }
  return iconMap[type] || "fas fa-circle"
}

function formatTransactionType(type) {
  const typeMap = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    investment: "Investment",
    profit: "Profit",
    referral_commission: "Referral Commission",
  }
  return typeMap[type] || type
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// API Request Helper (if not already defined)
if (typeof apiRequest === "undefined") {
  window.apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("authToken")
    const API_BASE = window.location.origin + "/api"

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
}

// Logout function (if not already defined)
if (typeof logout === "undefined") {
  window.logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    window.location.href = "/"
  }
}

// Notification System (if not already defined)
if (typeof showNotification === "undefined") {
  window.showNotification = (message, type = "info") => {
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => notification.remove())

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

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

    document.body.appendChild(notification)

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
}

// Modal click outside to close
document.addEventListener("click", (e) => {
  const modal = document.getElementById("depositModal")
  if (modal && e.target === modal) {
    closeDepositModal()
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
