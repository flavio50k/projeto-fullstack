# Usa uma imagem Node.js Alpine (leve)
FROM node:lts-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências (mysql2, express, cors, nodemon)
# Esta etapa será forçada a rodar com --no-cache!
RUN npm install

# Copia todo o código da aplicação
COPY . .

# O comando de execução final está no docker-compose.yml