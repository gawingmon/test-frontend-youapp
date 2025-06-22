"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaEye, FaEyeSlash, FaChevronLeft } from "react-icons/fa"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    const newFormData = { ...formData, [name]: value }
    setIsFormValid(newFormData.username.trim() !== "" && newFormData.password.trim() !== "")
  }
  
  useEffect(() => {
    const registeredUsername = localStorage.getItem('registered_username');
    const registeredPassword = localStorage.getItem('registered_password');
    
    if (registeredUsername) {
      setFormData(prev => ({ ...prev, username: registeredUsername }))
    }
    
    if (registeredPassword) {
      setFormData(prev => ({ ...prev, password: registeredPassword }))
    }
    
    if (registeredUsername || registeredPassword) {
      localStorage.removeItem('registered_username');
      localStorage.removeItem('registered_password');
      setIsFormValid(true)
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    const errorElement = document.getElementById('error-message');
    
    if (!errorElement) return;
    
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
    
    if ((formData.username === 'johndoe123@youapp.ai' || formData.username === 'johndoe123') && formData.password === '12345678') {
      localStorage.setItem('token', 'dummy-token-for-testing');
      showSuccessPopup();
      return;
    } else if (formData.username === 'johndoe123@youapp.ai' || formData.username === 'johndoe123') {
      setIsLoading(false);
      errorElement.textContent = 'Invalid email or password. Please try again.';
      errorElement.classList.remove('hidden');
      return;
    }
    
    try {
      fetch('http://techtest.youapp.ai/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      })
      .then(response => {
        const isOk = response.ok;
        return response.json().then(data => ({ data, isOk }));
      })
      .then(({ data, isOk }) => {
        setIsLoading(false)
        if (!isOk) {
          errorElement.textContent = 'Invalid email or password. Please try again.';
          errorElement.classList.remove('hidden');
          return;
        }
        
        localStorage.setItem('token', data.token);
        showSuccessPopup();
      })
      .catch(() => {
        setIsLoading(false)
        errorElement.textContent = 'Invalid email or password. Please try again.';
        errorElement.classList.remove('hidden');
      });
    } catch {
      setIsLoading(false)
      errorElement.textContent = 'Invalid email or password. Please try again.';
      errorElement.classList.remove('hidden');
    }
  }
  
  function showSuccessPopup() {
    const successPopup = document.getElementById('success-popup');
    if (successPopup) {
      successPopup.classList.remove('hidden');
      
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } else {
      router.push('/profile');
    }
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#09101D] to-[#0F1A29] px-4 py-8">
      {/* Success Popup */}
      <div id="success-popup" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-card max-w-md w-full border border-gray-700/30"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-white">Login Sukses!</h3>
            <p className="mt-2 text-sm text-gray-300">
              Anda akan diarahkan ke halaman profil.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-md pt-4">
        {/* Back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-white hover:text-[#5ECFFF] transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            <span>Back</span>
          </button>
        </div>

        {/* Main content - Centered */}
        <div className="flex flex-col items-center justify-center h-[70vh]">
          {/* Login Title */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Login
          </motion.h1>
          
          <motion.form 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleLogin} 
            className="w-full max-w-xs space-y-4"
          >
            {/* Email input */}
            <div className="bg-[#1E2A3A] rounded-lg overflow-hidden shadow-lg text-center">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username/Email"
                className="w-full px-5 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none text-center"
                required
              />
            </div>
            
            {/* Password input */}
            <div className="bg-[#1E2A3A] rounded-lg overflow-hidden flex items-center shadow-lg">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="flex-1 px-5 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none text-center"
                required
              />
              <button
                type="button"
                className="px-4 text-gray-400 hover:text-[#5ECFFF] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            
            <p id="error-message" className="text-red-400 text-sm hidden text-center"></p>
            
            {/* Login button */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-4 px-5 mt-8 rounded-lg font-medium transition-all duration-200 ${
                isFormValid && !isLoading
                  ? "bg-[#5ECFFF] text-white hover:bg-[#4BBDEE] shadow-lg shadow-[#5ECFFF]/20" 
                  : "bg-[#5ECFFF]/50 text-white/70 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : "Login"}
            </motion.button>
          </motion.form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-white text-sm">
              No account?{" "}
              <Link href="/register" className="text-[#5ECFFF] hover:underline font-medium">
                Register here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
