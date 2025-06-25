"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { safeLocalStorage } from "@/lib/utils"

interface Investment {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  category: "halal-stocks" | "islamic-bonds" | "sukuk" | "commodities"
  isHalal: boolean
  description: string
  marketCap: string
  volume: string
}

interface PortfolioItem {
  id: string
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
}

interface Transaction {
  id: string
  type: "buy" | "sell"
  symbol: string
  name: string
  quantity: number
  price: number
  total: number
  date: string
  status: "completed" | "pending" | "failed"
}

interface InvestmentContextType {
  investments: Investment[]
  portfolio: PortfolioItem[]
  transactions: Transaction[]
  balance: number
  buyInvestment: (symbol: string, quantity: number, price: number) => Promise<boolean>
  sellInvestment: (symbol: string, quantity: number, price: number) => Promise<boolean>
  getInvestmentBySymbol: (symbol: string) => Investment | undefined
  updatePrices: () => void
  isLoading: boolean
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined)

export function useInvestment() {
  const context = useContext(InvestmentContext)
  if (!context) {
    throw new Error("useInvestment must be used within an InvestmentProvider")
  }
  return context
}

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      category: "halal-stocks",
      isHalal: true,
      description: "Technology company specializing in consumer electronics",
      marketCap: "$2.8T",
      volume: "45.2M",
    },
    {
      id: "2",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 378.85,
      change: -1.23,
      changePercent: -0.32,
      category: "halal-stocks",
      isHalal: true,
      description: "Technology corporation developing software and services",
      marketCap: "$2.8T",
      volume: "32.1M",
    },
    {
      id: "3",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.56,
      change: 3.42,
      changePercent: 2.46,
      category: "halal-stocks",
      isHalal: true,
      description: "Technology conglomerate specializing in internet services",
      marketCap: "$1.8T",
      volume: "28.7M",
    },
    {
      id: "4",
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 248.42,
      change: -5.67,
      changePercent: -2.23,
      category: "halal-stocks",
      isHalal: true,
      description: "Electric vehicle and clean energy company",
      marketCap: "$789B",
      volume: "67.3M",
    },
    {
      id: "5",
      symbol: "SUKUK1",
      name: "Islamic Development Bank Sukuk",
      price: 1000.0,
      change: 0.5,
      changePercent: 0.05,
      category: "sukuk",
      isHalal: true,
      description: "Sharia-compliant Islamic bond",
      marketCap: "$2.5B",
      volume: "1.2M",
    },
    {
      id: "6",
      symbol: "GOLD",
      name: "Gold Commodity",
      price: 2034.5,
      change: 12.3,
      changePercent: 0.61,
      category: "commodities",
      isHalal: true,
      description: "Precious metal commodity trading",
      marketCap: "$12.1T",
      volume: "156K",
    },
  ])

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)

  // Initialize data from localStorage on client side
  useEffect(() => {
    const storage = safeLocalStorage()

    // Check for welcome bonus
    const hasReceivedWelcomeBonus = storage.getItem("hasReceivedWelcomeBonus")
    if (!hasReceivedWelcomeBonus) {
      storage.setItem("hasReceivedWelcomeBonus", "true")
      setBalance(10) // $10 welcome bonus
    } else {
      const savedBalance = storage.getItem("userBalance")
      setBalance(savedBalance ? Number.parseFloat(savedBalance) : 0)
    }

    // Load portfolio
    const savedPortfolio = storage.getItem("userPortfolio")
    if (savedPortfolio) {
      try {
        setPortfolio(JSON.parse(savedPortfolio))
      } catch (error) {
        console.error("Error loading portfolio:", error)
      }
    }

    // Load transactions
    const savedTransactions = storage.getItem("userTransactions")
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
      } catch (error) {
        console.error("Error loading transactions:", error)
      }
    }

    setIsLoading(false)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const storage = safeLocalStorage()
      storage.setItem("userBalance", balance.toString())
    }
  }, [balance, isLoading])

  useEffect(() => {
    if (!isLoading) {
      const storage = safeLocalStorage()
      storage.setItem("userPortfolio", JSON.stringify(portfolio))
    }
  }, [portfolio, isLoading])

  useEffect(() => {
    if (!isLoading) {
      const storage = safeLocalStorage()
      storage.setItem("userTransactions", JSON.stringify(transactions))
    }
  }, [transactions, isLoading])

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices()
    }, 10000) // Update every 10 seconds (less frequent for better performance)

    return () => clearInterval(interval)
  }, [])

  const updatePrices = () => {
    setInvestments((prev) =>
      prev.map((investment) => {
        // Simulate price changes (-1% to +1% for more realistic movement)
        const changePercent = (Math.random() - 0.5) * 2
        const priceChange = investment.price * (changePercent / 100)
        const newPrice = Math.max(0.01, investment.price + priceChange)

        return {
          ...investment,
          price: Number(newPrice.toFixed(2)),
          change: Number(priceChange.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
        }
      }),
    )

    // Update portfolio values
    setPortfolio((prev) =>
      prev.map((item) => {
        const currentInvestment = investments.find((inv) => inv.symbol === item.symbol)
        if (!currentInvestment) return item

        const totalValue = item.quantity * currentInvestment.price
        const gainLoss = totalValue - item.quantity * item.avgPrice
        const gainLossPercent =
          item.avgPrice > 0 ? ((currentInvestment.price - item.avgPrice) / item.avgPrice) * 100 : 0

        return {
          ...item,
          currentPrice: currentInvestment.price,
          totalValue: Number(totalValue.toFixed(2)),
          gainLoss: Number(gainLoss.toFixed(2)),
          gainLossPercent: Number(gainLossPercent.toFixed(2)),
        }
      }),
    )
  }

  const buyInvestment = async (symbol: string, quantity: number, price: number): Promise<boolean> => {
    try {
      const total = quantity * price

      if (total > balance) {
        return false // Insufficient funds
      }

      const investment = investments.find((inv) => inv.symbol === symbol)
      if (!investment) return false

      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: "buy",
        symbol,
        name: investment.name,
        quantity,
        price,
        total,
        date: new Date().toISOString(),
        status: "completed",
      }

      // Update balance
      setBalance((prev) => prev - total)

      // Update portfolio
      setPortfolio((prev) => {
        const existingItem = prev.find((item) => item.symbol === symbol)

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity
          const newAvgPrice = (existingItem.avgPrice * existingItem.quantity + total) / newQuantity

          return prev.map((item) =>
            item.symbol === symbol
              ? {
                  ...item,
                  quantity: newQuantity,
                  avgPrice: Number(newAvgPrice.toFixed(2)),
                  totalValue: newQuantity * price,
                  gainLoss: (price - newAvgPrice) * newQuantity,
                  gainLossPercent: ((price - newAvgPrice) / newAvgPrice) * 100,
                }
              : item,
          )
        } else {
          const newItem: PortfolioItem = {
            id: Date.now().toString(),
            symbol,
            name: investment.name,
            quantity,
            avgPrice: price,
            currentPrice: price,
            totalValue: total,
            gainLoss: 0,
            gainLossPercent: 0,
          }
          return [...prev, newItem]
        }
      })

      // Add transaction
      setTransactions((prev) => [transaction, ...prev])

      return true
    } catch (error) {
      console.error("Error buying investment:", error)
      return false
    }
  }

  const sellInvestment = async (symbol: string, quantity: number, price: number): Promise<boolean> => {
    try {
      const portfolioItem = portfolio.find((item) => item.symbol === symbol)

      if (!portfolioItem || portfolioItem.quantity < quantity) {
        return false // Insufficient shares
      }

      const investment = investments.find((inv) => inv.symbol === symbol)
      if (!investment) return false

      const total = quantity * price

      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: "sell",
        symbol,
        name: investment.name,
        quantity,
        price,
        total,
        date: new Date().toISOString(),
        status: "completed",
      }

      // Update balance
      setBalance((prev) => prev + total)

      // Update portfolio
      setPortfolio((prev) => {
        return prev
          .map((item) => {
            if (item.symbol === symbol) {
              const newQuantity = item.quantity - quantity

              if (newQuantity === 0) {
                return null // Will be filtered out
              }

              const newTotalValue = newQuantity * price
              const gainLoss = (price - item.avgPrice) * newQuantity
              const gainLossPercent = item.avgPrice > 0 ? ((price - item.avgPrice) / item.avgPrice) * 100 : 0

              return {
                ...item,
                quantity: newQuantity,
                totalValue: Number(newTotalValue.toFixed(2)),
                gainLoss: Number(gainLoss.toFixed(2)),
                gainLossPercent: Number(gainLossPercent.toFixed(2)),
              }
            }
            return item
          })
          .filter(Boolean) as PortfolioItem[]
      })

      // Add transaction
      setTransactions((prev) => [transaction, ...prev])

      return true
    } catch (error) {
      console.error("Error selling investment:", error)
      return false
    }
  }

  const getInvestmentBySymbol = (symbol: string) => {
    return investments.find((inv) => inv.symbol === symbol)
  }

  return (
    <InvestmentContext.Provider
      value={{
        investments,
        portfolio,
        transactions,
        balance,
        buyInvestment,
        sellInvestment,
        getInvestmentBySymbol,
        updatePrices,
        isLoading,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  )
}
