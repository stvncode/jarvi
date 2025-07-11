FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Start the application
CMD ["bun", "run", "dist/index.js"] 