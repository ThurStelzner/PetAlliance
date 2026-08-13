# Guia de Execução — Como Rodar o PetAlliance

Tutorial completo de instalação e execução do sistema em ambiente local (Windows). Cobre o que é necessário, o passo a passo para subir o servidor, como configurar o banco de dados (local ou remoto) e a resolução dos erros mais comuns.

---

## 1. Visão geral

| Componente | Tecnologia |
|---|---|
| Frontend | HTML5 + CSS3 + JavaScript (Vanilla) |
| Backend | PHP 8.3+ (recomendado 8.4) com PDO |
| Banco de dados | MySQL — **remoto** (`tini.click`, acesso restrito à equipe) **ou local** (criado com `docs/banco.sql`) |
| Pagamentos | AbacatePay (API REST) — chaves no `.env` |
| E-mail | PHPMailer (SMTP) — credenciais no `.env` |
| Servidor local | Servidor embutido do PHP (`php -S`) ou Apache/XAMPP |

**Importante — arquivos de configuração fora do git:** o `backEnd/config/config.php` (credenciais do banco) e o `.env` (chaves AbacatePay/SMTP) **não são versionados** — ambos estão no `.gitignore` e **não vêm no clone**. Cada pessoa configura os seus (seções 3 e 4). Quem **não tem acesso** ao banco remoto da equipe cria um **banco local** importando o `docs/banco.sql`.

---

## 2. Pré-requisitos

| Item | Obrigatório | Observação |
|---|---|---|
| **PHP 8.3+** (64 bits) | Sim | Recomendado 8.4.x (mesma versão usada no desenvolvimento) |
| Extensões PHP | Sim | `pdo_mysql`, `mysqli`, `curl`, `openssl`, `mbstring`, `gd`, `fileinfo` |
| `php.ini` configurado | Sim | Sem ele o PHP não carrega extensões (ver seção 5) |
| **MySQL 5.7+ / XAMPP** | Sim* | Obrigatório para quem **não tem acesso** ao banco remoto da equipe |
| Git | Sim | Para clonar o repositório |
| Composer | Não | O `vendor/` já está versionado no repositório |
| Navegador | Sim | Chrome, Firefox ou Edge |

### 2.1 Verificando o ambiente

```powershell
php -v                     # versão do PHP (precisa ser 8.3+)
php --ini                  # confirma se o php.ini está carregado
php -m                     # lista as extensões ativas — precisa ter pdo_mysql
```

Se `php --ini` mostrar `Loaded Configuration File: (none)` ou o `php -m` não listar `pdo_mysql`, **pare aqui** e siga o [Guia de Erros PHP](guia-erros-php.md) (seção 1) — é a causa nº 1 de falha ao rodar o sistema.

---

## 3. Passo a passo para rodar

### Passo 1 — Clonar o repositório

```powershell
git clone https://github.com/ThurStelzner/PetAlliance.git
cd PetAlliance
```

### Passo 2 — Conferir as pastas essenciais

O projeto já vem com tudo que precisa (não é necessário `composer install`):

```
PetAlliance/
├── vendor/          # PHPMailer (já versionado)
├── .env.example     # Modelo do .env (copiar para .env)
├── backEnd/config/config.php   # Criado localmente (NÃO vem no clone)
├── index.php        # Landing page (cria a pasta uploads/ automaticamente)
└── docs/banco.sql   # Script para criar o banco LOCAL
```

### Passo 3 — Criar o `backEnd/config/config.php`

O `config.php` é **ignorado pelo git** (contém as credenciais do banco) — quem já tem o arquivo (membro da equipe) pode pular este passo. Se você **não o recebeu**, crie com as credenciais do seu ambiente:

**Com acesso ao banco remoto da equipe:** solicite o `config.php` a um membro do time (ele contém o host, banco, usuário e senha do MySQL remoto).

**Sem acesso (banco local):** crie o arquivo `backEnd/config/config.php` com o conteúdo abaixo e as credenciais do seu MySQL local (padrão: `localhost` / `root` / senha vazia):

