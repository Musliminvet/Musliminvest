"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReferralPage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Referral Program</h1>
            <p className="text-sm text-gray-400">Invite friends and earn rewards</p>
          </div>
        </div>
      </header>

      <div className="p-6 text-center">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-bold mb-4">Refer Friends</h2>
        <p className="text-gray-400 mb-8">Invite your friends to join Muslim Invest and earn rewards together!</p>
        <Link href="/dashboard">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
