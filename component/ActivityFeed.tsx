'use client'

import { HistoryEntry } from '@/types'
import { CheckCircle2, XCircle, PauseCircle } from 'lucide-react'

const STATUS_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" />,
  failed: <XCircle className="w-4 h-4 text-[#e74c3c]" />,
  paused: <PauseCircle className="w-4 h-4 text-[#8b8ba7]" />,
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
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2d2d4a] bg-[#1a1a2e] p-6">
        <h3 className="font-semibold text-[#e8e8f0] mb-4">Recent Activity</h3>
        <p className="text-sm text-[#8b8ba7]">No activity yet. Your agents will appear here once they run.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#2d2d4a] bg-[#1a1a2e] p-6">
      <h3 className="font-semibold text-[#e8e8f0] mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {history.slice(0, 10).map((entry, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-[#2d2d4a]/50 last:border-0">
            <div className="mt-0.5">
              {STATUS_ICONS[entry.status] || STATUS_ICONS.success}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#e8e8f0]">
                <span className="font-medium">{AGENT_NAMES[entry.agent] || entry.agent}</span>
                {' — '}{entry.summary}
              </p>
              <p className="text-xs text-[#8b8ba7] mt-0.5">
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
        ))}
      </div>
    </div>
  )
}
