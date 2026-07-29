'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardStore } from '../../stores/dashboard'
import AgentCard from '../../components/AgentCard'
import DesktopStatusBar from '../../components/DesktopStatusBar'
import ActivityFeed from '../../components/ActivityFeed'
import { LayoutGrid, Clock, FolderOpen, Pencil, Box, BarChart3, Settings, LogOut } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const { token, status, isLoading, fetchStatus, clearToken, sendCommand } = useDashboardStore()

  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [token, router, fetchStatus])

  const handleRunNow = (agentId: string) => {
    sendCommand({ type: 'run_agent', agent: agentId })
  }

  const handleToggle = (agentId: string) => {
    const agent = status?.agents?.[agentId]
    if (!agent) return
    sendCommand({
      type: agent.status === 'paused' ? 'resume_agent' : 'pause_agent',
      agent: agentId,
    })
  }

  if (!token) return null

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col p-4 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 pb-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center relative shadow-sm">
            <span className="text-white text-lg font-bold font-serif">e</span>
            <div className="absolute bottom-1.5 w-4 h-0.5 bg-yellow-400 rounded-full" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-slate-900 leading-none">EfficientOS</h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 tracking-wide">DASHBOARD</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-5 flex flex-col gap-1 flex-1">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-900 text-[13px] font-semibold">
            <LayoutGrid className="w-[18px] h-[18px]" />
            Overview
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <Clock className="w-[18px] h-[18px]" />
            Time Tracker
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <FolderOpen className="w-[18px] h-[18px]" />
            Projects
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <Pencil className="w-[18px] h-[18px]" />
            Planner
          </button>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider px-3 mb-2">INSIGHTS</p>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <Box className="w-[18px] h-[18px]" />
              AI Insights
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <BarChart3 className="w-[18px] h-[18px]" />
              Analytics
            </button>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <button onClick={() => router.push('/settings')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <Settings className="w-[18px] h-[18px]" />
              Settings
            </button>
            <button onClick={clearToken} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <LogOut className="w-[18px] h-[18px]" />
              Disconnect
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 p-7">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back!</h2>
            <p className="text-[13px] text-slate-400 mt-1">Your AI operations team is ready for today&apos;s tasks.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-[13px] text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-white text-[13px] font-semibold shadow-sm">
              DA
            </div>
          </div>
        </div>

        <DesktopStatusBar />

        {isLoading && !status && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status && (
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Agents</h3>
                <p className="text-[13px] text-slate-400 mt-0.5">{Object.keys(status.agents).length} agents running on your desktop</p>
              </div>
              <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
                {Object.keys(status.agents).length} active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Object.entries(status.agents).map(([agentId, agentStatus]) => (
                <AgentCard
                  key={agentId}
                  agentId={agentId}
                  agentStatus={agentStatus}
                  timezone={status.settings.timezone}
                  onRunNow={() => handleRunNow(agentId)}
                  onToggle={() => handleToggle(agentId)}
                />
              ))}
            </div>

            <ActivityFeed 
              history={status.history} 
              timezone={status.settings.timezone} 
            />
          </div>
        )}
      </main>
    </div>
  )
}
