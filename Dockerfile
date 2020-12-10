# Stage 0, "build-stage".
FROM node:14-alpine3.12 as build-stage
WORKDIR /app
COPY package*.json /app/

# First install deps, then copy app and build.
RUN npm ci
COPY ./ /app/
RUN npm run build

# Stage 1, "prod-stage".
FROM nginx:stable
COPY --from=build-stage /app/build/ /usr/share/nginx/html