```php
<?php
    function carregarEnv() {
        $arquivo = __DIR__ . '/../../.env';
        if (!file_exists($arquivo)) {
            return;
        }
        $linhas = file($arquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($linhas as $linha) {
            $linha = trim($linha);
            if ($linha === '' || str_starts_with($linha, '#')) {
                continue;
            }
            $partes = explode('=', $linha, 2);
            if (count($partes) === 2) {
                $chave = trim($partes[0]);
                $valor = trim($partes[1]);
                $valor = trim($valor, '"\'');
                putenv("$chave=$valor");
                $_ENV[$chave] = $valor;
            }
        }
    }

    carregarEnv();
    date_default_timezone_set('America/Sao_Paulo');

    define('MAX_FILE_SIZE', 100 * 1024 * 1024);

    class Conexao {
        private static $instancia = null;

        public static function getConexao() {
            if(self::$instancia === null) {
                try {
                    self::$instancia = new PDO(
                        "mysql:host=localhost;dbname=pet_alliance_db;charset=utf8",
                        "root",
                        ""
                    );
                    self::$instancia->setAttribute(
                        PDO::ATTR_ERRMODE,
                        PDO::ERRMODE_EXCEPTION
                    );
                    self::$instancia->exec("SET time_zone = 'America/Sao_Paulo'");
                } catch (PDOException $e){
                    error_log("Erro de conexão: " . $e->getMessage());
                    throw new InvalidArgumentException("Erro ao conectar ao banco de dados. Tente novamente mais tarde.");
                }
            }
            return self::$instancia;
        }
    }
```

### Passo 4 — Criar o banco de dados

**Com acesso ao banco remoto?** Pule este passo — o banco já existe.

**Sem acesso?** Crie o banco local importando o script (o script já cria o banco `pet_alliance_db`):

```powershell
mysql -u root -p < docs/banco.sql
```

Ou, pelo phpMyAdmin (XAMPP): acesse `http://localhost/phpmyadmin` → aba **Importar** → escolha o arquivo `docs/banco.sql` → **Executar**.

### Passo 5 — Configurar o `.env`

O `.env` **não vem no clone** (está fora do git). Crie-o a partir do modelo:

```powershell
Copy-Item .env.example .env
```

Depois preencha as chaves AbacatePay e SMTP (solicite à equipe — seção 4.2). O `config.php` carrega esse arquivo automaticamente (função `carregarEnv()`).

### Passo 6 — Subir o servidor

Na raiz do projeto:

```powershell
php -S localhost:8000
```

> Porta ocupada? Use outra: `php -S localhost:8080` (ou qualquer porta livre).

### Passo 7 — Acessar

| URL | O que é |
|---|---|
| `http://localhost:8000` | Landing page |
| `http://localhost:8000/backEnd/usuario/loginUsuario.php` | Login |
| `http://localhost:8000/backEnd/usuario/cadastrarUsuario.php` | Cadastro |
| `http://localhost:8000/backEnd/home.php` | Home (após login) |

### Passo 8 — Rodar os testes (opcional)

```powershell
php vendor/bin/phpunit
```

---

## 4. Configuração

### 4.1 Banco de dados — `backEnd/config/config.php`

As credenciais de conexão ficam **dentro do `config.php`**, nas linhas 35–39 (host, banco, usuário e senha):

```php
self::$instancia = new PDO(
    "mysql:host=SEU_HOST;dbname=pet_alliance_db;charset=utf8",
    "SEU_USUARIO",
    "SUA_SENHA"
);
```

- **Membro da equipe:** o arquivo veio com o host remoto (`tini.click`) — não altere.
- **Banco local:** use `localhost` / `root` / sua senha e importe o `docs/banco.sql` (Passo 4).

> O arquivo **não é versionado** (`.gitignore`) — edições aqui não aparecem no git e não são sobrescritas por `git pull`.

### 4.2 Pagamentos e e-mail — `.env`

O `.env` (raiz, **não versionado**) contém as variáveis usadas por pagamentos e e-mail:

