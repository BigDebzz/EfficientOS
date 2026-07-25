'use client';

import { AgentStatus, AgentConfig } from '@/types';
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
} from 'lucide-react';

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
};

const ICON_MAP: Record<string, React.ReactNode> = {
  calendar: <Calendar className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  filetext: <FileText className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
};

const STATUS_CONFIG = {
  success: { icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-[#2ecc71]', border: 'border-[#2ecc71]/30', bg: 'bg-[#2ecc71]/5', dot: 'bg-[#2ecc71]' },
  failed: { icon: <XCircle className="w-5 h-5" />, color: 'text-[#e74c3c]', border: 'border-[#e74c3c]/30', bg: 'bg-[#e74c3c]/5', dot: 'bg-[#e74c3c]' },
  paused: { icon: <PauseCircle className="w-5 h-5" />, color: 'text-[#8b8ba7]', border: 'border-[#2d2d4a]', bg: 'bg-transparent', dot: 'bg-[#8b8ba7]' },
  running: { icon: <Loader2 className="w-5 h-5 animate-spin" />, color: 'text-[#e94560]', border: 'border-[#e94560]/30', bg: 'bg-[#e94560]/5', dot: 'bg-[#e94560]' },
  idle: { icon: <Clock className="w-5 h-5" />, color: 'text-[#8b8ba7]', border: 'border-[#2d2d4a]', bg: 'bg-transparent', dot: 'bg-[#8b8ba7]' },
  scheduled: { icon: <Clock className="w-5 h-5" />, color: 'text-[#3498db]', border: 'border-[#3498db]/30', bg: 'bg-[#3498db]/5', dot: 'bg-[#3498db]' },
};

interface AgentCardProps {
  agentId: string;
  agentStatus: AgentStatus;
  timezone: string;
  onRunNow: () => void;
  onToggle: () => void;
}

export default function AgentCard({ agentId, agentStatus, timezone, onRunNow, onToggle }: AgentCardProps) {
  const config = AGENT_CONFIGS[agentId];
  if (!config) return null;

  const status = STATUS_CONFIG[agentStatus.status] || STATUS_CONFIG.idle;
  const isOnDemand = !config.defaultSchedule;

  return (
    <div className={`relative rounded-2xl border ${status.border} ${status.bg} p-6 transition-all hover:border-opacity-60`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${status.color} bg-[#1a1a2e]`}>
            {ICON_MAP[config.icon]}
          </div>
          <div>
            <h3 className="font-semibold text-[#e8e8f0]">{config.name}</h3>
            <p className="text-xs text-[#8b8ba7] mt-0.5">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dot} ${agentStatus.status === 'success' ? 'animate-pulse-glow' : ''}`} />
          <span className={`text-xs font-medium ${status.color} uppercase tracking-wide`}>
            {agentStatus.status}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        {agentStatus.last_run && (
          <p className="text-sm text-[#8b8ba7]">
            Last: {new Date(agentStatus.last_run).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone })}
          </p>
        )}
        {agentStatus.next_run && agentStatus.status !== 'paused' && (
          <p className="text-sm text-[#8b8ba7]">
            Next: {new Date(agentStatus.next_run).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone })}
          </p>
        )}
        {agentStatus.output_summary && (
          <p className="text-sm text-[#e8e8f0]">{agentStatus.output_summary}</p>
        )}
        {agentStatus.error && (
          <p className="text-sm text-[#e74c3c]">{agentStatus.error}</p>
        )}
      </div>

      <div className="flex gap-2">
        {isOnDemand ? (
          <button
            onClick={onRunNow}
            className="flex-1 py-2.5 px-4 bg-[#1a1a2e] hover:bg-[#252540] border border-[#2d2d4a] rounded-xl text-sm font-medium text-[#e8e8f0] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {agentId === 'networking_prep' ? 'Prepare' : 'Tailor Resume'}
          </button>
        ) : (
          <>
            <button
              onClick={onRunNow}
              disabled={agentStatus.status === 'running'}
              className="flex-1 py-2.5 px-4 bg-[#e94560] hover:bg-[#d13a54] disabled:opacity-50 rounded-xl text-sm font-medium text-white transition-all"
            >
              {agentStatus.status === 'running' ? 'Running...' : 'Run Now'}
            </button>
            <button
              onClick={onToggle}
              className="py-2.5 px-4 bg-[#1a1a2e] hover:bg-[#252540] border border-[#2d2d4a] rounded-xl text-sm font-medium text-[#8b8ba7] transition-all"
            >
              {agentStatus.status === 'paused' ? 'Resume' : 'Pause'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
