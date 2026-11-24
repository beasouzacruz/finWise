
import { NextResponse } from 'next/server';
import { fail, isISODate, num, withUser } from '@/lib/api';
import { mutateDB } from '@/lib/db';

type Ctx = { params: { id: string } };

export const PATCH = withUser<Ctx>(async (u, req, { params }) => {
  const b = await req.json();

  if (b.deadline && !isISODate(b.deadline)) {
    return fail('Prazo inválido.');
  }

  const result = await mutateDB(db => {
    const goal = db.goals.find(
      g => g.id === params.id && g.userId === u.id
    );

    if (!goal) {
      return { error: 'Meta não encontrada.', status: 404 };
    }

    const next = {
      name: b.name !== undefined
        ? String(b.name).trim().slice(0, 80) || goal.name
        : goal.name,

      target: b.target !== undefined
        ? num(b.target)
        : goal.target,

      saved: b.saved !== undefined
        ? Math.max(0, num(b.saved))
        : goal.saved,
    };

    if (next.target <= 0) {
      return {
        error: 'O valor da meta precisa ser maior que zero.',
        status: 400
      };
    }

    Object.assign(goal, next, {
      updatedAt: new Date().toISOString()
    });

    if (b.deadline !== undefined) {
      goal.deadline = b.deadline || undefined;
    }

    if (b.category !== undefined) {
      goal.category = String(b.category || 'Meta').slice(0, 40);
    }

    return { goal };
  });

  if ('error' in result && typeof result.error === 'string') {
    return NextResponse.json(
      { error: result.error },
      { status: result.status ?? 400 }
    );
  }

  if (!('goal' in result) || !result.goal) {
    return fail('Não foi possível atualizar a meta.', 500);
  }

  return NextResponse.json(result.goal);
});

export const DELETE = withUser<Ctx>(async (u, _req, { params }) => {
  await mutateDB(db => {
    db.goals = db.goals.filter(
      g => !(g.id === params.id && g.userId === u.id)
    );
  });

  return NextResponse.json({ ok: true });
});
