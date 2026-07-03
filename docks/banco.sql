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
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (dono_id) REFERENCES tb_usuarios(id)
    ON DELETE CASCADE
);

-- MATCH
CREATE TABLE tb_matches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pet1_id BIGINT UNSIGNED NOT NULL,
    pet2_id BIGINT UNSIGNED NOT NULL,
    CHECK (pet1_id <> pet2_id),
    UNIQUE (pet1_id, pet2_id),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (pet1_id) REFERENCES tb_pets(id),
    FOREIGN KEY (pet2_id) REFERENCES tb_pets(id)
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
    pet_id BIGINT UNSIGNED NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    taxa DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_pagamento TIMESTAMP NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES tb_usuarios(id),
    FOREIGN KEY (pet_id) REFERENCES tb_pets(id)
);

-- DENÚNCIAS
CREATE TABLE tb_denuncias (
     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
     usuario_id BIGINT UNSIGNED  NULL,
     animal_id BIGINT UNSIGNED  NULL
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