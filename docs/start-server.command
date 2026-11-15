#!/bin/bash
# Duplo-clique para iniciar o servidor e abrir o site no browser.
# O script vive em docs/; o servidor corre na raiz do site.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ "$(basename "$SCRIPT_DIR")" = "docs" ]; then
  cd "$SCRIPT_DIR/.."
else
  cd "$SCRIPT_DIR"
fi

echo "Pasta: $(pwd)"
echo ""
echo "IMPORTANTE: O servidor corre na raiz do site (index.html, joga.html e a pasta jogo), não dentro de jogo/ nem de docs/."
echo ""
echo "A iniciar servidor em http://localhost:3000"
echo "Abrir o browser em 2 segundos..."
echo ""
echo "Para parar: fecha esta janela ou Ctrl+C"
echo "----------------------------------------"

(sleep 2 && open "http://localhost:3000") &

if command -v npx &>/dev/null; then
  npx --yes serve . -l 3000
else
  echo "Node/npx não encontrado. Instala em https://nodejs.org"
  echo "Alternativa: python3 -m http.server 3000"
  python3 -m http.server 3000
fi
