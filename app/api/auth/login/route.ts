import { NextResponse } from 'next/server';
import { fail } from '@/lib/api';
import { createSession } from '@/lib/auth';
import { readDB, verifyPassword } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email ?? '').trim().toLowerCase();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (!rateLimit(`login:${ip}:${email}`)) return fail('Muitas tentativas. Aguarde um minuto.', 429);

  const user = (await readDB()).users.find(x => x.email === email);
  // verifyPassword roda mesmo sem usuário para não revelar se o e-mail existe pelo tempo de resposta.
  const ok = verifyPassword(String(b.password ?? ''), user?.passwordHash);
  if (!user || !ok) return fail('E-mail ou senha incorretos.', 401);
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
