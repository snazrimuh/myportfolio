FROM node:20-alpine

WORKDIR /app

# Install dependencies (all — ts-node needed for seeding)
# Copy prisma schema first so postinstall (prisma generate) can find it
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci

# Copy source and generate Prisma client
COPY . .
RUN npx prisma generate

# Build app (src/ → dist/main.js)
RUN npm run build
# Compile seed.ts → dist/prisma/seed.js
RUN npx tsc prisma/seed.ts --outDir dist --rootDir . --module commonjs --target ES2021 --esModuleInterop true --skipLibCheck true

EXPOSE 3001

CMD ["node", "dist/main.js"]

