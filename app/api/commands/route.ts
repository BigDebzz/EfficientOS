import { NextRequest, NextResponse } from 'next/server'
import { getCommands, setCommands, appendCommand, removeCommand } from '../../../lib/kv'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const commands = await getCommands(token)
    const pending = commands.filter(c => c.status === 'pending')
    
    return NextResponse.json({ commands: pending })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch commands' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, command } = body

    if (!token || !command) {
      return NextResponse.json({ error: 'Token and command required' }, { status: 400 })
    }

    await appendCommand(token, command)
    
    return NextResponse.json({ ok: true, commandId: command.id })
  } catch {
    return NextResponse.json({ error: 'Failed to add command' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const commandId = searchParams.get('command_id')

    if (!token || !commandId) {
      return NextResponse.json({ error: 'Token and command_id required' }, { status: 400 })
    }

    await removeCommand(token, commandId)
    
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to remove command' }, { status: 500 })
  }
}
