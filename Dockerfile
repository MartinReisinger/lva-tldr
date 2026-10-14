FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare --activate
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_QUIZ_DATABASE_PATH=/app/.data/quiz-progress.sqlite

COPY --from=builder /app/.output ./.output

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
