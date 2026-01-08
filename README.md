# 🎮 Pokédex Interativa

<div align="center">

Uma aplicação web fullstack moderna e interativa onde você pode explorar a Pokédex completa, buscar Pokémons, favoritar seus preferidos e até mesmo fazer batalhas épicas entre Pokémons!

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

</div>

---

## 📖 Sobre o Projeto

A **Pokédex Interativa** é uma aplicação completa desenvolvida seguindo as melhores práticas de engenharia de software, incluindo:

- ✅ **Arquitetura em Camadas** (Repositories, Services, Controllers)
- ✅ **Princípios SOLID** aplicados em todo o código
- ✅ **Componentes Reutilizáveis** (Atomic Design)
- ✅ **Testes Unitários** abrangentes com Vitest
- ✅ **Type Safety** completo com TypeScript
- ✅ **Design Responsivo** estilo Gameboy

## 🎯 Funcionalidades Principais

### 🔐 Autenticação
- Cadastro de usuários com validação
- Login seguro com JWT
- Proteção de rotas autenticadas
- Logout

### 📚 Pokédex
- Busca de Pokémons por nome ou ID
- Listagem paginada de todos os Pokémons
- Visualização detalhada com estatísticas completas
- Filtro por tipo de Pokémon
- Design responsivo e intuitivo

### ⭐ Favoritos
- Adicionar Pokémons aos favoritos
- Lista de favoritos persistida no banco de dados
- Remover favoritos
- Verificar status de favorito

### ⚔️ Arena de Batalha (Feature Extra!)
- Seleção de dois Pokémons para batalhar
- Sistema de turnos automático
- Cálculo de dano baseado em stats
- Efetividade de tipos (Super efetivo, Não efetivo)
- Barra de HP animada
- Histórico completo da batalha
- Animações suaves com Framer Motion

## 🚀 Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utilitária
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos

### Backend
- **Next.js API Routes** - API RESTful
- **Prisma ORM** - Acesso ao banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação por tokens
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de schemas

### Ferramentas
- **Vitest** - Framework de testes
- **ESLint** - Linting de código
- **TypeScript** - Type checking

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** ou **yarn** ou **pnpm**
- **PostgreSQL** (local ou remoto - recomendamos Neon, Supabase ou Fly.io)

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
git clone <seu-repositorio>
cd Pokemon
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `env.example.txt`:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@host:porta/database?sslmode=require"

# JWT Secret
JWT_SECRET="sua-chave-secreta-aqui"

# Next.js API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**⚠️ Importante:** Gere uma chave secreta forte para `JWT_SECRET` (use uma string aleatória de pelo menos 32 caracteres).

### 4. Configure o banco de dados

