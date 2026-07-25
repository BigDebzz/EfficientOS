export interface AgentStatus {
  status: 'success' | 'failed' | 'paused' | 'running' | 'idle' | 'scheduled';
  last_run: string | null;
  next_run: string | null;
  schedule: string | null;
  output_summary: string | null;
  error: string | null;
  jobs_found?: number;
  high_priority?: number;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSchedule: string | null;
}

export interface HistoryEntry {
  agent: string;
  timestamp: string;
  status: string;
  summary: string;
}

export interface StatusData {
  sync_token: string;
  last_updated: string;
  desktop: {
    version: string;
    platform: string;
    python_version: string;
  };
  agents: Record<string, AgentStatus>;
  history: HistoryEntry[];
  settings: {
    timezone: string;
    email: string;
    active_agents: string[];
  };
}

export interface Command {
  id: string;
  type: 'run_agent' | 'update_setting' | 'pause_agent' | 'resume_agent';
  agent?: string;
  inputs?: Record<string, string>;
  setting?: string;
  value?: unknown;
  created_at: string;
  status: 'pending' | 'completed';
}
