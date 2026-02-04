#!/bin/bash
# Inicia o jogo Bitcoin Quiz com o Vite (mesmo servidor que usaste quando testaste).
# Porta 3001 para não conflituar com o site (3000).
#
# Para testar: 1) Inicia start-server.command (site na 3000)
#              2) Inicia ESTE ficheiro (jogo na 3001)
#              3) No site, clica "Jogar Bitcoin Quiz" → abre o jogo.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
QUIZZ_DIR="$(cd "$SCRIPT_DIR/../Bitcoin Quizz" && pwd)"

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
