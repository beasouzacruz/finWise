import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { mutateDB, readDB } from './db';

const COOKIE = 'finwise_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

const hashToken = (t: string) => crypto.createHash('sha256').update(t).digest('hex');

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('base64url');
  // Só o hash do token é persistido: vazamento do banco não expõe sessões ativas.
  await mutateDB(db => { db.sessions[hashToken(token)] = userId; });
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: MAX_AGE, path: '/' });
}

export async function destroySession() {
  const token = cookies().get(COOKIE)?.value;
  if (token) await mutateDB(db => { delete db.sessions[hashToken(token)]; });
  cookies().set(COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
}

export async function currentUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const db = await readDB();
  const uid = db.sessions[hashToken(token)];
  return uid ? db.users.find(u => u.id === uid) ?? null : null;
}