```bash
# Gerar o Prisma Client
npm run db:generate

# Criar as tabelas no banco (desenvolvimento)
npm run db:push

# Ou criar migrations (produção)
npm run db:migrate
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador 🎉

## 📁 Estrutura do Projeto

```
Pokemon/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rotas de autenticação (grupo)
│   │   ├── login/                # Página de login
│   │   └── register/             # Página de registro
│   │
│   ├── (pokedex)/                # Rotas protegidas da Pokédex (grupo)
│   │   ├── pokedex/              # Lista principal de Pokémons
│   │   ├── pokemon/[id]/         # Detalhes do Pokémon
│   │   ├── favorites/            # Lista de favoritos
│   │   └── battle/               # ⚔️ Arena de Batalha
│   │
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Endpoints de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── pokemon/              # Endpoints de Pokémons
│   │   │   ├── route.ts          # GET /api/pokemon (lista)
│   │   │   ├── [id]/route.ts     # GET /api/pokemon/:id
│   │   │   └── types/route.ts    # GET /api/pokemon/types
│   │   └── favorites/            # Endpoints de favoritos
│   │       ├── route.ts          # GET/POST /api/favorites
│   │       ├── [pokemonId]/      # DELETE /api/favorites/:id
│   │       └── check/[pokemonId]/ # GET /api/favorites/check/:id
│   │
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página inicial
│   ├── middleware.ts             # Middleware Next.js
│   └── providers.tsx             # Context providers
│
├── components/                   # Componentes React (Atomic Design)
│   ├── atoms/                    # Componentes atômicos (menor nível)
│   │   ├── Badge/                # Badge de tipo
│   │   ├── Button/               # Botão reutilizável
│   │   ├── Card/                 # Card container
│   │   ├── Image/                # Imagem otimizada
│   │   └── Input/                # Input de formulário
│   │
│   ├── molecules/                # Componentes moleculares
│   │   ├── FavoriteButton/       # Botão de favoritar
│   │   ├── LoadingSpinner/       # Spinner de loading
│   │   ├── PokemonCard/          # Card de Pokémon
│   │   ├── PokemonSelector/      # Seletor de Pokémon (batalha)
│   │   ├── SearchBar/            # Barra de busca
│   │   ├── StatBar/              # Barra de estatísticas
│   │   └── TypeFilter/           # Filtro de tipos
│   │
│   ├── organisms/                # Componentes complexos
│   │   ├── BattleArena/          # ⚔️ Arena de batalha
│   │   ├── FavoritesList/        # Lista de favoritos
│   │   ├── Navigation/           # Navegação principal
│   │   ├── PokemonDetails/       # Detalhes do Pokémon
│   │   ├── PokemonList/          # Lista de Pokémons
│   │   ├── ProtectedRoute/       # Rota protegida
│   │   └── LoadingScreen/        # Tela de loading
│   │
│   └── templates/                # Templates de página
│       ├── AuthLayout/           # Layout de autenticação
│       └── PokedexLayout/        # Layout da Pokédex
│
├── lib/                          # Código compartilhado
│   ├── api/                      # Cliente HTTP e helpers
│   │   ├── auth.ts               # API de autenticação
│   │   ├── pokemon.ts            # API de Pokémons
│   │   ├── favorites.ts          # API de favoritos
│   │   └── client.ts             # Cliente HTTP configurado
│   │
│   ├── constants/                # Constantes da aplicação
│   │   ├── colors.ts             # Cores dos tipos de Pokémon
│   │   └── routes.ts             # Rotas da aplicação
│   │
│   ├── contexts/                 # React Contexts
│   │   └── AuthContext.tsx       # Context de autenticação
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAuth.ts            # Hook de autenticação
│   │   ├── usePokemon.ts         # Hook de Pokémons
│   │   └── useFavorites.ts       # Hook de favoritos
│   │
│   ├── middleware/               # Middleware customizado
│   │   └── auth.middleware.ts    # Middleware de autenticação
│   │
│   ├── prisma/                   # Cliente Prisma
│   │   └── client.ts             # Instância do Prisma Client
│   │
│   ├── repositories/             # Camada de acesso a dados
│   │   ├── user.repository.ts    # Repository de usuários
│   │   └── favorite.repository.ts # Repository de favoritos
│   │
│   ├── services/                 # Camada de lógica de negócio
│   │   ├── auth.service.ts       # Serviço de autenticação
│   │   ├── pokemon.service.ts    # Serviço de Pokémons
│   │   └── favorite.service.ts   # Serviço de favoritos
│   │
│   ├── types/                    # TypeScript types/interfaces
│   │   ├── auth.ts               # Tipos de autenticação
│   │   ├── pokemon.ts            # Tipos de Pokémon
│   │   ├── favorites.ts          # Tipos de favoritos
│   │   └── api.ts                # Tipos de API
│   │
│   └── utils/                    # Funções utilitárias
│       ├── jwt.ts                # Utilitários de JWT
│       ├── password.ts           # Hash e comparação de senhas
│       ├── validation.ts         # Schemas Zod de validação
│       └── format.ts             # Funções de formatação
│
├── prisma/                       # Configuração Prisma
│   └── schema.prisma             # Schema do banco de dados
│
├── tests/                        # Testes unitários
│   ├── api/                      # Testes das rotas da API
│   │   ├── auth/                 # Testes de autenticação
│   │   ├── pokemon/              # Testes de Pokémons
│   │   └── favorites/            # Testes de favoritos
│   │
│   ├── services/                 # Testes dos serviços
│   ├── repositories/             # Testes dos repositórios
│   ├── middleware/               # Testes do middleware
│   └── utils/                    # Testes das utilities
│
├── public/                       # Arquivos estáticos
├── next.config.js                # Configuração Next.js
├── tailwind.config.ts            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
├── vitest.config.ts              # Configuração Vitest
└── package.json                  # Dependências e scripts

