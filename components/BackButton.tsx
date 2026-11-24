'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton({ fallback = '/' }: { fallback?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallback);
      }}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <ArrowLeft size={17} /> Voltar
    </button>
  );
}
