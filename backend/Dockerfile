# Backend Dockerfile
# Node.js backend with Express and MongoDB

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/posts uploads/profiles uploads/communities

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application using ts-node
CMD ["npx", "ts-node", "src/server.ts"]

