'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboard';
import AgentCard from '@/components/AgentCard';
import DesktopStatusBar from '@/components/DesktopStatusBar';
import ActivityFeed from '@/components/ActivityFeed';
import { Settings, LogOut, Zap } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { token, status, isLoading, fetchStatus, clearToken, sendCommand } = useDashboardStore();

  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [token, router, fetchStatus]);

  const handleRunNow = (agentId: string) => {
    sendCommand({
      type: 'run_agent',
      agent: agentId,
    });
  };

  const handleToggle = (agentId: string) => {
    const agent = status?.agents[agentId];
    if (!agent) return;

    sendCommand({
      type: agent.status === 'paused' ? 'resume_agent' : 'pause_agent',
      agent: agentId,
    });
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Header */}
      <header className="border-b border-[#2d2d4a] bg-[#1a1a2e]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-[#e94560]" />
            <h1 className="text-xl font-bold">EfficientOS</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/settings')}
              className="p-2 hover:bg-[#252540] rounded-xl transition-colors text-[#8b8ba7]"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={clearToken}
              className="p-2 hover:bg-[#252540] rounded-xl transition-colors text-[#8b8ba7]"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Bar */}
        <div className="mb-8">
          <DesktopStatusBar />
        </div>

        {/* Loading State */}
        {isLoading && !status && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Agent Grid */}
        {status && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

            {/* Activity Feed */}
            <ActivityFeed 
              history={status.history} 
              timezone={status.settings.timezone} 
            />
          </>
        )}
      </main>
    </div>
  );
}
