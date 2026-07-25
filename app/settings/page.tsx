'use client';

import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboard';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { status, clearToken } = useDashboardStore();

  const handleExport = () => {
    if (!status) return;
    const blob = new Blob([JSON.stringify(status, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efficientos-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <header className="border-b border-[#2d2d4a] bg-[#1a1a2e]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-[#252540] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#8b8ba7]" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Connected Accounts */}
        <div className="rounded-2xl border border-[#2d2d4a] bg-[#1a1a2e] p-6">
          <h2 className="font-semibold text-[#e8e8f0] mb-4">Connected Accounts</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#e8e8f0]">Google</p>
                <p className="text-xs text-[#8b8ba7]">{status?.settings.email || 'Not connected'}</p>
              </div>
              <span className="text-xs font-medium text-[#2ecc71] bg-[#2ecc71]/10 px-3 py-1 rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="rounded-2xl border border-[#2d2d4a] bg-[#1a1a2e] p-6">
          <h2 className="font-semibold text-[#e8e8f0] mb-4">Data & Privacy</h2>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#252540] hover:bg-[#2d2d4a] rounded-xl transition-all text-left"
            >
              <Download className="w-5 h-5 text-[#8b8ba7]" />
              <div>
                <p className="text-sm font-medium text-[#e8e8f0]">Export my data</p>
                <p className="text-xs text-[#8b8ba7]">Download all your status data as JSON</p>
              </div>
            </button>

            <button
              onClick={() => {
                if (confirm('This will disconnect your dashboard. Your desktop app will keep running.')) {
                  clearToken();
                  router.push('/');
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#e74c3c]/10 hover:bg-[#e74c3c]/20 border border-[#e74c3c]/20 rounded-xl transition-all text-left"
            >
              <Trash2 className="w-5 h-5 text-[#e74c3c]" />
              <div>
                <p className="text-sm font-medium text-[#e74c3c]">Disconnect dashboard</p>
                <p className="text-xs text-[#e74c3c]/70">Remove this device from your account</p>
              </div>
            </button>
          </div>

          <p className="text-xs text-[#8b8ba7] mt-4">
            Your data never leaves your computer except for status metadata (timestamps, agent states).
            We cannot read your emails, calendar, or job applications.
          </p>
        </div>
      </main>
    </div>
  );
}
