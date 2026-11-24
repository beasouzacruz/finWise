import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Check,
  CircleDollarSign,
  Goal,
  GraduationCap,
  LineChart,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';

const features = [
  { icon: WalletCards, title: 'Controle financeiro', text: 'Organize receitas, despesas e seu saldo em um único lugar.' },
  { icon: LineChart, title: 'Investimentos', text: 'Acompanhe seus objetivos e prepare seu dinheiro para o longo prazo.' },
  { icon: BarChart3, title: 'Gestão organizada', text: 'Entenda para onde seu dinheiro está indo e identifique oportunidades.' },
  { icon: Goal, title: 'Metas inteligentes', text: 'Defina quanto quer alcançar, em quanto tempo e acompanhe o progresso.' },
  { icon: GraduationCap, title: 'Educação financeira', text: 'Tenha uma visão mais clara das suas escolhas e hábitos financeiros.' },
  { icon: ShieldCheck, title: 'Mais segurança', text: 'Planeje sua reserva e construa uma relação mais consciente com o dinheiro.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-black tracking-tight text-brand">Fin<span className="text-slate-900">Wise</span></Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <a href="#recursos" className="hover:text-brand">Recursos</a>
          <a href="#score" className="hover:text-brand">FinWise Score</a>
          <a href="#aprender" className="hover:text-brand">Aprender</a>
          <a href="#sobre" className="hover:text-brand">Sobre nós</a>
        </div>
        <div className="flex items-center gap-2">
          <Link className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 sm:inline-flex" href="/login">Entrar</Link>
          <Link className="btn btn-primary" href="/cadastro">Criar conta</Link>
        </div>
      </nav>

      <section className="overflow-hidden border-t border-slate-100 bg-gradient-to-b from-white to-brand-50/50">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-14 md:grid-cols-2 md:items-center md:pt-20">
          <div>
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-2 text-xs font-bold text-brand">Sua vida financeira, mais leve.</span>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Organize, invista e conquiste seus <span className="text-brand">objetivos.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted md:text-lg">
              O FinWise é a plataforma para cuidar das suas finanças com clareza. Controle seu dinheiro, acompanhe suas metas e tome decisões com mais informação.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cadastro" className="btn btn-primary inline-flex items-center gap-2">Começar agora <ArrowRight size={18} /></Link>
              <a href="#recursos" className="btn btn-secondary inline-flex items-center gap-2">Ver demonstração <ArrowRight size={17} /></a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-good" /> Gratuito para começar</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-good" /> Sem cartão de crédito</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[32px] bg-brand-100/70 blur-2xl" />
            <div className="relative rounded-[24px] border border-slate-200 bg-white p-3 shadow-soft">
              <div className="rounded-[18px] bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Visão geral</p><p className="mt-1 text-lg font-black">Olá, Marina.</p></div>
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-black text-white">M</div>
                </div>
                <div className="mt-5 rounded-2xl bg-navy p-5 text-white">
                  <p className="text-xs text-slate-300">Saldo disponível</p>
                  <p className="mt-1 text-3xl font-black">R$ 1.240,00</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-3"><p className="text-[10px] text-slate-300">Receitas</p><b className="text-sm">R$ 3.450</b></div>
                    <div className="rounded-xl bg-white/10 p-3"><p className="text-[10px] text-slate-300">Despesas</p><b className="text-sm">R$ 2.210</b></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border bg-white p-4"><p className="text-[10px] font-bold text-slate-400">Sua meta</p><p className="mt-1 text-sm font-black">Reserva</p><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 w-[68%] rounded-full bg-brand" /></div><p className="mt-2 text-[10px] font-bold text-brand">68% concluído</p></div>
                  <div className="rounded-2xl border bg-white p-4"><p className="text-[10px] font-bold text-slate-400">FinWise Score</p><p className="mt-1 text-3xl font-black text-brand">82</p><p className="text-[10px] text-slate-500">Seu momento financeiro</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-widest text-brand">Uma visão mais simples</p><h2 className="mt-3 text-3xl font-black md:text-4xl">O próximo passo começa com <span className="text-brand">clareza.</span></h2><p className="mt-4 leading-7 text-muted">FinWise reúne informações importantes para você entender sua vida financeira e transformar intenção em planejamento.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => <div key={title} className="card p-6 transition hover:-translate-y-1 hover:shadow-soft"><div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand"><Icon size={21} /></div><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text}</p></div>)}
        </div>
      </section>

      <section id="score" className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div><p className="text-xs font-black uppercase tracking-widest text-brand-200">O diferencial FinWise</p><h2 className="mt-3 text-3xl font-black md:text-4xl">Seu score transforma <span className="text-brand-200">dados em direção.</span></h2><p className="mt-5 max-w-xl leading-7 text-slate-300">Uma leitura do seu comportamento financeiro baseada nos seus próprios dados. Use o acompanhamento para entender evolução, organização e consistência.</p><div className="mt-6 space-y-3 text-sm text-slate-200"><p className="flex gap-2"><Check size={18} className="shrink-0 text-brand-200" /> Entenda seus hábitos financeiros</p><p className="flex gap-2"><Check size={18} className="shrink-0 text-brand-200" /> Acompanhe sua evolução ao longo do tempo</p><p className="flex gap-2"><Check size={18} className="shrink-0 text-brand-200" /> Tenha indicadores para apoiar suas decisões</p></div></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft"><div className="rounded-2xl bg-[#101838] p-6"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-400">Seu momento financeiro</p><p className="mt-1 font-bold">FinWise Score</p></div><div className="grid h-20 w-20 place-items-center rounded-full border-8 border-brand text-2xl font-black">82</div></div><div className="mt-7 space-y-4"><ScoreRow label="Organização" value="92%" width="92%" /><ScoreRow label="Metas" value="76%" width="76%" /><ScoreRow label="Reserva" value="64%" width="64%" /></div><Link href="/score" className="btn btn-primary mt-6 inline-flex items-center gap-2">Conferir meu FinWise Score <ArrowRight size={16}/></Link></div></div>
        </div>
      </section>

      <section id="aprender" className="mx-auto max-w-6xl px-6 py-16"><div className="rounded-3xl bg-brand-50 p-8 md:p-12"><div className="max-w-2xl"><p className="text-sm font-bold text-brand">O futuro mais leve depende de você.</p><h2 className="mt-3 text-3xl font-black">Comece a construir uma relação melhor com seu dinheiro.</h2><p className="mt-4 text-sm leading-6 text-muted">Cadastre sua conta, informe sua realidade financeira e deixe o FinWise organizar as informações para você começar.</p><Link href="/cadastro" className="btn btn-primary mt-6 inline-flex">Criar minha conta</Link></div></div></section>

      <section id="sobre" className="border-t border-slate-100 bg-white px-6 py-10 text-center"><div className="mx-auto max-w-3xl"><div className="inline-flex items-center gap-2 text-sm font-black text-brand"><CircleDollarSign size={18} /> FinWise</div><p className="mt-3 text-sm leading-6 text-muted">Seu dinheiro. Suas metas. Seu futuro.</p><div className="mt-6 flex flex-wrap justify-center gap-5 text-xs font-semibold text-slate-500"><a href="#recursos" className="hover:text-brand">Recursos</a><a href="#score" className="hover:text-brand">FinWise Score</a><a href="#aprender" className="hover:text-brand">Aprender</a><Link href="/login" className="hover:text-brand">Entrar</Link></div><p className="mt-7 text-[11px] text-slate-400">© 2026 FinWise. Organização financeira para decisões mais conscientes.</p></div></section>
    </main>
  );
}

function ScoreRow({ label, value, width }: { label: string; value: string; width: string }) {
  return <div><div className="flex justify-between text-xs"><span className="text-slate-300">{label}</span><span className="font-bold text-white">{value}</span></div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-brand" style={{ width }} /></div></div>;
}
