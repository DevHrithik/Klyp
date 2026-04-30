#!/bin/bash
set -e

CACHE_DIR="$(cd "$(dirname "$0")" && pwd)/.bin"
BINARY="$CACHE_DIR/inngest"

if [ ! -f "$BINARY" ]; then
  echo "[inngest] Downloading Inngest CLI binary…"
  mkdir -p "$CACHE_DIR"

  OS=$(uname -s | tr '[:upper:]' '[:lower:]')
  ARCH=$(uname -m)
  [ "$ARCH" = "x86_64" ] && ARCH="amd64"
  [ "$ARCH" = "arm64" ] && ARCH="arm64"
  [ "$ARCH" = "aarch64" ] && ARCH="arm64"

  VERSION=$(curl -fsSL https://api.github.com/repos/inngest/inngest/releases/latest \
    | grep '"tag_name"' | head -1 | sed 's/.*"v\([^"]*\)".*/\1/')

  URL="https://github.com/inngest/inngest/releases/download/v${VERSION}/inngest_${VERSION}_${OS}_${ARCH}.tar.gz"

  echo "[inngest] Fetching v${VERSION} (${OS}/${ARCH})…"
  curl -fsSL "$URL" | tar -xz -C "$CACHE_DIR"

  chmod +x "$BINARY"
  echo "[inngest] Ready."
fi

exec "$BINARY" dev -u http://localhost:3001/api/inngest
