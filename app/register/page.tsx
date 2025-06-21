"use client"

import { useState } from "react"
import Link from "next/link"
import { getHoroscope, getZodiac } from "@/lib/zodiac"

export default function RegisterPage() {
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
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
      <div className="mt-1 text-xs text-gray-600">
        Based on your birthday, your horoscope is {horoscope} and zodiac is {zodiac}
      </div>
    );
  };
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Register Sukses!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.href = "/login"}
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ke Halaman Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              pattern="[a-zA-Z0-9._-]+"
              title="Username can contain letters, numbers, dots, underscores, and hyphens"
            />
            
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formData.birthday && previewHoroscopeZodiac()}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
            />
          </div>
          
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-medium rounded-md ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
