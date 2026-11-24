import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/api';
import { mutateDB } from '@/lib/db';

export const DELETE = withUser<{ params: { id: string } }>(async (u, _req, { params }) => {
  const removed = await mutateDB(db => {
    const before = db.transactions.length;
    db.transactions = db.transactions.filter(t => !(t.id === params.id && t.userId === u.id));
    return before !== db.transactions.length;
  });
  return removed ? NextResponse.json({ ok: true }) : fail('Movimentação não encontrada.', 404);
});
