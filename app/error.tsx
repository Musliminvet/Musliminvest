"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-4xl">⚠️</div>
        </div>
        <h1 className="text-4xl font-bold text-red-400 mb-4">Something went wrong!</h1>
        <p className="text-gray-400 mb-8 max-w-md">An unexpected error occurred. Please try again.</p>
        <div className="space-x-4">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
          >
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
