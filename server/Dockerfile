FROM mcr.microsoft.com/playwright:v1.62.1-jammy
WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 1911

CMD ["bun", "run", "start"]