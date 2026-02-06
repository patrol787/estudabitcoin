#!/bin/bash
# Copia o build do Bitcoin Quizz para a pasta jogo/ do site.
#
# IMPORTANTE: Sempre que alterares o jogo no projeto "Bitcoin Quizz",
# tens de correr ESTE script para as alterações aparecerem no site.
# Executar a partir da pasta do site: ./copy-game.sh
#
# Pasta do jogo: se o teu Bitcoin Quizz está noutro sítio, altera o caminho
# em baixo ou define BITCOIN_QUIZZ_DIR antes de correr o script.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR" && pwd)"
JOGO_DIR="$SITE_DIR/jogo"

# Pasta do projeto Bitcoin Quizz (em Documents). Para outro caminho: export BITCOIN_QUIZZ_DIR="/caminho"
if [ -n "$BITCOIN_QUIZZ_DIR" ]; then
  QUIZZ_DIR="$(cd "$BITCOIN_QUIZZ_DIR" && pwd)"
elif [ -d "/Users/pedrofrazao/Documents/Bitcoin Quizz" ]; then
  QUIZZ_DIR="/Users/pedrofrazao/Documents/Bitcoin Quizz"
else
  echo "Erro: pasta Bitcoin Quizz não encontrada."
  echo "  Esperada: /Users/pedrofrazao/Documents/Bitcoin Quizz"
  echo "  Ou define: export BITCOIN_QUIZZ_DIR=\"/caminho/para/Bitcoin Quizz\""
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
ls -la "$JOGO_DIR"
