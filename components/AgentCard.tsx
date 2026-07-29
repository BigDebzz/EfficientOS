'use client'

import { useState } from 'react'
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
  Mail,
  Send
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
  users: <Users className="w-5 h-5"
