/* Core helpers: DOM builder, rich text, persistence, toasts, tables. */
(function (A) {
  "use strict";

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, "");
        else el.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { append(el, x); });
    else if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }

  /* **bold** and `code` only; everything else is plain text, so content can never inject markup. */
  function rich(str) {
    var frag = document.createDocumentFragment();
    String(str).split(/(\*\*[^*]+\*\*|`[^`]+`)/).forEach(function (p) {
      if (!p) return;
      if (p.slice(0, 2) === "**" && p.slice(-2) === "**") frag.appendChild(h("strong", null, p.slice(2, -2)));
      else if (p[0] === "`" && p.slice(-1) === "`") {
        frag.appendChild(h("code", { class: "copyable", tabindex: "0", role: "button", title: "Click to copy" }, p.slice(1, -1)));
      } else frag.appendChild(document.createTextNode(p));
    });
    return frag;
  }

  /* Array of paragraphs; consecutive "- " lines become a list. */
  function paras(list) {
    var out = [], ul = null;
    (list || []).forEach(function (s) {
      if (/^- /.test(s)) {
        if (!ul) { ul = h("ul", { class: "bullets" }); out.push(ul); }
        ul.appendChild(h("li", null, rich(s.slice(2))));
      } else {
        ul = null;
        out.push(h("p", null, rich(s)));
      }
    });
    return out;
  }

  /* ---------- persistence ---------- */
  var KEY = "adnd365-training-v1";
  var mem = null;
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { mem = {}; }
    ["steps", "practice", "quiz", "claimed"].forEach(function (k) { mem[k] = mem[k] || {}; });
    return mem;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* private mode: keep in memory */ }
  }
  function reset() {
    mem = { steps: {}, practice: {}, quiz: {}, claimed: {} };
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function copyText(text, okMsg) {
    function done() { toast(okMsg || "Copied to clipboard"); }
    function fallback() {
      var ta = h("textarea", { class: "sr-only", "aria-hidden": "true" });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Copy failed"); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  document.addEventListener("click", function (e) {
    var c = e.target.closest && e.target.closest("code.copyable");
    if (c) copyText(c.textContent, "Copied \"" + c.textContent + "\"");
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("copyable")) {
      e.preventDefault();
      copyText(e.target.textContent, "Copied \"" + e.target.textContent + "\"");
    }
  });

  /* ---------- tables ---------- */
  function table(def) {
    var wrap = h("div", { class: "table-block" });
    var head = h("div", { class: "table-head" });
    if (def.title) head.appendChild(h("h4", null, def.title));
    if (def.copy) {
      head.appendChild(h("button", {
        type: "button", class: "btn btn-small",
        onclick: function () {
          copyText(def.rows.map(function (r) { return r.join("\t"); }).join("\n"), "Rows copied, ready to paste into Excel");
        }
      }, "Copy for Excel"));
    }
    if (def.title || def.copy) wrap.appendChild(head);
    var thead = h("thead", null, h("tr", null, def.columns.map(function (c) { return h("th", { scope: "col" }, c); })));
    var tbody = h("tbody", null, def.rows.map(function (r) {
      return h("tr", null, r.map(function (cell, i) {
        var td = h("td", { "data-label": def.columns[i] });
        if (cell === "") td.appendChild(h("span", { class: "muted" }, "-"));
        else if (i === 0 && def.columns[0] === "Field") td.appendChild(h("strong", null, cell));
        else td.appendChild(rich(cell));
        return td;
      }));
    }));
    wrap.appendChild(h("div", { class: "table-scroll" }, h("table", { class: "data" }, thead, tbody)));
    return wrap;
  }

  function note(n) {
    var label = n.type === "warn" ? "Heads up" : "Tip";
    return h("aside", { class: "note note-" + (n.type || "tip") }, h("strong", { class: "note-label" }, label), h("p", null, rich(n.text)));
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function norm(s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  A.ui = { h: h, rich: rich, paras: paras, load: load, save: save, reset: reset, toast: toast, copyText: copyText, table: table, note: note, shuffle: shuffle, norm: norm };
})(window.ADND);
