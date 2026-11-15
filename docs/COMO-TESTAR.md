# Como testar o site no browser

Os ficheiros desta pasta (`docs/`) são só para desenvolvimento. Não são publicados: estão excluídos no `.vercelignore`.

Serve sempre a **raiz do site** (a pasta que contém `index.html`), não esta pasta `docs/`.

## Método 1 – Duplo-clique

1. Abre a pasta `docs/` do site.
2. Faz **duplo-clique** em **`start-server.command`**.
3. Na primeira vez, no macOS: botão direito → **Abrir** → **Abrir**.
4. O browser deve abrir em **http://localhost:3000**.

---

## Método 2 – Terminal com Node

Na raiz do site (a pasta com `index.html`):

```bash
npx serve . -l 3000
```

Depois abre **http://localhost:3000**.

---

## Método 3 – Se a pasta na nuvem der "ligação reposta"

Pastas sincronizadas (por exemplo Proton Drive) às vezes recusam o servidor. Copia o site para uma pasta local, como o Ambiente de trabalho, e corre o servidor a partir dessa cópia:

```bash
npx serve . -l 3000
```

Abre **http://localhost:3000**.

---

## Método 4 – Só Python (porta 3000)

Na raiz do site:

```bash
python3 -m http.server 3000
```

Abre **http://localhost:3000**.

---

**Para parar o servidor:** na janela do Terminal carrega **Ctrl+C**.

---

## Jogo (Bitcoin Quiz)

O jogo publicado está na pasta `jogo/` e abre no mesmo servidor que o resto do site (`/jogo/`).

O ficheiro `start-game.command` só é preciso para desenvolver o projeto do jogo à parte, na porta 3001. Para ver o jogo tal como está no site, basta o servidor da raiz e a página **Joga**.

---

## Atualizar o jogo no site

As alterações no projeto **Bitcoin Quizz** só aparecem no site depois de atualizares a pasta `jogo/`. O procedimento está em `PROCEDIMENTO-ATUALIZAR-JOGO.txt`.
