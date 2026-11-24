import type { DB, Goal, Transaction } from './db';

export type Summary = {
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
  byCategory: Record<string, number>;
  topCategory: [string, number] | null;
};

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function summarize(tx: Transaction[]): Summary {
  const income = sum(tx.filter(t => t.type === 'income').map(t => t.amount));
  const expense = sum(tx.filter(t => t.type === 'expense').map(t => t.amount));
  const byCategory: Record<string, number> = {};
  for (const t of tx) if (t.type === 'expense') byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] ?? null;
  const balance = income - expense;
  return { income, expense, balance, savingsRate: income > 0 ? balance / income : 0, byCategory, topCategory };
}

export const userData = (db: DB, userId: string) => ({
  tx: db.transactions.filter(t => t.userId === userId),
  goals: db.goals.filter(g => g.userId === userId),
});

export function monthsUntil(deadline: string, from = new Date()) {
  const d = new Date(`${deadline}T12:00:00`);
  return Math.max(1, (d.getFullYear() - from.getFullYear()) * 12 + d.getMonth() - from.getMonth());
}

/** Aporte mensal necessário para cumprir a meta no prazo (null se sem prazo ou já concluída). */
export function monthlyNeeded(g: Pick<Goal, 'target' | 'saved' | 'deadline'>): number | null {
  if (!g.deadline || g.saved >= g.target) return null;
  return (g.target - g.saved) / monthsUntil(g.deadline);
}
