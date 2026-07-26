import { NextRequest, NextResponse } from 'next/server'
import { getStatus } from '../../../lib/kv'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token || !token.startsWith('eos_')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    const status = await getStatus(token)
    
    if (!status) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    return NextResponse.json(status)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}
