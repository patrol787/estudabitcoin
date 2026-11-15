/* Mensagens se o módulo do jogo não arrancar. Não faz parte do ecrã normal. */
(function () {
  window.addEventListener("error", function (event) {
    var root = document.getElementById("root");
    if (!root || root.getAttribute("data-error")) return;
    root.setAttribute("data-error", "1");
    var msg = event.message || "erro desconhecido";
    var src = (event.target && (event.target.src || event.target.href)) || event.filename || "";
    if (src) msg += " — Ficheiro: " + src;
    root.textContent = "";
    var error = document.createElement("p");
    error.style.cssText = "padding:2rem;color:#f44;font-family:Courier New,Consolas,monospace;word-break:break-all;";
    error.textContent = "Erro: " + msg;
    var hint = document.createElement("p");
    hint.style.cssText = "padding:0 2rem;color:#888;font-size:0.9em;";
    hint.textContent = "Certifica-te de que abriste o site através de um servidor (ex.: npx serve) e não abrindo o ficheiro diretamente.";
    root.appendChild(error);
    root.appendChild(hint);
  }, true);

  setTimeout(function () {
    var root = document.getElementById("root");
    if (root && !root.getAttribute("data-error") && root.children.length === 1 && root.querySelector("p")) {
      root.innerHTML = '<p style="padding:2rem;text-align:center;color:#F7931A;font-family:Courier New,Consolas,monospace;">Ainda a carregar…</p><p style="padding:0 2rem;text-align:center;color:#aaa;font-size:0.95em;">Na primeira vez o carregamento pode demorar. Espera mais um pouco ou abre a consola (F12) para ver erros.</p>';
    }
  }, 15000);

  setTimeout(function () {
    var root = document.getElementById("root");
    if (root && !root.getAttribute("data-error") && root.children.length === 1 && root.querySelector("p")) {
      root.innerHTML = '<p style="padding:2rem;text-align:center;color:#f44;font-family:Courier New,Consolas,monospace;">O jogo não carregou.</p><p style="padding:0 2rem;text-align:center;color:#aaa;font-size:0.95em;">Abre a consola (F12) e vê qual o erro a vermelho. Recarrega (F5) para tentar de novo.</p>';
    }
  }, 35000);
})();
