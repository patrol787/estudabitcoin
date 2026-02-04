#!/bin/bash
# Copia o build do Bitcoin Quizz para a pasta jogo/ do site.
# Executar a partir da pasta do site: ./copy-game.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR" && pwd)"
QUIZZ_DIR="$(cd "$SITE_DIR/../Bitcoin Quizz" && pwd)"
JOGO_DIR="$SITE_DIR/jogo"

echo "→ Bitcoin Quizz: $QUIZZ_DIR"
echo "→ Destino jogo:  $JOGO_DIR"
echo ""

echo "1/2 A fazer build do Bitcoin Quizz..."
cd "$QUIZZ_DIR"
npm run build

echo ""
echo "2/2 A copiar dist/ para jogo/..."
mkdir -p "$JOGO_DIR"
find "$JOGO_DIR" -mindepth 1 -delete 2>/dev/null || true
cp -R "$QUIZZ_DIR/dist"/* "$JOGO_DIR/"

echo ""
echo "✓ Jogo atualizado em jogo/"
ls -la "$JOGO_DIR"
