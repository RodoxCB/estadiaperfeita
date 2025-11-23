# Estadia Perfeita

Um sistema de matching entre usuários e hotéis/pousadas, similar ao Tinder mas para hospedagem. Conecta viajantes com anfitriões compatíveis para experiências únicas de hospedagem.

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar banco de dados e dados de teste
```bash
npm run db:seed
```

### 3. Executar o servidor
```bash
npm run dev
```

### 4. Acessar a aplicação
- 🌐 **Aplicação:** http://localhost:3000
- 📱 **API:** http://localhost:3000/api

## 🔐 Credenciais de teste

- **Email:** `joao@example.com`
- **Senha:** `123456`

- **Email:** `maria@example.com`
- **Senha:** `123456`

## 🗃️ Tecnologias utilizadas

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Banco de dados:** SQLite (desenvolvimento local)
- **Autenticação:** JWT
- **Matching:** Algoritmo baseado em preferências

## 🎯 Funcionalidades

- ✅ Cadastro e login de usuários
- ✅ Configuração de preferências de viagem
- ✅ Sistema de matching inteligente
- ✅ Lista de hotéis compatíveis
- ✅ Interface responsiva com dark mode
- ✅ Design moderno com neomorphism/glassmorphism

## 📁 Estrutura do projeto

```
estadia-perfeita/
├── src/
│   ├── app/                 # Páginas Next.js
│   │   ├── api/            # APIs REST
│   │   ├── (auth)/         # Páginas de autenticação
│   │   └── (dashboard)/    # Páginas do dashboard
│   ├── components/         # Componentes React
│   ├── lib/               # Utilitários e configurações
│   └── models/            # Modelos de dados
├── data/                  # Banco SQLite
├── public/                # Arquivos estáticos
└── scripts/               # Scripts de seed
```

## 🔧 Desenvolvimento

### Comandos disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run db:seed` - Popular banco com dados de teste

### Arquivos importantes
- `.env.local` - Configurações de ambiente
- `src/lib/db-sqlite.ts` - Conexão com banco
- `src/lib/auth.ts` - Sistema de autenticação
- `src/lib/matching-sqlite.ts` - Algoritmo de matching

## 🔒 Configuração de Ambiente

Para configurar as variáveis de ambiente:

1. Copie o arquivo de exemplo: `cp .env.example .env.local`
2. Preencha as variáveis com seus valores reais
3. **Nunca commite** arquivos `.env*` - eles estão protegidos pelo `.gitignore`

## 🌿 Branches

- **main**: Código em produção
- **staging**: Ambiente de testes
- **development**: Desenvolvimento ativo

## 🎨 Personalização

O design usa Tailwind CSS com dark mode como padrão e pode ser facilmente personalizado editando as classes nos componentes em `src/components/`.

## 📈 Próximos passos

- [ ] Upload de imagens dos hotéis
- [ ] Sistema de mensagens entre usuários
- [ ] Avaliações e reviews
- [ ] Filtros avançados de busca
- [ ] Geolocalização
- [ ] Integração com mapas
