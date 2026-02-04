#!/bin/bash
# Duplo-clique para iniciar o servidor e abrir o site no browser.
# Usa Node (npx serve) — mais estável em pastas com espaços/ProtonDrive.

cd "$(dirname "$0")"
echo "Pasta: $(pwd)"
echo ""
echo "IMPORTANTE: O servidor deve correr nesta pasta (a que tem index.html, joga.html e a pasta 'jogo'), NÃO dentro da pasta jogo."
echo ""
echo "A iniciar servidor em http://localhost:3000"
echo "Abrir o browser em 2 segundos..."
echo ""
echo "Para parar: fecha esta janela ou Ctrl+C"
echo "----------------------------------------"

# Abre o browser após o servidor estar pronto
(sleep 2 && open "http://localhost:3000") &

# npx serve é mais estável que python em pastas cloud/s espaços
if command -v npx &>/dev/null; then
  npx --yes serve . -l 3000
else
  echo "Node/npx não encontrado. A instalar: https://nodejs.org"
  echo "Alternativa: no Terminal, nesta pasta, corre: python3 -m http.server 3000"
  python3 -m http.server 3000
fi
