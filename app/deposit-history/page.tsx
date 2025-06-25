"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DepositRequest {
  id: string
  amount: string
  coin: string
  status: "pending" | "completed" | "rejected"
  createdAt: string
  walletAddress: string
}

export default function DepositHistoryPage() {
  const router = useRouter()
  const [deposits, setDeposits] = useState<DepositRequest[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    // Load deposit history from localStorage
    const savedDeposits = localStorage.getItem("depositHistory")
    if (savedDeposits) {
      setDeposits(JSON.parse(savedDeposits))
    }
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "rejected":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Deposit History</h1>
            <p className="text-sm text-gray-400">Track your deposit requests</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {deposits.length > 0 ? (
          <div className="space-y-4">
            {deposits.map((deposit) => (
              <Card key={deposit.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">${deposit.amount} USD</p>
                      <p className="text-sm text-gray-400">{deposit.coin.toUpperCase()} Deposit</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getStatusColor(deposit.status)}`}>
                        {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                      </p>
                      <p className="text-xs text-gray-400">{deposit.createdAt}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 break-all">Wallet: {deposit.walletAddress}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-xl font-bold mb-2">No Deposits Yet</h2>
            <p className="text-gray-400 mb-6">Your deposit history will appear here.</p>
            <Link href="/deposit">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Make First Deposit</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
