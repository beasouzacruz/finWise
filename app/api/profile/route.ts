import { NextResponse } from 'next/server';
import { fail, publicUser, withUser } from '@/lib/api';
import { mutateDB } from '@/lib/db';

export const PATCH = withUser(async (u, req) => {
  const b = await req.json();
  const name = String(b.name ?? '').trim();
  if (name.length < 2 || name.length > 80) return fail('Informe um nome entre 2 e 80 caracteres.');
  const user = await mutateDB(db => {
    const x = db.users.find(x => x.id === u.id);
    if (x) x.name = name;
    return x;
  });
  return user ? NextResponse.json(publicUser(user)) : fail('Conta não encontrada.', 404);
});
