import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-4xl">🌙⭐</div>
        </div>
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
