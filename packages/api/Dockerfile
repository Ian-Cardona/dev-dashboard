FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

COPY . .

RUN npm ci --no-audit --no-fund

RUN npm run build -w @dev-dashboard/shared && npm run build -w api

FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=build /app/packages/api/dist ./dist

COPY --from=build /app/packages/shared/dist ./node_modules/@dev-dashboard/shared/dist

COPY --from=build /app/packages/api/package.json ./package.json

COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]