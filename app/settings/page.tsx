"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { safeLocalStorage } from "@/lib/utils"

export default function SettingsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storage = safeLocalStorage()
    const isLoggedIn = storage.getItem("userLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      const storage = safeLocalStorage()
      storage.clear()
      router.push("/")
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl animate-pulse">⚙️</div>
          </div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
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
            <h1 className="text-xl font-bold text-yellow-400">Settings</h1>
            <p className="text-sm text-gray-400">Manage your account</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
              Profile Settings
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
              Security Settings
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
              Notification Preferences
            </Button>
          </CardContent>
        </Card>

        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
