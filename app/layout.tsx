import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { InvestmentProvider } from "@/contexts/InvestmentContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Muslim Invest - Halal Investment Platform",
  description: "Halal Investment Platform for Muslim investors",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InvestmentProvider>
          <div className="min-h-screen bg-black">{children}</div>
        </InvestmentProvider>
      </body>
    </html>
  )
}
