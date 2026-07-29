'use client'

import { useRouter } from 'next/navigation'
import { useDashboardStore } from '../../stores/dashboard'
import { ArrowLeft, Download, Trash2, Settings, User, Shield } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { status, clearToken } = useDashboardStore()

  const handleExport = () => {
    if (!status) return
    const blob = new Blob([JSON.stringify(status, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `efficientos-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Connected Accounts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-blue-900" />
            <h2 className="font-semibold text-slate-900">Connected Accounts</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">Google</p>
                <p className="text-xs text-slate-400 mt-0.5">{status?.settings?.email || 'Not connected'}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-blue-900" />
            <h2 className="font-semibold text-slate-900">Data & Privacy</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all text-left"
            >
              <Download className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Export my data</p>
                <p className="text-xs text-slate-400">Download all your status data as JSON</p>
              </div>
            </button>
            
            <button
              onClick={() => {
                if (confirm('This will disconnect your dashboard. Your desktop app will keep running.')) {
                  clearToken()
                  router.push('/')
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl transition-all text-left"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700">Disconnect dashboard</p>
                <p className="text-xs text-red-400">Remove this device from your account</p>
              </div>
            </button>
          </div>
          
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Your data never leaves your computer except for status metadata (timestamps, agent states).
            We cannot read your emails, calendar, or job applications.
          </p>
        </div>
      </main>
    </div>
  )
}
