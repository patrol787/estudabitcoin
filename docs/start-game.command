#!/bin/bash
# Servidor de desenvolvimento do Bitcoin Quiz (Vite), à parte do site.
# Porta 3001 para não conflituar com o site (3000).
#
# A pasta do projeto é BITCOIN_QUIZZ_DIR, ou "Bitcoin Quizz" ao lado da pasta do site.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ "$(basename "$SCRIPT_DIR")" = "docs" ]; then
  SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
else
  SITE_DIR="$SCRIPT_DIR"
fi

if [ -n "$BITCOIN_QUIZZ_DIR" ]; then
  QUIZZ_DIR="$(cd "$BITCOIN_QUIZZ_DIR" && pwd)"
elif [ -d "$SITE_DIR/../Bitcoin Quizz" ]; then
  QUIZZ_DIR="$(cd "$SITE_DIR/../Bitcoin Quizz" && pwd)"
else
  echo "Define BITCOIN_QUIZZ_DIR para a pasta do projeto Bitcoin Quizz."
  exit 1
fi

cd "$QUIZZ_DIR"

echo "Pasta do jogo: $QUIZZ_DIR"
echo ""
echo "Servidor do jogo (Vite) em http://localhost:3001"
echo "Abrir o browser em 3 segundos..."
echo ""
echo "Para parar: fecha esta janela ou Ctrl+C"
echo "----------------------------------------"

(sleep 3 && open "http://localhost:3001") &

npm run dev -- --port 3001 --host 127.0.0.1
