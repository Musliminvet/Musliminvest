"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useInvestment } from "@/contexts/InvestmentContext"
import { safeLocalStorage } from "@/lib/utils"

export default function TransactionsPage() {
  const router = useRouter()
  const { transactions } = useInvestment()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate a loading delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      const isLoggedIn = safeLocalStorage.getItem("userLoggedIn")
      if (!isLoggedIn) {
        router.push("/")
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">Loading Transactions...</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Transactions</h1>
            <p className="text-sm text-gray-400">Your transaction history</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{transaction.name}</p>
                      <p className="text-sm text-gray-400">
                        {transaction.type.toUpperCase()} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === "buy" ? "text-red-400" : "text-green-400"}`}>
                        {transaction.type === "buy" ? "-" : "+"}${transaction.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">{transaction.quantity} shares</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-xl font-bold mb-2">No Transactions Yet</h2>
            <p className="text-gray-400 mb-6">Start investing to see your transaction history here.</p>
            <Link href="/investments">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Start Investing</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
