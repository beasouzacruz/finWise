import { NextResponse } from 'next/server';
import { publicUser, withUser } from '@/lib/api';
import { readDB } from '@/lib/db';
import { summarize, userData } from '@/lib/finance';

export const GET = withUser(async u => {
  const db = await readDB();
  const { tx, goals } = userData(db, u.id);
  return NextResponse.json({
    user: publicUser(u), profile: db.profiles[u.id],
    summary: { balance: summarize(tx).balance, goals: goals.length, transactions: tx.length },
  });
});
