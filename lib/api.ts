import { NextResponse } from 'next/server';
import { currentUser } from './auth';
import type { User } from './db';

export const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** Remove campos sensíveis antes de enviar o usuário ao cliente. */
export const publicUser = ({ passwordHash: _omit, ...rest }: User) => rest;

type Handler<C> = (user: User, req: Request, ctx: C) => Promise<Response> | Response;

/** Garante autenticação e trata erros inesperados (JSON inválido etc.) de forma uniforme. */
export function withUser<C = unknown>(handler: Handler<C>) {
  return async (req: Request, ctx: C) => {
    const user = await currentUser();
    if (!user) return fail('Não autenticado', 401);
    try {
      return await handler(user, req, ctx);
    } catch (e) {
      if (e instanceof SyntaxError) return fail('Requisição inválida.');
      console.error('[api]', e);
      return fail('Erro interno. Tente novamente.', 500);
    }
  };
}

export const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
export const isISODate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
