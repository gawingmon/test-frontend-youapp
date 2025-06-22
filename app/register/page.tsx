"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getHoroscope, getZodiac } from "@/lib/zodiac"
import Button from "../components/Button"
import { FaEye, FaEyeSlash, FaChevronLeft } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    birthday: "",
    password: "",
    confirm_password: "",
    height: "",
    weight: ""
  })
  
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const isFormValid = () => {
    return (
      formData.username.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.full_name.trim() !== "" &&
      formData.birthday !== "" &&
      formData.password.length >= 8 &&
      formData.confirm_password === formData.password &&
      formData.height !== "" &&
      formData.weight !== ""
    )
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    if (formData.password !== formData.confirm_password) {
      setError("Password dan konfirmasi password tidak cocok")
      setLoading(false)
      return
    }
    
    try {
      const horoscope = getHoroscope(formData.birthday)
      const zodiac = getZodiac(formData.birthday)
      
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        birthday: formData.birthday,
        password: formData.password,
        confirm_password: formData.confirm_password,
        height: Number(formData.height) || 0,
        weight: Number(formData.weight) || 0,
        horoscope,
        zodiac
      }
      
      console.log('Registration payload with horoscope and zodiac:', payload)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Registration payload:', payload)
        
        setShowSuccess(true)
        localStorage.setItem("registered_username", payload.username)
        localStorage.setItem("registered_password", payload.password)
        
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
        return
      }
      
      const res = await fetch("http://techtest.youapp.ai/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Registrasi gagal")
      }
      
      setShowSuccess(true)
      
      localStorage.setItem("registered_username", payload.username)
      localStorage.setItem("registered_password", payload.password)
      
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }
  
  const previewHoroscopeZodiac = () => {
    if (!formData.birthday) return null;
    
    const horoscope = getHoroscope(formData.birthday);
    const zodiac = getZodiac(formData.birthday);
    
    return (
      <div className="mt-1 text-xs text-youapp-text-secondary">
        Based on your birthday, your horoscope is <span className="text-youapp-primary">{horoscope}</span> and zodiac is <span className="text-youapp-primary">{zodiac}</span>
      </div>
    );
  };
  
  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-8 bg-gradient-to-b from-[#09101D] via-[#131F30] to-[#1D293B]">
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-card max-w-md w-full border border-gray-700/30">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-youapp-text-primary">Register Sukses!</h3>
              <p className="mt-2 text-sm text-youapp-text-secondary">
                Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login.
              </p>
              <div className="mt-4">
                <Button 
                  onClick={() => window.location.href = "/login"}
                  variant="secondary"
                  fullWidth
                  rounded="full"
                >
                  Ke Halaman Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md pt-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-white hover:text-[#5ECFFF] transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            <span>Back</span>
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <div className="text-youapp-text-primary text-3xl font-bold font-youapp">YouApp</div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-card p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-youapp-text-primary text-center mb-8">Register</h1>
          
          {error && (
            <div className="bg-red-900/30 text-red-400 p-4 rounded-full mb-6 border border-red-800/50">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                required
                pattern="[a-zA-Z0-9._-]+"
                title="Username can contain letters, numbers, dots, underscores, and hyphens"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                required
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                Birthday
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                required
              />
              {formData.birthday && previewHoroscopeZodiac()}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-youapp-text-secondary hover:text-youapp-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                  required
                  minLength={8}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-youapp-text-secondary hover:text-youapp-primary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                  required
                  min="0"
                  placeholder="Height"
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-youapp-text-secondary mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-black/30 border border-gray-700/50 rounded-full text-youapp-text-primary placeholder-youapp-text-muted focus:outline-none focus:ring-2 focus:ring-youapp-primary focus:border-transparent transition-all duration-250"
                  required
                  min="0"
                  placeholder="Weight"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              fullWidth
              rounded="full"
              className="mt-4"
            >
              {loading ? "Processing..." : "Register"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-amber-400 text-sm">
              Have an account?{" "}
              <Link href="/login" className="text-amber-400 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
