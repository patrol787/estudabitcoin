/* Shared header, footer and mobile menu for the static pages.
   Injected synchronously so the navigation is in the DOM before first paint.
   Page titles, headings and meta tags stay in each HTML file. */
(function () {
  var LINKS = [
    { id: "inicio", href: "/", label: "Início" },
    { id: "aprende", href: "/aprende.html", label: "Aprende" },
    { id: "joga", href: "/joga.html", label: "Joga" },
    { id: "recursos", href: "/recursos.html", label: "Recursos" }
  ];

  var FOOTER = "Este site não utiliza cookies nem scripts de rastreio. O alojamento é fornecido pela Vercel, sujeito à sua política de privacidade. A página inicial consulta a altura do bloco na Blockstream ou no mempool.space, e o simulador O Sócio Invisível consulta o preço do Bitcoin na CoinGecko; esses pedidos partem do teu navegador.";

  function navItems(current) {
    var html = "";
    var i;
    for (i = 0; i < LINKS.length; i++) {
      var link = LINKS[i];
      var currentAttr = link.id === current ? ' aria-current="page"' : "";
      html += '<li><a href="' + link.href + '"' + currentAttr + ">" + link.label + "</a></li>";
    }
    return html;
  }

  function bindMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav-list");
    if (!toggle || !nav || toggle.getAttribute("data-bound") === "1") return;
    toggle.setAttribute("data-bound", "1");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
  }

  function render() {
    var current = document.documentElement.getAttribute("data-page") || "";
    var headerSlot = document.getElementById("site-header");
    if (headerSlot) {
      headerSlot.outerHTML =
        '<header class="site-header" role="banner">' +
          '<div class="header-inner">' +
            '<a href="/" class="site-logo">Estuda<span>Bitcoin</span></a>' +
            '<button type="button" class="nav-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-main">' +
              '<span aria-hidden="true">\u2630</span>' +
            "</button>" +
            '<nav id="nav-main" role="navigation" aria-label="Navegação principal">' +
              '<ul class="nav-list">' + navItems(current) + "</ul>" +
            "</nav>" +
          "</div>" +
        "</header>";
      bindMenu();
    }

    var footerSlot = document.getElementById("site-footer");
    if (footerSlot) {
      var footer = document.createElement("footer");
      footer.className = "site-footer";
      footer.setAttribute("role", "contentinfo");
      var inner = document.createElement("div");
      inner.className = "footer-inner";
      var paragraph = document.createElement("p");
      paragraph.className = "footer-disclaimer";
      var strong = document.createElement("strong");
      strong.textContent = "Privacidade.";
      paragraph.appendChild(strong);
      paragraph.appendChild(document.createTextNode(" " + FOOTER));
      inner.appendChild(paragraph);
      footer.appendChild(inner);
      footerSlot.replaceWith(footer);
    }
  }

  render();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  }
})();
