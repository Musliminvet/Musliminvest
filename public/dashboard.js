// Dashboard specific functionality
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData()
})

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
    showNotification("Error loading dashboard data", "error")
  }
}

// Update Dashboard UI
function updateDashboardUI(data) {
  // Update balance card
  const balanceAmount = document.querySelector(".balance-card .amount")
  if (balanceAmount) {
    balanceAmount.textContent = `$${data.balance.toFixed(2)}`
  }

  // Update today's profit
  const profitAmount = document.querySelector(".profit-card .amount")
  if (profitAmount) {
    profitAmount.textContent = `+$${data.todayProfit.toFixed(2)}`
  }

  // Update recent transactions
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
