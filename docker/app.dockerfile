FROM node:22-alpine

LABEL project="gym-workout"

# Define o diretório de trabalho dentro do contêiner
WORKDIR /application

# Habilita o corepack para gerenciar o yarn, que já vem com a imagem node
RUN corepack enable

# Copia os arquivos de definição de dependências para aproveitar o cache
COPY package.json yarn.lock ./

# Instala as dependências do projeto
RUN yarn install --frozen-lockfile

# Copia o restante dos arquivos do projeto para o contêiner
COPY . .

# Expõe a porta padrão que o Nuxt utiliza
EXPOSE 3000

# Dá permissão de execução para o script de entrypoint
RUN chmod +x docker-entrypoint.sh

# Define o entrypoint que preparará o banco de dados antes de iniciar a aplicação
ENTRYPOINT ["docker-entrypoint.sh"]

# Comando para iniciar o projeto em modo de desenvolvimento
CMD ["yarn", "run", "dev"]