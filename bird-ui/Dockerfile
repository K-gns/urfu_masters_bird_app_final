FROM node:20-alpine AS build
WORKDIR /app

# устанавливаем зависимости
COPY package*.json ./
RUN npm install

# собираем проект
COPY . .
RUN npx vite build

# раздача статики
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

