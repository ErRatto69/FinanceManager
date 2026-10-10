FROM node:22-alpine AS build
WORKDIR /app

COPY . .
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f package.json ]; then npm install; \
    else mkdir -p dist && cp -r public/* dist/; fi
RUN if [ -f package.json ]; then npm run build; fi

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]