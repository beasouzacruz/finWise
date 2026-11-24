import { NextResponse } from 'next/server';
import { withUser } from '@/lib/api';
import { readDB } from '@/lib/db';
import { money } from '@/lib/format';
import { monthsUntil, summarize, userData } from '@/lib/finance';

export const GET = withUser(async u => {
  const { tx, goals } = userData(await readDB(), u.id);
  const { income, expense, balance, savingsRate, topCategory } = summarize(tx);

  const insights: { type: 'opportunity' | 'attention' | 'progress'; title: string; text: string; action: string }[] = [];
  if (!income) {
    insights.push({ type: 'opportunity', title: 'Comece pelo diagnóstico', text: 'Registre suas receitas e despesas por algumas semanas. O FinWise precisa de dados reais para personalizar seu plano.', action: 'Registrar movimentação' });
  } else if (savingsRate < 0) {
    insights.push({ type: 'attention', title: 'Suas despesas superaram suas receitas', text: `O período registrado terminou com ${money(Math.abs(balance))} a menos. Antes de aumentar metas, vale revisar os gastos recorrentes e variáveis.`, action: 'Revisar orçamento' });
  } else if (savingsRate < 0.1) {
    insights.push({ type: 'opportunity', title: 'Crie uma margem de segurança', text: `Você está preservando cerca de ${(savingsRate * 100).toFixed(0)}% das receitas registradas. Uma primeira etapa pode ser separar uma pequena quantia assim que a renda entrar.`, action: 'Definir meta de reserva' });
  } else {
    insights.push({ type: 'progress', title: 'Seu fluxo está gerando margem', text: `Cerca de ${(savingsRate * 100).toFixed(0)}% das receitas registradas não foram consumidas por despesas. O próximo passo é direcionar essa margem para objetivos definidos.`, action: 'Distribuir para metas' });
  }

  if (topCategory && expense > 0 && topCategory[1] / expense >= 0.35) {
    insights.push({ type: 'attention', title: `A categoria ${topCategory[0]} merece atenção`, text: `${((topCategory[1] / expense) * 100).toFixed(0)}% das suas despesas registradas estão concentradas nela (${money(topCategory[1])}). Compare esse valor com seu orçamento antes de fazer cortes.`, action: 'Ver orçamento' });
  }

  const now = new Date();
  for (const g of goals) {
    if (!g.deadline || g.saved >= g.target) continue;
    const deadline = new Date(`${g.deadline}T12:00:00`);
    const months = monthsUntil(g.deadline, now);
    const needed = (g.target - g.saved) / months;
    if (deadline < now) {
      insights.push({ type: 'attention', title: `A meta “${g.name}” precisa de replanejamento`, text: `O prazo cadastrado já passou e faltam ${money(g.target - g.saved)}. Você pode atualizar a data ou o valor da meta sem perder o histórico.`, action: 'Editar meta' });
    } else if (income > 0 && needed > balance * 0.8) {
      insights.push({ type: 'attention', title: `A meta “${g.name}” está exigindo muita margem`, text: `Para cumprir o prazo, o aporte necessário é de aproximadamente ${money(needed)}/mês. O FinWise sugere revisar o prazo ou o valor para preservar uma margem de segurança.`, action: 'Replanejar meta' });
    } else {
      insights.push({ type: 'progress', title: `Plano atualizado para “${g.name}”`, text: `Mantendo o prazo atual, o aporte estimado é de ${money(needed)}/mês. Esse valor será recalculado conforme novas receitas, despesas e aportes forem registrados.`, action: 'Acompanhar meta' });
    }
  }

  if (!goals.length && income > 0) {
    insights.push({ type: 'opportunity', title: 'Transforme sobra em objetivo', text: 'Você ainda não cadastrou uma meta. Criar um objetivo dá destino ao dinheiro que sobra e permite acompanhar um plano concreto.', action: 'Criar primeira meta' });
  }

  return NextResponse.json({ insights: insights.slice(0, 5), metrics: { income, expense, balance, savingsRate, topCategory: topCategory?.[0] || null } });
});
