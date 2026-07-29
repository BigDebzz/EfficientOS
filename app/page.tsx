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
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 mb-6 relative shadow-lg">
            <span className="text-white text-2xl font-bold font-serif">e</span>
            <div className="absolute bottom-2 w-5 h-1 bg-yellow-400 rounded-full" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">EfficientOS</h1>
          <p className="text-slate-400 text-sm">Your AI operations team dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter your sync token
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="eos_abc123xyz..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all font-mono text-sm"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || input.length < 10}
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-900/20"
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
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400 mb-3">Don&apos;t have a token?</p>
          <a
            href="https://efficientos.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-900 hover:text-blue-700 font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download the desktop app first
          </a>
        </div>
      </div>
    </div>
  )
}
