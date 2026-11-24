import { NextResponse } from 'next/server';
import { fail, isISODate, num, withUser } from '@/lib/api';
import { id, mutateDB, readDB, type Goal } from '@/lib/db';

export const GET = withUser(async u => NextResponse.json((await readDB()).goals.filter(g => g.userId === u.id)));

export const POST = withUser(async (u, req) => {
  const b = await req.json();
  const name = String(b.name ?? '').trim().slice(0, 80);
  const target = num(b.target);
  const saved = Math.max(0, num(b.saved));
  if (!name || target <= 0) return fail('Nome e valor da meta são obrigatórios.');
  if (b.deadline && !isISODate(b.deadline)) return fail('Prazo inválido.');
  const g: Goal = {
    id: id(), userId: u.id, name, target, saved, deadline: b.deadline || undefined,
    category: String(b.category || 'Meta').slice(0, 40), color: /^#[0-9a-f]{6}$/i.test(b.color) ? b.color : '#2F5BFF',
    createdAt: new Date().toISOString(),
  };
  await mutateDB(db => { db.goals.push(g); });
  return NextResponse.json(g, { status: 201 });
});
