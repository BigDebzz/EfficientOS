import { kv } from '@vercel/kv';
import { StatusData, Command } from '@/types';

const STATUS_PREFIX = 'status:';
const COMMANDS_PREFIX = 'commands:';

export async function getStatus(token: string): Promise<StatusData | null> {
  try {
    const data = await kv.get(`${STATUS_PREFIX}${token}`);
    return data as StatusData | null;
  } catch {
    return null;
  }
}

export async function setStatus(token: string, data: StatusData): Promise<void> {
  await kv.set(`${STATUS_PREFIX}${token}`, data, { ex: 604800 }); // 7 days TTL
}

export async function getCommands(token: string): Promise<Command[]> {
  try {
    const data = await kv.get(`${COMMANDS_PREFIX}${token}`);
    return (data as Command[]) || [];
  } catch {
    return [];
  }
}

export async function setCommands(token: string, commands: Command[]): Promise<void> {
  await kv.set(`${COMMANDS_PREFIX}${token}`, commands, { ex: 86400 }); // 1 day TTL
}

export async function appendCommand(token: string, command: Command): Promise<void> {
  const commands = await getCommands(token);
  commands.push(command);
  await setCommands(token, commands);
}

export async function removeCommand(token: string, commandId: string): Promise<void> {
  const commands = await getCommands(token);
  const filtered = commands.filter(c => c.id !== commandId);
  await setCommands(token, filtered);
}
