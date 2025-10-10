# 🎯 Cubos Movies

Um sistema completo desenvolvido com arquitetura moderna, utilizando Node.js/Express no backend e React no frontend, com foco em escalabilidade e boas práticas de desenvolvimento.

## 📋 Índice

- [Como Executar](#-como-executar)
- [Arquitetura](#-arquitetura)
- [Patterns Utilizados](#-patterns-utilizados)

## ▶️ Como Executar

### 1. Clone o repositório
```bash
git https://github.com/joaoMiraya/cubos-teste.git
cd cubos
```
### 2. 🐳 Rode com Docker (Recomendado)
```bash
# Conceda permissão para o executável criar o .env
chmod +x make_env.sh

# Execute
./create_env.sh

# Suba todos os serviços
docker compose up --build -d

# Conceda permissão para o executável criar as migrations
chmod +x gen_migration.s

# Gere as migrations iniciais
./gen_migration.sh InitialMigration

# Acessar
http://localhost:5173/
```

## 🛠 Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | ^18.0.0 | Runtime JavaScript |
| **Express** | ^4.18.0 | Framework web |
| **TypeScript** | ^5.0.0 | Superset tipado do JavaScript |
| **TypeORM** | ^0.3.0 | ORM para TypeScript/JavaScript |
| **PostgreSQL** | ^15.0 | Banco de dados relacional |
| **AWS SDK** | ^3.0.0 | Integração com serviços AWS |
| **node-cron** | ^3.0.0 | Agendamento de tarefas |

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | ^18.0.0 | Biblioteca para interfaces |
| **TypeScript** | ^5.0.0 | Tipagem estática |
| **React Query** | ^4.0.0 | Gerenciamento de estado servidor |
| **Axios** | ^1.0.0 | Cliente HTTP |
| **TailwindCSS** | ^3.0.0 | Framework CSS utilitário |

### DevOps & Infraestrutura
- **Docker** & **Docker Compose** - Containerização
- **Amazon S3** - Armazenamento de arquivos
- **Amazon SES** - Serviço de e-mail
- **PostgreSQL** - Banco de dados principal

## 🏗 Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │    Backend      │
│   (React TS)    │◄──►│  (Express TS)   │
└─────────────────┘    └─────────────────┘
                              │
                       ┌──────▼──────┐
                       │ Camadas     │
                       │             │
                       │ Route       │
                       │ Controller  │
                       │ Service     │
                       │ Repository  │
                       └──────┬──────┘
                              │
                    ┌─────────▼─────────┐
                    │   PostgreSQL      │
                    └───────────────────┘
```


### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp backend/.env.example backend/.env
```

## 🔧 Variáveis de Ambiente

### Servidor
```env
PORT=3000
NODE_ENV=development
API_VERSION=v1
```

### Banco de Dados
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cubos_db
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=cubos_user
DATABASE_PASSWORD=password
DATABASE_NAME=cubos_db
```

### Segurança
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
```

### AWS
```env
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
SENDER_EMAIL=your-email@domain.com
```

### CORS
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## 🎨 Patterns Utilizados

### 🔔 Notification Pattern
- **Objetivo**: Evitar o uso de exceptions, melhorando performance
- **Benefícios**: 
  - Melhor retorno para o usuário
  - Performance otimizada
  - Controle de fluxo mais claro

### 🏛 Repository Pattern
- **Objetivo**: Separação de responsabilidades
- **Benefícios**:
  - Facilita testes unitários
  - Melhora manutenibilidade
  - Abstrai acesso a dados

**Fluxo da arquitetura:**
```
Route → Controller → Service → Repository → PostgreSQL
```

### 🔄 Dependency Injection
- Facilita testes e manutenção
- Desacoplamento entre camadas
- Melhor testabilidade