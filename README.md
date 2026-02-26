PetAlliance, é um aplicativo para ajudar donos de animais a terem boas crias, com segurança e facilidade.

Banco de dados:
    Usuário:
        Nome do usuário.
        CPF.
        Email.
        Senha.
        Endereço.
    ------------------------
    Animal:
        Nome do animal.
        ID animal
        Certificado de raça/foto.
        Carteira de vacinação do animal.
        Foto do animal.
        Tipo do animal.
        Raça.
        Chat.
        Cor.
        Data de nascimento.
        Sexo.
    ------------------------
    Chat:
        ID usuário mandou.
        ID da conversa.
        Mensagem.
        Arquivo.
        Lido.
        Data enviada.
    -------------------------

Funcionalidades:
    Login e Cadastro.
    Cadastro de animal.
    Chat interno no aplicativo.
    Listagem de pets.
    VIP (Pet aparecer acima dos outros).
    Carteira digital/transação de dinheiro dentro do aplicativo.
    Curtir pet.
    Match pet.
    De olho (Mostra pessoas interessadas no animal).
    Pesquisa.
    Tipo animal.
    Denunciar.
    Sobre Nós.

Requisitos Funcionais:
RF01 – Login
    Nome de usuário
    CPF Senha 
    Verificação de e-mail

RF02 – Cadastro
    Nome de usuário
    CPF válido
    Senha
    Confirmação de senha
    Verificação CAPTCHA

RF03 – Cadastro de Pet
    Foto
    Nome
    Raça
    Cor
    Sexo
    Tipo (cachorro, cavalo, etc.)
    Porte
    Certificado de raça (opcional)
    Carteira de vacinação
    Descrição do animal

RF04 – Lista de Pets
    Foto
    Nome
    Raça
    Cor
    Sexo
    Porte
    Tipo

RF05 – Chat com Dono
    Enviar mensagem
    Receber mensagem
    Visualizar conversa

RF06 – Carteira / Transações
    Criar carteira digital
    Realizar transações entre usuários
    Aplicar taxa sobre transações

RF07 – Configurações
    Alterar dados do perfil
    Alterar tema/cor
    Acessar suporte
    Termos e política
    Fazer logout
    Excluir conta

Requisitos Não Funcionais 
RNF01 – Segurança
    Senhas devem ser criptografadas
    CPF deve ser validado
    Sistema deve usar autenticação segura

RNF02 – Validação de Dados
    Campos obrigatórios devem ser validados
    CPF deve seguir formato válido
    Email deve ser verificado

RNF03 – Desempenho
    Tempo de resposta máximo de 3 segundos

RNF04 – Usabilidade
    Interface simples e fácil de usar

RNF05 – Disponibilidade
    Sistema disponível 24/7

RNF06 – Responsividade
    Funcionar em celular, tablet e computador

RNF07 – Segurança de Transações
    Transações devem ser seguras e registradas