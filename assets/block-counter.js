/* Altura do bloco Bitcoin, consultada no browser (~10 min). */
(function () {
  var el = document.getElementById("live-block-number");
  if (!el) return;

  var UPDATE_MS = 10 * 60 * 1000;
  var FETCH_TIMEOUT_MS = 8000;
  var apis = [
    "https://blockstream.info/api/blocks/tip",
    "https://mempool.space/api/v1/blocks/tip/height"
  ];

  function setHeight(height) {
    if (typeof height === "number") el.textContent = "#" + height.toLocaleString("pt-PT");
    else el.textContent = "\u2014";
  }

  function parseHeight(url, data) {
    if (url.indexOf("blockstream") !== -1) {
      var block = Array.isArray(data) ? data[0] : data;
      return block && block.height != null ? Number(block.height) : NaN;
    }
    if (url.indexOf("mempool") !== -1) {
      if (typeof data === "number") return data;
      if (typeof data === "string") {
        var parsed = parseInt(data, 10);
        return isNaN(parsed) ? NaN : parsed;
      }
      return data && data.height != null ? Number(data.height) : NaN;
    }
    return NaN;
  }

  function fetchWithTimeout(url) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, FETCH_TIMEOUT_MS);
    return fetch(url, { signal: ctrl.signal }).then(function (response) {
      clearTimeout(timer);
      var contentType = (response.headers.get("content-type") || "").toLowerCase();
      if (contentType.indexOf("json") !== -1) return response.json();
      return response.text();
    });
  }

  function tryNext(index) {
    if (index >= apis.length) {
      setHeight(null);
      return;
    }
    var url = apis[index];
    fetchWithTimeout(url).then(function (data) {
      var height = parseHeight(url, data);
      if (!isNaN(height)) setHeight(height);
      else tryNext(index + 1);
    }).catch(function () {
      tryNext(index + 1);
    });
  }

  function updateBlock() {
    tryNext(0);
  }

  updateBlock();
  setInterval(updateBlock, UPDATE_MS);
})();
