FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

COPY . .

RUN npm ci --no-audit --no-fund

RUN npm run build:api

FROM node:20-alpine AS runtime
WORKDIR /app

# Only copy built artifacts from build stage and production node_modules
COPY --from=build /app/packages/api/dist ./dist
# Copy package.json from the api package so npm can install runtime deps if desired
COPY --from=build /app/packages/api/package.json ./package.json
# Copy node_modules (all) to avoid re-install in runtime; this keeps image simple.
# Alternatively, run `npm ci --only=production` here if you prefer to keep node_modules slimmer.
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the compiled server (tsc output preserves file layout)
CMD ["node", "dist/server.js"]