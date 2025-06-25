"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestment } from "@/contexts/InvestmentContext"
import { safeLocalStorage } from "@/lib/utils"

export default function InvestmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { investments } = useInvestment()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = safeLocalStorage().getItem("userLoggedIn")
      if (!isLoggedIn) {
        router.push("/")
      }
      setIsLoading(false)
    }

    checkLogin()
  }, [router])

  const categories = [
    { id: "all", name: "All Investments" },
    { id: "halal-stocks", name: "Halal Stocks" },
    { id: "islamic-bonds", name: "Islamic Bonds" },
    { id: "sukuk", name: "Sukuk" },
    { id: "commodities", name: "Commodities" },
  ]

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || investment.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">Halal Investments</h1>
              <p className="text-sm text-gray-400">Discover Sharia-compliant opportunities</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Market Status</p>
                  <p className="text-lg font-semibold text-green-400">Open</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-gray-400">Halal Index</p>
                <p className="text-lg font-semibold text-white">4,523.67</p>
                <p className="text-sm text-green-400 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  +1.24%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-gray-400">Available Investments</p>
                <p className="text-lg font-semibold text-white">{filteredInvestments.length}</p>
                <p className="text-sm text-gray-400">Sharia-compliant</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((investment) => (
            <Card
              key={investment.id}
              className="bg-gray-800 border-gray-700 hover:border-yellow-400 transition-colors cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{investment.symbol}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{investment.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {investment.isHalal && (
                      <Badge className="bg-green-600 text-white">
                        <Star size={12} className="mr-1" />
                        Halal
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">${investment.price.toFixed(2)}</span>
                    <div className={`flex items-center ${investment.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {investment.change >= 0 ? (
                        <TrendingUp size={16} className="mr-1" />
                      ) : (
                        <TrendingDown size={16} className="mr-1" />
                      )}
                      <span className="font-medium">
                        {investment.change >= 0 ? "+" : ""}
                        {investment.change.toFixed(2)}({investment.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Market Cap</p>
                      <p className="text-white font-medium">{investment.marketCap}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Volume</p>
                      <p className="text-white font-medium">{investment.volume}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2">{investment.description}</p>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/investments/${investment.symbol}`} className="flex-1">
                      <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInvestments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No investments found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
