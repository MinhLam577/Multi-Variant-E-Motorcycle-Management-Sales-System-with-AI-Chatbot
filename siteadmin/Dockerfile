FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY . .
RUN npm run build

FROM base AS dev
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start"]

FROM node:22-alpine AS prod
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["serve", "-s", "dist", "-l", "4000"]