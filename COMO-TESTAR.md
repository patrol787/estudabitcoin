# Como testar o site no browser

## Método 1 – Duplo-clique (recomendado)

1. No Finder, abre a pasta **website estudabictoin.com**.
2. Faz **duplo-clique** em **`start-server.command`**.
3. Na primeira vez: botão direito → **Abrir** → **Abrir**.
4. O browser deve abrir em **http://localhost:3000**.

---

## Método 2 – Terminal com Node

Se tiveres Node.js instalado:

```bash
cd "/Users/pedrofrazao/Library/CloudStorage/ProtonDrive-pjfsinvest@protonmail.com-folder/Bitcoin/website estudabictoin.com"
npx serve . -l 3000
```

Depois abre no browser: **http://localhost:3000**

---

## Método 3 – Se der "ligação reposta" (ProtonDrive)

Às vezes pastas no ProtonDrive causam isso. Copia o site para o **Ambiente de trabalho** e corre o servidor de lá:

1. No Finder, copia a pasta **website estudabictoin.com** para o **Ambiente de trabalho**.
2. No Terminal:
   ```bash
   cd ~/Desktop/website\ estudabictoin.com
   npx serve . -l 3000
   ```
3. Abre **http://localhost:3000** no browser.

---

## Método 4 – Só Python (porta 3000)

```bash
cd "/Users/pedrofrazao/Library/CloudStorage/ProtonDrive-pjfsinvest@protonmail.com-folder/Bitcoin/website estudabictoin.com"
python3 -m http.server 3000
```

Abre **http://localhost:3000**

---

**Para parar o servidor:** na janela do Terminal carrega **Ctrl+C**.

---

## Jogo (Bitcoin Quiz)

O jogo corre **no seu próprio servidor**, como quando o testaste sozinho, para evitar problemas com subpastas.

1. **Inicia o site:** duplo-clique em **`start-server.command`** (site em http://localhost:3000).
2. **Inicia o jogo:** duplo-clique em **`start-game.command`** (jogo em http://localhost:3001). Na primeira vez: botão direito → Abrir → Abrir.
3. No browser abre **http://localhost:3000** → **Joga** → **Jogar Bitcoin Quiz**. O jogo abre numa nova aba em http://localhost:3001 e funciona como quando o testaste no Firefox.

**Resumo:** dois servidores (site na 3000, jogo na 3001). O botão "Jogar" em localhost abre o jogo na porta 3001.
