import { NextRequest, NextResponse } from 'next/server'
import { setStatus } from '../../../lib/kv'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token || !token.startsWith('eos_')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    
    const statusData = {
      ...body,
      sync_token: token,
      last_updated: new Date().toISOString(),
    }

    await setStatus(token, statusData)
    
    return NextResponse.json({ 
      ok: true, 
      synced_at: statusData.last_updated 
    })
  } catch {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
