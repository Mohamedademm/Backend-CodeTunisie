# Multi-stage build for Backend
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Development stage
FROM node:18-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
