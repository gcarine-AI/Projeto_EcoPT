# 🌿 EcoPT — Calculadora de Pegada Carbónica

[![CI/CD — EcoPT Frontend](https://github.com/gcarine-AI/Projeto_EcoPT/actions/workflows/ciFrontend.yml/badge.svg)](https://github.com/gcarine-AI/Projeto_EcoPT/actions/workflows/ciFrontend.yml)

A primeira calculadora de pegada carbónica pensada especificamente para Portugal.
Usa fatores de emissão portugueses (APA 2025 / DGEG Energia em Números 2025) para resultados mais precisos e relevantes.

---

## ODS 13 — Ação Climática

Este projeto contribui para o ODS 13 das Nações Unidas ao consciencializar 
os cidadãos portugueses sobre o impacto das suas escolhas diárias no clima, 
e ao sugerir ações concretas de redução.

---

## O que é o EcoPT?

A maioria das pessoas não sabe quanto CO₂ gera no dia a dia. 
O EcoPT calcula a tua pegada carbónica com base em:
- 🚗 Quilómetros de carro por semana
- ✈️ Voos por ano
- 🥗 Tipo de dieta
- ⚡ Consumo de energia em casa (kWh)

E compara com a média portuguesa (5.1t) e europeia (9.0t).

---

## Stack tecnológica

| Camada | Tecnologia | Deploy |
|--------|-----------|--------|
| Frontend | Angular 21+ | Vercel |
| Backend | Node.js 24+ + Express | Render |
| Base de dados | Supabase (PostgreSQL) | Supabase Cloud |
| Auth | Supabase Auth (JWT) | Supabase Cloud |
| CI/CD | GitHub Actions | GitHub |

---

## Estrutura do repositório
```
Projeto_EcoPT/
├── backend/    → API REST (Node.js + Express)
├── frontend/   → Aplicação web (Angular)
└── .github/    → Pipeline CI/CD
```

---

## Links

- 🔗 Aplicação: *em breve*
- 📦 Backend API: ver [backend/README.md](./backend/README.md)
- 🎯 ODS 13: [undp.org](https://www.undp.org/pt/sustainable-development-goals/acao-climatica)

---

## Como correr localmente
```bash
# Backend
cd backend
npm install
cp .env.example .env
# preenche o .env com as tuas credenciais Supabase
npm run dev

# Frontend (em breve)
cd frontend
npm install
ng serve
```

---

## Decisão de design

**Fatores de emissão oficiais portugueses (APA/DGEG 2025)**

- **Energia:** 0.25 kgCO₂e/kWh — Fator de Emissão da Eletricidade, APA 2025
- **Transporte:** 0.21 kgCO₂/km — média do parque automóvel português
- **Comparador:** média PT de 5.1 tonCO₂/hab (DGEG, Energia em Números 2025) 
  vs média EU de 9.0 tonCO₂/hab (Eurostat 2023)
