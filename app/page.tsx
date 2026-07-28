'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardStore } from '../stores/dashboard'
import { Zap, ArrowRight, Download } from 'lucide-react'

export default function TokenEntry() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const setToken = useDashboardStore((s) => s.setToken)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const token = input.startsWith('eos_') ? input : `eos_${input}`
    
    if (!/^eos_[a-zA-Z0-9]{20,32}$/.test(token)) {
      setError('Invalid token format. It should look like eos_abc123...')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/status?token=${token}`)
      const data = await res.json()
      
      if (data.error) {
        setError('Token not found. Make sure your desktop app is running.')
        setLoading(false)
        return
      }

      setToken(token)
      router.push('/dashboard')
    } catch {
      setError('Connection failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0f1a]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e94560]/10 mb-6">
            <Zap className="w-8 h-8 text-[#e94560]" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-[#e8e8f0]">EfficientOS</h1>
          <p className="text-[#8b8ba7]">Your AI operations team dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8b8ba7] mb-2">
              Enter your sync token
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="eos_abc123xyz..."
              className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#2d2d4a] rounded-xl text-[#e8e8f0] placeholder-[#4a4a6a] focus:outline-none focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560] transition-all font-mono text-sm"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-[#e74c3c]">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || input.length < 10}
            className="w-full py-3 bg-[#e94560] hover:bg-[#d13a54] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Connect Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#8b8ba7] mb-3">Don't have a token?</p>
          <a
            href="https://efficientos.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#e94560] hover:text-[#ff6b81] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download the desktop app first
          </a>
        </div>
      </div>
    </div>
  )
}
