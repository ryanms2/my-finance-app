
# MyFinance – Gerenciador Financeiro Pessoal

O **MyFinance** é um aplicativo web para controle financeiro pessoal, desenvolvido com as tecnologias Next.js (App Router), React 18, Tailwind CSS, Prisma ORM e componentes shadcn/ui. O objetivo do projeto é oferecer uma solução moderna, responsiva e fácil de usar para que usuários possam registrar, visualizar e analisar suas finanças de forma prática e segura.

## Funcionalidades Principais

- **Dashboard**: visão geral do saldo, últimas transações e gráficos de despesas/receitas.
- **Transações**: cadastro, edição e exclusão de receitas e despesas, com categorização e data.
- **Carteiras**: gerenciamento de múltiplas carteiras (contas), permitindo separar saldos e movimentações.
- **Orçamentos**: definição de limites mensais por categoria para melhor controle dos gastos.
- **Relatórios**: visualização de totais mensais, gráficos comparativos e análise de despesas por categoria.
- **Autenticação**: sistema de login seguro, com rotas protegidas e gerenciamento de sessão.
- **Configurações**: personalização de preferências do usuário e alteração de dados cadastrais.

## Estrutura e Tecnologias

- **Next.js App Router**: arquitetura baseada em Server Components e Client Components, aproveitando server actions para lógica de negócio e acesso ao banco de dados.
- **Prisma ORM**: manipulação de dados relacional com tipagem forte e integração direta com o banco SQLite (dev) ou PostgreSQL (prod).
- **Tailwind CSS**: estilização mobile-first, garantindo responsividade e consistência visual.
- **shadcn/ui e Radix**: componentes acessíveis e customizáveis para formulários, navegação e modais.
- **Validação**: uso de Zod para validação de dados em server actions, garantindo integridade e feedback ao usuário.

## Como o Projeto Foi Feito

O desenvolvimento seguiu princípios de modularidade e escalabilidade. Cada funcionalidade principal foi implementada em módulos separados, com componentes reutilizáveis e lógica de negócio centralizada em server actions. O uso de Server Components permitiu otimizar o carregamento inicial e reduzir o bundle enviado ao cliente, enquanto Client Components foram usados apenas onde a interatividade era essencial.

O acesso ao banco de dados é feito exclusivamente no servidor, utilizando Prisma para garantir segurança e performance. A validação dos dados ocorre tanto no frontend (para feedback imediato) quanto no backend (para segurança), seguindo as melhores práticas recomendadas pela documentação oficial do Next.js e do Prisma.

O projeto também adota boas práticas de organização de código, separando camadas de serviços, hooks customizados e componentes de UI. O uso de Tailwind e shadcn/ui acelerou o desenvolvimento da interface, mantendo o design limpo e acessível.

## Próximos Passos

- Implementação de testes automatizados (Jest, React Testing Library)
- Integração com APIs bancárias para importação automática de transações
- Internacionalização (i18n) e suporte a múltiplos idiomas
- Melhoria dos relatórios e dashboards avançados

---
Este projeto é um exemplo de aplicação moderna, escalável e de fácil manutenção, servindo como base para evoluções futuras no contexto de finanças pessoais.