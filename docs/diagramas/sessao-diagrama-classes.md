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

## Correção v2 (06/08/2026) — regeneração completa do `classes.drawio`

Usuário reportou: linhas atravessando caixas, `tb_matches` sem forma, config estranha e textos fora da caixa. Diagnóstico e correção:

| Defeito (v1/v3) | Causa | Correção (v2) |
|---|---|---|
| Linhas atravessando tabelas | Waypoints escritos como `<mxPoint as="point"/>` repetidos (formato inválido; draw.io ignora e re-rota por cima das caixas) | Waypoints no formato real do draw.io: `<Array as="points"><mxPoint x y/></Array>` |
| DAOs fora do eixo do modelo | `NotificacaoDAO` e `DenunciaDAO` ficavam a ~900px lateralmente; arestas "usa" cruzavam a faixa inteira | Layout em 6 colunas-cadeia: cada DAO na mesma coluna, imediatamente abaixo do lado |
| `tb_matches` não formada | Só existia como texto dentro de nota amarela, sem conexões | `tb_matches`, `tb_favoritos`, `tb_bloqueios`, `tb_vendas`, `tb_pagamentos` viraram caixas reais ("Tabela:") com relações: `SolicitacaoMatch --aceito--> tb_matches`, `Usuario --bloqueia--> tb_bloqueios`, `Animal --favorita--> tb_favoritos`, `PagamentoAbacatePay --checkout--> tb_pagamentos`, `tb_vendas -> tb_pagamentos` |
| Config estranha | Caixa `Conexao` batizada "Config: Conexao" com estilo divergente | Renomeada "Infra: Conexao (PDO)" com paleta própria |
| Textos fora da caixa | Labels de aresta sem fundo e posições default | Todos os labels com `labelBackgroundColor=#FFFFFF` + rotas ortogonais e waypoints explícitos; gutter entre colunas ampliado de 50px → 120px para os textos caberem |

**Roteamento garantido**: arestas entre caixas vizinhas retas; arestas longas sobem por lanes de telhado (y=52/72/92) ou descem pela calha inferior (y=1192) e entram pelas **bordas laterais** dos alvos — nunca pelo interior de outra caixa.

**Validação (automática)**: `Check` geométrico de todos os 22 segmentos de aresta × 23 caixas → **0 colisões**; checagem de rótulos → **0 etiquetas sobre caixas**.

**Números v2**: 23 caixas, 22 arestas, página 2290×1292 px. Arquivos: `classes.drawio` regenerado, `preview-classes.svg` e `preview-classes.png` reexportados (SVG→PNG via Edge headless).

## Regeneração (v2)
```powershell
python "$env:TEMP\opencode\gen_classes_v2.py"        # regera classes.drawio + preview-classes.svg
python "$env:TEMP\opencode\check_svg.py"             # valida rótulos sobre caixas
edge --headless --screenshot=docs\diagramas\preview-classes.png --window-size=2290,1300 file:///...preview-classes.svg
```

## Pendência
- Revisão visual final no draw.io desktop (PNG/SVG gerados para conferência rápida).

## Correção v3 (06/08/2026) — feedback "linhas juntas e longe de qualquer tabela"

Após a v2, o usuário reportou arestas agrupadas num corredor e longe das caixas. Causa: calha inferior (BUS, y=1192) e telhado largo concentravam várias arestas longas num mesmo trilho.

| Mudança (v3) | Efeito |
|---|---|
| Tabelas incorporadas na cadeia do componente que a consulta: `tb_favoritos` logo após `AnimalDAO` (SQL real), `tb_pagamentos` após `PagamentoAbacatePay` (SQL real), `tb_vendas` após `tb_pagamentos` (FK), `tb_bloqueios` no fim da coluna Usuario, `tb_matches` após `SolicitacaoMatchDAO` | Aresta vira vertical de 1 gap (64px), curta e colada às caixas |
| Eliminada a calha inferior (BUS) e o telhado largo | Nenhuma aresta corre a >100px do conteúdo |
| Transversais do usuário: apenas 2 lanes de telhado (y=52/72) para `Usuario→SolicSolicitacaoMatch` e `Usuario→Mensagem` | Curta, perto do topo das caixas |
| Gutters laterais com x próprio por aresta (330/350/390/760/1500) + labels com offset `mxPoint as="offset"` | Nenhuma aresta "junta" na mesma vertical; label alojado dentro do corredor |
| Labels de banda encurtados ("1 solicitacao", "1..* conversa") | Cabem no corredor de 100px entre colunas |

**Validação v3**: 22 arestas × 23 caixas → **0 colisões de segmento**; 21 labels → **0 sobre caixas**. Página 2290×1354 px.

## Regeneração
Script (fora do repo, em `Temp\opencode\`):
```powershell
python "$env:TEMP\opencode\gen_classes_v3.py"   # regera classes.drawio + preview-classes.svg
python "$env:TEMP\opencode\check_svg.py"        # valida rótulos sobre caixas
edge --headless --screenshot=docs\diagramas\preview-classes.png --window-size=2290,1360 file:///...preview-classes.svg
```