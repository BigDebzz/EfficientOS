'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardStore } from '../../stores/dashboard'
import AgentCard from '../../components/AgentCard'
import DesktopStatusBar from '../../components/DesktopStatusBar'
import ActivityFeed from '../../components/ActivityFeed'
import { LayoutGrid, Clock, FolderOpen, Pencil, Box, BarChart3, Settings, LogOut } from 'lucide-react'

const MOCK_STATUS = {
  sync_token: 'eos_demo',
  last_updated: new Date().toISOString(),
  desktop: {
    version: '1.0.0',
    platform: 'demo',
    python_version: '3.11',
  },
  agents: {
    morning_briefing: {
      status: 'success',
      last_run: new Date(Date.now() - 3600000).toISOString(),
      next_run: new Date(Date.now() + 3600000 * 6).toISOString(),
      schedule: '0 7 * * 1-5',
      output_summary: '3 meetings today. 2 emails flagged urgent. 1 deadline approaching.',
      error: null,
      jobs_found: null,
      high_priority: null,
    },
    jobs_digest: {
      status: 'scheduled',
      last_run: new Date(Date.now() - 86400000).toISOString(),
      next_run: new Date(Date.now() + 3600000 * 2).toISOString(),
      schedule: '30 7 * * *',
      output_summary: '5 new jobs matched your profile. 2 are high priority.',
      error: null,
      jobs_found: 5,
      high_priority: 2,
    },
    weekly_review: {
      status: 'idle',
      last_run: new Date(Date.now() - 86400000 * 3).toISOString(),
      next_run: new Date(Date.now() + 86400000 * 4).toISOString(),
      schedule: '0 18 * * 0',
      output_summary: null,
      error: null,
      jobs_found: null,
      high_priority: null,
    },
    networking_prep: {
      status: 'idle',
      last_run: null,
      next_run: null,
      schedule: null,
      output_summary: null,
      error: null,
      jobs_found: null,
      high_priority: null,
    },
    resume_agent: {
      status: 'idle',
      last_run: null,
      next_run: null,
      schedule: null,
      output_summary: null,
      error: null,
      jobs_found: null,
      high_priority: null,
    },
  },
  history: [
    {
      agent: 'morning_briefing',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success',
      summary: 'Briefing sent to your email with 3 meetings and 2 urgent items',
    },
    {
      agent: 'jobs_digest',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'success',
      summary: 'Found 5 jobs — 2 high priority matches',
    },
    {
      agent: 'weekly_review',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'success',
      summary: 'Weekly summary generated with productivity insights',
    },
  ],
  settings: {
    timezone: 'Africa/Lagos',
    email: 'demo@efficientos.dev',
    active_agents: ['morning_briefing', 'jobs_digest', 'weekly_review', 'networking_prep', 'resume_agent'],
  },
}

export default function Dashboard() {
  const router = useRouter()
  const { token, status, isLoading, fetchStatus, clearToken, sendCommand } = useDashboardStore()

  const isDemo = token === 'eos_demo'

  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }
    if (isDemo) return
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [token, router, fetchStatus, isDemo])

  const handleRunNow = (agentId: string) => {
    if (isDemo) {
      alert('This is a demo. Run Now is disabled. Download the desktop app to use real agents.')
      return
    }
    sendCommand({ type: 'run_agent', agent: agentId })
  }

  const handleToggle = (agentId: string) => {
    if (isDemo) {
      alert('This is a demo. Pause/Resume is disabled. Download the desktop app to control real agents.')
      return
    }
    const agent = status?.agents?.[agentId]
    if (!agent) return
    sendCommand({
      type: agent.status === 'paused' ? 'resume_agent' : 'pause_agent',
      agent: agentId,
    })
  }

  if (!token) return null

  const displayStatus = isDemo ? MOCK_STATUS : status

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col p-4 z-50">
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

      <main className="flex-1 ml-60 p-7">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isDemo ? 'Demo Mode' : 'Welcome back!'}
            </h2>
            <p className="text-[13px] text-slate-400 mt-1">
              {isDemo 
                ? 'This is a preview with sample data. No real agents are running.' 
                : 'Your AI operations team is ready for today\'s tasks.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                DEMO
              </span>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-[13px] text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-white text-[13px] font-semibold shadow-sm">
              {isDemo ? 'DE' : 'DA'}
            </div>
          </div>
        </div>

        {!isDemo && <DesktopStatusBar />}

        {isLoading && !isDemo && !status && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {displayStatus && (
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Agents</h3>
                <p className="text-[13px] text-slate-400 mt-0.5">{Object.keys(displayStatus.agents).length} agents running on your desktop</p>
              </div>
              <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
                {Object.keys(displayStatus.agents).length} active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Object.entries(displayStatus.agents).map(([agentId, agentStatus]) => (
                <AgentCard
                  key={agentId}
                  agentId={agentId}
                  agentStatus={agentStatus as any}
                  timezone={displayStatus.settings.timezone}
                  onRunNow={() => handleRunNow(agentId)}
                  onToggle={() => handleToggle(agentId)}
                />
              ))}
            </div>

            <ActivityFeed 
              history={displayStatus.history} 
              timezone={displayStatus.settings.timezone} 
            />
          </div>
        )}
      </main>
    </div>
  )
}
