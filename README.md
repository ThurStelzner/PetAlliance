O que são Requisitos Funcionais (RF)?
Os RFs descrevem as funcionalidades do sistema. Eles definem o comportamento do software em resposta a entradas específicas. Em resumo: é o que o sistema deve fazer.
Exemplos para um Sistema de Biblioteca:
RF01 - Cadastro de Livros: O sistema deve permitir a inclusão, alteração e exclusão de títulos no acervo (título, autor, ISBN, editora).
RF02 - Empréstimo de Obras: O sistema deve registrar o empréstimo de livros vinculando um exemplar a um usuário cadastrado.
RF03 - Pesquisa de Acervo: O usuário deve ser capaz de buscar livros por palavras-chave, categoria ou autor.
RF04 - Renovação Online: O sistema deve permitir que o usuário renove a data de devolução, desde que não haja reservas pendentes.
RF05 - Cálculo de Multas: O sistema deve calcular automaticamente o valor da multa para devoluções após o prazo estipulado.

O que são Requisitos Não Funcionais (RNF)?
Os RNFs descrevem os atributos de qualidade ou restrições do sistema. Eles não dizem o que o sistema faz, mas sim como ele faz. Eles focam em aspectos como desempenho, segurança, usabilidade e confiabilidade.
Exemplos para um Sistema de Biblioteca:
RNF01 - Desempenho: O tempo de resposta para qualquer pesquisa no acervo não deve ultrapassar 2 segundos.
RNF02 - Segurança/Acesso: Apenas funcionários administradores podem excluir registros de livros ou usuários.
RNF03 - Disponibilidade: O sistema deve estar disponível para consulta online 24 horas por dia, 7 dias por semana, com 99,5% de uptime.
RNF04 - Usabilidade: O sistema deve possuir uma interface responsiva, permitindo que alunos consultem o acervo via dispositivos móveis.
RNF05 - Escalabilidade: O banco de dados deve suportar o armazenamento de até 500.000 registros de exemplares sem perda de performance.

Tabela Comparativa Rápida
Aspecto
Requisito Funcional (RF)
Requisito Não Funcional (RNF)
Foco
O que o sistema faz (Ações)
Como o sistema é (Atributos)
Origem
Necessidades do negócio/usuário
Restrições técnicas ou de qualidade
Exemplo
"Emitir relatório de atrasos"
"O relatório deve ser gerado em PDF"


Caso de Uso: UC002 – Realizar Empréstimo de Obra
Ator Principal: Bibliotecário (ou Atendente).
Pré-condições: 1. O usuário deve estar previamente cadastrado e ativo.
2. O livro (exemplar) deve estar cadastrado e com status "Disponível".

1. Fluxo Principal (O "Caminho Feliz")
Este é o cenário onde tudo ocorre conforme o esperado.
O Bibliotecário inicia o processo de empréstimo no sistema.
O Bibliotecário informa o código de identificação do Usuário (ex: CPF ou Matrícula).
O sistema valida o usuário e exibe seus dados (Nome e Status).
O Bibliotecário informa o código de barras do Exemplar.
O sistema valida a disponibilidade do livro e exibe o título e autor.
O sistema calcula a Data de Devolução baseada no perfil do usuário (ex: Aluno = 7 dias, Professor = 15 dias).
O Bibliotecário confirma o empréstimo.
O sistema registra o empréstimo, altera o status do livro para "Emprestado" e emite um comprovante (digital ou impresso).

2. Fluxos Alternativos e de Exceção
O papel do analista é prever o que pode dar errado para evitar erros no código.
Cenário
Descrição da Ação
A1: Usuário com Pendência
Se no passo 3 o sistema detectar multas atrasadas, o sistema bloqueia o empréstimo e exibe um alerta.
A2: Limite de Livros
Se o usuário já atingiu o limite máximo de livros simultâneos, o sistema impede a operação.
E1: Livro Reservado
Se no passo 5 o livro estiver reservado para outra pessoa, o sistema questiona se o Bibliotecário deseja ignorar a reserva ou cancelar a operação.
E2: Código Inválido
Caso o código do usuário ou do livro não seja encontrado, o sistema exibe a mensagem: "Registro não encontrado".


3. Regras de Negócio (RN) Relacionadas
As regras de negócio são as "leis" que regem o comportamento acima:
RN01: Usuários com multas acima de R$ 5,00 não podem realizar novos empréstimos.
RN02: A data de devolução não pode cair em domingos ou feriados (o sistema deve pular para o próximo dia útil).
RN03: O número máximo de livros para alunos é de 3 exemplares simultâneos.

4. Protótipo de Dados (O que será salvo?)
Para que este caso de uso funcione, o banco de dados precisará registrar:
ID_Emprestimo
ID_Usuario
ID_Exemplar
Data_Saida
Data_Prevista_Devolucao
Status (Ativo/Finalizado)
Diagrama de Atividades (Fluxo de Empréstimo)
Este diagrama foca na lógica do processo do "RF02 - Empréstimo de Obras". Ele detalha as decisões que o sistema toma.
Fluxo Lógico:
Início (O Bibliotecário inicia a operação).
Ação: Identificar Usuário.
Decisão: O usuário possui multas ou pendências?
Sim: Ação: Bloquear operação e exibir erro. -> Fim.
Não: Seguir para próxima etapa.
Ação: Identificar Exemplar (Livro).
Decisão: O livro está disponível?
Não: Ação: Informar indisponibilidade. -> Fim.
Sim: Seguir para próxima etapa.
Ação: Calcular Data de Devolução (Regra de Negócio).
Ação: Registrar Empréstimo no Banco de Dados.
Ação: Atualizar status do livro para "Emprestado".
Fim (Empréstimo concluído com sucesso).

