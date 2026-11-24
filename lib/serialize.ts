export const money = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
export const dateBR = (s: string) => new Intl.DateTimeFormat('pt-BR').format(new Date(`${s}T12:00:00`));
