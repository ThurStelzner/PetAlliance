# Plano de Testes — Pet Alliance

## 1. Identificação do Documento

| Campo | Valor |
|---|---|
| **Projeto** | Pet Alliance |
| **Versão** | 1.1 |
| **Data** | 08/07/2026 |
| **Responsável** | Arthur Iantas Stelzner |
| **Aprovador** | — |
| **Tipo de Teste** | Funcional (End-to-End / Manual) |
| **Ambiente** | Desenvolvimento |

---

## 2. Objetivo

Este plano define a estratégia, os recursos, o cronograma e a abrangência dos testes funcionais do sistema **Pet Alliance**, uma plataforma web para conexão entre tutores de animais de raça para acasalamento e venda de filhotes.

O objetivo é validar que todos os requisitos funcionais atendem ao especificado no documento SRS (`docks/requisitosFuncionais.txt`), garantindo a qualidade do sistema antes de sua evolução para ambiente de homologação.

---

## 3. Escopo

### 3.1. Dentro do Escopo (Será Testado)

- Autenticação (login, recuperação de senha)
- Cadastro de usuários com validação de CPF, email único e senha forte
- Verificação de email (código e link)
- Cadastro, edição, listagem e exclusão de animais (pets) — limite de **10 fotos**
- Match entre animais (solicitação, aceite, recusa)
- Chat entre usuários com match ativo
- Venda de filhotes (anúncio com preço)
- Pagamentos integrados (AbacatePay)
- Perfil do usuário (edição, foto, exclusão)
- Favoritar animais
- Denúncias (cadastro e resolução pelo admin)
- Notificações (solicitações de match, lidas/não lidas)
- Painel administrativo (gerenciamento de denúncias, usuários, pets)
- Configurações e privacidade (senha, perfil público/privado)
- Membros / Destaques (planos de destaque para animais)
- Responsividade (navegadores, celulares, tablets)
- Navegação (navbar, footer, rotas)

### 3.2. Fora do Escopo

Consulte o documento **Escopo Negativo** (`docks/escopo-negativo.md`).

---

## 4. Estratégia de Testes

| Tipo | Abordagem | Ferramenta |
|---|---|---|
| Teste Funcional (E2E) | Manual, navegando pelo sistema como usuário final | Navegador (Chrome/Firefox) + Inspecionar |
| Teste de API | Opcional — chamadas diretas aos endpoints PHP | Postman / Insomnia |
| Teste de Regressão | Reexecução dos casos críticos após cada alteração | Checklist manual |
| Teste de Aceitação | Validação com o cliente/PO ao final do ciclo | Demonstração guiada |

---

## 5. Ciclos de Teste

### 5.1. Ciclo 1 — Funcionalidades Core (Semanas 1–2)

- RF01: Autenticação
- RF02: Cadastro de Usuário
- RF03: Cadastro de Pet
- RF09: Perfil

### 5.2. Ciclo 2 — Interação entre Usuários (Semanas 3–4)

- RF04: Listagem de Pets
- RF05: Match de Animais
- RF06: Chat
- RF11: Configurações e Privacidade

### 5.3. Ciclo 3 — Transações e Administração (Semanas 5–6)

- RF07: Venda de Filhotes
- RF08: Pagamentos
- RF10: Administração

### 5.4. Ciclo 4 — Regressão e Fechamento (Semana 7)

- Reexecução de casos críticos
- Testes de responsividade
- Validação final com o PO

---

## 6. Recursos

### 6.1. Equipe

| Papel | Quantidade | Responsabilidade |
|---|---|---|
| Analista de Testes | 1 | Planejamento, execução e reporte |
| Desenvolvedor | 2 | Correção de defeitos |
| PO / Cliente | 1 | Validação e aceitação |

### 6.2. Ambiente

- **Servidor Web:** XAMPP (Apache + PHP 8.3+)
- **Banco de Dados:** MySQL 5.7+ (pet_alliance_db)
- **Navegadores:** Chrome, Firefox, Edge (últimas versões)
- **Dispositivos:** Desktop, tablet (768px), mobile (375px)
- **Ferramentas:** DevTools do navegador, GitHub Issues para defeitos

---

## 7. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Banco de dados privado sem acesso | Alta | Crítico | Solicitar acesso com antecedência; usar dump local se possível |
| Dependência de API externa (AbacatePay) | Média | Alto | Usar ambiente sandbox / mock da API |
| Ambiente de desenvolvimento instável | Média | Médio | Documentar critérios de parada no documento específico |
| Escopo crescer sem controle | Baixa | Alto | Seguir rigorosamente o Escopo Negativo |
| Falta de equipamentos para teste mobile | Média | Baixo | Usar DevTools modo responsivo |

---

## 8. Entregáveis

| Entregável | Descrição | Local |
|---|---|---|
| Plano de Testes | Este documento | `docks/plano-de-testes.md` |
| Escopo Negativo | O que **não** será testado | `docks/escopo-negativo.md` |
| Critérios de Entrada/Parada/Saída | Regras do ciclo | `docks/criterios.md` |
| Matriz de Rastreabilidade (RTM) | Requisito → Caso de Teste → Resultado | `docks/matriz-rastreabilidade.md` |
| Relatório de Execução | Resultados e estatísticas ao final | `docks/relatorio-testes.md` |

---

## 9. Cronograma

| Fase | Início | Fim |
|---|---|---|
| Planejamento | 08/07/2026 | 10/07/2026 |
| Ciclo 1 — Core | 13/07/2026 | 24/07/2026 |
| Ciclo 2 — Interação | 27/07/2026 | 07/08/2026 |
| Ciclo 3 — Transações | 10/08/2026 | 21/08/2026 |
| Ciclo 4 — Regressão | 24/08/2026 | 28/08/2026 |
| Entrega Final | 29/08/2026 | 29/08/2026 |

---

## 10. Aprovação

| Nome | Papel | Data | Assinatura |
|---|---|---|---|
| — | Analista de Testes | — | — |
| — | PO / Cliente | — | — |
