FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

FROM mcr.microsoft.com/playwright:v1.62.1-jammy
WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lockb ./

RUN bun install --production

COPY --from=builder /app/dist ./dist

EXPOSE 1911

CMD ["bun", "run", "start"]