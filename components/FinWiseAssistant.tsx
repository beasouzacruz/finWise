'use client';
import { FormEvent, useEffect, useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';

type Props = { context?: 'goals' | 'transactions' | 'general' };
export default function FinWiseAssistant({ context = 'general' }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{from:'bot'|'user';text:string}[]>([
    { from: 'bot', text: context === 'goals' ? 'Estou aqui para acompanhar suas metas. Pode criar ou editar uma meta e eu explico o que mudou.' : context === 'transactions' ? 'Pode registrar suas receitas e despesas. Eu acompanho os lançamentos e trago observações conforme seu histórico cresce.' : 'Sou seu ajudante financeiro dentro do FinWise. Posso conversar sobre gastos, metas, receitas e seu Score.' }
  ]);
  const [input, setInput] = useState('');
  useEffect(() => { const handler = (e: Event) => { const detail = (e as CustomEvent).detail || {}; if (detail.text) { setOpen(true); ask(detail.text, detail.event || 'chat', detail.item); } }; window.addEventListener('finwise:assistant', handler); return () => window.removeEventListener('finwise:assistant', handler); }, []);
  async function ask(text: string, event = 'chat', item?: any) {
    const trimmed = text.trim(); if (!trimmed) return;
    setMessages(m => [...m, { from:'user', text: trimmed }]);
    setInput('');
    try {
      const res = await fetch('/api/assistant', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ event, item, message:trimmed }) });
      const data = await res.json();
      setMessages(m => [...m, { from:'bot', text:data.message || data.error || 'Vou acompanhar seus próximos registros.' }]);
    } catch {
      setMessages(m => [...m, { from:'bot', text:'Não consegui responder agora. Verifique sua conexão e tente de novo.' }]);
    }
  }
  async function submit(e:FormEvent){e.preventDefault(); await ask(input);}
  return <>
    <button type="button" onClick={()=>setOpen(true)} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-black text-white shadow-lg shadow-brand/25 hover:bg-brand-600"><Bot size={18}/> FinWise IA</button>
    {open && <div className="fixed bottom-20 right-5 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-navy p-4 text-white"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-brand"><Sparkles size={17}/></div><div><p className="font-black">FinWise IA</p><p className="text-[11px] text-slate-300">Seu ajudante financeiro</p></div></div><button aria-label="Fechar assistente" onClick={()=>setOpen(false)}><X size={18}/></button></div>
      <div className="max-h-80 space-y-3 overflow-y-auto p-4 bg-slate-50">{messages.map((m,i)=><div key={i} className={`flex ${m.from==='user'?'justify-end':''}`}><div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-5 ${m.from==='user'?'bg-brand text-white':'bg-white border border-slate-100 text-slate-700'}`}>{m.text}</div></div>)}</div>
      <form onSubmit={submit} className="flex gap-2 border-t p-3"><input value={input} onChange={e=>setInput(e.target.value)} className="input flex-1" placeholder="Converse com o FinWise..."/><button aria-label="Enviar mensagem" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-white"><Send size={17}/></button></form>
    </div>}
  </>
}
