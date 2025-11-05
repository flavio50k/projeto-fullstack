# --- STAGE 1: BUILD (Compila o código Vue) ---
FROM node:lts-alpine as build-stage
WORKDIR /app

# Copia e instala dependências
COPY vue-app/package*.json ./
RUN npm install

# Copia o código fonte e faz o build (gera a pasta 'dist')
COPY vue-app/. .
RUN npm run build 

# --- STAGE 2: SERVE (Nginx) ---
# Usa a imagem Nginx super-leve para servir os arquivos estáticos
FROM nginx:stable-alpine as production-stage
# Copia os arquivos gerados (do Stage 1) para o diretório de serviço do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expor a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# O Nginx já tem um CMD padrão que o inicializa.