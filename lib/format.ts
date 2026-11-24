const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFmt = new Intl.DateTimeFormat('pt-BR');

export const money = (n: number) => brl.format(n);
export const dateBR = (iso: string) => dateFmt.format(new Date(`${iso}T12:00:00`));
export const pct = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;
