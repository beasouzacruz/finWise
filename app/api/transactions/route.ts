import { NextResponse } from 'next/server';
import { fail, isISODate, num, withUser } from '@/lib/api';
import { id, mutateDB, readDB, type Transaction } from '@/lib/db';

export const GET = withUser(async u => {
  const db = await readDB();
  return NextResponse.json(db.transactions.filter(t => t.userId === u.id).sort((a, b) => b.date.localeCompare(a.date)));
});

export const POST = withUser(async (u, req) => {
  const b = await req.json();
  const amount = Math.round(num(b.amount) * 100) / 100;
  const description = String(b.description ?? '').trim().slice(0, 120);
  if (!description || amount <= 0 || amount > 1e9) return fail('Informe uma descrição e um valor maior que zero.');
  if (b.date !== undefined && !isISODate(b.date)) return fail('Data inválida.');
  const t: Transaction = {
    id: id(), userId: u.id, type: b.type === 'income' ? 'income' : 'expense', description, amount,
    category: String(b.category || 'Outros').slice(0, 40), date: b.date ?? new Date().toISOString().slice(0, 10),
    recurring: Boolean(b.recurring), frequency: b.recurring ? 'monthly' : undefined, createdAt: new Date().toISOString(),
  };
  await mutateDB(db => { db.transactions.push(t); });
  return NextResponse.json(t, { status: 201 });
});
