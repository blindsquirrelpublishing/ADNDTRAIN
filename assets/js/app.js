/* App shell: routing, views, progress. */
(function (A) {
  "use strict";
  var ui = A.ui, h = ui.h, rich = ui.rich, paras = ui.paras;
  var $app = document.getElementById("app");
  var $side = document.getElementById("sidebar");
  var $badge = document.getElementById("xp-badge");
  var store = ui.load();

  var TABS = [
    { id: "briefing", label: "Briefing" },
    { id: "reference", label: "Reference" },
    { id: "walkthrough", label: "Walkthrough" },
    { id: "practice", label: "Practice" },
    { id: "quiz", label: "Knowledge Check" },
    { id: "wrapup", label: "Wrap-Up & XP" }
  ];
  var RANKS = [
    { xp: 0, name: "Novice Scribe" },
    { xp: 400, name: "Apprentice Cartographer" },
    { xp: 1000, name: "Journeyman Cartographer" },
    { xp: 1800, name: "Arcane Cartographer of Configuration" }
  ];

  /* ---------- progress model ---------- */
  function key(mod, lab, part) { return mod.id + "/" + lab.id + (part ? "/" + part : ""); }

  function stepCounts(mod, lab) {
    var total = 0, done = 0;
    lab.tasks.forEach(function (t) {
      total += t.steps.length;
      done += (store.steps[key(mod, lab, t.id)] || []).length;
    });
    return { total: total, done: done };
  }
  function practiceCounts(mod, lab) {
    var done = 0;
    lab.practice.forEach(function (p, i) { if (store.practice[key(mod, lab, "p" + i)]) done += 1; });
    return { total: lab.practice.length, done: done };
  }
  function labState(mod, lab) {
    var s = stepCounts(mod, lab), p = practiceCounts(mod, lab);
    var q = !!(store.quiz[key(mod, lab)] && store.quiz[key(mod, lab)].passed);
    var claimed = !!store.claimed[key(mod, lab)];
    var ready = s.done === s.total && p.done === p.total && q;
    var pct = claimed ? 100 : Math.round(((s.done / s.total) + (p.total ? p.done / p.total : 1) + (q ? 1 : 0)) / 3 * 100);
    return { steps: s, practice: p, quiz: q, claimed: claimed, ready: ready, pct: pct, started: pct > 0 };
  }
  function moduleState(mod) {
    var xp = 0, claimed = 0, pctSum = 0;
    mod.labs.forEach(function (l) {
      var st = labState(mod, l);
      if (st.claimed) { xp += l.xp; claimed += 1; }
      pctSum += st.pct;
    });
    var finalOk = !!(store.quiz[mod.id + "/final"] && store.quiz[mod.id + "/final"].passed);
    return { xp: xp, claimed: claimed, total: mod.labs.length, pct: Math.round(pctSum / mod.labs.length), final: finalOk, complete: claimed === mod.labs.length && finalOk };
  }
  function totalXp() { return A.modules.reduce(function (n, m) { return n + moduleState(m).xp; }, 0); }
  function rank(xp) { var r = RANKS[0]; RANKS.forEach(function (x) { if (xp >= x.xp) r = x; }); return r.name; }

  function getModule(id) { return A.modules.filter(function (m) { return m.id === id; })[0]; }
  function getLab(mod, id) { return mod.labs.filter(function (l) { return l.id === id; })[0]; }
  function persist() { ui.save(); renderChrome(); }

  /* ---------- chrome (header badge + sidebar) ---------- */
  var current = { mod: null, lab: null, tab: null, summary: false, updateTabs: null };

  function renderChrome() {
    var xp = totalXp();
    $badge.textContent = "";
    $badge.appendChild(h("span", { class: "xp-num" }, xp.toLocaleString() + " XP"));
    $badge.appendChild(h("span", { class: "xp-rank" }, rank(xp)));

    $side.textContent = "";
    var mod = current.mod;
    if (!mod) { document.body.classList.add("no-side"); return; }
    document.body.classList.remove("no-side");
    var ms = moduleState(mod);
    $side.appendChild(h("a", { class: "side-back", href: "#/" }, "\u2190 All modules"));
    $side.appendChild(h("div", { class: "side-title" }, h("span", { class: "side-kicker" }, "Module " + mod.number), h("strong", null, mod.title)));
    $side.appendChild(h("div", { class: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(ms.pct), "aria-label": "Module progress" }, h("span", { style: "width:" + ms.pct + "%" })));
    var ul = h("ul", { class: "side-list" });
    ul.appendChild(sideItem("#/" + mod.id, "Module overview", "", !current.lab && !current.summary, null));
    mod.labs.forEach(function (l) {
      var st = labState(mod, l);
      ul.appendChild(sideItem("#/" + mod.id + "/" + l.id, "Lab " + l.number + ": " + l.title, l.xp + " XP", current.lab === l, st));
    });
    ul.appendChild(sideItem("#/" + mod.id + "/summary", "Module summary", ms.complete ? "Complete" : "", current.summary, null, ms.complete));
    $side.appendChild(ul);
  }
  function sideItem(href, label, meta, active, st, doneFlag) {
    var cls = "side-item" + (active ? " active" : "");
    var status = st ? (st.claimed ? "done" : st.started ? "progress" : "new") : (doneFlag ? "done" : "none");
    var icon = status === "done" ? "\u2714" : status === "progress" ? "\u25D0" : status === "new" ? "\u25CB" : "\u25C6";
    return h("li", null, h("a", { class: cls, href: href, "aria-current": active ? "page" : null, "data-status": status },
      h("span", { class: "side-icon", "aria-hidden": "true" }, icon),
      h("span", { class: "side-label" }, label),
      meta ? h("span", { class: "side-meta" }, meta) : null));
  }

  /* ---------- helpers ---------- */
  function progressBar(pct, label) {
    return h("div", { class: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct), "aria-label": label }, h("span", { style: "width:" + pct + "%" }));
  }
  function section(title, children, cls) {
    return h("section", { class: "block " + (cls || "") }, title ? h("h3", null, title) : null, children);
  }
  function mount(view, title) {
    document.title = title + " | AD&D365 Training";
    $app.textContent = "";
    $app.appendChild(view);
    window.scrollTo(0, 0);
    var hd = $app.querySelector("h1");
    if (hd) { hd.setAttribute("tabindex", "-1"); hd.focus({ preventScroll: true }); }
    document.body.classList.remove("side-open");
  }

  /* ---------- home ---------- */
  function homeView() {
    current = { mod: null, lab: null, tab: null, summary: false };
    var xp = totalXp();
    var cards = A.modules.map(function (m) {
      var ms = moduleState(m);
      var label = ms.complete ? "Review module" : ms.pct > 0 ? "Continue" : "Start module";
      return h("article", { class: "card module-card" },
        h("div", { class: "card-kicker" }, "Module " + m.number + " \u00B7 " + m.guide),
        h("h3", null, h("a", { href: "#/" + m.id }, m.title)),
        h("p", null, m.tagline),
        h("ul", { class: "meta" }, h("li", null, m.labs.length + " labs"), h("li", null, m.duration), h("li", null, m.totalXp.toLocaleString() + " XP")),
        progressBar(ms.pct, m.title + " progress"),
        h("div", { class: "card-foot" }, h("span", { class: "muted small" }, ms.claimed + " of " + ms.total + " labs complete"), h("a", { class: "btn btn-primary", href: "#/" + m.id }, label)));
    });
    var soon = A.upcoming.map(function (m) {
      return h("article", { class: "card module-card soon", "aria-disabled": "true" },
        h("div", { class: "card-kicker" }, "Module " + m.number + " \u00B7 Coming soon"),
        h("h3", null, m.title), h("p", null, m.tagline));
    });
    var how = [
      ["Read the briefing", "Understand why the configuration matters to the Waterdeep Trading Company."],
      ["Follow the walkthrough", "Check off each step as you perform it in your own Dynamics 365 environment."],
      ["Practice in the simulator", "Rehearse the data entry in a safe, simulated form before touching your tenant."],
      ["Pass the check, claim XP", "Prove it with a short quiz, then claim the XP and climb the ranks."]
    ];
    var view = h("div", { class: "page home" },
      h("header", { class: "hero" },
        h("div", { class: "hero-text" },
          h("p", { class: "eyebrow" }, "Advanced Dungeons & Dynamics 365"),
          h("h1", null, "Configuration Training Academy"),
          h("p", { class: "lead" }, "Hands-on, gamified labs for configuring Microsoft Dynamics 365 Finance with the Waterdeep Trading Company. Learn by doing, earn XP, and map the Realms into your ERP."),
          h("div", { class: "btn-row" },
            h("a", { class: "btn btn-primary", href: "#/" + A.modules[0].id }, xp > 0 ? "Continue your quest" : "Begin Module 1"),
            h("a", { class: "btn", href: "#how" , onclick: function (e) { e.preventDefault(); document.getElementById("how").scrollIntoView({ behavior: "smooth" }); } }, "How it works"))),
        h("img", { class: "hero-art", src: "assets/img/hero-scribe.jpg", alt: "A scribe in a candlelit study writing records on parchment", width: "400", height: "490" })),
      h("section", { class: "stats", "aria-label": "Your progress" },
        stat(xp.toLocaleString(), "XP earned"), stat(rank(xp), "Current rank"),
        stat(A.modules.reduce(function (n, m) { return n + moduleState(m).claimed; }, 0) + "/" + A.modules.reduce(function (n, m) { return n + m.labs.length; }, 0), "Labs complete")),
      h("section", { id: "modules" }, h("h2", null, "Modules"), h("div", { class: "grid" }, cards, soon)),
      h("section", { id: "how" }, h("h2", null, "How each lab works"),
        h("ol", { class: "how" }, how.map(function (x, i) { return h("li", null, h("span", { class: "how-n" }, String(i + 1)), h("div", null, h("strong", null, x[0]), h("p", null, x[1]))); }))),
      h("section", { class: "note note-tip" }, h("strong", { class: "note-label" }, "Your progress is private"),
        h("p", null, "Progress and XP are saved only in this browser (local storage). Nothing is sent to a server, and clearing site data resets it."))
    );
    renderChrome();
    mount(view, "Home");
  }
  function stat(v, l) { return h("div", { class: "stat" }, h("strong", null, v), h("span", null, l)); }

  /* ---------- module overview ---------- */
  function moduleView(mod) {
    current = { mod: mod, lab: null, tab: null, summary: false };
    var ms = moduleState(mod);
    var learn = mod.intro.learn.map(function (l, i) { return h("li", { class: "learn-card" }, h("span", { class: "learn-n" }, String(i + 1)), h("div", null, h("strong", null, l.title), h("p", null, rich(l.text)))); });
    var labs = mod.labs.map(function (l) {
      var st = labState(mod, l);
      return h("li", { class: "lab-row" + (st.claimed ? " done" : "") },
        h("span", { class: "lab-num" }, String(l.number)),
        h("div", { class: "lab-info" }, h("a", { href: "#/" + mod.id + "/" + l.id }, h("strong", null, l.title)), h("p", null, l.short), progressBar(st.pct, l.title + " progress")),
        h("div", { class: "lab-xp" }, h("strong", null, l.xp + " XP"), h("span", { class: "muted small" }, st.claimed ? "Claimed" : st.pct + "%")));
    });
    var view = h("div", { class: "page" },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow" }, "Module " + mod.number + " \u00B7 " + mod.guide),
        h("h1", null, mod.title),
        h("p", { class: "lead" }, mod.tagline),
        h("ul", { class: "meta" }, h("li", null, mod.labs.length + " labs"), h("li", null, mod.duration), h("li", null, mod.totalXp.toLocaleString() + " XP available")),
        h("div", { class: "btn-row" }, nextAction(mod)),
        progressBar(ms.pct, "Module progress")),
      section("Introduction", paras(mod.intro.paragraphs)),
      section("What you will learn", h("ul", { class: "learn" }, learn)),
      section(null, paras([mod.intro.outro])),
      section("Before you begin", h("ul", { class: "bullets" }, mod.intro.prerequisites.map(function (p) { return h("li", null, rich(p)); }))),
      section("Labs in this module", h("ol", { class: "labs" }, labs)),
      h("div", { class: "btn-row" }, h("a", { class: "btn", href: "#/" + mod.id + "/summary" }, "Go to module summary"))
    );
    renderChrome();
    mount(view, mod.title);
  }
  function nextAction(mod) {
    for (var i = 0; i < mod.labs.length; i++) {
      var st = labState(mod, mod.labs[i]);
      if (!st.claimed) return h("a", { class: "btn btn-primary", href: "#/" + mod.id + "/" + mod.labs[i].id }, st.started ? "Continue Lab " + mod.labs[i].number : "Start Lab " + mod.labs[i].number);
    }
    return h("a", { class: "btn btn-primary", href: "#/" + mod.id + "/summary" }, "Finish with the summary");
  }

  /* ---------- lab view ---------- */
  function labView(mod, lab, tabId) {
    var tab = TABS.filter(function (t) { return t.id === tabId; })[0] ? tabId : "briefing";
    current = { mod: mod, lab: lab, tab: tab, summary: false };
    var tabBar = h("div", { class: "tabs", role: "tablist", "aria-label": "Lab sections" });
    var panel = h("div", { class: "tab-panel", role: "tabpanel" });
    var pager = h("div", { class: "pager" });

    function tabDone(id) {
      var st = labState(mod, lab);
      if (id === "walkthrough") return st.steps.done === st.steps.total;
      if (id === "practice") return st.practice.done === st.practice.total;
      if (id === "quiz") return st.quiz;
      if (id === "wrapup") return st.claimed;
      return false;
    }
    function drawTabs() {
      tabBar.textContent = "";
      TABS.forEach(function (t) {
        var d = tabDone(t.id);
        tabBar.appendChild(h("a", { role: "tab", class: "tab" + (t.id === tab ? " active" : "") + (d ? " done" : ""), href: "#/" + mod.id + "/" + lab.id + "/" + t.id, "aria-selected": t.id === tab ? "true" : "false" },
          t.label, d ? h("span", { class: "tick", "aria-label": "complete" }, " \u2714") : null));
      });
    }
    current.updateTabs = drawTabs;

    var builders = {
      briefing: function () { return briefingTab(lab); },
      reference: function () { return referenceTab(lab); },
      walkthrough: function () { return walkthroughTab(mod, lab); },
      practice: function () { return practiceTab(mod, lab); },
      quiz: function () { return quizTab(mod, lab); },
      wrapup: function () { return wrapupTab(mod, lab); }
    };
    panel.appendChild(builders[tab]());

    var idx = TABS.findIndex(function (t) { return t.id === tab; });
    var prev = idx > 0 ? { href: "#/" + mod.id + "/" + lab.id + "/" + TABS[idx - 1].id, label: TABS[idx - 1].label } : null;
    var next = idx < TABS.length - 1 ? { href: "#/" + mod.id + "/" + lab.id + "/" + TABS[idx + 1].id, label: TABS[idx + 1].label } : null;
    if (!next) {
      var li = mod.labs.indexOf(lab);
      next = li < mod.labs.length - 1 ? { href: "#/" + mod.id + "/" + mod.labs[li + 1].id, label: "Lab " + mod.labs[li + 1].number } : { href: "#/" + mod.id + "/summary", label: "Module summary" };
    }
    pager.appendChild(prev ? h("a", { class: "btn", href: prev.href }, "\u2190 " + prev.label) : h("span"));
    pager.appendChild(h("a", { class: "btn btn-primary", href: next.href }, next.label + " \u2192"));

    drawTabs();
    var st = labState(mod, lab);
    var view = h("div", { class: "page" },
      h("header", { class: "page-head compact" },
        h("p", { class: "eyebrow" }, "Module " + mod.number + " \u00B7 Lab " + lab.number),
        h("h1", null, lab.title),
        h("div", { class: "head-row" }, progressBar(st.pct, "Lab progress"), h("span", { class: "muted small" }, lab.xp + " XP"))),
      tabBar, panel, pager);
    renderChrome();
    mount(view, "Lab " + lab.number + ": " + lab.title);
  }

  function briefingTab(lab) {
    var b = lab.briefing;
    var kids = [section("Introduction", paras(b.intro)), section("Overview", paras([b.overview]))];
    if (b.sample) {
      kids.push(h("figure", { class: "sample" }, h("figcaption", null, b.sample.title),
        h("address", null, b.sample.lines.map(function (l) { return h("div", null, rich(l)); }))));
    }
    kids.push(section("Objective", paras(b.objective), "objective"));
    return h("div", null, kids);
  }

  function referenceTab(lab) {
    var r = lab.reference;
    return h("div", null, section("Reference data", [h("p", null, rich(r.intro)), (r.notes || []).map(ui.note), r.tables.map(ui.table)]));
  }

  function walkthroughTab(mod, lab) {
    var wrap = h("div", null, h("p", { class: "muted" }, "Work in your Dynamics 365 Finance environment and tick each step as you complete it. Click any highlighted value to copy it."));
    lab.tasks.forEach(function (t, ti) {
      var k = key(mod, lab, t.id);
      var checked = store.steps[k] || [];
      var bar = progressBar(0, t.title + " progress");
      var counter = h("span", { class: "muted small" });
      var boxes = [];

      function sync() {
        var n = boxes.filter(function (b) { return b.checked; }).length;
        store.steps[k] = boxes.map(function (b, i) { return b.checked ? i : -1; }).filter(function (i) { return i >= 0; });
        boxes.forEach(function (b) { b.closest("li").classList.toggle("checked", b.checked); });
        var pct = Math.round(n / boxes.length * 100);
        bar.firstChild.style.width = pct + "%";
        bar.setAttribute("aria-valuenow", String(pct));
        counter.textContent = n + " of " + boxes.length + " steps";
        persist();
        if (current.updateTabs) current.updateTabs();
      }

      var steps = h("ol", { class: "steps" }, t.steps.map(function (s, i) {
        var id = "s-" + lab.id + "-" + t.id + "-" + i;
        var cb = h("input", { type: "checkbox", id: id, checked: checked.indexOf(i) >= 0, onchange: sync });
        boxes.push(cb);
        return h("li", { class: "step" },
          h("label", { class: "step-main", for: id }, cb, h("span", { class: "step-n" }, String(i + 1)),
            h("span", { class: "step-text" }, h("span", { class: "step-action" }, rich(s.a)), h("span", { class: "step-desc" }, rich(s.d)))),
          s.path ? h("div", { class: "menu-path" }, h("span", null, "Menu path: "), h("code", { class: "copyable", tabindex: "0", role: "button", title: "Click to copy" }, s.path),
            s.search ? h("span", { class: "search-hint" }, "Search: ", h("code", { class: "copyable", tabindex: "0", role: "button", title: "Click to copy" }, s.search)) : null) : null);
      }));

      var card = h("article", { class: "task" },
        h("h3", null, t.title, t.authored ? h("span", { class: "badge" }, "Web edition steps") : null),
        paras(t.intro),
        h("div", { class: "objective-box" }, h("strong", null, "Objective"), h("p", null, rich(t.objective))),
        t.fields ? ui.table(t.fields) : null,
        h("h4", { class: "sub" }, "How to do it\u2026"), h("p", null, rich(t.how)),
        (t.notes || []).map(ui.note),
        h("div", { class: "steps-head" }, bar, counter,
          h("button", { type: "button", class: "btn btn-small btn-ghost", onclick: function () { var all = boxes.every(function (b) { return b.checked; }); boxes.forEach(function (b) { b.checked = !all; }); sync(); } }, "Toggle all")),
        steps,
        t.extraTable ? ui.table(t.extraTable) : null,
        h("div", { class: "review" }, h("strong", null, "Review"), h("p", null, rich(t.review))));
      wrap.appendChild(card);
      sync0(boxes, bar, counter);
    });
    function sync0(boxes, bar, counter) {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      var pct = Math.round(n / boxes.length * 100);
      bar.firstChild.style.width = pct + "%";
      bar.setAttribute("aria-valuenow", String(pct));
      counter.textContent = n + " of " + boxes.length + " steps";
      boxes.forEach(function (b) { b.closest("li").classList.toggle("checked", b.checked); });
    }
    return wrap;
  }

  function practiceTab(mod, lab) {
    var wrap = h("div", null, h("p", { class: "muted" }, "A safe sandbox: these exercises simulate the data entry and never touch a real system. Complete every exercise to unlock your XP."));
    lab.practice.forEach(function (p, i) {
      var k = key(mod, lab, "p" + i);
      var badge = h("span", { class: "badge ok", hidden: !store.practice[k] }, "Completed");
      var body = A.widgets.practice(p, function () {
        if (!store.practice[k]) { store.practice[k] = true; badge.hidden = false; persist(); if (current.updateTabs) current.updateTabs(); }
      });
      wrap.appendChild(h("section", { class: "block exercise" }, h("h3", null, "Exercise " + (i + 1) + ": " + p.title, badge), h("p", null, rich(p.intro)), body));
    });
    return wrap;
  }

  function quizTab(mod, lab) {
    var k = key(mod, lab);
    return h("div", null, h("p", { class: "muted" }, "Check what you have learned. Answers are shuffled each time."),
      A.widgets.quiz(lab.quiz, store.quiz[k], function (res) { store.quiz[k] = res; persist(); if (current.updateTabs) current.updateTabs(); }));
  }

  function wrapupTab(mod, lab) {
    var st = labState(mod, lab);
    var claimBox = h("div", { class: "claim" });
    var tab = h("div", null, section("Wrap up", paras(lab.wrapup)), claimBox);

    function draw() {
      var s = labState(mod, lab);
      claimBox.textContent = "";
      if (s.claimed) {
        claimBox.appendChild(awardView(lab, false));
        return;
      }
      var items = [
        [s.steps.done === s.steps.total, "Walkthrough: " + s.steps.done + " of " + s.steps.total + " steps ticked", "walkthrough"],
        [s.practice.done === s.practice.total, "Practice: " + s.practice.done + " of " + s.practice.total + " exercises complete", "practice"],
        [s.quiz, "Knowledge check passed", "quiz"]
      ];
      claimBox.appendChild(h("div", { class: "scroll-sealed" },
        h("h3", null, "Claim your reward"),
        h("ul", { class: "req" }, items.map(function (it) {
          return h("li", { class: it[0] ? "ok" : "" }, h("span", { "aria-hidden": "true" }, it[0] ? "\u2714" : "\u25CB"), h("a", { href: "#/" + mod.id + "/" + lab.id + "/" + it[2] }, it[1]));
        })),
        h("button", {
          type: "button", class: "btn btn-primary btn-large", disabled: !s.ready,
          onclick: function () {
            store.claimed[key(mod, lab)] = true; persist(); if (current.updateTabs) current.updateTabs();
            claimBox.textContent = ""; claimBox.appendChild(awardView(lab, true));
          }
        }, "Claim " + lab.xp + " XP"),
        s.ready ? null : h("p", { class: "muted small" }, "Finish the items above to unlock this lab's XP.")));
    }
    draw();
    return tab;
  }

  function awardView(lab, animate) {
    var a = lab.award;
    var num = h("span", { class: "xp-big-num" }, animate ? "0" : String(a.xp));
    if (animate) countUp(num, a.xp);
    return h("div", { class: "award" + (animate ? " pop" : "") },
      h("div", { class: "award-head" }, h("span", { class: "award-seal", "aria-hidden": "true" }, "\u2605"), h("div", null, h("p", { class: "eyebrow" }, "XP Award"), h("p", { class: "xp-big" }, num, " XP"))),
      h("p", null, rich(a.story)),
      ui.table({ title: "XP calculation framework", columns: ["Category", "Criteria", "XP awarded"], rows: a.rows }),
      h("p", { class: "closing" }, rich(a.closing)));
  }
  function countUp(el, to) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = String(to); return; }
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 900, 1);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- summary ---------- */
  function summaryView(mod) {
    current = { mod: mod, lab: null, tab: null, summary: true };
    var s = mod.summary, ms = moduleState(mod);
    var certBox = h("div");
    function drawCert() {
      var m = moduleState(mod);
      certBox.textContent = "";
      if (!m.complete) {
        certBox.appendChild(h("div", { class: "note note-tip" }, h("strong", { class: "note-label" }, "Certificate locked"),
          h("p", null, "Claim the XP for all " + m.total + " labs" + (m.final ? "" : " and pass the final check") + " to unlock your printable certificate. So far: " + m.claimed + " of " + m.total + " labs claimed, " + m.xp.toLocaleString() + " of " + mod.totalXp.toLocaleString() + " XP.")));
        return;
      }
      var nameIn = h("input", { type: "text", id: "cert-name", maxlength: "60", placeholder: "Adventurer name", value: store.name || "" });
      var nameOut = h("span", { class: "cert-name" }, store.name || "Adventurer");
      nameIn.addEventListener("input", function () { store.name = nameIn.value; nameOut.textContent = nameIn.value.trim() || "Adventurer"; ui.save(); });
      certBox.appendChild(h("section", { class: "block" }, h("h3", null, "Module complete"),
        h("div", { class: "field cert-field" }, h("label", { for: "cert-name" }, "Name for your certificate"), nameIn),
        h("div", { class: "certificate" },
          h("img", { src: "assets/img/logo-adnd365.png", alt: "AD&D365 Fifth Edition", width: "220" }),
          h("p", { class: "eyebrow" }, "Certificate of Completion"),
          nameOut,
          h("p", null, "has completed ", h("strong", null, "Module " + mod.number + ": " + mod.title), " and earned ", h("strong", null, mod.totalXp.toLocaleString() + " XP"), "."),
          h("p", { class: "cert-rank" }, "Rank attained: ", h("strong", null, "Arcane Cartographer of Configuration"))),
        h("div", { class: "btn-row" }, h("button", { type: "button", class: "btn btn-primary", onclick: function () { window.print(); } }, "Print certificate"))));
    }
    var view = h("div", { class: "page" },
      h("header", { class: "page-head compact" }, h("p", { class: "eyebrow" }, "Module " + mod.number), h("h1", null, "Module summary")),
      section(null, paras([s.intro])),
      h("ul", { class: "summary-list" }, s.points.map(function (p) { return h("li", null, h("strong", null, p.title), h("p", null, rich(p.text))); })),
      section(null, paras([s.outro])),
      section("Final check", [h("p", { class: "muted" }, "A last quiz that spans every lab."),
        A.widgets.quiz(s.finalQuiz, store.quiz[mod.id + "/final"], function (res) { store.quiz[mod.id + "/final"] = res; persist(); drawCert(); })]),
      certBox,
      h("div", { class: "pager" }, h("a", { class: "btn", href: "#/" + mod.id + "/" + mod.labs[mod.labs.length - 1].id + "/wrapup" }, "\u2190 Lab " + mod.labs.length), h("a", { class: "btn btn-primary", href: "#/" }, "All modules")));
    drawCert();
    renderChrome();
    mount(view, "Summary: " + mod.title);
  }

  /* ---------- router ---------- */
  function notFound() {
    current = { mod: null, lab: null, tab: null, summary: false };
    renderChrome();
    mount(h("div", { class: "page" }, h("h1", null, "Page not found"), h("p", null, "That lesson does not exist."), h("a", { class: "btn btn-primary", href: "#/" }, "Back to home")), "Not found");
  }
  function route() {
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!parts.length) return homeView();
    var mod = getModule(parts[0]);
    if (!mod) return (parts[0] === "how" || parts[0] === "modules") ? homeView() : notFound();
    if (!parts[1]) return moduleView(mod);
    if (parts[1] === "summary") return summaryView(mod);
    var lab = getLab(mod, parts[1]);
    if (!lab) return notFound();
    labView(mod, lab, parts[2]);
  }

  /* ---------- global UI wiring ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    var b = document.getElementById("theme-toggle");
    if (b) { b.setAttribute("aria-pressed", t === "light" ? "true" : "false"); b.textContent = t === "light" ? "Dark mode" : "Light mode"; }
  }
  var theme = (function () { try { return localStorage.getItem("adnd365-theme"); } catch (e) { return null; } })() ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  applyTheme(theme);
  document.getElementById("theme-toggle").addEventListener("click", function () {
    theme = theme === "light" ? "dark" : "light";
    applyTheme(theme);
    try { localStorage.setItem("adnd365-theme", theme); } catch (e) { /* ignore */ }
  });
  document.getElementById("menu-toggle").addEventListener("click", function () {
    var open = document.body.classList.toggle("side-open");
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.getElementById("reset-progress").addEventListener("click", function () {
    if (window.confirm("Reset all saved progress and XP in this browser?")) { ui.reset(); store = ui.load(); route(); }
  });
  document.getElementById("year").textContent = String(new Date().getFullYear() > 2026 ? new Date().getFullYear() : 2026);

  window.addEventListener("hashchange", route);
  route();
})(window.ADND);
