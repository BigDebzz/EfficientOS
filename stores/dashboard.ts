'use client'

import { create } from 'zustand'
import { StatusData, Command } from '../types'

interface DashboardState {
  token: string | null
  status: StatusData | null
  isLoading: boolean
  lastSync: Date | null
  desktopOnline: boolean
  setToken: (token: string) => void
  fetchStatus: () => Promise<void>
  sendCommand: (command: Omit<Command, 'id' | 'created_at' | 'status'>) => Promise<void>
  clearToken: () => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  token: null,
  status: null,
  isLoading: false,
  lastSync: null,
  desktopOnline: false,

  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eos_token', token)
    }
    set({ token })
  },

  fetchStatus: async () => {
    const { token } = get()
    if (!token) return

    set({ isLoading: true })
    try {
      const res = await fetch(`/api/status?token=${token}`)
      const data = await res.json()
      
      if (data.error) {
        set({ status: null, isLoading: false, desktopOnline: false })
        return
      }

      const lastSync = data.last_updated ? new Date(data.last_updated) : null
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      
      set({
        status: data,
        isLoading: false,
        lastSync,
        desktopOnline: lastSync ? lastSync > fiveMinutesAgo : false,
      })
    } catch {
      set({ isLoading: false, desktopOnline: false })
    }
  },

  sendCommand: async (command) => {
    const { token } = get()
    if (!token) return

    const fullCommand: Command = {
      ...command,
      id: `cmd_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'pending',
    }

    await fetch('/api/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, command: fullCommand }),
    })
  },

  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eos_token')
    }
    set({ token: null, status: null, lastSync: null, desktopOnline: false })
  },
}))

// Hydrate token from localStorage on client
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('eos_token')
  if (saved) {
    useDashboardStore.setState({ token: saved })
  }
}
