
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

const getNomeMes = (numeroMes: string) => {
  const meses: Record<string, string> = {
    "01": "janeiro", "02": "fevereiro", "03": "março", "04": "abril",
    "05": "maio", "06": "junho", "07": "julho", "08": "agosto",
    "09": "setembro", "10": "outubro", "11": "novembro", "12": "dezembro"
  };

  return meses[numeroMes] || "";
};

export async function POST(request: Request) {
  try {
    const { mes, ano } = await request.json();

    const mesAtualStr = String(mes).padStart(2, '0');
    const anoAtualStr = String(ano);
    const nomeMesAtual = getNomeMes(mesAtualStr);

    const numMesAnterior = Number(mes) === 1 ? 12 : Number(mes) - 1;
    const numAnoAnterior = Number(mes) === 1 ? Number(ano) - 1 : Number(ano);

    const mesAnteriorStr = String(numMesAnterior).padStart(2, '0');
    const anoAnteriorStr = String(numAnoAnterior);

    // 1. Verifica se já existem lançamentos no mês atual
    const ciclosAtuais = await prisma.ciclo.findMany({
      where: {
        mes: mesAtualStr,
        ano: anoAtualStr
      },
      include: {
        lancamentos: true
      }
    });

    const temLancamentosReais = ciclosAtuais.some((ciclo: any) =>
      ciclo.lancamentos.some((l: any) =>
        l.descricao !== "Início da Pasta"
      )
    );

    if (temLancamentosReais) {
      return NextResponse.json(
        { message: 'Já existem despesas lançadas neste mês. A replicação não é permitida.' },
        { status: 400 }
      );
    }

    // 2. Busca os ciclos do mês anterior
    const ciclosAnteriores = await prisma.ciclo.findMany({
      where: {
        mes: mesAnteriorStr,
        ano: anoAnteriorStr
      },
      include: {
        lancamentos: true
      }
    });

    if (ciclosAnteriores.length === 0) {
      return NextResponse.json(
        { message: 'Não há pastas no mês anterior para replicar.' },
        { status: 404 }
      );
    }

    let totalReplicado = 0;

    // 3. Replicação dos dados
    for (const cicloAntigo of ciclosAnteriores) {

      if (cicloAntigo.lancamentos.length === 0) continue;

      const dia = cicloAntigo.titulo.split(" ")[0];

      const novoTitulo = `${dia} ${nomeMesAtual} ${anoAtualStr}`;

      let cicloAtual = ciclosAtuais.find(
        (c: any) => c.titulo === novoTitulo
      );

      // Cria a pasta caso ela não exista
      if (!cicloAtual) {
        cicloAtual = await prisma.ciclo.create({
          data: {
            titulo: novoTitulo,
            mes: mesAtualStr,
            ano: anoAtualStr
          },
          include: {
            lancamentos: true
          }
        });
      }

      // Prepara os lançamentos para copiar
      const novosLancamentos = cicloAntigo.lancamentos
        .filter((l: any) => l.descricao !== "Início da Pasta")
        .map((l: any) => ({
          descricao: l.descricao,
          valor: l.valor,
          tipo: l.tipo,
          status: 'pendente',
          cicloId: cicloAtual!.id
        }));

      // Salva os lançamentos copiados
      if (novosLancamentos.length > 0) {
        await prisma.lancamento.createMany({
          data: novosLancamentos
        });

        totalReplicado += novosLancamentos.length;
      }
    }

    if (totalReplicado === 0) {
      return NextResponse.json(
        { message: 'Não havia lançamentos válidos no mês anterior.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      count: totalReplicado
    });

  } catch (error) {
    console.error('Erro ao replicar:', error);

    return NextResponse.json(
      { message: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
