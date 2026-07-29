'use client'

import { AgentStatus, AgentConfig } from '../types'
import { 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Loader2, 
  Clock,
  Play,
  Briefcase,
  Calendar,
  FileText,
  Users,
  Mail
} from 'lucide-react'

const AGENT_CONFIGS: Record<string, AgentConfig> = {
  morning_briefing: {
    id: 'morning_briefing',
    name: 'Morning Briefing',
    description: 'Daily summary of calendar, emails, and priorities',
    icon: 'calendar',
    defaultSchedule: '0 7 * * 1-5',
  },
  jobs_digest: {
    id: 'jobs_digest',
    name: 'Jobs Digest',
    description: 'Aggregates and scores job listings from multiple sources',
    icon: 'briefcase',
    defaultSchedule: '30 7 * * *',
  },
  weekly_review: {
    id: 'weekly_review',
    name: 'Weekly Review',
    description: 'Comprehensive review of the week from your tracker',
    icon: 'filetext',
    defaultSchedule: '0 18 * * 0',
  },
  networking_prep: {
    id: 'networking_prep',
    name: 'Networking Prep',
    description: 'Research people and generate talking points',
    icon: 'users',
    defaultSchedule: null,
  },
  resume_agent: {
    id: 'resume_agent',
    name: 'Resume Agent',
    description: 'Tailor resume and cover letter to job descriptions',
    icon: 'mail',
    defaultSchedule: null,
  },
}

const ICON_MAP: Record<string, React.ReactNode> = {
  calendar: <Calendar className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  filetext: <FileText className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
}

const STATUS_STYLES = {
  success: { 
    bar: 'from-emerald-500 to-emerald-400',
    badge: 'text-emerald-700 bg-emerald-50',
    iconBg: 'from-emerald-500 to-emerald-400',
    label: 'SUCCESS'
  },
  failed: { 
    bar: 'from-red-500 to-red-400',
    badge: 'text-red-700 bg-red-50',
    iconBg: 'from-red-500 to-red-400',
    label: 'FAILED'
  },
  paused: { 
    bar: 'from-slate-400 to-slate-300',
    badge: 'text-slate-600 bg-slate-100',
    iconBg: 'from-slate-400 to-slate-300',
    label: 'PAUSED'
  },
  running: { 
    bar: 'from-rose-500 to-rose-400',
    badge: 'text-rose-700 bg-rose-50',
    iconBg: 'from-rose-500 to-rose-400',
    label: 'RUNNING'
  },
  idle: { 
    bar: 'from-slate-400 to-slate-300',
    badge: 'text-slate-600 bg-slate-100',
    iconBg: 'from-slate-400 to-slate-300',
    label: 'IDLE'
  },
  scheduled: { 
    bar: 'from-sky-500 to-sky-400',
    badge: 'text-sky-700 bg-sky-50',
    iconBg: 'from-sky-500 to-sky-400',
    label: 'SCHEDULED'
  },
}

interface AgentCardProps {
  agentId: string
  agentStatus: AgentStatus
  timezone: string
  onRunNow: () => void
  onToggle: () => void
}

export default function AgentCard({ agentId, agentStatus, timezone, onRunNow, onToggle }: AgentCardProps) {
  const config = AGENT_CONFIGS[agentId]
  if (!config) return null

  const style = STATUS_STYLES[agentStatus.status] || STATUS_STYLES.idle
  const isOnDemand = !config.defaultSchedule

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5">
      <div className={`h-1 w-full bg-gradient-to-r ${style.bar}`} />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center text-white shadow-sm`}>
              {ICON_MAP[config.icon]}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight">{config.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{config.description}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${style.badge}`}>
            {style.label}
          </span>
        </div>

        <div className="space-y-1.5 mb-5 min-h-[52px]">
          {agentStatus.last_run && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last: {new Date(agentStatus.last_run).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone })}</span>
            </div>
          )}
          {agentStatus.next_run && agentStatus.status !== 'paused' && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Next: {new Date(agentStatus.next_run).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone })}</span>
            </div>
          )}
          {agentStatus.output_summary && (
            <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{agentStatus.output_summary}</p>
          )}
          {agentStatus.error && (
            <p className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded-lg border border-red-100">{agentStatus.error}</p>
          )}
        </div>

        <div className="flex gap-2">
          {isOnDemand ? (
            <button
              onClick={onRunNow}
              className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              {agentId === 'networking_prep' ? 'Prepare' : 'Tailor Resume'}
            </button>
          ) : (
            <>
              <button
                onClick={onRunNow}
                disabled={agentStatus.status === 'running'}
                className="flex-1 py-2 px-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:hover:bg-blue-900 rounded-xl text-xs font-semibold text-white transition-all shadow-sm shadow-blue-900/20"
              >
                {agentStatus.status === 'running' ? 'Running...' : 'Run Now'}
              </button>
              <button
                onClick={onToggle}
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 transition-all"
              >
                {agentStatus.status === 'paused' ? 'Resume' : 'Pause'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
