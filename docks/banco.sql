CREATE DATABASE pet_alliance_db;
USE pet_alliance_db;

-- 
CREATE TABLE tb_usuarios (
	id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	foto_perfil VARCHAR(250) DEFAULT"placeholder.webp",
    cep varchar(8) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    tipo_usuario INT DEFAULT 0 NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    verificado BOOLEAN DEFAULT FALSE,
    tentativas_login INT DEFAULT 0 ,
    bloqueado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- PETS
CREATE TABLE tb_pets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dono_id BIGINT UNSIGNED NOT NULL,
    foto_pet VARCHAR(250) DEFAULT"placeholder.webp",
    nome VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    cor VARCHAR(30),
    sexo VARCHAR(10) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    porte VARCHAR(20),
    data_nascimento DATE,
    peso DECIMAL(5,2),
    descricao TEXT,
    vacinado BOOLEAN NOT NULL,
    foto_vacinas VARCHAR(250) DEFAULT 0,
    certificado_raca BOOLEAN DEFAULT FALSE,
    foto_certificado VARCHAR(250) DEFAULT 0,
    venda_preco DECIMAL(10,2) DEFAULT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (dono_id) REFERENCES tb_usuarios(id)
    ON DELETE CASCADE
);

-- MATCH
CREATE TABLE tb_matches (
    id SERIAL PRIMARY KEY, 
    id_usuario1 BIGINT UNSIGNED NOT NULL,  
    id_animal1 BIGINT UNSIGNED NOT NULL,   
    id_usuario2 BIGINT UNSIGNED NOT NULL,  
    id_animal2 BIGINT UNSIGNED NOT NULL,   
    aceito BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respondido_em TIMESTAMP,
    CONSTRAINT fk_usuario1 FOREIGN KEY (id_usuario1) REFERENCES tb_usuarios(id),
    CONSTRAINT fk_animal1 FOREIGN KEY (id_animal1) REFERENCES tb_animais(id),
    CONSTRAINT fk_usuario2 FOREIGN KEY (id_usuario2) REFERENCES tb_usuarios(id),
    CONSTRAINT fk_animal2 FOREIGN KEY (id_animal2) REFERENCES tb_animais(id),
    CONSTRAINT uq_match_animais UNIQUE (id_animal1, id_animal2)
);

-- BLOQUEIOS
CREATE TABLE tb_bloqueios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    bloqueado_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES tb_usuarios(id),
    FOREIGN KEY (bloqueado_id) REFERENCES tb_usuarios(id)
);

-- CHAT (CONVERSA)
CREATE TABLE tb_conversas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY ,
    match_id BIGINT UNSIGNED NOT NULL,
    ativa BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (match_id) REFERENCES tb_matches(id)
);

-- MENSAGENS
CREATE TABLE tb_mensagens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY ,
    conversa_id BIGINT UNSIGNED NOT NULL,
    remetente_id BIGINT UNSIGNED NOT NULL,
    conteudo VARCHAR(500) NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (conversa_id) REFERENCES tb_conversas(id),
    FOREIGN KEY (remetente_id) REFERENCES tb_usuarios(id)
);


-- PAGAMENTOS
CREATE TABLE tb_pagamentos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY ,
    usuario_id BIGINT UNSIGNED NOT NULL,
    prod_id_abacatepay varchar(200) NOT NULL,
    status_pagamento ENUM('PENDING', 'PAID', 'REFUNDED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    id_transacao_abacatepay VARCHAR(255) UNIQUE NULL,
    valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES tb_usuarios(id)
);

-- VENDAS
CREATE TABLE tb_vendas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    animal_id BIGINT UNSIGNED NOT NULL,
    comprador_id BIGINT UNSIGNED NOT NULL,
    vendedor_id BIGINT UNSIGNED NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    pagamento_id BIGINT UNSIGNED,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES tb_pets(id),
    FOREIGN KEY (comprador_id) REFERENCES tb_usuarios(id),
    FOREIGN KEY (vendedor_id) REFERENCES tb_usuarios(id),
    FOREIGN KEY (pagamento_id) REFERENCES tb_pagamentos(id)
);

-- DENÚNCIAS
CREATE TABLE tb_denuncias (
     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
     usuario_id BIGINT UNSIGNED  NULL,
     tipo_alvo ENUM('animal', 'usuario', 'site') NOT NULL,
     alvo_id BIGINT UNSIGNED NULL,
     descricao TEXT NOT NULL,
     resolvido TINYINT(1) NOT NULL DEFAULT 0,
     criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (usuario_id) REFERENCES tb_usuarios(id)
)

CREATE TABLE tb_favoritos (
	id_pet BIGINT UNSIGNED,
    id_usuario BIGINT UNSIGNED,
    PRIMARY KEY (id_usuario, id_pet),
    FOREIGN KEY (id_usuario) REFERENCES tb_usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pet) REFERENCES tb_pets(id) ON DELETE CASCADE
)