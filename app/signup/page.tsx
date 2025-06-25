"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!agreeToTerms) newErrors.terms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate sign up process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Store user session
    localStorage.setItem("userLoggedIn", "true")
    localStorage.setItem("userEmail", formData.email)
    localStorage.setItem("userName", `${formData.firstName} ${formData.lastName}`)

    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/" className="text-gray-400 hover:text-white mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-yellow-400">Create Account</h1>
          </div>

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <div className="text-lg">🌙⭐</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Join the Halal Investment Platform</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                required
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={agreeToTerms}
                onCheckedChange={setAgreeToTerms}
                className="border-gray-600 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 mt-1"
              />
              <Label htmlFor="agreeToTerms" className="text-white text-sm leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-yellow-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-yellow-400 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.terms && <p className="text-red-400 text-xs">{errors.terms}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 rounded-lg transition-all duration-200 mt-6"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/" className="text-yellow-400 hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
