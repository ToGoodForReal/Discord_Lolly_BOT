# ---- Build Stage ----
FROM node:20-bookworm AS builder

WORKDIR /app

# Install Python, ffmpeg and yt-dlp (required by youtube-dl-exec)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 curl ca-certificates ffmpeg && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files first (better layer caching)
COPY package.json package-lock.json* ./

# Install all dependencies
ENV YOUTUBE_DL_SKIP_PYTHON_CHECK=1
RUN npm ci

# Copy source and config
COPY tsconfig.json eslint.config.js ./
COPY src ./src

# Build TypeScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-bookworm-slim AS production

WORKDIR /app

# Install Python, ffmpeg and yt-dlp (required by youtube-dl-exec at runtime)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 curl ca-certificates ffmpeg && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    rm -rf /var/lib/apt/lists/*

# Copy package and install production deps only
COPY package.json package-lock.json* ./
ENV YOUTUBE_DL_SKIP_PYTHON_CHECK=1
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Symlink ffmpeg-static to PATH (discord-player needs ffmpeg binary)
RUN ln -s /app/node_modules/ffmpeg-static/ffmpeg /usr/local/bin/ffmpeg

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('ok')" || exit 1

# Run the bot
CMD ["node", "--no-warnings", "dist/index.js"]
