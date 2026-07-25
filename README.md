# EfficientOS Dashboard

Web dashboard for EfficientOS — monitor and manage your personal AI agents from any device.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Connect Vercel KV:
```bash
npx vercel link
npx vercel env pull
```
Or manually copy `.env.example` to `.env.local` and fill in KV credentials from Vercel Dashboard → Storage.

3. Run locally:
```bash
npm run dev
```

4. Deploy:
```bash
vercel --prod
```

## Architecture

- **Landing + Dashboard**: Next.js 14, Tailwind CSS, hosted on Vercel (free tier)
- **State Sync**: Vercel KV — desktop app pushes status every 5 min, dashboard polls every 30 sec
- **Command Queue**: Dashboard writes commands to KV, desktop app polls and executes
- **Privacy**: Only status metadata touches the cloud. Emails, calendar, AI calls stay local.

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sync` | POST | Desktop app pushes status |
| `/api/status` | GET | Dashboard reads status |
| `/api/commands` | GET/POST/DELETE | Bidirectional command queue |
| `/api/health` | GET | Health check |

## File Structure

```
app/
  page.tsx              # Token entry
  dashboard/page.tsx    # Main dashboard
  agents/[agentId]/     # Agent detail view
  settings/page.tsx     # Settings
  api/                  # Serverless API routes
components/
  AgentCard.tsx         # Agent status card
  DesktopStatusBar.tsx  # Online/offline indicator
  ActivityFeed.tsx      # Recent activity list
lib/
  kv.ts                 # Vercel KV wrapper
  utils.ts              # Formatting utilities
stores/
  dashboard.ts          # Zustand state store
types/
  index.ts              # TypeScript interfaces
```
