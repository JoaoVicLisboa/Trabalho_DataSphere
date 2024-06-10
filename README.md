# Trabalho_DataSphere

## 1. Introdução
A API Datasphere foi desenvolvida para centralizar dados essenciais, como tarefas concluídas e horas trabalhadas, com o objetivo de facilitar a análise de desempenho dos funcionários por setor. Este sistema permite que chefes e supervisores gerenciem e monitorem seus funcionários de maneira eficiente e segura.

## 2. Descrição do Problema e Solução Desenvolvida

**Problema:** Gerenciar e monitorar o desempenho de funcionários pode ser um desafio, especialmente em empresas com uma estrutura hierárquica complexa e diversos setores.

**Solução:** A API Datasphere oferece uma plataforma centralizada onde chefes e supervisores podem acessar e gerenciar dados dos funcionários, como tarefas concluídas, horas trabalhadas e informações pessoais. A autenticação baseada em JWT (JSON Web Tokens) garante que apenas usuários autorizados possam acessar ou modificar os dados.

## 3. Descrição das Estratégias para Escolha da Solução Desenvolvida

- **Segurança:** A API utiliza JWT para autenticação, garantindo que apenas usuários autenticados possam acessar os dados.
- **Simplicidade:** O uso de SQLite como banco de dados embutido facilita a configuração e o uso em ambientes de desenvolvimento e produção.
- **Hierarquia de Acesso:** Diferenciação clara entre os níveis de acesso de chefes e supervisores, garantindo que cada grupo de usuários tenha acesso apenas aos dados relevantes ao seu papel.
- **Facilidade de Manutenção:** A estrutura simples e bem documentada do código facilita futuras manutenções e extensões.

## 4. Descrição da Arquitetura do Sistema

A arquitetura do sistema é baseada em uma aplicação web com backend em Node.js e banco de dados SQLite.

### 4.1 Componentes Principais:

- **Express.js:** Framework web utilizado para criar rotas e gerenciar solicitações HTTP.
- **SQLite:** Banco de dados relacional utilizado para armazenar dados dos usuários e funcionários.
- **JWT (JSON Web Tokens):** Utilizado para autenticação de usuários.
- **Body-Parser:** Middleware para analisar o corpo das requisições HTTP.


## 5. Descrição do Ambiente e das Tecnologias Utilizadas

- **Node.js:** Ambiente de execução para JavaScript no servidor, usado para criar a API.
- **Express.js:** Framework para Node.js, facilita a criação de rotas e o gerenciamento de solicitações HTTP.
- **SQLite:** Banco de dados SQL embutido, fácil de usar e configurar, adequado para ambientes de desenvolvimento e produção leves.
- **JWT (jsonwebtoken):** Biblioteca para criar e verificar tokens JWT, utilizada para autenticação segura.
- **Body-Parser:** Middleware utilizado para analisar o corpo das requisições HTTP, permitindo a manipulação de dados enviados pelo cliente.
- **DB Browser for SQLite:** Ferramenta gráfica utilizada para gerenciar e visualizar o banco de dados SQLite, facilitando o desenvolvimento e testes.
