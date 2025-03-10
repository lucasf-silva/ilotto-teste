# API de Transferência

## Autor
Lucas de Farias Silva

## Requisitos
- **Node.js** v20.16.0
- **NestJS** v11.0.5
- **PostgreSQL** (Banco de dados relacional)
- **Prisma ORM**

## 1. Configuração Inicial

### 1.1. Clonar o repositório
bash
git clone https://github.com/lucasf-silva/ilotto-teste


### 1.2. Instalar dependências
bash
npm install
# ou
yarn install


### 1.3. Configurar o Banco de Dados
1. Certifique-se de que o **PostgreSQL** está instalado e rodando.
2. Crie um banco de dados PostgreSQL com as configurações padrão.
3. Edite o arquivo `.env` e configure a variável `DATABASE_URL` com as credenciais do banco de dados:
   ini
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/seu_banco"
   

### 1.4. Criar a estrutura do banco de dados
bash
npx prisma migrate dev --name init


### 1.5. Atualizar o Prisma com o banco de dados existente
bash
npx prisma db pull


## 2. Rodando o projeto localmente

### 2.1. Iniciar a aplicação
bash
npm run start
# ou
yarn start


### 2.2. Rodar em modo de desenvolvimento
bash
npm run start:dev
# ou
yarn start:dev


A API estará disponível em `localhost:3000`

## 3. Endpoints

### 3.1. Criar uma transferência
**POST** `/transfers`
json
{
  "receiverId": 2,
  "amount": 100.00
}

**POST** `/deposit`
json
{
  "amount": 100.00
}

**POST** `/withdraw`
json
{
  "amount": 100.00
}

### 3.1. Usuários
**GET** `/account`

**GET** `/getall`


## 4. Ferramentas e Tecnologias
- **NestJS** (Framework Node.js para aplicações escaláveis)
- **Prisma ORM** (Manipulação de banco de dados PostgreSQL)
- **BullMQ** (Gerenciamento de filas)
- **Docker** (Containerização)

## 5. Docker
Caso queira rodar a aplicação com Docker, use:
bash
docker-compose up --build


Isso irá iniciar uma fila dentro do container.

## 6. Você pode verificar a API rodando

A API estará disponível em `https://ilotto-teste.onrender.com/api`