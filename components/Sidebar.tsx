'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ArrowDownUp, Target, WalletCards, Settings, LogOut, Home, BarChart3, Calculator } from 'lucide-react';

const links = [
  ['/', 'Página inicial', Home],
  ['/dashboard', 'Visão geral', LayoutDashboard],
  ['/score', 'FinWise Score', BarChart3],
  ['/transacoes', 'Transações', ArrowDownUp],
  ['/controle', 'Despesas', Calculator],
  ['/metas', 'Metas', Target],
  ['/orcamento', 'Orçamento', WalletCards],
  ['/configuracoes', 'Configurações', Settings],
] as const;

// Itens exibidos na barra inferior (mobile), onde o espaço é curto.
const mobileLinks = links.filter(([href]) => href !== '/' && href !== '/configuracoes');

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <aside className="sidebar fixed left-0 top-0 z-20 p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-black">F</div>
          <span className="brandtext text-xl font-black">FinWise</span>
        </div>
        <nav aria-label="Navegação principal" className="space-y-1">
          {links.map(([href, label, Icon]) => (
            <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} title={label} className={`navitem ${isActive(href) ? 'active' : ''}`}>
              <Icon size={19} aria-hidden />
              <span className="navtext">{label}</span>
            </Link>
          ))}
        </nav>
        <button onClick={logout} title="Sair" className="navitem mt-8 w-full border-0 bg-transparent">
          <LogOut size={19} aria-hidden />
          <span className="navtext">Sair</span>
        </button>
      </aside>

      <nav aria-label="Navegação principal" className="mobile-nav fixed inset-x-0 bottom-0 z-30 hidden justify-around border-t border-slate-200 bg-white/95 px-1 py-2 backdrop-blur">
        {mobileLinks.map(([href, label, Icon]) => (
          <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px] font-bold ${isActive(href) ? 'text-brand' : 'text-slate-500'}`}>
            <Icon size={20} aria-hidden />
            <span className="truncate">{label.replace('FinWise ', '')}</span>
          </Link>
        ))}
        <Link href="/configuracoes" aria-current={isActive('/configuracoes') ? 'page' : undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px] font-bold ${isActive('/configuracoes') ? 'text-brand' : 'text-slate-500'}`}>
          <Settings size={20} aria-hidden />
          <span>Conta</span>
        </Link>
      </nav>
    </>
  );
}
