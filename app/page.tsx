"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-[#09101D] to-[#0F1A29] text-white p-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
         <h1 className="text-4xl font-bold mb-4">YouApp</h1>
         <p className="text-gray-300">Discover your match. Know yourself better.</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl"
        >
          <div className="flex flex-col space-y-4">
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#5ECFFF] text-white font-medium rounded-lg shadow-lg shadow-[#5ECFFF]/20 hover:bg-[#4BBDEE] transition-colors"
              >
                Login
              </motion.button>
            </Link>
            
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-transparent border border-[#5ECFFF] text-[#5ECFFF] font-medium rounded-lg hover:bg-[#5ECFFF]/10 transition-colors"
              >
                Register
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

