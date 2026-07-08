# Plano de Remediação

## 1. Objetivo

Propor soluções práticas para as falhas de segurança, UX, acessibilidade e funcionais identificadas durante as análises do Pet Alliance. Cada remediação é priorizada por impacto e esforço.

---

## 2. Legenda

| Prioridade | Prazo | Critério |
|---|---|---|
| 🔴 Alta | Imediato (1-3 dias) | Bloqueia funcionalidade ou fere requisito |
| 🟡 Média | Curto prazo (1 semana) | Melhoria significativa de qualidade |
| 🟢 Baixa | Médio prazo (2-4 semanas) | Melhoria incremental |

---

## 3. Remediações

### 🔴 Alta Prioridade

#### R01 — Validar senha forte no cadastro (RF02.3)

| Campo | Valor |
|---|---|
| **Problema** | BUG-002 — Cadastro aceita qualquer senha (ex: `12345678`) |
| **Causa** | `cadastrarUsuario.php` não valida critérios de senha forte |
| **Solução** | Adicionar validação no backend (`usuarioController.php:criarUsuario`) com regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/` |
| **Arquivos** | `backEnd/controllers/api/usuarioController.php`, `frontEnd/utils/formatacao.js` |
| **Esforço** | 2h |
| **Teste** | Incluir no CT02-04 |

```php
// Sugestão de código para usuarioController.php
public function criarUsuario(Usuario $usuario) {
    $senha = $usuario->getSenha();
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/', $senha)) {
        throw new InvalidArgumentException("A senha deve ter 8+ caracteres, com maiúscula, minúscula e número.");
    }
    // ... resto do método
}
```

#### R02 — Validar mínimo de 8 caracteres no login (RF01.3)

| Campo | Valor |
|---|---|
| **Problema** | BUG-001 — Login aceita senhas de 3 caracteres |
| **Causa** | `login.html` com `minlength="3"` e backend sem validação |
| **Solução** | Alterar `minlength` para `8` no HTML e adicionar validação no PHP |
| **Arquivos** | `frontEnd/view/login.html:16`, `backEnd/usuario/loginUsuario.php` |
| **Esforço** | 1h |

#### R03 — Validar mínimo de 8 caracteres na redefinição de senha (RF01.3)

| Campo | Valor |
|---|---|
| **Problema** | BUG-004 — `redefinirSenha()` checa `strlen < 3` em vez de `< 8` |
| **Causa** | Hardcoded incorreto no controller |
| **Solução** | Alterar `strlen($novaSenha) < 3` para `strlen($novaSenha) < 8` |
| **Arquivos** | `backEnd/controllers/api/usuarioController.php:220` |
| **Esforço** | 30min |

#### R04 — Adicionar `aria-live` em mensagens de feedback

| Campo | Valor |
|---|---|
| **Problema** | Mensagens flash (sucesso/erro) sem `role="alert"` |
| **Solução** | Adicionar `role="alert" aria-live="assertive"` ao container de flash messages |
| **Arquivos** | `backEnd/home.php` (flash message div), `match.php` |
| **Esforço** | 1h |

---

### 🟡 Média Prioridade

#### R05 — Associar labels a inputs com `for`/`id`

| Campo | Valor |
|---|---|
| **Problema** | Formulários com `<label>` sem atributo `for` |
| **Solução** | Adicionar `id` único em cada input e `for` correspondente no label |
| **Arquivos** | `frontEnd/view/cadastrarAnimal.html`, `frontEnd/view/home.html`, `frontEnd/view/login.html` |
| **Esforço** | 3h |

#### R06 — Tornar carrossel de fotos acessível por teclado

| Campo | Valor |
|---|---|
| **Problema** | Carrossel depende de `mouseenter`/`mouseleave` |
| **Solução** | Adicionar listeners de teclado (`keydown` → setas esquerda/direita) e `role="region"` + `aria-label` |
| **Arquivos** | `frontEnd/utils/app.js` (função `carregarCarrosselEventos`) |
| **Esforço** | 4h |

#### R07 — Adicionar foco visível (`:focus`) em todos os elementos interativos

| Campo | Valor |
|---|---|
| **Problema** | Navegação por teclado sem indicador visual |
| **Solução** | Adicionar no CSS global: `*:focus { outline: 2px solid #4A90D9; outline-offset: 2px; }` |
| **Arquivos** | `frontEnd/style/style.css` |
| **Esforço** | 30min |

#### R08 — Adicionar validação de CPF/Email no login (RF01)

| Campo | Valor |
|---|---|
| **Problema** | BUG-003 — Login aceita apenas CPF, não email |
| **Causa** | Formulário tem apenas campo `cpf` e backend busca só por CPF |
| **Solução** | (1) Renomear campo para aceitar CPF ou email; (2) backend detectar qual foi informado e buscar adequadamente |
| **Arquivos** | `frontEnd/view/login.html`, `backEnd/usuario/loginUsuario.php` |
| **Esforço** | 6h |
| **Nota** | Pode ser tratado como melhoria futura (baixa prioridade funcional) |

#### R09 — Adicionar `lang="pt-BR"` em páginas sem declaração

| Campo | Valor |
|---|---|
| **Problema** | `configuracoes.html`, `cadastrarUsuario.html` e outras sem `lang` |
| **Solução** | Adicionar `<html lang="pt-BR">` em todas as páginas |
| **Arquivos** | Todas as views HTML standalone |
| **Esforço** | 2h |

#### R10 — Adicionar confirmação em ações destrutivas

| Campo | Valor |
|---|---|
| **Problema** | Exclusão de conta sem confirmação visual clara |
| **Solução** | Substituir `confirm()` por modal customizado com `role="alertdialog"` e `aria-describedby` |
| **Arquivos** | `frontEnd/utils/app.js` (função `excluirAnimal`) |
| **Esforço** | 3h |

---

### 🟢 Baixa Prioridade

#### R11 — Adicionar link "Pular para conteúdo principal"

| Campo | Valor |
|---|---|
| **Problema** | Usuários de leitor de tela precisam passar pela navbar |
| **Solução** | Adicionar link oculto no topo: `<a href="#main-content" class="skip-link">Pular para conteúdo</a>` |
| **Arquivos** | `frontEnd/view/navBar.html` |
| **Esforço** | 1h |

#### R12 — Melhorar contraste de cores

| Campo | Valor |
|---|---|
| **Problema** | Cores definidas sem verificação de contraste WCAG |
| **Solução** | Auditar com ferramenta (ex: WebAIM Contrast Checker) e ajustar cores para ratio mínimo de 4.5:1 |
| **Arquivos** | `frontEnd/style/style.css` |
| **Esforço** | 3h |

#### R13 — Adicionar feedback visual em botões (loading state)

| Campo | Valor |
|---|---|
| **Problema** | Ao clicar em "Enviar Match", não há indicador de carregamento |
| **Solução** | Desabilitar botão + exibir spinner/texto "Enviando..." enquanto a requisição não retorna |
| **Arquivos** | `frontEnd/utils/app.js` (event listener de match) |
| **Esforço** | 2h |

#### R14 — Implementar testes automatizados

| Campo | Valor |
|---|---|
| **Problema** | Zero testes automatizados (ISO 25010 — Testabilidade nota 2) |
| **Solução** | Adicionar PHPUnit para testes unitários nos DAOs + Controllers. Jest para frontend |
| **Esforço** | 1-2 semanas |
| **Nota** | Requer setup inicial de ambiente de teste |

---

## 4. Priorização por Esforço vs. Impacto

```
Alto impacto │ R01 R02 R03 R04 R06   │
             │ R05 R07               │ R08 R10
             │                       │
             │ R09 R11               │ R12 R13 R14
Baixo impacto│                       │
             └───────────────────────┴──────────────
              Baixo esforço          Alto esforço
```

**Recomendação:** Executar primeiro o quadrante superior esquerdo (R01, R02, R03, R04, R06, R05, R07) — alto impacto com baixo esforço.

---

## 5. Cronograma Sugerido

| Semana | Ação |
|---|---|
| Semana 1 | R01, R02, R03, R04 (validações de senha + acessibilidade crítica) |
| Semana 2 | R05, R06, R07 (labels, carrossel, focus) |
| Semana 3 | R08, R09, R10 (login por email, lang, confirmação) |
| Semana 4 | R11, R12, R13, R14 (skip-link, contraste, loading, testes) |

---

## 6. Histórico de Revisões

| Versão | Data | Autor | Alteração |
|---|---|---|---|
| 1.0 | 08/07/2026 | Arthur Iantas Stelzner | Plano baseado nos bugs e falhas identificados |
