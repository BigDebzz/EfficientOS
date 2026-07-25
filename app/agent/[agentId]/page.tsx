'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboard';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function AgentDetail() {
  const params = useParams();
  const router = useRouter();
  const { status, sendCommand } = useDashboardStore();
  const agentId = params.agentId as string;

  const agent = status?.agents[agentId];
  if (!agent || !status) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <p className="text-[#8b8ba7]">Agent not found</p>
      </div>
    );
  }

  const names: Record<string, string> = {
    morning_briefing: 'Morning Briefing',
    jobs_digest: 'Jobs Digest',
    weekly_review: 'Weekly Review',
    networking_prep: 'Networking Prep',
    resume_agent: 'Resume Agent',
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <header className="border-b border-[#2d2d4a] bg-[#1a1a2e]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-[#252540] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#8b8ba7]" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{names[agentId] || agentId}</h1>
            <p className="text-xs text-[#8b8ba7]">
              {agent.schedule ? `Runs: ${agent.schedule}` : 'On demand'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Status Card */}
        <div className="rounded-2xl border border-[#2d2d4a] bg-[#1a1a2e] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${
              agent.status === 'success' ? 'bg-[#2ecc71]' :
              agent.status === 'failed' ? 'bg-[#e74c3c]' :
              agent.status === 'running' ? 'bg-[#e94560] animate-pulse' :
              'bg-[#8b8ba7]'
            }`} />
            <span className="font-medium capitalize">{agent.status}</span>
          </div>

          {agent.last_run && (
            <p className="text-sm text-[#8b8ba7] mb-2">
              Last run: {new Date(agent.last_run).toLocaleString('en-US', { timeZone: status.settings.timezone })}
            </p>
          )}
          {agent.next_run && (
            <p className="text-sm text-[#8b8ba7] mb-2">
              Next run: {new Date(agent.next_run).toLocaleString('en-US', { timeZone: status.settings.timezone })}
            </p>
          )}
          {agent.error && (
            <p className="text-sm text-[#e74c3c] mt-3 p-3 bg-[#e74c3c]/10 rounded-xl">{agent.error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => sendCommand({ type: 'run_agent', agent: agentId })}
            className="flex-1 py-3 bg-[#e94560] hover:bg-[#d13a54] rounded-xl text-sm font-medium text-white transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run Now
          </button>
          <button
            onClick={() => sendCommand({ 
              type: agent.status === 'paused' ? 'resume_agent' : 'pause_agent', 
              agent: agentId 
            })}
            className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#252540] border border-[#2d2d4a] rounded-xl text-sm font-medium text-[#e8e8f0] transition-all flex items-center justify-center gap-2"
          >
            {agent.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {agent.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
        </div>

        {/* Output */}
        {agent.output_summary && (
          <div className="rounded-2xl border border-[#2d2d4a] bg-[#1a1a2e] p-6">
            <h3 className="font-semibold text-[#e8e8f0] mb-3">Last Output</h3>
            <p className="text-sm text-[#8b8ba7]">{agent.output_summary}</p>
          </div>
        )}
      </main>
    </div>
  );
}
