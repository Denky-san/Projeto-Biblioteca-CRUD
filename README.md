# Projeto de Gerenciamento de Biblioteca

Este repositório contém o código-fonte completo para um sistema de gerenciamento de biblioteca, incluindo um back-end em Laravel e um front-end em HTML, CSS e JavaScript.

## Visão Geral

O objetivo deste sistema é fornecer uma solução completa para gerenciar os principais ativos de uma biblioteca:

- **Usuários**: Cadastro, edição e exclusão de usuários.
- **Livros**: Cadastro, edição e exclusão de livros, com classificação por gênero.
- **Empréstimos**: Registro de novos empréstimos, devoluções e controle de prazos com status de "Atrasado" automático.

## Tecnologias Utilizadas

- **Back-end**: PHP 8.2+, Laravel 11+, MySQL
- **Front-end**: HTML5, Tailwind CSS, JavaScript (ES6+), SweetAlert2

---

## 1. Pré-requisitos

Antes de começar, certifique-se de que o seu ambiente de desenvolvimento local atende aos seguintes requisitos:

- **PHP**: Versão 8.2 ou superior.
- **Extensões PHP essenciais**: `fileinfo`, `pdo_mysql`. Certifique-se de que estão habilitadas no seu ficheiro `php.ini`.
- **Composer**: Para gerenciamento de dependências do PHP.
- **MySQL**: Ou uma alternativa como o MariaDB.
- **Git**: Para clonar o repositório.

---

## 2. Guia de Instalação e Execução Local

Siga estes passos para configurar e executar o projeto após clonar o repositório.

### Passo 1: Clonar o Repositório

Primeiro, clone este repositório para a sua máquina local.

```bash
git clone <URL_DO_SEU_REPOSITORIO_AQUI> biblioteca
cd biblioteca
```

O projeto já está dividido nas pastas `backend/` e `frontend/`.

### Passo 2: Configurar o Back-end (API Laravel)

Todas as ações a seguir devem ser executadas no terminal, dentro da pasta `backend/`.

- Navegue até a pasta do back-end:

```bash
cd backend
```

- Instale as dependências do PHP:

```bash
composer install
```

- Configure o Ficheiro de Ambiente: Crie o seu ficheiro `.env` a partir do exemplo fornecido.

```bash
copy .env.example .env
```

- Gere a Chave da Aplicação:

```bash
php artisan key:generate
```

- Configure a Conexão com o Banco de Dados:

  - Crie um banco de dados vazio no seu MySQL (ex: `biblioteca_db`).
  - Abra o ficheiro `.env` e atualize as variáveis com suas credenciais:

```env
DB_DATABASE=biblioteca_db
DB_USERNAME=root
DB_PASSWORD=sua_senha_aqui
```

- Execute as Migrações e Seeders:

```bash
php artisan migrate:fresh --seed
```

### Passo 3: Executar a Aplicação

Agora que o back-end está configurado, podemos iniciar os servidores.

- Inicie o Servidor do Back-end:

```bash
php artisan serve
```

O seu API estará a funcionar, geralmente em `http://127.0.0.1:8000`. Mantenha este terminal aberto.

- Abra o Front-end:

  - Navegue até a pasta `frontend/` no seu explorador de ficheiros.
  - Abra o ficheiro `home.html` no seu navegador web (ex: Chrome, Firefox).

A aplicação da biblioteca estará totalmente funcional, conectada à sua API local.
