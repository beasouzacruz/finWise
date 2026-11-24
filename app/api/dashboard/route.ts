import { NextResponse } from 'next/server';
import { withUser } from '@/lib/api';
import { readDB } from '@/lib/db';
import { summarize, userData } from '@/lib/finance';

export const GET = withUser(async u => {
  const { tx, goals } = userData(await readDB(), u.id);
  const s = summarize(tx);
  return NextResponse.json({
    balance: s.balance, income: s.income, expense: s.expense,
    saved: goals.reduce((a, g) => a + g.saved, 0),
    transactions: [...tx].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    goals, byCategory: s.byCategory,
  });
});
