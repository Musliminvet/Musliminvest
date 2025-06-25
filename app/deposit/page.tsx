"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Diamond, RotateCcw, Copy, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useInvestment } from "@/contexts/InvestmentContext"
import { isBrowser } from "@/utils/browser"

type DepositStep = "select-option" | "enter-details" | "payment-confirmation"
type PaymentMethod = "manual" | "automatic"
type CoinType = "btc" | "usdttrc20"

export default function DepositPage() {
  const router = useRouter()
  const { balance } = useInvestment()
  const [step, setStep] = useState<DepositStep>("select-option")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("manual")
  const [amount, setAmount] = useState("")
  const [selectedCoin, setSelectedCoin] = useState<CoinType>("btc")
  const [showCoinDropdown, setShowCoinDropdown] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [depositAmount, setDepositAmount] = useState("")

  useEffect(() => {
    if (!isBrowser()) return
    const isLoggedIn = localStorage.getItem("userLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [router])

  const walletAddresses = {
    btc: "bc1qg80rgcutu86vzl7pnldf0emn2da5a8m0zlc6jm",
    usdttrc20: "TA54uX5LMvdaRh2x6yxYEUJ3i7BSEsBe8p",
  }

  const coinOptions = [
    { value: "btc", label: "Bitcoin - btc" },
    { value: "usdttrc20", label: "Tether (USD) - usdttrc20" },
  ]

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep("enter-details")
  }

  const handleContinue = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }
    setStep("payment-confirmation")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPaymentProof(file)
    }
  }

  const calculateCryptoAmount = () => {
    const usdAmount = Number(amount)
    if (selectedCoin === "btc") {
      // Simulate BTC price calculation (example: $50 = 0.00047746 BTC)
      return (usdAmount / 105000).toFixed(8) // Assuming BTC price ~$105,000
    } else {
      // USDT is 1:1 with USD
      return usdAmount.toFixed(2)
    }
  }

  if (step === "select-option") {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="flex items-center justify-between p-4 pt-6">
          <div className="flex items-center space-x-3">
            <Diamond className="text-yellow-400" size={24} />
            <div className="bg-gray-800 rounded-full px-3 py-1 flex items-center space-x-2">
              <span className="text-gray-400 text-sm">PH</span>
              <span className="text-yellow-400 font-semibold">${balance.toFixed(0)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="border border-orange-500 text-orange-500 hover:bg-orange-500/10 rounded-lg"
          >
            <RotateCcw size={20} />
          </Button>
        </header>

        {/* Content */}
        <div className="px-4 pt-8">
          <h1 className="text-2xl font-bold text-white text-center mb-12">Select Payment Option</h1>

          <div className="grid grid-cols-2 gap-4">
            {/* Crypto Manual */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <div className="text-4xl text-orange-500">🪙</div>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Crypto(manual)</h3>
                  <p className="text-gray-400 text-sm mb-4">Requires manual verificati...</p>
                </div>
                <Button
                  onClick={() => handleSelectPaymentMethod("manual")}
                  className="w-full bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10"
                >
                  Select
                </Button>
              </CardContent>
            </Card>

            {/* Crypto Automatic */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <div className="text-4xl text-orange-500">🪙</div>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Crypto(automatic)</h3>
                  <p className="text-gray-400 text-sm mb-4">Instant</p>
                </div>
                <Button
                  onClick={() => handleSelectPaymentMethod("automatic")}
                  className="w-full bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "enter-details") {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Modal Overlay */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Pay with crypto</h2>
              <button onClick={() => setStep("select-option")} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Amount Input */}
              <div>
                <Label htmlFor="amount" className="text-white text-sm font-medium mb-2 block">
                  Amount (USD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to deposit"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>

              {/* Coin Selection */}
              <div>
                <Label className="text-white text-sm font-medium mb-2 block">Select Coin</Label>
                <div className="relative">
                  <button
                    onClick={() => setShowCoinDropdown(!showCoinDropdown)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-left text-white hover:bg-gray-700 flex items-center justify-between"
                  >
                    <span>{selectedCoin === "btc" ? "Bitcoin - btc" : "Tether (USD) - usdttrc20"}</span>
                    <ChevronDown size={20} className="text-gray-400" />
                  </button>

                  {showCoinDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md z-10">
                      {coinOptions.map((coin) => (
                        <button
                          key={coin.value}
                          onClick={() => {
                            setSelectedCoin(coin.value as CoinType)
                            setShowCoinDropdown(false)
                          }}
                          className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                        >
                          {coin.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                disabled={!amount || Number(amount) <= 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "payment-confirmation") {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="p-4">
          <button
            onClick={() => setStep("enter-details")}
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-400"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </header>

        {/* Content */}
        <div className="px-4 pt-8">
          <h1 className="text-2xl font-bold text-white text-center mb-8">Deposit (Crypto)</h1>

          {/* Send Amount */}
          <div className="text-center mb-8">
            <p className="text-white text-lg mb-2">Send exactly:</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white text-lg">
                {calculateCryptoAmount()} {selectedCoin === "btc" ? "btc" : "usdt"}
              </span>
              <button
                onClick={() => copyToClipboard(calculateCryptoAmount())}
                className="text-gray-400 hover:text-white"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="bg-gray-900 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm break-all">{walletAddresses[selectedCoin]}</span>
              <button
                onClick={() => copyToClipboard(walletAddresses[selectedCoin])}
                className="text-gray-400 hover:text-white ml-2 flex-shrink-0"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Upload Payment Proof */}
          <div className="mb-6">
            <h3 className="text-white text-lg mb-4">Upload Payment Proof</h3>
            <div className="border border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
              {paymentProof && <p className="text-green-400 text-sm mt-2">File uploaded: {paymentProof.name}</p>}
            </div>
          </div>

          {/* Note */}
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-2">
              <span className="text-red-400 text-sm">📝</span>
              <div>
                <p className="text-red-400 font-medium text-sm mb-1">Note</p>
                <p className="text-red-400 text-sm">
                  After sending the amount, take a screenshot of your payment proof and upload it for verification.
                </p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-lg">Amount</span>
            <span className="text-white text-lg font-semibold">${amount}</span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-lg">Status</span>
            <span className="text-red-400 text-lg">Action-needed</span>
          </div>

          {/* Created At */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-white text-lg">Created At</span>
            <span className="text-gray-400 text-lg">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>

          {/* Submit Button */}
          <Button
            onClick={() => {
              if (!paymentProof) {
                alert("Please upload payment proof")
                return
              }
              if (!isBrowser()) return
              alert("Deposit request submitted! We'll verify your payment and update your balance within 24 hours.")
              router.push("/dashboard")
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
          >
            Submit Deposit Request
          </Button>
        </div>
      </div>
    )
  }

  return null
}
