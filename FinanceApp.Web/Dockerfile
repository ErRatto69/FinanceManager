# Stage 1: Compila l'app React con Node
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Prende la cartella 'dist' compilata e la mette in Nginx
FROM nginx:alpine

# Rimuove i file di default di Nginx
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]