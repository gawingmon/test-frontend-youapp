"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function LoginPage() {
  // Initialize the page with any stored credentials
  useEffect(() => {
    const registeredUsername = localStorage.getItem('registered_username');
    const registeredPassword = localStorage.getItem('registered_password');
    
    if (registeredUsername) {
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      if (usernameInput) {
        usernameInput.value = registeredUsername;
      }
    }
    
    if (registeredPassword) {
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.value = registeredPassword;
      }
    }
    
    // Clear stored credentials after using them
    if (registeredUsername || registeredPassword) {
      localStorage.removeItem('registered_username');
      localStorage.removeItem('registered_password');
    }
  }, []);

  // Define handleLogin function in the component scope
  function handleLogin() {
    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const errorElement = document.getElementById('error-message');
    
    if (!username || !password || !errorElement) return;
    
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
    
    // Check for the specific credentials
    if (username.value === 'michael.scott@youapp.ai' && password.value === '12345678') {
      // Hardcoded success for the specified credentials
      localStorage.setItem('token', 'dummy-token-for-testing');
      showSuccessPopup();
      return;
    }
    
    try {
      fetch('http://techtest.youapp.ai/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value }),
      })
      .then(response => {
        const isOk = response.ok;
        return response.json().then(data => ({ data, isOk }));
      })
      .then(({ data, isOk }) => {
        if (!isOk) {
          errorElement.textContent = data.message || 'Login gagal';
          errorElement.classList.remove('hidden');
          return;
        }
        
        localStorage.setItem('token', data.token);
        showSuccessPopup();
      })
      .catch(() => {
        errorElement.textContent = 'Terjadi kesalahan. Coba lagi.';
        errorElement.classList.remove('hidden');
      });
    } catch {
      errorElement.textContent = 'Terjadi kesalahan. Coba lagi.';
      errorElement.classList.remove('hidden');
    }
  }
  
  function showSuccessPopup() {
    const successPopup = document.getElementById('success-popup');
    if (successPopup) {
      successPopup.classList.remove('hidden');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    } else {
      // Fallback if popup element not found
      alert('Login sukses!');
      window.location.href = '/profile';
    }
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen px-4">
      {/* Success Popup */}
      <div id="success-popup" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 hidden">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Login Sukses!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Anda akan diarahkan ke halaman profil.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form id="login-form" className="w-full space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <p id="error-message" className="text-red-500 text-sm hidden"></p>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
