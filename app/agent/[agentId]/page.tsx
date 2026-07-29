'use client'

import { useParams, useRouter } from 'next/navigation'
import { useDashboardStore } from '../../../stores/dashboard'
import { ArrowLeft, Play, Pause } from 'lucide-react'

export default function AgentDetail() {
  const params = useParams()
  const router = useRouter()
  const { status, sendCommand } = useDashboardStore()
  const agentId = params.agentId as string
  
  const agent = status?.agents?.[agentId]
  
  const names: Record<string, string> = {
    morning_briefing: 'Morning Briefing',
    jobs_digest: 'Jobs Digest',
    weekly_review: 'Weekly Review',
    networking_prep: 'Networking Prep',
    resume_agent: 'Resume Agent',
  }

  const descriptions: Record<string, string> = {
    morning_briefing: 'Daily summary of calendar, emails, and priorities',
    jobs_digest: 'Aggregates and scores job listings from multiple sources',
    weekly_review: 'Comprehensive review of the week from your tracker',
    networking_prep: 'Research people and generate talking points',
    resume_agent: 'Tailor resume and cover letter to job descriptions',
  }

  if (!agent || !status) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Agent not found</p>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    success: 'bg-emerald-500',
    failed: 'bg-red-500',
    running: 'bg-rose-500 animate-pulse',
    paused: 'bg-slate-400',
    idle: 'bg-slate-400',
    scheduled: 'bg-sky-500',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{names[agentId] || agentId}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {descriptions[agentId] || ''} • {agent.schedule ? `Runs: ${agent.schedule}` : 'On demand'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-3 h-3 rounded-full ${statusColors[agent.status] || 'bg-slate-400'}`} />
            <span className="font-semibold text-slate-900 capitalize">{agent.status}</span>
          </div>
          
          {agent.last_run && (
            <p className="text-sm text-slate-500 mb-2">
              Last run: {new Date(agent.last_run).toLocaleString('en-US', { timeZone: status.settings.timezone })}
            </p>
          )}
          {agent.next_run && (
            <p className="text-sm text-slate-500 mb-2">
              Next run: {new Date(agent.next_run).toLocaleString('en-US', { timeZone: status.settings.timezone })}
            </p>
          )}
          {agent.error && (
            <p className="text-sm text-red-600 mt-4 p-3 bg-red-50 rounded-xl border border-red-100">{agent.error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => sendCommand({ type: 'run_agent', agent: agentId })}
            className="flex-1 py-3 bg-blue-900 hover:bg-blue-800 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run Now
          </button>
          <button
            onClick={() => sendCommand({ 
              type: agent.status === 'paused' ? 'resume_agent' : 'pause_agent', 
              agent: agentId 
            })}
            className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium text-slate-700 transition-all flex items-center justify-center gap-2"
          >
            {agent.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {agent.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
        </div>

        {/* Output */}
        {agent.output_summary && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Last Output</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{agent.output_summary}</p>
          </div>
        )}
      </main>
    </div>
  )
}