| Variável | Uso |
|---|---|
| `ABACATEPAY_API_KEY`, `ABACATEPAY_URL`, `ABACATEPAY_PRODUCT*_ID` | API de pagamento (planos) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_*` | Envio de e-mail (PHPMailer — verificação, redefinição de senha) |

Essas chaves pertencem à equipe — solicite-as a um membro do time e preencha no seu `.env`. Sem elas, os fluxos de **pagamento** e **e-mail** não funcionam (o restante do sistema funciona normalmente).

### 4.3 Pasta de uploads

A pasta `uploads/usuario` e `uploads/animais` é criada **automaticamente** pelo `index.php` na primeira execução. Não precisa criar manualmente.

---

## 5. Erros comuns ao rodar

### 5.1 Fatal: "Erro ao conectar ao banco de dados. Tente novamente mais tarde."

O erro mais comum. Causas possíveis, na ordem:

1. **`config.php` inexistente** — o arquivo não vem no clone; sem ele o `require` falha (ou o sistema usa credenciais erradas). Crie-o (Passo 3).
2. **Driver `pdo_mysql` não carregado no PHP local** (php.ini ausente ou `extension_dir` errado) — resumo da correção abaixo, detalhes no [Guia de Erros PHP](guia-erros-php.md), seção 1:
   - Localize o PHP: `(Get-Command php).Source`
   - Crie o `php.ini`: `Copy-Item "<pasta-do-php>\php.ini-development" "<pasta-do-php>\php.ini"`
   - Edite: `extension_dir = "<pasta-do-php>\ext"` (caminho absoluto!) e descomente `extension=pdo_mysql` (e `curl`, `openssl`, `mbstring`, `gd`, `fileinfo`, `mysqli`)
   - Valide: `php -m` deve listar `pdo_mysql`
3. **MySQL local desligado** (quem usa banco local) — inicie o MySQL (XAMPP: botão **Start** no MySQL) ou confirme que o serviço está rodando.
4. **Credenciais erradas no `config.php`** — confira as linhas 35–39 (seção 4.1). Para ver o erro real, consulte o `error_log` (o `config.php` registra a mensagem original — veja [Guia de Erros PHP](guia-erros-php.md), seção 1.5).

### 5.2 Warning: "Session cannot be started after headers have already been sent"

Causa: arquivos PHP salvos com BOM UTF-8 (3 bytes invisíveis `EF BB BF` no início). Solução: remover o BOM dos arquivos (script na seção 2 do [Guia de Erros PHP](guia-erros-php.md)) e salvar como UTF-8 sem BOM no editor.

### 5.3 Checklist rápido

| Sintoma | Causa | Solução |
|---|---|---|
| `Fatal: Erro ao conectar ao banco...` | `config.php` ausente **ou** `pdo_mysql` não carregado **ou** MySQL local desligado **ou** credenciais erradas | Seção 5.1 |
| `Warning: PHP Startup: Unable to load dynamic library ... C:\php\ext` | `extension_dir` inválido no php.ini | Corrigir `extension_dir` para a pasta `ext` real do PHP |
| `session_start(): headers already sent` | BOM UTF-8 nos arquivos | Remover BOM (guia-erros-php.md, seção 2) |
| `Could not find driver` | `extension=pdo_mysql` descomentado? | Seção 5.1 (item 2) |
| `Connection refused` / `Access denied` no error_log | MySQL desligado / credenciais erradas | Seção 5.1 (itens 3 e 4) |
| `Unknown database 'pet_alliance_db'` | Banco local não criado | Passo 4 (importar `docs/banco.sql`) |
| `Failed opening required ... config.php` | Config ausente (não vem no clone) | Passo 3 (criar o arquivo) |
| Página em branco / 404 | Servidor parado ou porta errada | Rodar `php -S localhost:8000` e conferir a URL |
| E-mail não envia | Variáveis SMTP no `.env` | Conferir seção 4.2 |
| Pagamento não inicia | Chaves AbacatePay no `.env` | Conferir seção 4.2 |

---

## 6. Histórico de Revisões

| Versão | Data | Autor | Alteração |
|---|---|---|---|
| 1.0 | 13/08/2026 | Carlos Eduardo Duhring | Criação do guia — tutorial de execução com pré-requisitos, passo a passo (servidor embutido PHP), configuração (banco remoto, .env) e erros comuns |
| 1.1 | 13/08/2026 | Carlos Eduardo Duhring | Banco local com `docs/banco.sql` documentado para quem não tem acesso ao remoto; `.env.example` como modelo |
| 1.2 | 13/08/2026 | Carlos Eduardo Duhring | Decisão final: credenciais do banco permanecem no `config.php` (padrão remoto), que sai do versionamento (`.gitignore`); `.env` só para AbacatePay/SMTP; modelo completo do `config.php` incluído no guia |