'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardStore } from '../../stores/dashboard'
import AgentCard from '../../components/AgentCard'
import DesktopStatusBar from '../../components/DesktopStatusBar'
import ActivityFeed from '../../components/ActivityFeed'

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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Overview
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Time Tracker
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Projects
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Planner
          </button>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider px-3 mb-2">INSIGHTS</p>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              AI Insights
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Analytics
            </button>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <button onClick={() => router.push('/settings')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.09 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.09 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.09a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.91 9a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </button>
            <button onClick={clearToken} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-[13px] font-medium hover:bg-slate-50 transition-colors w-full text-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line
