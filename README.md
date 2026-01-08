# 🎮 Pokédex Interativa

Uma aplicação web fullstack onde você pode navegar por uma Pokédex interativa, buscar Pokémons, favoritar seus preferidos e muito mais!

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT
- **API Externa**: PokéAPI

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Fly.io configurada
- PostgreSQL (via Fly.io ou local)

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
- `DATABASE_URL`: URL de conexão do PostgreSQL (Fly.io)
- `JWT_SECRET`: Chave secreta para JWT (gere uma string aleatória)
- `NEXT_PUBLIC_API_URL`: URL da API (http://localhost:3000 para desenvolvimento)

4. Configure o banco de dados:
```bash
# Gerar o Prisma Client
npm run db:generate

# Criar as tabelas no banco
npm run db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── (auth)/            # Rotas de autenticação
│   └── (pokedex)/         # Rotas da Pokédex
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
│   ├── prisma/           # Cliente Prisma
│   ├── services/         # Services (lógica de negócio)
│   ├── repositories/     # Repositories (acesso a dados)
│   └── utils/            # Funções utilitárias
└── prisma/               # Schema e migrations Prisma
```

## 🎯 Funcionalidades

- ✅ Autenticação (Cadastro, Login, Logout)
- ✅ Busca de Pokémons
- ✅ Listagem com paginação
- ✅ Detalhes do Pokémon
- ✅ Filtro por tipo
- ✅ Favoritar Pokémons (persistido no backend)
- ✅ Design responsivo estilo Gameboy

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run db:generate` - Gera Prisma Client
- `npm run db:push` - Sincroniza schema com banco
- `npm run db:migrate` - Cria migration
- `npm run db:studio` - Abre Prisma Studio

## 🔐 Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT para autenticação
- Validação de dados com Zod
- Proteção de rotas API

## 📄 Licença

MIT
