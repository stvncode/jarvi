FROM oven/bun:1 AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

# Copy source code
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

# Set production environment
ENV NODE_ENV=production

# Build optimized binary following Elysia recommendations
RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/index.ts

# Production stage with distroless image
FROM gcr.io/distroless/base

WORKDIR /app

# Copy the compiled binary
COPY --from=build /app/server server

# Set production environment
ENV NODE_ENV=production

# Start the binary
CMD ["./server"]

# Expose port (flexible for production)
EXPOSE 3001 