# 🚀 Guia de Configuração - Pokédex Interativa

## 📋 Passo a Passo Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados no Fly.io

#### 2.1. Criar App no Fly.io

```bash
# Instalar Fly CLI (se ainda não tiver)
# Windows: https://fly.io/docs/hands-on/install-flyctl/

# Login no Fly.io
fly auth login

# Criar um novo app PostgreSQL
fly postgres create --name pokedex-db --region gru  # ou outra região próxima
```

#### 2.2. Obter String de Conexão

```bash
# Listar apps
fly apps list

# Obter informações do banco
fly postgres connect -a pokedex-db

# Ou obter a URL diretamente
fly postgres connect -a pokedex-db --command "echo \$DATABASE_URL"
```

A URL será algo como:
```
postgresql://postgres:password@hostname:5432/pokedex?sslmode=require
```

#### 2.3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://postgres:password@hostname:5432/pokedex?sslmode=require"

# JWT - Gere uma chave secreta forte
JWT_SECRET="sua-chave-secreta-super-segura-aqui-mude-isso"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**⚠️ IMPORTANTE**: 
- Substitua `DATABASE_URL` pela URL real do seu banco Fly.io
- Gere uma `JWT_SECRET` forte (pode usar: `openssl rand -base64 32`)

### 3. Configurar Prisma

```bash
# Gerar o Prisma Client
npm run db:generate

# Criar as tabelas no banco de dados
npm run db:push
```

### 4. Verificar Configuração

```bash
# Abrir Prisma Studio para ver o banco
npm run db:studio
```

### 5. Iniciar o Projeto

```bash
# Modo desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 🔧 Comandos Úteis

### Prisma

```bash
# Gerar Prisma Client após mudanças no schema
npm run db:generate

# Sincronizar schema com banco (desenvolvimento)
npm run db:push

# Criar migration (produção)
npm run db:migrate

# Abrir Prisma Studio (interface visual do banco)
npm run db:studio
```

### Fly.io

```bash
# Conectar ao banco via psql
fly postgres connect -a pokedex-db

# Ver logs do banco
fly logs -a pokedex-db

# Ver informações do app
fly status -a pokedex-db
```

## 📝 Estrutura de Arquivos Criada

```
/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Autenticação
│   │   ├── pokemon/           # Endpoints de Pokémon
│   │   └── favorites/         # Endpoints de Favoritos
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página inicial
├── lib/
│   ├── middleware/           # Middlewares (auth)
│   ├── prisma/               # Cliente Prisma
│   ├── repositories/         # Repositories (acesso a dados)
│   ├── services/            # Services (lógica de negócio)
│   └── utils/               # Utilitários (JWT, password, validation)
├── prisma/
│   └── schema.prisma         # Schema do banco de dados
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎯 Próximos Passos

1. ✅ Estrutura do projeto criada
2. ✅ Prisma configurado
3. ✅ API Routes criadas
4. ⏭️ Criar componentes do frontend
5. ⏭️ Implementar páginas (Login, Register, Pokédex, Detalhes)
6. ⏭️ Adicionar estilização Gameboy/Pokédex
7. ⏭️ Implementar autenticação no frontend
8. ⏭️ Implementar favoritos no frontend

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

- Verifique se a `DATABASE_URL` está correta
- Confirme que o banco está rodando no Fly.io
- Teste a conexão: `fly postgres connect -a pokedex-db`

### Erro: "Prisma Client not generated"

```bash
npm run db:generate
```

### Erro: "JWT_SECRET is not defined"

- Certifique-se de ter criado o arquivo `.env`
- Verifique se a variável `JWT_SECRET` está definida

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Fly.io Docs](https://fly.io/docs)
- [PokéAPI](https://pokeapi.co/)
