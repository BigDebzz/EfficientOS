import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  try {
    await kv.ping()
    return NextResponse.json({ status: 'ok', kv_connected: true })
  } catch {
    return NextResponse.json({ status: 'degraded', kv_connected: false }, { status: 503 })
  }
}
