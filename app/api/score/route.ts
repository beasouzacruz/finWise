import { NextResponse } from 'next/server';
import { withUser } from '@/lib/api';
import { readDB } from '@/lib/db';
import { summarize, userData } from '@/lib/finance';

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

export const GET = withUser(async u => {
  const { tx, goals } = userData(await readDB(), u.id);
  const { income, expense, balance } = summarize(tx);
  const savingsRate = income > 0 ? clamp(balance / income) : 0;
  const goalProgress = goals.length ? goals.reduce((s, g) => s + clamp(g.target ? g.saved / g.target : 0), 0) / goals.length : 0;
  const activity = clamp(tx.length / 20);
  const positiveFlow = income > 0 ? (balance >= 0 ? 1 : 0.35) : 0;
  const score = Math.round(clamp(20 + positiveFlow * 30 + savingsRate * 25 + goalProgress * 15 + activity * 10, 0, 100));
  const metrics = [
    { label: 'Fluxo financeiro', value: Math.round(positiveFlow * 100) },
    { label: 'Margem', value: Math.round(savingsRate * 100) },
    { label: 'Metas', value: Math.round(goalProgress * 100) },
    { label: 'Acompanhamento', value: Math.round(activity * 100) },
  ];
  return NextResponse.json({ score, metrics, income, expense, balance, goals: goals.length, transactions: tx.length });
});
