FROM node:24-alpine3.21 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine3.21-slim AS prod

COPY --from=build /app/dist/ /usr/share/nginx/html/

# Add custom entrypoint to inject runtime env
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]