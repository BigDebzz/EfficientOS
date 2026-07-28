'use client'

import { useDashboardStore } from '../stores/dashboard'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'

export default function DesktopStatusBar() {
  const { desktopOnline, lastSync } = useDashboardStore()

  if (desktopOnline) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-xl">
        <Wifi className="w-4 h-4 text-[#2ecc71]" />
        <span className="text-sm text-[#2ecc71] font-medium">Desktop app connected</span>
        {lastSync && (
          <span className="text-sm text-[#8b8ba7]">
            Last sync: {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>
    )
  }

  if (lastSync && Date.now() - lastSync.getTime() < 3600000) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-[#f39c12]/10 border border-[#f39c12]/20 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-[#f39c12]" />
        <span className="text-sm text-[#f39c12] font-medium">
          Last sync: {Math.floor((Date.now() - lastSync.getTime()) / 60000)}m ago
        </span>
        <span className="text-sm text-[#8b8ba7]">Your computer may be asleep</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#e74c3c]/10 border border-[#e74c3c]/20 rounded-xl">
      <WifiOff className="w-4 h-4 text-[#e74c3c]" />
      <span className="text-sm text-[#e74c3c] font-medium">Desktop app offline</span>
      <span className="text-sm text-[#8b8ba7]">Check that EfficientOS is running</span>
    </div>
  )
}
