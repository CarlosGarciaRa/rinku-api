# ------------------------------------- - ------------------------------------ #
# --------------------------- stage de developmnet --------------------------- #
# ------------------------------------- - ------------------------------------ #

# Usa una imagen base de Node.js 16.13.1
FROM node:16.13.1-alpine AS development

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app


RUN chown -R node:node /app

# Establece el usuario y grupo para ejecutar los comandos dentro del contenedor
USER node

# Copia los archivos de paquete y de bloqueo para instalar las dependencias
COPY package*.json ./
COPY yarn.lock ./
# Instala las dependencias utilizando Yarn
RUN yarn install 
# Copia el código fuente de tu aplicación
COPY . .
RUN yarn prisma generate
# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 3000

# Comando para iniciar tu aplicación
CMD [ "yarn", "start:dev" ]

# ------------------------------------- - ------------------------------------ #
# --------------------------- Stage de construcción -------------------------- #
# ------------------------------------- - ------------------------------------ #

FROM development AS build

RUN yarn build
RUN yarn install --production && && yarn cache clean

# ------------------------------------- - ------------------------------------ #
# ---------------------------- Stage de producción --------------------------- #
# ------------------------------------- - ------------------------------------ #

FROM node:16.13.1-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD [ "yarn", "start:prod" ]