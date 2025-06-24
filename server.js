const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// In-memory database (replace with real database in production)
const users = []
const transactions = []
const investments = []
const referrals = []

// Helper function to generate user ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Helper function to generate transaction ID
const generateTxnId = () => "TXN-" + Math.random().toString(36).substr(2, 6).toUpperCase()

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

// Routes

// Register new user
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, username, password, phone } = req.body

    // Validation
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email || u.username === username)
    if (existingUser) {
      return res.status(400).json({ error: "User with this email or username already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = {
      id: generateId(),
      fullName,
      email,
      username,
      password: hashedPassword,
      phone: phone || "",
      balance: 0,
      totalProfit: 0,
      referralCode: generateId(),
      referredBy: null,
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    users.push(user)

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      message: "Account created successfully",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Login user
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user profile
app.get("/api/profile", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update user profile
app.put("/api/profile", authenticateToken, (req, res) => {
  try {
    const { fullName, phone } = req.body

    const userIndex = users.findIndex((u) => u.id === req.user.userId)
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update user data
    if (fullName) users[userIndex].fullName = fullName
    if (phone !== undefined) users[userIndex].phone = phone
    users[userIndex].updatedAt = new Date().toISOString()

    const { password: _, ...userWithoutPassword } = users[userIndex]
    res.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update password
app.put("/api/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" })
    }

    const userIndex = users.findIndex((u) => u.id === req.user.userId)
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, users[userIndex].password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    users[userIndex].password = hashedNewPassword
    users[userIndex].updatedAt = new Date().toISOString()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Password change error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get dashboard data
app.get("/api/dashboard", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Get user transactions
    const userTransactions = transactions
      .filter((t) => t.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    // Calculate today's profit
    const today = new Date().toDateString()
    const todayProfit = transactions
      .filter(
        (t) => t.userId === req.user.userId && t.type === "profit" && new Date(t.createdAt).toDateString() === today,
      )
      .reduce((sum, t) => sum + t.amount, 0)

    res.json({
      balance: user.balance,
      totalProfit: user.totalProfit,
      todayProfit,
      recentTransactions: userTransactions,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create deposit
app.post("/api/deposit", authenticateToken, (req, res) => {
  try {
    const { amount, cryptocurrency, walletAddress, note } = req.body

    if (!amount || amount < 10) {
      return res.status(400).json({ error: "Minimum deposit amount is $10" })
    }

    if (!cryptocurrency) {
      return res.status(400).json({ error: "Cryptocurrency selection is required" })
    }

    const transaction = {
      id: generateTxnId(),
      userId: req.user.userId,
      type: "deposit",
      amount: Number.parseFloat(amount),
      cryptocurrency,
      walletAddress,
      note: note || "",
      status: "processing",
      createdAt: new Date().toISOString(),
    }

    transactions.push(transaction)

    res.status(201).json({
      message: "Deposit request submitted successfully",
      transaction,
    })
  } catch (error) {
    console.error("Deposit error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create investment
app.post("/api/invest", authenticateToken, (req, res) => {
  try {
    const { plan, amount } = req.body

    const planData = {
      starter: { percentage: 2.5, min: 10, max: 999, duration: 30 },
      business: { percentage: 3.5, min: 1000, max: 4999, duration: 45 },
      professional: { percentage: 5.0, min: 5000, max: 50000, duration: 60 },
    }

    if (!planData[plan]) {
      return res.status(400).json({ error: "Invalid investment plan" })
    }

    const planInfo = planData[plan]
    const investAmount = Number.parseFloat(amount)

    if (investAmount < planInfo.min || investAmount > planInfo.max) {
      return res.status(400).json({
        error: `Investment amount must be between $${planInfo.min} and $${planInfo.max}`,
      })
    }

    const user = users.find((u) => u.id === req.user.userId)
    if (!user || user.balance < investAmount) {
      return res.status(400).json({ error: "Insufficient balance" })
    }

    // Create investment
    const investment = {
      id: generateId(),
      userId: req.user.userId,
      plan,
      amount: investAmount,
      dailyProfit: (investAmount * planInfo.percentage) / 100,
      totalProfit: ((investAmount * planInfo.percentage) / 100) * planInfo.duration,
      duration: planInfo.duration,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + planInfo.duration * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      createdAt: new Date().toISOString(),
    }

    investments.push(investment)

    // Update user balance
    const userIndex = users.findIndex((u) => u.id === req.user.userId)
    users[userIndex].balance -= investAmount

    // Create transaction record
    const transaction = {
      id: generateTxnId(),
      userId: req.user.userId,
      type: "investment",
      amount: -investAmount,
      status: "successful",
      description: `Investment in ${plan} plan`,
      createdAt: new Date().toISOString(),
    }

    transactions.push(transaction)

    res.status(201).json({
      message: "Investment created successfully",
      investment,
    })
  } catch (error) {
    console.error("Investment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user investments
app.get("/api/investments", authenticateToken, (req, res) => {
  try {
    const userInvestments = investments
      .filter((i) => i.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(userInvestments)
  } catch (error) {
    console.error("Investments error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user transactions
app.get("/api/transactions", authenticateToken, (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query

    let userTransactions = transactions.filter((t) => t.userId === req.user.userId)

    if (type && type !== "all") {
      userTransactions = userTransactions.filter((t) => t.type === type)
    }

    userTransactions = userTransactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit)

    res.json({
      transactions: userTransactions,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      total: transactions.filter((t) => t.userId === req.user.userId).length,
    })
  } catch (error) {
    console.error("Transactions error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get referral data
app.get("/api/referral", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Get referral statistics
    const referredUsers = users.filter((u) => u.referredBy === user.referralCode)
    const totalReferrals = referredUsers.length
    const activeInvestors = referredUsers.filter((u) => u.balance > 0).length

    // Calculate total invested by referrals
    const totalInvested = referredUsers.reduce((sum, u) => {
      const userInvestments = investments.filter((i) => i.userId === u.id)
      return sum + userInvestments.reduce((invSum, inv) => invSum + inv.amount, 0)
    }, 0)

    // Get referral commissions
    const referralCommissions = transactions
      .filter((t) => t.userId === req.user.userId && t.type === "referral_commission")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const totalReward = referralCommissions.reduce((sum, t) => sum + t.amount, 0)

    const today = new Date().toDateString()
    const todayReward = referralCommissions
      .filter((t) => new Date(t.createdAt).toDateString() === today)
      .reduce((sum, t) => sum + t.amount, 0)

    res.json({
      referralCode: user.referralCode,
      referralLink: `${req.protocol}://${req.get("host")}/register?ref=${user.referralCode}`,
      totalReward,
      todayReward,
      totalReferrals,
      activeInvestors,
      totalInvested,
      recentCommissions: referralCommissions.slice(0, 10),
    })
  } catch (error) {
    console.error("Referral error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
})

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"))
})

// Catch all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Visit: http://localhost:${PORT}`)

  // Create demo user for testing
  createDemoUser()
})

// Create demo user
async function createDemoUser() {
  const demoUser = {
    id: "demo-user-123",
    fullName: "Ahmed Hassan",
    email: "demo@musliminvest.com",
    username: "ahmed123",
    password: await bcrypt.hash("password123", 10),
    phone: "+1 (555) 123-4567",
    balance: 2450.0,
    totalProfit: 245.5,
    referralCode: "AHMED123",
    referredBy: null,
    createdAt: new Date().toISOString(),
    isActive: true,
  }

  // Only add if not exists
  if (!users.find((u) => u.email === demoUser.email)) {
    users.push(demoUser)

    // Add demo transactions
    const demoTransactions = [
      {
        id: "TXN-001234",
        userId: demoUser.id,
        type: "deposit",
        amount: 500,
        status: "successful",
        description: "Crypto Deposit",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "TXN-001233",
        userId: demoUser.id,
        type: "investment",
        amount: -200,
        status: "processing",
        description: "Investment in Business Plan",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "TXN-001232",
        userId: demoUser.id,
        type: "profit",
        amount: 25.5,
        status: "successful",
        description: "Daily Profit",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    transactions.push(...demoTransactions)

    console.log("Demo user created:")
    console.log("Email: demo@musliminvest.com")
    console.log("Password: password123")
  }
}
