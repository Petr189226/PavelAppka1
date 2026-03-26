# Static Vite/React app lives in fve-ui/ — Railpack fails on repo root without this file.
FROM node:20-alpine AS build
WORKDIR /app
COPY fve-ui/package.json ./fve-ui/
WORKDIR /app/fve-ui
RUN npm install
COPY fve-ui/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/fve-ui/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l \"tcp://0.0.0.0:${PORT:-3000}\""]
