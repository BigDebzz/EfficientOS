'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('eos_token')
    if (!saved) {
      router.push('/')
      return
    }
    setToken(saved)
  }, [router])

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0]">
      <header className="border-b border-[#2d2d4a] bg-[#1a1a2e]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">EfficientOS</h1>
          <button
            onClick={() => {
              localStorage.removeItem('eos_token')
              router.push('/')
            }}
            className="text-sm text-[#8b8ba7] hover:text-[#e94560] transition-colors"
          >
            Disconnect
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-[#2d2d4a] bg-[#1a1a2e] p-6">
          <h2 className="font-semibold mb-2">Dashboard Connected</h2>
          <p className="text-sm text-[#8b8ba7]">Token: {token.slice(0, 12)}...</p>
          <p className="text-sm text-[#8b8ba7] mt-4">Agent cards will appear here in the next commit.</p>
        </div>
      </main>
    </div>
  )
}
