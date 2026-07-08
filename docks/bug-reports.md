# Bug Reports — Relatório de Defeitos

## 1. Objetivo

Registrar os defeitos encontrados durante a inspeção do código em relação aos requisitos funcionais (SRS). Cada bug report contém passos para reprodução, severidade, prioridade e evidências.

---

## 2. Legenda

| Campo | Descrição |
|---|---|
| **BUG-ID** | Identificador único do defeito |
| **RF** | Requisito Funcional violado |
| **Severidade** | Blocker / Crítica / Alta / Média / Baixa |
| **Prioridade** | Imediata / Alta / Média / Baixa |
| **Status** | Open / In Progress / Fixed / Closed / Rejected |
| **Ambiente** | Desenvolvimento / Homologação / Produção |

---

## 3. Bug Reports

---

### BUG-001 — Login aceita senhas com menos de 8 caracteres

| Campo | Valor |
|---|---|
| **BUG-ID** | BUG-001 |
| **RF** | RF01.3 — "Senha com no mínimo 8 caracteres" |
| **Data** | 08/07/2026 |
| **Reportado por** | Analista de Testes |
| **Severidade** | **Média** |
| **Prioridade** | **Média** |
| **Status** | **Open** |
| **Ambiente** | Desenvolvimento |
| **Módulo** | Autenticação (`backEnd/usuario/loginUsuario.php`) |
| **Componente** | Formulário de login + backend |

#### Descrição

O requisito RF01.3 especifica que a senha deve ter **no mínimo 8 caracteres**. No entanto, o formulário de login (`frontEnd/view/login.html`) define `minlength="3"` e o backend (`loginUsuario.php`) não realiza nenhuma validação de tamanho mínimo — apenas verifica se a senha confere via `password_verify`. Uma senha de 3 caracteres é aceita sem qualquer aviso.

#### Passos para Reproduzir

1. Cadastrar um usuário com senha de 3 caracteres (ex: `Ab1`)
2. Fazer logout
3. Acessar `/index.php`
4. Informar CPF do usuário e senha `Ab1`
5. Clicar em "Entrar"

#### Resultado Obtido (Atual)

O login é realizado com sucesso, redirecionando para `/backEnd/home.php`.

#### Resultado Esperado

O sistema deve exibir a mensagem **"A senha deve ter no mínimo 8 caracteres"** e bloquear o login.

#### Evidências

```
Arquivo: frontEnd/view/login.html (linha 16)
<input type="password" name="senha" id="senha" maxlength="50" minlength="3" ...>
                                          minlength="3" ← deveria ser minlength="8"

Arquivo: backEnd/usuario/loginUsuario.php (linhas 10-43)
Nenhuma validação de strlen($senha) antes de password_verify()
```

#### Anexos
— *(inserir print do login com senha de 3 caracteres)*

#### Observações

Mesmo que o cadastro fosse corrigido para exigir 8+ caracteres, o login ainda precisa validar o mínimo para evitar ataques de força bruta com senhas curtas.

---

### BUG-002 — Cadastro de usuário não valida senha forte

| Campo | Valor |
|---|---|
| **BUG-ID** | BUG-002 |
| **RF** | RF02.3 — "Senha deve conter: Maiúscula, Minúscula e Número" |
| **Data** | 08/07/2026 |
| **Reportado por** | Analista de Testes |
| **Severidade** | **Média** |
| **Prioridade** | **Média** |
| **Status** | **Open** |
| **Ambiente** | Desenvolvimento |
| **Módulo** | Cadastro de Usuário (`backEnd/usuario/cadastrarUsuario.php`) |
| **Componente** | Backend — controller |

#### Descrição

O requisito RF02.3 determina que a senha do usuário deve conter **ao menos 1 letra maiúscula, 1 letra minúscula e 1 número**. O código PHP do cadastro (`cadastrarUsuario.php`) envia a senha diretamente para o DAO sem qualquer validação de complexidade. O JavaScript de frontend também não possui validação de senha forte. Qualquer string é aceita.

#### Passos para Reproduzir

1. Acessar `/backEnd/usuario/cadastrarUsuario.php`
2. Preencher todos os campos obrigatórios com dados válidos
3. Informar a senha `12345678` (apenas números, sem letras)
4. Clicar em "Cadastrar"

#### Resultado Obtido (Atual)

O usuário é cadastrado com sucesso, sem qualquer mensagem de erro.

#### Resultado Esperado

O sistema deve exibir a mensagem **"A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula e 1 número"** e recusar o cadastro.

#### Evidências

```
Arquivo: backEnd/usuario/cadastrarUsuario.php (linhas 14-96)
Nenhuma validação de senha forte — o dado segue direto para criarUsuario()

Arquivo: frontEnd/utils/formatacao.js
Valida apenas CPF e CEP — não valida senha

Arquivo: frontEnd/view/cadastrarUsuario.html (linha 14)
<input type="password" name="senha" id="senha" placeholder="Sua Senha aqui" required>
Apenas 'required' — sem pattern, sem minlength
```

