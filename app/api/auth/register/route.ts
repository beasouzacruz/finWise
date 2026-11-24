import { NextResponse } from 'next/server';
import { fail } from '@/lib/api';
import { createSession } from '@/lib/auth';
import { hashPassword, id, mutateDB, type User } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email ?? '').trim().toLowerCase();
  const name = String(b.name ?? '').trim();
  const password = String(b.password ?? '');
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';

  if (!rateLimit(`register:${ip}`, 5, 10 * 60_000)) return fail('Muitas tentativas. Tente novamente mais tarde.', 429);
  if (name.length < 2 || !EMAIL.test(email) || password.length < 8) {
    return fail('Informe nome, um e-mail válido e uma senha de pelo menos 8 caracteres.');
  }

  const now = new Date().toISOString();
  const user: User = { id: id(), email, name, passwordHash: hashPassword(password), createdAt: now, accountType: 'personal', onboardingComplete: false };
  const created = await mutateDB(db => {
    if (db.users.some(u => u.email === email)) return false; // checagem e inserção na mesma seção crítica
    db.users.push(user);
    db.profiles[user.id] = { userId: user.id, currency: 'BRL', monthlyIncome: 0, createdAt: now, updatedAt: now };
    db.activities.push({ id: id(), userId: user.id, type: 'account_created', createdAt: now, metadata: { source: 'register' } });
    return true;
  });
  if (!created) return fail('Este e-mail já está cadastrado.', 409);

  await createSession(user.id);
  return NextResponse.json({ ok: true, user: { id: user.id, email, name }, next: '/onboarding' }, { status: 201 });
}
