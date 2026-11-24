import './globals.css';
export const metadata = { title: { default: 'FinWise — Sua vida financeira em um só lugar', template: '%s · FinWise' }, description: 'Controle receitas, despesas, metas e orçamento.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body>{children}</body></html>; }
