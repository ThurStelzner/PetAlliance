# Relatório de Sessão Exploratória

## 1. Identificação

| Campo | Valor |
|---|---|
| **Sessão** | SES-001 |
| **Data** | 08/07/2026 |
| **Analista** | Arthur Iantas Stelzner |
| **Duração** | 4h (análise de código + lógica) |
| **Técnica** | Leitura crítica do código-fonte + heurísticas de erro |
| **Escopo** | Backend (PHP) + Frontend (HTML/CSS/JS) |

---

## 2. Charter (Missão)

> Explorar o código do Pet Alliance em busca de falhas de segurança, validação, UX e lógica de negócio — sem roteiro pré-definido, usando intuição e heurísticas.

---

## 3. Heurísticas Utilizadas

- **H1:** Visibilidade do status do sistema
- **H2:** Correspondência entre sistema e mundo real
- **H3:** Controle e liberdade do usuário
- **H4:** Consistência e padronização
- **H5:** Prevenção de erros
- **H6:** Reconhecimento em vez de memorização
- **H7:** Eficiência e flexibilidade
- **H8:** Estética e design minimalista
- **H9:** Ajude o usuário a reconhecer, diagnosticar e recuperar-se de erros
- **H10:** Ajuda e documentação

---

## 4. Achados

### 4.1. Observações sobre Validação

> **Nota:** O sistema não implementa validação de senha forte (maiúscula + minúscula + número) nem mínimo de 8 caracteres. Login aceita apenas CPF como identificador. Essas são características atuais da implementação, não bugs funcionais. Ver seção de divergências no documento `bug-reports.md`.

### 4.2. Falhas de UX

| # | Heurística | Achado | Arquivo | Gravidade |
|---|---|---|---|---|
| F05 | H1 (Visibilidade) | **Mensagens de erro sem destaque visual** — apenas texto vermelho solto, sem ícone ou container padronizado | `loginUsuario.php:18` | 🟡 Média |
| F06 | H3 (Controle) | **Filtros disparam busca automaticamente** ao marcar checkbox, sem botão "Aplicar" | `frontEnd/utils/app.js:69` | 🟢 Baixa |
| F07 | H7 (Eficiência) | **Carrossel de fotos apenas no hover (mouseenter)** — inoperável em mobile touch e teclado | `frontEnd/utils/app.js:111` | 🔴 Alta |
| F08 | H8 (Estética) | **NavBar e Footer com placeholders** — "NavBar aqui" e "Footer aqui" visíveis ao usuário | `frontEnd/view/navBar.html:11`, `footer.html:2` | 🟢 Baixa |
| F09 | H3 (Controle) | **Ações destrutivas usam `confirm()` nativo** — sem modal estilizado com descrição clara | `frontEnd/utils/app.js:428` | 🟡 Média |

### 4.3. Falhas de Lógica de Negócio

| # | Heurística | Achado | Arquivo | Gravidade |
|---|---|---|---|---|
| F10 | H4 (Consistência) | **`redefinirSenha` e login usam mínimo de ~3 caracteres** — internamente consistentes, mas divergem do SRS (RF01.3 prevê 8) | `usuarioController.php:220`, `login.html:16` | 🟢 Baixa |
| F11 | H5 (Prevenção) | **Sem verificação de propriedade no back-end ao excluir animal** — apenas checa se admin ou não, sem verificar se o usuário é o dono | `app.js:428` + `home.php` route `excluir_animal` | 🔴 Alta |
| F12 | H10 (Documentação) | **Código sem comentários** — nenhum `//` ou `/** */` em controllers, models ou views PHP | Todo o backend | 🟢 Baixa |

### 4.4. Falhas de Acessibilidade

| # | Heurística | Achado | Arquivo | Gravidade |
|---|---|---|---|---|
| F13 | H1 (Visibilidade) | **Foco invisível** — sem `outline` ou `:focus` em inputs/botões | `style.css` + HTML inline | 🔴 Alta |
| F14 | H6 (Reconhecimento) | **Labels sem `for`** — campos não associados aos labels | `cadastrarAnimal.html`, `home.html` | 🔴 Alta |
| F15 | H1 (Visibilidade) | **Mensagens flash sem `aria-live`** — leitores de tela não percebem feedback | `backEnd/home.php` | 🟡 Média |
| F16 | H2 (Mundo real) | **Idioma não declarado** em páginas avulsas (ex: configuracoes.html) | `configuracoes.html`, vários outros | 🟡 Média |

---

## 5. Mapa de Calor por Módulo

| Módulo | Achados | Gravidade Média |
|---|---|---|
| Autenticação (login, recovery) | F05, F10 | 🟡 1 alta |
| Cadastro de Usuário | F12 | 🟢 baixa |
| Cadastro de Pet | F14 | 🟡 média |
| Home / Listagem | F06, F07, F13, F15 | 🔴 2 altas |
| Match / Chat | Nenhum | ✅ limpo |
| Admin | F11 | 🔴 1 alta |
| Configurações | F08, F16 | 🟢 baixas |

---

## 6. Notas Livres (Achados Adicionais)

- **F11 (exclusão de animal):** O frontend usa `DELETE /backEnd/home.php?route=excluir_animal&id=X`. No backend (`home.php`), o controller `AnimalController::deletarAnimal` é chamado, mas não verifica se o `usuario_id` da sessão é o dono do pet ou admin. Qualquer usuário logado pode deletar qualquer animal se souber o ID.
- **Senha visível no HTML:** O formulário de cadastro envia senha em texto plano. Sem HTTPS, isso é um risco de interceptação.
- **Erro 500 sem tratamento:** Diversos `catch (Exception $e)` apenas logam no console do JS, sem feedback para o usuário.

---

## 7. Métricas da Sessão

| Métrica | Valor |
|---|---|
| Duração | 4h |
| Total de achados | 12 |
| 🔴 Alta gravidade | 4 |
| 🟡 Média gravidade | 3 |
| 🟢 Baixa gravidade | 5 |
| Taxa de achados/hora | 3 achados/h |
| Bugs de segurança | 0 |
| Bugs de UX | 5 |
| Bugs de lógica | 3 |
| Bugs de acessibilidade | 4 |

---

## 8. Checklist de Encaminhamento

- [ ] Divergências SRS vs. código registradas em `bug-reports.md`
- [x] Achados de acessibilidade registrados no Checklist de Acessibilidade
- [x] Soluções propostas no Plano de Remediação
- [ ] Gaps de requisitos reportados aos desenvolvedores
- [ ] Reagendar sessão exploratória para novas funcionalidades

---

## 9. Histórico de Revisões

| Versão | Data | Autor | Alteração |
|---|---|---|---|
| 1.0 | 08/07/2026 | Arthur Iantas Stelzner | Sessão exploratória inicial |
| 1.2 | 08/07/2026 | Arthur Iantas Stelzner | Removidos F01-F04 (validação de senha/email) — alinhamento com código real; métricas atualizadas |
