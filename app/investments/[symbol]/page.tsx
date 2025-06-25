"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Star, DollarSign, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestment } from "@/contexts/InvestmentContext"
import { BuySellModal } from "@/components/BuySellModal"
import { safeLocalStorage } from "@/lib/utils"

export default function InvestmentDetailPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const router = useRouter()
  const { getInvestmentBySymbol, portfolio } = useInvestment()
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const investment = getInvestmentBySymbol(symbol)
  const portfolioItem = portfolio.find((item) => item.symbol === symbol)

  useEffect(() => {
    const isLoggedIn = safeLocalStorage().getItem("userLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Investment Not Found</h1>
          <Link href="/investments">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Back to Investments</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/investments" className="text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">{investment.symbol}</h1>
              <p className="text-sm text-gray-400">{investment.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {investment.isHalal && (
              <Badge className="bg-green-600 text-white">
                <Star size={12} className="mr-1" />
                Halal Certified
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Current Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-4xl font-bold text-white">${investment.price.toFixed(2)}</p>
                    <div
                      className={`flex items-center mt-2 ${investment.change >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {investment.change >= 0 ? (
                        <TrendingUp size={20} className="mr-2" />
                      ) : (
                        <TrendingDown size={20} className="mr-2" />
                      )}
                      <span className="text-lg font-medium">
                        {investment.change >= 0 ? "+" : ""}
                        {investment.change.toFixed(2)}({investment.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-400 mb-2">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">Real-time</span>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Market Cap</p>
                    <p className="text-white font-semibold">{investment.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Volume</p>
                    <p className="text-white font-semibold">{investment.volume}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">About {investment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{investment.description}</p>
                <div className="mt-4 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Star className="text-green-400 mr-2" size={16} />
                    <span className="text-green-400 font-medium">Halal Certification</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    This investment has been verified as Sharia-compliant by our Islamic finance experts.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Position (if any) */}
            {portfolioItem && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Your Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Shares Owned</p>
                      <p className="text-white font-semibold text-lg">{portfolioItem.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Avg. Price</p>
                      <p className="text-white font-semibold text-lg">${portfolioItem.avgPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Value</p>
                      <p className="text-white font-semibold text-lg">${portfolioItem.totalValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Gain/Loss</p>
                      <p
                        className={`font-semibold text-lg ${
                          portfolioItem.gainLoss >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {portfolioItem.gainLoss >= 0 ? "+" : ""}${portfolioItem.gainLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trading Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Trade {investment.symbol}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setShowBuyModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <DollarSign size={16} className="mr-2" />
                  Buy Shares
                </Button>
                {portfolioItem && portfolioItem.quantity > 0 && (
                  <Button
                    onClick={() => setShowSellModal(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <BarChart3 size={16} className="mr-2" />
                    Sell Shares
                  </Button>
                )}
                <p className="text-xs text-gray-400 text-center">Commission-free trading on all Halal investments</p>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Key Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white capitalize">{investment.category.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Halal Status</span>
                  <Badge className="bg-green-600 text-white">Certified</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white">{investment.marketCap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Volume</span>
                  <span className="text-white">{investment.volume}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Buy/Sell Modals */}
      <BuySellModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} investment={investment} type="buy" />

      <BuySellModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        investment={investment}
        type="sell"
        maxQuantity={portfolioItem?.quantity || 0}
      />
    </div>
  )
}
