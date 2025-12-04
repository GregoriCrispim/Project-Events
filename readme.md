# API Projeto Integrador - Gestão de Eventos

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg?logo=express)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-purple.svg?logo=sequelize)](https://sequelize.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue.svg?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Instituições de Fomento e Parceria
[![Website IFB](https://img.shields.io/badge/Website-IFB-%23508C3C.svg?labelColor=%23C8102E)](https://www.ifb.edu.br/) 
[![Website ihwbr](https://img.shields.io/badge/Website-ihwbr-%23DAA520.svg?labelColor=%232E2E2E)](https://hardware.org.br/)

## Orientador (link para o perfil do orientador)

[![LinkedIn Claudio Ulisse](https://img.shields.io/badge/LinkedIn-Claudio_Ulisse-%230077B5.svg?labelColor=%23FFFFFF&logo=linkedin)](https://www.linkedin.com/in/claudioulisse/)
[![GitHub claulis](https://img.shields.io/badge/GitHub-claulis_(Claudio_Ulisse)-%23181717.svg?logo=github&logoColor=white)](https://github.com/claulis)
[![Lattes Claudio Ulisse](https://img.shields.io/badge/Lattes-Claudio_Ulisse-green.svg?logo=cnpq&logoColor=white)](http://lattes.cnpq.br/4607303092740768)

## Sumário

- [Visão Geral](#visão-geral)
- [Pacotes Utilizados](#pacotes-utilizados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Diagrama de Banco de Dados](#diagrama-de-banco-de-dados)
- [Documentação da API](#documentação-da-api)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Deploy](#deploy)

## Visão Geral

API backend para centralizar e organizar a gestão de eventos, participantes e atividades (workshops, palestras, oficinas), com autenticação JWT e rotas de relacionamento. Permite cadastro, consulta, edição e remoção das entidades, além de evidenciar os relacionamentos obrigatórios.

## Pacotes Utilizados

| Pacote                  | Versão       | Descrição                                      |
|-------------------------|--------------|------------------------------------------------|
| express                 | >=4.18       | Framework web principal                        |
| sequelize               | >=6.37       | ORM para banco relacional                      |
| pg / pg-hstore          | latest       | Driver PostgreSQL                              |
| jsonwebtoken            | latest       | Autenticação JWT                               |
| bcryptjs                | latest       | Hash de senhas                                 |
| dotenv                  | latest       | Variáveis de ambiente                          |
| sequelize-cli           | latest       | CLI para migrations/seeds                      |
| ...                     | ...          | ...                                            |

> **Nota:** Consulte o arquivo `package.json` para a lista completa e versões exatas.

## Estrutura do Projeto

```
projeto_integrador/
├── app.js
├── package.json
├── config/
│   └── config.json
├── controllers/
│   ├── atividadeController.js
│   ├── eventoController.js
│   └── participanteController.js
├── middlewares/
│   └── auth.js
├── migrations/
│   └── ...
├── models/
│   ├── atividade.js
│   ├── evento.js
│   ├── eventoparticipante.js
│   ├── participante.js
│   └── index.js
├── routes/
│   ├── atividadeRoutes.js
│   ├── authRoutes.js
│   ├── eventoRoutes.js
│   └── participanteRoutes.js
├── seeders/
│   └── 20251204195000-demo-data.js
└── README.md
```

Descreva brevemente o propósito de cada diretório e módulo relevante.

## Diagrama de Banco de Dados

![Diagrama de Banco de Dados](./docs/database_diagram.png)

> **Descrição:** Inclua um diagrama ER (Entidade-Relacionamento) gerado por ferramentas como dbdiagram.io ou draw.io. Principais entidades: Evento, Participante, Atividade, EventoParticipante. Relacionamentos: Evento 1:N Atividade, Evento N:N Participante, Atividade 1:1 Participante (Responsável).

## Documentação da API

A documentação pode ser consultada abaixo ou via ferramentas como Postman.

### Endpoints Principais

| Método | Endpoint                                | Descrição                          | Autenticação |
|--------|-----------------------------------------|------------------------------------|--------------|
| GET    | `/eventos`                             | Lista todos os eventos             | Pública      |
| GET    | `/eventos/:id`                         | Detalha evento                     | Pública      |
| POST   | `/eventos`                             | Cria evento                        | JWT          |
| PUT    | `/eventos/:id`                         | Edita evento                       | JWT          |
| DELETE | `/eventos/:id`                         | Remove evento                      | JWT          |
| GET    | `/eventos/:id/atividades`              | Lista atividades do evento         | Pública      |
| POST   | `/eventos/:id/atividades`              | Cria atividade no evento           | JWT          |
| GET    | `/eventos/:id/participantes`           | Lista participantes do evento      | Pública      |
| POST   | `/eventos/:id/participantes`           | Inscreve participante no evento    | JWT          |
| GET    | `/eventos/:id/dashboard`               | Dashboard do evento                | Pública      |
| GET    | `/atividades`                          | Lista todas atividades             | Pública      |
| GET    | `/atividades/:id`                      | Detalha atividade                  | Pública      |
| POST   | `/atividades`                          | Cria atividade                     | JWT          |
| PUT    | `/atividades/:id`                      | Edita atividade                    | JWT          |
| DELETE | `/atividades/:id`                      | Remove atividade                   | JWT          |
| GET    | `/atividades/:id/responsavel`          | Consulta responsável da atividade  | Pública      |
| PUT    | `/atividades/:id/responsavel`          | Define responsável                 | JWT          |
| GET    | `/participantes`                       | Lista todos participantes          | Pública      |
| GET    | `/participantes/:id`                   | Detalha participante               | Pública      |
| POST   | `/participantes`                       | Cria participante                  | Pública      |
| PUT    | `/participantes/:id`                   | Edita participante                 | Pública      |
| DELETE | `/participantes/:id`                   | Remove participante                | Pública      |
| POST   | `/auth/login`                          | Login e obtenção do token JWT      | Pública      |

> **Detalhes:** Consulte os controllers e rotas para exemplos de request/response.

## Configuração do Ambiente

Siga os passos abaixo para configurar o ambiente local.

1. **Clone o repositório:**
   ```powershell
   git clone https://github.com/usuario/projeto_integrador.git
   cd projeto_integrador
   ```

2. **Instale as dependências:**
   ```powershell
   npm install
   ```

3. **Configure o banco de dados:**
   - Edite `config/config.json` com suas credenciais PostgreSQL.

4. **Aplique as migrações e insira dados de teste:**
   ```powershell
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Inicie o servidor:**
   ```powershell
   node app.js
   ```

## Deploy (opcional)

### Plataforma Recomendada: [Railway / Render / AWS]

1. **Configure variáveis de ambiente** na plataforma de deploy.
2. **Execute migrações em produção:**
   ```powershell
   npx sequelize-cli db:migrate
   ```
3. **CI/CD:** Integração com GitHub Actions disponível em `.github/workflows/deploy.yml`.