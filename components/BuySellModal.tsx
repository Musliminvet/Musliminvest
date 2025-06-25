"use client"

import type React from "react"

import { useState } from "react"
import { X, DollarSign, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvestment } from "@/contexts/InvestmentContext"

interface Investment {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  category: string
  isHalal: boolean
  description: string
  marketCap: string
  volume: string
}

interface BuySellModalProps {
  isOpen: boolean
  onClose: () => void
  investment: Investment
  type: "buy" | "sell"
  maxQuantity?: number
}

export function BuySellModal({ isOpen, onClose, investment, type, maxQuantity = 0 }: BuySellModalProps) {
  const [quantity, setQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { buyInvestment, sellInvestment, balance } = useInvestment()

  if (!isOpen) return null

  const numQuantity = Number.parseFloat(quantity) || 0
  const totalCost = numQuantity * investment.price
  const isBuy = type === "buy"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (numQuantity <= 0) {
      setError("Please enter a valid quantity")
      setIsLoading(false)
      return
    }

    if (isBuy && totalCost > balance) {
      setError("Insufficient balance")
      setIsLoading(false)
      return
    }

    if (!isBuy && numQuantity > maxQuantity) {
      setError(`You can only sell up to ${maxQuantity} shares`)
      setIsLoading(false)
      return
    }

    try {
      let result: boolean
      if (isBuy) {
        result = await buyInvestment(investment.symbol, numQuantity, investment.price)
      } else {
        result = await sellInvestment(investment.symbol, numQuantity, investment.price)
      }

      if (result) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setQuantity("")
        }, 2000)
      } else {
        setError(isBuy ? "Transaction failed. Insufficient funds." : "Transaction failed. Insufficient shares.")
      }
    } catch (err) {
      setError("Transaction failed. Please try again.")
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setQuantity("")
      setError("")
      setSuccess(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {isBuy ? "Buy" : "Sell"} {investment.symbol}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">Transaction Successful!</h3>
            <p className="text-gray-400">
              {isBuy ? "Purchased" : "Sold"} {numQuantity} shares of {investment.symbol}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Investment Info */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{investment.name}</span>
                <span className="text-yellow-400 font-bold">${investment.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Current Price</span>
                <span className={investment.change >= 0 ? "text-green-400" : "text-red-400"}>
                  {investment.change >= 0 ? "+" : ""}
                  {investment.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <Label htmlFor="quantity" className="text-white">
                Number of Shares
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                max={!isBuy ? maxQuantity : undefined}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
                disabled={isLoading}
                required
              />
              {!isBuy && maxQuantity > 0 && <p className="text-xs text-gray-400 mt-1">Maximum: {maxQuantity} shares</p>}
            </div>

            {/* Order Summary */}
            {numQuantity > 0 && (
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <h4 className="text-white font-medium">Order Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shares</span>
                  <span className="text-white">{numQuantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price per share</span>
                  <span className="text-white">${investment.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-600 pt-2">
                  <span className="text-gray-400">Total {isBuy ? "Cost" : "Proceeds"}</span>
                  <span className="text-white font-semibold">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Balance Info */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{isBuy ? "Available Balance" : "Shares Owned"}</span>
              <span className="text-white">{isBuy ? `$${balance.toFixed(2)}` : `${maxQuantity} shares`}</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || numQuantity <= 0}
                className={`flex-1 ${
                  isBuy ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <DollarSign size={16} className="mr-2" />
                    {isBuy ? "Buy Shares" : "Sell Shares"}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
