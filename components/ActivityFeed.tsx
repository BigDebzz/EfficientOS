'use client'

import { HistoryEntry } from '../types'
import { CheckCircle2, XCircle, PauseCircle, ArrowRight } from 'lucide-react'

const STATUS_STYLES: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  success: { 
    icon: <CheckCircle2 className="w-4 h-4" />, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50' 
  },
  failed: { 
    icon: <XCircle className="w-4 h-4" />, 
    color: 'text-red-600', 
    bg: 'bg-red-50' 
  },
  paused: { 
    icon: <PauseCircle className="w-4 h-4" />, 
    color: 'text-slate-500', 
    bg: 'bg-slate-100' 
  },
}

const AGENT_NAMES: Record<string, string> = {
  morning_briefing: 'Morning Briefing',
  jobs_digest: 'Jobs Digest',
  weekly_review: 'Weekly Review',
  networking_prep: 'Networking Prep',
  resume_agent: 'Resume Agent',
}

interface ActivityFeedProps {
  history: HistoryEntry[]
  timezone: string
}

export default function ActivityFeed({ history, timezone }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm">Recent Activity</h3>
        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-full">
          {history?.length || 0} events
        </span>
      </div>
      
      {!history || history.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 font-medium">No activity yet</p>
          <p className="text-xs text-slate-400 mt-1">Your agents will appear here once they run</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {history.slice(0, 10).map((entry, i) => {
            const style = STATUS_STYLES[entry.status] || STATUS_STYLES.success
            return (
              <div key={i} className="px-6 py-3 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
                <div className={`mt-0.5 p-1.5 rounded-lg ${style.bg} ${style.color}`}>
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">{AGENT_NAMES[entry.agent] || entry.agent}</span>
                    <span className="text-slate-500"> — {entry.summary}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(entry.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZone: timezone,
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
