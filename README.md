# FinWise

Plataforma de organização financeira pessoal em Next.js 14, TypeScript e Tailwind CSS.

## Conceito
O FinWise funciona como um **sistema financeiro adaptativo**: o usuário registra receitas, despesas e metas; a aplicação transforma esses dados em indicadores, evolução de objetivos e orientações práticas. As orientações mudam conforme o histórico do usuário cresce.

## Funcionalidades principais
- Cadastro, login e sessão por cookie.
- Onboarding com prioridade, renda inicial e primeira meta.
- Dashboard com saldo, receitas, despesas, metas e movimentações.
- Metas editáveis, com aportes e prazo acompanhados dinamicamente.
- Cálculo do aporte mensal necessário para cada meta.
- Replanejamento visual quando prazo ou valor são alterados.
- Histórico de receitas e despesas.
- Orçamento por categorias.
- FinWise Intelligence: insights baseados no fluxo de caixa, concentração de gastos, margem financeira e andamento das metas.
- Configurações de perfil.

## Rodar
```bash
npm install
npm run dev
```
Abra http://localhost:3000.

## Estrutura
```
app/api/*     rotas HTTP (todas autenticadas via `withUser`)
lib/db.ts     persistência em JSON + `mutateDB` (leitura/escrita atômica)
lib/auth.ts   sessões por cookie httpOnly (token guardado como hash)
lib/finance.ts regras de negócio puras (saldo, categorias, aporte mensal)
lib/api.ts    helpers de rota: auth, erros, validação
lib/format.ts formatação de moeda e data (pt-BR)
components/   UI cliente
```

## Segurança
- Senhas com scrypt + salt; mínimo de 8 caracteres.
- Limite de tentativas em login e cadastro (em memória; use Redis em produção com várias instâncias).
- Respostas da API nunca incluem `passwordHash`.
- Validação de valores, datas e tamanhos de texto no servidor.

## Arquitetura de dados
O MVP utiliza `data/db.json` como persistência local. Para produção, substituir por Postgres/Prisma ou outro banco persistente, mantendo as mesmas interfaces das rotas. Como toda escrita passa por `mutateDB`, a troca fica concentrada em `lib/db.ts`.

> O MVP em arquivo JSON não escala para várias instâncias do servidor nem para ambientes serverless (disco efêmero).
