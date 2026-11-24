import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export type TransactionType = 'income' | 'expense';
export type Frequency = 'monthly' | 'weekly' | 'yearly' | 'one_time';

export type User = {
  id: string; email: string; name: string; passwordHash?: string; createdAt: string;
  accountType: 'personal' | 'business'; onboardingComplete: boolean; priority?: string;
};
export type FinancialProfile = {
  userId: string;
  currency: 'BRL';
  monthlyIncome: number;
  createdAt: string;
  updatedAt: string;
};
export type Transaction = {
  id: string; userId: string; type: TransactionType; description: string; amount: number;
  category: string; date: string; recurring: boolean; frequency?: Frequency; createdAt: string; updatedAt?: string;
};
export type Goal = {
  id: string; userId: string; name: string; target: number; saved: number; deadline?: string;
  category: string; color: string; createdAt: string; updatedAt?: string;
};
export type ActivityEvent = {
  id: string; userId: string; type: string; createdAt: string; metadata?: Record<string, unknown>;
};
export type DB = {
  users: User[];
  profiles: Record<string, FinancialProfile>;
  transactions: Transaction[];
  goals: Goal[];
  activities: ActivityEvent[];
  sessions: Record<string,string>;
};

const file = path.join(process.cwd(), 'data', 'db.json');
const seed: DB = { users: [], profiles: {}, transactions: [], goals: [], activities: [], sessions: {} };
let writeQueue = Promise.resolve();

async function ensure() {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try { await fs.access(file); }
  catch { await fs.writeFile(file, JSON.stringify(seed, null, 2), 'utf8'); }
}

function normalize(raw: Partial<DB>): DB {
  return {
    users: raw.users ?? [],
    profiles: raw.profiles ?? {},
    transactions: raw.transactions ?? [],
    goals: raw.goals ?? [],
    activities: raw.activities ?? [],
    sessions: raw.sessions ?? {},
  };
}

export async function readDB(): Promise<DB> {
  await ensure();
  return normalize(JSON.parse(await fs.readFile(file, 'utf8')));
}

export async function writeDB(db: DB) {
  await ensure();
  const snapshot = JSON.stringify(db, null, 2);
  writeQueue = writeQueue.then(async () => {
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, snapshot, 'utf8');
    await fs.rename(tmp, file);
  });
  return writeQueue;
}

/**
 * Leitura + alteração + gravação serializadas.
 * Evita que duas requisições simultâneas sobrescrevam as alterações uma da outra.
 */
let mutex: Promise<unknown> = Promise.resolve();
export function mutateDB<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = mutex.then(async () => {
    const db = await readDB();
    const result = await fn(db);
    await writeDB(db);
    return result;
  });
  mutex = run.catch(() => undefined);
  return run;
}

export const id = () => crypto.randomUUID();

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
export function verifyPassword(password: string, stored?: string) {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(actual, 'hex'));
}
