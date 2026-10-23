# Contexto de build: raiz do monorepo (usa o package-lock.json compartilhado).
FROM node:22-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN mkdir -p apps/api/node_modules && npm ci --workspace apps/api
COPY apps/api apps/api
RUN npm run build --workspace apps/api

FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN mkdir -p apps/api/node_modules && npm ci --omit=dev --workspace apps/api

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/
WORKDIR /repo/apps/api
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
