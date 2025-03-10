# Api de transferencia
- Lucas de Farias Silva

# Requisitos
- Node v20.16.0
- Nest v11.0.5

# 1º Primeiro passo
- Criar um banco de dados PostgresSQL configurações padrões
- Mudar a URL do banco no arquivo [Configurar variáveis de ambiente](./.env)
- Rode o comando 'npm install ou yarn'
- Rode o comando 'npx prisma migrate dev --name init' para criar uma migration
- Depois rode o camondo 'npx prisma db pull' para subir tabelas para o seu banco
