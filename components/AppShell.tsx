import Sidebar from './Sidebar';
import BackButton from './BackButton';
import Link from 'next/link';
import { Home } from 'lucide-react';
export default function AppShell({children,title,back=false}:{children:React.ReactNode,title:string,back?:boolean}){return <><Sidebar/><main className="mainwrap ml-[250px] min-h-screen p-5 pb-24 md:p-8 sm:pb-8"><div className="mx-auto max-w-7xl"><header className="mb-7 flex items-start justify-between gap-4"><div><h1 className="text-3xl font-black">{title}</h1><p className="mt-1 text-sm text-muted">Organize seu dinheiro com clareza.</p></div><div className="flex items-center gap-2">{back&&<BackButton fallback="/dashboard"/>}<Link href="/" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><Home size={17}/> Início</Link></div></header>{children}</div></main></>}
