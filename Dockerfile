FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

ENV DATABASE_URL="file:/data/prod.db"
EXPOSE 3000
CMD ["sh", "-c", "mkdir -p /data && npx prisma db push && npx tsx scripts/update-menu.ts && npm start"]
