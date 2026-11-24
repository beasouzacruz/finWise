import { NextResponse } from 'next/server';
import { withUser } from '@/lib/api';
import { readDB } from '@/lib/db';
import { money } from '@/lib/format';
import { summarize, userData } from '@/lib/finance';

export const POST = withUser(async (user, req) => {
  const body = await req.json();
  const { tx, goals } = userData(await readDB(), user.id);
  const { income, expense, balance } = summarize(tx);
  const event = body.event as string | undefined;
  const item = body.item as { name?: string; target?: number; saved?: number; deadline?: string; type?: string; amount?: number; category?: string } | undefined;
  let message = 'Estou acompanhando seus registros. Quanto mais informações você cadastrar, mais contextualizadas ficam minhas orientações.';

  if (event === 'goal_created' && item) {
    const remaining = Math.max(0, Number(item.target) - Number(item.saved || 0));
    message = `Meta “${item.name}” criada. Você ainda precisa de ${money(remaining)} para alcançar o objetivo.`;
    if (item.deadline) message += ' Também vou acompanhar o prazo e recalcular o ritmo necessário conforme você evoluir.';
    message += ' Se sua realidade mudar, edite a meta — o plano acompanha a mudança.';
  }
  if (event === 'goal_updated' && item) {
    const remaining = Math.max(0, Number(item.target) - Number(item.saved || 0));
    message = `Atualizei a leitura da meta “${item.name}”. Faltam ${money(remaining)}. Vou considerar esse novo cenário nas próximas orientações.`;
  }
  if (event === 'transaction_created' && item) {
    if (item.type === 'expense') {
      message = `Registrei a despesa de ${money(Number(item.amount))} em ${item.category}.`;
      if (income > 0 && balance < 0) message += ' No período registrado, as despesas já superaram as receitas. Vale revisar o orçamento antes de assumir novos compromissos.';
      else if (income > 0) message += ` Até agora, suas receitas registradas deixam uma margem de ${money(balance)}. Vou continuar observando seu padrão.`;
      else message += ' Quando você registrar suas receitas, consigo contextualizar esse gasto melhor.';
    } else {
      message = `Registrei sua receita de ${money(Number(item.amount))}.`;
      message += goals.length ? ' Se essa entrada gerar uma sobra, posso acompanhar como ela conversa com suas metas.' : ' Você ainda pode transformar parte dessa entrada em uma meta concreta.';
    }
  }
  if (event === 'chat' && typeof body.message === 'string') {
    const q = body.message.toLowerCase();
    if (q.includes('gasto') || q.includes('despesa')) message = expense ? `Até agora, você registrou ${money(expense)} em despesas. Posso ajudar a interpretar as categorias e o impacto delas no seu saldo.` : 'Ainda não tenho despesas registradas para analisar.';
    else if (q.includes('meta')) message = goals.length ? `Você tem ${goals.length} meta${goals.length > 1 ? 's' : ''} cadastrada${goals.length > 1 ? 's' : ''}. Posso acompanhar prazo, progresso e ritmo de aporte.` : 'Você ainda não cadastrou metas. Uma meta dá um destino concreto para o dinheiro que sobra.';
    else if (q.includes('score')) message = 'Seu FinWise Score é calculado a partir dos dados registrados, como fluxo de receitas e despesas, metas e consistência. Acesse “FinWise Score” para ver os critérios detalhados.';
    else message = 'Posso conversar sobre suas despesas, receitas, metas e evolução. Tente perguntar, por exemplo: “como estão meus gastos?” ou “como estão minhas metas?”.';
  }

  return NextResponse.json({ message });
});
