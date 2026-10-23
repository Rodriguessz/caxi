# Caxi

ERP mobile-first para feirantes e vendedores permissionários.
Monorepo com `apps/web` (React + Vite) e `apps/api` (NestJS + TypeORM + PostgreSQL/PostGIS).

## Ambiente local reproduzível

**Pré-requisito único:** Docker com Compose v2 (Docker Desktop no Windows/macOS).

```bash
git clone <url-do-repo> caxi && cd caxi
docker compose up --build -d
```

Abra <http://localhost:8080>. A página mostra o estado da API e a barraca de demonstração lida do banco.

| Serviço | O que faz | Porta |
|---|---|---|
| `db` | PostgreSQL 16 + PostGIS 3.4 | 5432 |
| `migrate` | Tarefa única: aplica as migrations e o seed fictício, depois encerra | — |
| `api` | NestJS em `/api/*`, com `/api/health/live` e `/api/health/ready` | 3000 |
| `web` | Build da SPA servido por nginx, com `/api/*` encaminhado à API | 8080 |

Comandos úteis (exigem Node 22, ver `.nvmrc`):

```bash
npm run smoke      # verifica SPA, API/banco e seed (http://localhost:8080)
npm run dev:logs   # logs da API
npm run dev:reset  # apaga o banco e recria tudo do zero
npm run dev:down   # para o ambiente
```

### Desenvolvimento com hot reload

Para editar código com recarga automática, suba só o banco no Docker e rode as apps no host:

```bash
npm ci
docker compose up -d db
npm run migration:run -w apps/api && npm run seed -w apps/api
npm run dev -w apps/api     # http://localhost:3000/api
npm run dev -w apps/web     # http://localhost:5173 (proxy de /api para :3000)
```

### O que torna o ambiente reproduzível

- **Versões fixadas:** imagens com tag explícita (`postgis/postgis:16-3.4`, `node:22-alpine`, `nginx:1.27-alpine`), `package-lock.json` versionado e `npm ci` nos builds.
- **Schema só por migration:** `synchronize` desligado; o banco nasce de `apps/api/src/database/migrations`.
- **Dados de partida declarados:** seed idempotente com dados marcados como fictícios.
- **Zero configuração manual:** o compose tem valores padrão; `.env.example` documenta o que pode ser sobrescrito. Nenhum segredo real é versionado.
- **Ordem garantida:** `db` saudável → `migrate` conclui com sucesso → `api` saudável → `web`.
- **Mesma forma da nuvem:** a imagem da API é a mesma que irá para o ECS; `migrate` espelha a tarefa isolada de migrations do pipeline; o nginx roteia `/api/*` como o CloudFront.
- **Verificado em máquina limpa:** o job `ambiente-reproduzivel` do CI sobe o compose do zero e roda o smoke test.

> Este ambiente é para **desenvolvimento**. Ele não serve como evidência de deploy nem de CI/CD. Essas evidências vêm das execuções do GitHub Actions e dos deploys no piloto AWS.

## Qualidade (CI em `.github/workflows/ci.yml`)

Em todo PR e push na `main`: gitleaks, lint, typecheck, testes Jest, migrations do zero em PostGIS limpo (incluindo revert), `npm audit` e build. Além disso, sobe o ambiente reproduzível do zero e roda o smoke test.
