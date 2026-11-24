import { NextResponse } from 'next/server';
import { fail, num, withUser } from '@/lib/api';
import { id, mutateDB } from '@/lib/db';
import { summarize, userData } from '@/lib/finance';

export const PATCH = withUser(async (u, req) => {
  const b = await req.json();
  const now = new Date().toISOString();
  const income = num(b.income);
  const goalName = String(b.goalName ?? '').trim().slice(0, 80);
  const target = num(b.target);

  const account = await mutateDB(db => {
    const user = db.users.find(x => x.id === u.id);
    if (!user) return null;
    user.priority = String(b.priority || user.priority || '').slice(0, 80);

    const profile = db.profiles[u.id] ?? { userId: u.id, currency: 'BRL' as const, monthlyIncome: 0, createdAt: now, updatedAt: now };
    if (income > 0) profile.monthlyIncome = income;
    profile.updatedAt = now;
    db.profiles[u.id] = profile;

    // Idempotente: reenviar o onboarding atualiza a renda/meta iniciais em vez de duplicá-las.
    if (income > 0) {
      const initial = db.transactions.find(t => t.userId === u.id && t.category === 'Salário' && t.description === 'Renda mensal inicial');
      if (initial) Object.assign(initial, { amount: income, updatedAt: now });
      else db.transactions.push({ id: id(), userId: u.id, type: 'income', description: 'Renda mensal inicial', amount: income, category: 'Salário', date: now.slice(0, 10), recurring: true, frequency: 'monthly', createdAt: now });
    }
    if (goalName && target > 0) {
      const initial = db.goals.find(g => g.userId === u.id && g.category === 'Meta inicial');
      if (initial) Object.assign(initial, { name: goalName, target, updatedAt: now });
      else db.goals.push({ id: id(), userId: u.id, name: goalName, target, saved: 0, category: 'Meta inicial', color: '#2F5BFF', createdAt: now, updatedAt: now });
    }
    if (b.complete) user.onboardingComplete = true;
    db.activities.push({ id: id(), userId: u.id, type: b.complete ? 'onboarding_completed' : 'onboarding_updated', createdAt: now });

    const { tx, goals } = userData(db, u.id);
    return { id: user.id, onboardingComplete: user.onboardingComplete, monthlyIncome: profile.monthlyIncome, balance: summarize(tx).balance, goals: goals.length, transactions: tx.length };
  });
  return account ? NextResponse.json({ ok: true, account }) : fail('Conta não encontrada.', 404);
});