#### Anexos
— *(inserir print do cadastro com senha "12345678" sendo aceito)*

#### Observações

A senha é armazenada com hash (`password_hash`), mas a falta de validação de complexidade permite senhas fracas.

---

### BUG-003 — Login não aceita email como identificador

| Campo | Valor |
|---|---|
| **BUG-ID** | BUG-003 |
| **RF** | RF01 — "O sistema deve permitir que o usuário realize login na plataforma. Entradas: Email/Username, CPF, Senha." |
| **Data** | 08/07/2026 |
| **Reportado por** | Analista de Testes |
| **Severidade** | **Baixa** |
| **Prioridade** | **Baixa** |
| **Status** | **Open** |
| **Ambiente** | Desenvolvimento |
| **Módulo** | Autenticação (`frontEnd/view/login.html`) |
| **Componente** | Formulário de login |

#### Descrição

O requisito RF01 especifica que o login deve aceitar como entrada **Email, Username ou CPF**, além da senha. O formulário atual possui apenas o campo **CPF**. Não há campo para email ou username, impossibilitando o login por esses identificadores.

#### Passos para Reproduzir

1. Acessar `/index.php`
2. Observar os campos do formulário de login
3. Tentar inserir email no lugar do CPF

#### Resultado Obtido (Atual)

O formulário contém apenas os campos "Cpf" e "Senha". O backend (`loginUsuario.php`) busca exclusivamente por CPF na tabela `tb_usuarios`.

#### Resultado Esperado

O formulário deve permitir login por **CPF ou Email**, e o backend deve identificar qual foi informado e buscar adequadamente no banco.

#### Evidências

```
Arquivo: frontEnd/view/login.html (linhas 12-16)
<h1>Login de usuário</h1>
<label for="cpf" >Cpf:</label>
<input type="text" name="cpf" ...>
<label for="senha">Senha:</label>
<input type="password" name="senha" ...>
→ Apenas campo CPF, sem email/username

Arquivo: backEnd/usuario/loginUsuario.php (linha 15)
$usuario = $usuarioDAO->read($cpf);
→ Busca apenas por CPF, não por email
```

#### Anexos
— *(inserir print do formulário de login mostrando apenas CPF + Senha)*

#### Observações

Defeito de baixa prioridade. A validação de CPF já identifica unicamente o usuário. Pode ser tratado como melhoria futura.

---

### BUG-004 — Redefinição de senha valida mínimo de 3 caracteres (inconsistente com RF01.3)

| Campo | Valor |
|---|---|
| **BUG-ID** | BUG-004 |
| **RF** | RF01.3 — "Senha com no mínimo 8 caracteres" |
| **Data** | 08/07/2026 |
| **Reportado por** | Analista de Testes |
| **Severidade** | **Média** |
| **Prioridade** | **Média** |
| **Status** | **Open** |
| **Ambiente** | Desenvolvimento |
| **Módulo** | Recuperação de Senha (`backEnd/controllers/api/usuarioController.php`) |
| **Componente** | Controller |

#### Descrição

O método `redefinirSenha()` no `usuarioController.php` valida que a nova senha tenha **pelo menos 3 caracteres** (`strlen($novaSenha) < 3`), enquanto o requisito RF01.3 determina o mínimo de **8 caracteres**. Há uma inconsistência clara entre o valor hardcoded e o especificado.

#### Passos para Reproduzir

1. Solicitar recuperação de senha
2. Receber o código de verificação
3. Informar código válido e nova senha com 4 caracteres (ex: `Ab12`)
4. Tentar redefinir

#### Resultado Obtido (Atual)

A senha é redefinida com sucesso com apenas 4 caracteres.

#### Resultado Esperado

O sistema deve recusar senhas com menos de 8 caracteres.

#### Evidências

```
Arquivo: backEnd/controllers/api/usuarioController.php (linha 220)
public function redefinirSenha($usuarioId, $novaSenha) {
    if (strlen($novaSenha) < 3) {   ← deveria ser < 8
```

#### Anexos
— *(inserir print da redefinição com senha curta)*

---

## 4. Métricas de Defeitos

| Métrica | Valor |
|---|---|
| Total de defeitos abertos | 4 |
| Blocker | 0 |
| Crítica | 0 |
| Alta | 0 |
| Média | 3 |
| Baixa | 1 |
| Taxa de defeitos por RF | RF01: 3 | RF02: 1 |

---

## 5. Histórico de Revisões

| Versão | Data | Autor | Alteração |
|---|---|---|---|
| 1.0 | 08/07/2026 | Arthur Iantas Stelzner | Criação com bugs reais da inspeção SRS vs. Código |
