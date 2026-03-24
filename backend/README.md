# EcoPT — Backend API
![CI](https://github.com/gcarine-AI/Projeto_EcoPT/actions/workflows/ci.yml/badge.svg)


![CI](https://github.com/gcarine-AI/Projeto_EcoPT/actions/workflows/ci.yml/badge.svg)



API REST para a aplicação EcoPT, uma calculadora de pegada carbónica pensada para o contexto português.

Ligada ao **ODS 13 — Ação Climática** das Nações Unidas.


## Stack

| Tecnologia | Versão | Para quê |
|------------|--------|----------|
| Node.js | 24+ | Runtime JavaScript |
| Express | 4.x | Framework HTTP |
| Supabase | 2.x | Base de dados e autenticação |
| Docker | - | Containerização |
| GitHub Actions | - | CI/CD |


## Como correr localmente

### Pré-requisitos
- Node.js 24+
- Conta no Supabase

### Instalação

1. Clona o repositório
```bash
   git clone https://github.com/gcarine-AI/Projeto_EcoPT.git
   cd ecopt/backend
```

2. Instala as dependências
```bash
   npm install
```

3. Cria o ficheiro de variáveis de ambiente
```bash
   cp .env.example .env
```

4. Preenche o `.env` com as tuas credenciais Supabase

5. Arranca o servidor
```bash
   npm run dev
```

O servidor fica disponível em `http://localhost:3000`

## Variáveis de ambiente

Cria um ficheiro `.env` na raiz do `/backend` com estas variáveis:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_service_key_here
PORT=3000
FRONTEND_URL=http://localhost:4200
```

> **Nunca** partilhes os valores reais. O ficheiro `.env` está no `.gitignore`.

## Endpoints

### Autenticação

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|-------------|-----------|
| POST | `/auth/register` | ❌ | Criar conta |
| POST | `/auth/login` | ❌ | Login — devolve JWT |

**POST /auth/register — Body:**
```json
{
  "email": "utilizador@gmail.com",
  "password": "123456",
  "name": "Nome",
  "role": "personal"
}
```

**POST /auth/login — Body:**
```json
{
  "email": "utilizador@gmail.com",
  "password": "123456"
}
```

---

### Cálculos de Pegada Carbónica

> Todos os endpoints requerem header: `Authorization: Bearer TOKEN`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/calculations` | Criar cálculo |
| GET | `/calculations` | Listar cálculos do utilizador |
| GET | `/calculations/:id` | Ver detalhe de um cálculo |
| PUT | `/calculations/:id` | Editar cálculo |
| DELETE | `/calculations/:id` | Eliminar cálculo |
| GET | `/calculations/compare` | Comparar com médias PT e EU |

**POST /calculations — Body:**
```json
{
  "car_km": 200,
  "flights": 2,
  "diet": "omnivora",
  "kwh": 200
}
```

**Valores aceites para `diet`:** `vegan`, `vegetariana`, `omnivora`, `carnivora`

---

### Dicas de Redução

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|-------------|-----------|
| GET | `/tips` | ❌ | Listar todas as dicas |
| GET | `/tips/category/:category` | ❌ | Filtrar por categoria |

**Categorias disponíveis:** `transporte`, `dieta`, `energia`, `geral`

---

### FAQ Científico

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|-------------|-----------|
| GET | `/faq` | ❌ | Listar perguntas e respostas |

---

### Carsharing

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|-------------|-----------|
| POST | `/carsharing/calculate` | ✅ | Calcular poupança CO₂ |

**POST /carsharing/calculate — Body:**
```json
{
  "km": 50,
  "passengers": 3,
  "car_type": "gasolina"
}
```

**Tipos de carro:** `gasolina`, `diesel`, `hibrido`, `eletrico`

---

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Verificar se o servidor está online |

## Decisão de design

**Fatores de emissão portugueses em vez de valores europeus genéricos**

A maioria das calculadoras de CO₂ usa fatores de emissão genéricos europeus. 
O EcoPT usa dados específicos de Portugal:

- **Energia:** 0.233 kgCO₂/kWh (mix energético português — DGEG 2023)
- **Transporte:** 0.21 kgCO₂/km (média do parque automóvel português)
- **Comparador:** média portuguesa de 5.8 tonCO₂/ano vs média europeia de 8.4 tonCO₂/ano

Esta escolha torna os resultados mais precisos e relevantes para utilizadores portugueses.
