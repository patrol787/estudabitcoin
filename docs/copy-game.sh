#!/bin/bash
# Copia o build do Bitcoin Quizz para a pasta jogo/ do site.
#
# Correr a partir da raiz do site:
#   export BITCOIN_QUIZZ_DIR="/caminho/para/Bitcoin Quizz"
#   ./docs/copy-game.sh
#
# Se BITCOIN_QUIZZ_DIR não estiver definida, usa a pasta "Bitcoin Quizz"
# imediatamente ao lado da pasta do site, quando existir.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ "$(basename "$SCRIPT_DIR")" = "docs" ]; then
  SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
else
  SITE_DIR="$SCRIPT_DIR"
fi
JOGO_DIR="$SITE_DIR/jogo"

if [ -n "$BITCOIN_QUIZZ_DIR" ]; then
  QUIZZ_DIR="$(cd "$BITCOIN_QUIZZ_DIR" && pwd)"
elif [ -d "$SITE_DIR/../Bitcoin Quizz" ]; then
  QUIZZ_DIR="$(cd "$SITE_DIR/../Bitcoin Quizz" && pwd)"
else
  echo "Erro: pasta Bitcoin Quizz não encontrada."
  echo "  Define a variável e volta a correr:"
  echo "  export BITCOIN_QUIZZ_DIR=\"/caminho/para/Bitcoin Quizz\""
  exit 1
fi

echo "→ Bitcoin Quizz (origem do build): $QUIZZ_DIR"
echo "→ Destino jogo:  $JOGO_DIR"
echo ""

echo "1/3 Limpar cache e dist do Bitcoin Quizz (build limpo)..."
cd "$QUIZZ_DIR"
rm -rf dist
rm -rf node_modules/.vite
echo ""
echo "2/3 A fazer build do Bitcoin Quizz..."
npm run build

echo ""
echo "3/3 A copiar dist/ para jogo/..."
mkdir -p "$JOGO_DIR"
find "$JOGO_DIR" -mindepth 1 -delete 2>/dev/null || true
cp -R "$QUIZZ_DIR/dist"/* "$JOGO_DIR/"

echo ""
echo "✓ Jogo atualizado em jogo/"
echo "Rever depois da cópia: lang=\"pt-PT\", favicon do site, textos em português europeu,"
echo "e apagar jogo/images/bitcoin-coin.png se for duplicado de jogo/assets/."
ls -la "$JOGO_DIR"
