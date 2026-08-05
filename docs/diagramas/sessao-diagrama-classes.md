# Sessão — Diagrama de Classes (PetAlliance)

Data: 05/08/2026 · Branch: `carlos-branch` · Autor: Carlos Duhring

## Objetivo
Gerar o diagrama de classes do PetAlliance em `docs/diagramas/classes.drawio` espelhando o código real do `backEnd` (models + DAOs) e o `docs/banco.sql`.

## O que foi produzido
| Arquivo | Descrição |
|---|---|
| `docs/diagramas/classes.drawio` | Diagrama de classes (draw.io, 40 células, 20 arestas) |
| `docs/diagramas/preview-classes.svg` | Preview vetorial (export CLI) |
| `docs/diagramas/preview-classes.png` | Preview raster (export CLI) |

## Conteúdo do diagrama

**Models**: `Usuario`, `Animal`, `SolicitacaoMatch`, `Mensagem`, `Notificacao`, `Denuncia` (implements JsonSerializable onde existe), `Conversa` (sem model, DAO-backed).

**DAOs**: `UsuarioDAO` (10 métodos), `AnimalDAO` (13), `SolicitacaoMatchDAO` (6), `ConversaDAO` (4), `MensagemDAO` (3), `NotificacaoDAO` (4), `DenunciaDAO` (4), `VerificacaoDAO` (6).

**Serviços/Infra**: `PagamentoAbacatePay` (gateway, env ABACATEPAY_API_KEY), `EmailService` (verificação/recuperação/alteração de email), `Conexao` (PDO singleton).

**Entidades do banco sem classe própria** (nota amarela): `tb_matches`, `tb_bloqueios`, `tb_favoritos`, `tb_vendas` — consultadas via SQL direto nos DAOs.

**Relacionamentos (UML)**: `Usuario 1..* Animal` (dono_id) · `Animal 1..* SolicitacaoMatch` (pet_id) · `Usuario 1..* SolicitacaoMatch` (remetente) · `SolicitacaoMatch 1—1 Conversa` · `Conversa 1..* Mensagem` · `Usuario 1..* Notificacao` · `Usuario 1..* Denuncia` · `Animal —o Denuncia` (alvo polimórfico animal|usuario|site).

## Critérios de qualidade aplicados
- Alturas de caixa calculadas por conteúdo (sem corte nem sobra).
- Grade uniforme: 5 colunas (w=260, gap 30px), 4 faixas (y=120/430/700/950).
- Arestas ortogonais com waypoints explícitos — **validador geométrico (Python) confirma: nenhuma aresta cruza caixa**.
- Conteúdo 100% ASCII (evita mojibake de encoding no PS 5.1).

## Regeneração
Script (fora do repo, em `Temp\opencode\gen_classes.ps1`):
```powershell
& "$env:TEMP\opencode\gen_classes.ps1"          # regera classes.drawio
python "$env:TEMP\opencode\check_colisao.py"   # valida cruzamentos
draw.io --export --format svg --scale 1.5 --output docs\diagramas\preview-classes.svg docs\diagramas\classes.drawio
```

## Pendência
- Diagrama foi gerado programaticamente; aguarda **revisão visual** em draw.io (usuário reportou que ainda não está bom — pendência aberta).

## Histórico da sessão
1. Leitura completa de `docs/banco.sql` (14 tabelas) e assinaturas de todos os models/DAOs (`grep public function`).
2. Geração v1 → quebra de XML (aspas não escapadas) → correção.
3. Geração v2: arestas `entityRelationEdgeStyle` cruzavam caixas → reescrita com `orthogonalEdgeStyle` + waypoints.
4. Geração v3 (atual): ASCII puro, alturas dinâmicas, espaçamento maior, rotas recalculadas.
5. Push anterior desta branch: commit `2b8a8b1` (casos de uso).