```

## 🧪 Testes

O projeto possui uma suíte completa de testes unitários cobrindo:

- ✅ Utilitários (JWT, senhas, validação)
- ✅ Repositórios (User, Favorite)
- ✅ Serviços (Auth, Pokemon, Favorite)
- ✅ Middleware de autenticação
- ✅ Todas as rotas da API

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch (desenvolvimento)
npm run test:watch

# Executar com relatório de coverage
npm run test:coverage
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build e Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Banco de Dados
npm run db:generate  # Gera Prisma Client
npm run db:push      # Sincroniza schema com banco (dev)
npm run db:migrate   # Cria e aplica migrations (prod)
npm run db:studio    # Abre Prisma Studio (GUI do banco)

# Testes
npm test             # Executa testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Testes com coverage

```

## 🎮 Como Usar

### 1. Criar uma Conta
- Acesse a página de registro
- Preencha email, senha e nome (opcional)
- Faça login com suas credenciais

### 2. Explorar Pokémons
- Navegue pela lista paginada de Pokémons
- Use a busca para encontrar Pokémons específicos
- Filtre por tipo para ver Pokémons de um determinado tipo
- Clique em um Pokémon para ver detalhes completos

### 3. Favoritar Pokémons
- Na página de detalhes, clique no botão de favorito
- Acesse "Meus Favoritos" para ver todos os Pokémons favoritados
- Gerencie sua lista removendo favoritos quando quiser

### 4. Batalhar Pokémons ⚔️
- Acesse a **Arena de Batalha**
- Selecione o primeiro Pokémon usando a busca
- Selecione o segundo Pokémon
- Clique em "Iniciar Turno" para começar a batalha
- Assista aos turnos automáticos com cálculos de dano realistas
- Veja o histórico completo da batalha
- O vencedor é determinado quando o HP de um Pokémon chega a zero!

## 🏗️ Arquitetura

O projeto segue uma **Arquitetura em Camadas** com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Components, Pages, Hooks)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Application Layer           │
│    (API Routes, Middleware)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Business Layer             │
│          (Services)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Data Access Layer          │
│        (Repositories)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Database Layer             │
│      (Prisma + PostgreSQL)          │
└─────────────────────────────────────┘
```

### Princípios Aplicados

- **SOLID**: Cada classe tem uma responsabilidade única
- **DRY**: Sem duplicação de código
- **Dependency Inversion**: Dependências através de interfaces
- **Separation of Concerns**: Camadas bem definidas

## 🔐 Segurança

- ✅ **Senhas hasheadas** com bcrypt (10 rounds)
- ✅ **Autenticação JWT** com tokens seguros
- ✅ **Validação de dados** com Zod
- ✅ **Proteção de rotas** com middleware
- ✅ **HTTPS** em produção
- ✅ **Variáveis de ambiente** para secrets

### Variáveis de Ambiente no Fly.io

Configure as variáveis de ambiente no dashboard do Fly.io ou via CLI:

```bash
fly secrets set DATABASE_URL="sua-url-do-banco"
fly secrets set JWT_SECRET="sua-chave-secreta"
fly secrets set NEXT_PUBLIC_API_URL="https://seu-app.fly.dev"
```
## 📄 Sobre o Projeto

Este projeto foi desenvolvido como **teste técnico para entrevista**, demonstrando:

- ✅ Conhecimento em **Next.js** com App Router
- ✅ Arquitetura limpa e **SOLID principles**
- ✅ **Testes unitários** completos
- ✅ **TypeScript** com type safety
- ✅ Design responsivo e moderno
- ✅ Integração com APIs externas
- ✅ Sistema de autenticação seguro
- ✅ Feature extra: **Arena de Batalha de Pokémons**
