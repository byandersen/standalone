# Docker Build for running nginx react app

FROM node:lts-alpine AS build-stage
WORKDIR /app

COPY ["web app/standalone/package*.json", "./"]
RUN npm install
COPY ["web app/standalone/", "."]
RUN npm run build


FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY /deployment/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]