"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Diamond,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Grid3X3,
  Users,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useInvestment } from "@/contexts/InvestmentContext"
import Link from "next/link"
import { safeLocalStorage } from "@/lib/utils"

export default function Dashboard() {
  const [userName, setUserName] = useState("")
  const [currentYear] = useState(2025)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const { balance, portfolio, isLoading } = useInvestment()

  useEffect(() => {
    setIsClient(true)
    const storage = safeLocalStorage()

    const isLoggedIn = storage.getItem("userLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    // Get user data
    const email = storage.getItem("userEmail") || ""
    const name = storage.getItem("userName") || email.split("@")[0] || "User"
    setUserName(name)

    // Show welcome bonus notification for new users
    const hasShownWelcome = storage.getItem("hasShownWelcome")
    const hasReceivedWelcomeBonus = storage.getItem("hasReceivedWelcomeBonus")

    if (hasReceivedWelcomeBonus === "true" && !hasShownWelcome && balance >= 10) {
      setTimeout(() => {
        alert("🎉 Welcome Bonus: $10 has been added to your account!")
        storage.setItem("hasShownWelcome", "true")
      }, 2000)
    }
  }, [router, balance])

  const totalPortfolioValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0)
  const todaysProfit = portfolio.reduce((sum, item) => sum + (item.gainLoss > 0 ? item.gainLoss * 0.1 : 0), 0) // Simulate daily profit

  const navigationItems = [
    { id: "transactions", label: "Transacti...", icon: DollarSign, href: "/transactions" },
    { id: "invest", label: "Invest an...", icon: TrendingUp, href: "/investments" },
    { id: "dashboard", label: "Dashboard", icon: Grid3X3, href: "/dashboard" },
    { id: "referral", label: "Referral", icon: Users, href: "/referral" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl animate-pulse">🌙⭐</div>
          </div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center space-x-3">
          <Diamond className="text-yellow-400" size={24} />
          <div className="bg-gray-800 rounded-full px-3 py-1 flex items-center space-x-2">
            <span className="text-gray-400 text-sm">PH</span>
            <span className="text-yellow-400 font-semibold">${(balance + totalPortfolioValue).toFixed(0)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="border border-orange-500 text-orange-500 hover:bg-orange-500/10 rounded-lg"
          onClick={() => window.location.reload()}
        >
          <RotateCcw size={20} />
        </Button>
      </header>

      {/* Greeting */}
      <div className="px-4 mb-8">
        <h1 className="text-2xl font-normal text-white">
          Hello {userName} <span className="text-2xl">👋</span>
        </h1>
      </div>

      {/* Balance and Profit Cards */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Balance Card */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                <span className="text-gray-300 text-sm">Balance</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">${balance.toFixed(0)}</p>
                <p className="text-gray-400 text-xs">United States Dollar</p>
              </div>
            </CardContent>
          </Card>

          {/* Today's Profit Card */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-green-400 text-lg">🌱</div>
                <span className="text-gray-300 text-sm">Today's Profit</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">${todaysProfit.toFixed(0)}</p>
                <p className="text-gray-400 text-xs">United States Dollar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Take Action Section */}
      <div className="px-4 mb-8">
        <h2 className="text-white text-lg mb-4 flex items-center">
          Take Action <span className="ml-2 text-lg">🔥</span>
        </h2>
        <div className="space-y-3">
          <Link href="/deposit">
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 py-4 rounded-lg flex items-center justify-center space-x-2">
              <span>Make Deposit</span>
              <span className="text-lg">💰</span>
            </Button>
          </Link>

          <Link href="/transfer">
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 py-4 rounded-lg flex items-center justify-center space-x-2">
              <span>Internal Transfer</span>
              <span className="text-lg">⚡</span>
            </Button>
          </Link>

          <Link href="/withdraw">
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 py-4 rounded-lg flex items-center justify-center space-x-2">
              <span>Withdraw Money</span>
              <span className="text-lg">💸</span>
            </Button>
          </Link>

          <Link href="/deposit-history">
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 py-4 rounded-lg flex items-center justify-center space-x-2">
              <span>Deposit History</span>
              <span className="text-lg">📋</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Year Navigation */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-center space-x-6">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ChevronLeft size={24} />
          </Button>
          <span className="text-white text-xl font-medium">{currentYear}</span>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>

      {/* Spacer to push navigation to bottom */}
      <div className="flex-1"></div>

      {/* Bottom Navigation */}
      <nav className="bg-black border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeTab

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive ? "text-orange-500" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-orange-500/20" : ""}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
