# Como contribuir com o Caxi

Toda mudança entra na `main` por Pull Request, com os checks do CI verdes. Ninguém faz push direto na `main`, nem quem administra o repositório.

## 1. Crie uma branch curta

```bash
git checkout main && git pull
git checkout -b feat/vendas-pedido-duplicado
```

O nome segue `<tipo>/<descricao-em-kebab-case>`: letras minúsculas, números e hífens.

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | Funcionalidade nova | `feat/onboarding-cadastro-produto` |
| `fix` | Correção de bug | `fix/acesso-codigo-expirado` |
| `refactor` | Mudança de código sem mudar comportamento | `refactor/pedidos-calculo-total` |
| `test` | Só testes | `test/estoque-idempotencia` |
| `docs` | Só documentação | `docs/readme-ambiente-local` |
| `infra` | Infraestrutura como código (AWS CDK) | `infra/cdk-cognito` |
| `ci` | Workflows do GitHub Actions | `ci/adiciona-trivy` |
| `chore` | Manutenção: dependências, configuração | `chore/atualiza-nestjs` |

Comece a descrição pela jornada ou área (`onboarding`, `operacao`, `vendas`, `resultados`, `acesso`). Assim fica claro de onde a branch vem.

Uma branch deve durar horas ou poucos dias. Se crescer demais, divida em PRs menores.

## 2. Faça commits no padrão Conventional Commits

```
<tipo>(<area>): <descrição no imperativo>

feat(pedidos): registra pedido do comprador
fix(acesso): trata código expirado
test(estoque): cobre toque duplo na confirmação
```

Os tipos são os mesmos da branch. A área é opcional, mas ajuda a ler o histórico.

## 3. Abra o Pull Request

- **Título:** mesmo padrão do commit, com até 72 caracteres. Com squash merge, ele vira a mensagem do commit na `main`.
- **Descrição:** o template já vem preenchido. Responda as seções e marque o checklist.
- **Revisão:** o GitHub pede revisão automaticamente a quem está no `CODEOWNERS`.

## 4. Espere os checks

| Check | O que verifica |
|---|---|
| `padroes-do-pr` | Nome da branch e título do PR |
| `qualidade` | Segredos vazados (gitleaks), lint, tipos, testes, migrations, dependências vulneráveis e build |
| `ambiente-reproduzivel` | Sobe o projeto do zero com Docker Compose e roda o smoke test |

Com algum check vermelho, o merge fica bloqueado. Abra o check, leia o erro, corrija e faça push na mesma branch: o CI roda de novo.

Se só o título estiver errado, basta editá-lo no GitHub. O `padroes-do-pr` roda de novo sozinho.

## 5. Merge

Use **Squash and merge**. A branch é apagada automaticamente depois do merge.
