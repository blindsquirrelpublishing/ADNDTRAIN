/* Interactive widgets: simulated D365 forms, drills, composers, and quizzes. */
(function (A) {
  "use strict";
  var ui = A.ui, h = ui.h, rich = ui.rich, norm = ui.norm;
  var uid = 0;
  function nextId(p) { uid += 1; return p + uid; }

  var TABS = ["Address format", "Country/region", "State/province", "City", "District", "ZIP/postal code"];

  function d365Window(activeTab) {
    return h("div", { class: "d365" },
      h("div", { class: "d365-title" }, h("span", { class: "d365-logo", "aria-hidden": "true" }, "D"), h("span", null, "Address setup"), h("span", { class: "d365-sim" }, "Practice simulator")),
      h("div", { class: "d365-tabs", role: "presentation" }, TABS.map(function (t) {
        return h("span", { class: "d365-tab" + (t === activeTab ? " active" : "") }, t);
      }))
    );
  }

  function feedbackBox() { return h("div", { class: "feedback", role: "status", "aria-live": "polite" }); }
  function setFeedback(box, ok, msg) {
    box.className = "feedback " + (ok ? "ok" : "bad");
    box.textContent = "";
    box.appendChild(rich(msg));
  }

  function finishBar(box, onCheck, onReset, onReveal) {
    return h("div", { class: "btn-row" },
      h("button", { type: "button", class: "btn btn-primary", onclick: onCheck }, "Check my work"),
      onReveal ? h("button", { type: "button", class: "btn", onclick: onReveal }, "Show answers") : null,
      h("button", { type: "button", class: "btn btn-ghost", onclick: onReset }, "Reset")
    );
  }

  /* ---------- form ---------- */
  function formWidget(def, done) {
    var box = feedbackBox(), controls = {};
    var win = d365Window(def.tab);
    var grid = h("div", { class: "d365-form" });
    def.fields.forEach(function (f) {
      var id = nextId("f");
      var c;
      if (f.kind === "select") {
        c = h("select", { id: id }, f.options.map(function (o) { return h("option", { value: o }, o || "Select..."); }));
      } else {
        c = h("input", { id: id, type: "text", autocomplete: "off", spellcheck: "false" });
      }
      controls[f.id] = c;
      c.addEventListener("input", function () { c.classList.remove("ok", "bad"); });
      grid.appendChild(h("div", { class: "field" }, h("label", { for: id }, f.label), c));
    });
    win.appendChild(grid);

    function check() {
      var bad = 0;
      def.fields.forEach(function (f) {
        var c = controls[f.id];
        var good = f.kind === "select" ? c.value === f.expected : norm(c.value) === norm(f.expected);
        c.classList.toggle("ok", good);
        c.classList.toggle("bad", !good);
        if (!good) bad += 1;
      });
      if (bad) setFeedback(box, false, bad + (bad === 1 ? " field needs" : " fields need") + " another look. Compare them with the walkthrough table.");
      else { setFeedback(box, true, def.success); done(); }
    }
    function reset() {
      def.fields.forEach(function (f) { controls[f.id].value = ""; controls[f.id].classList.remove("ok", "bad"); });
      box.className = "feedback"; box.textContent = "";
    }
    function reveal() {
      def.fields.forEach(function (f) { controls[f.id].value = f.expected; controls[f.id].classList.remove("ok", "bad"); });
      setFeedback(box, false, "Answers shown. Click **Check my work** to complete this exercise.");
    }
    return h("div", { class: "practice-body" }, win, finishBar(box, check, reset, reveal), box);
  }

  /* ---------- address components builder (Lab 1) ---------- */
  function componentsWidget(def, done) {
    var rows = [], box = feedbackBox();
    var sel = h("select", { id: nextId("c"), "aria-label": "Component" }, def.available.map(function (o) { return h("option", { value: o }, o); }));
    var nl = h("input", { type: "checkbox", id: nextId("nl") });
    var tbody = h("tbody");
    var empty = h("p", { class: "muted small" }, "No components yet. Choose one and click Add.");

    function draw() {
      tbody.textContent = "";
      rows.forEach(function (r, i) {
        tbody.appendChild(h("tr", null,
          h("td", null, String(i + 1)),
          h("td", null, r.name),
          h("td", null, r.newLine ? "Yes" : "No"),
          h("td", null, h("button", { type: "button", class: "btn btn-small btn-ghost", "aria-label": "Remove " + r.name, onclick: function () { rows.splice(i, 1); draw(); } }, "Remove"))
        ));
      });
      empty.hidden = rows.length > 0;
    }
    function add() {
      rows.push({ name: sel.value, newLine: nl.checked });
      nl.checked = false;
      box.className = "feedback"; box.textContent = "";
      draw();
    }
    function check() {
      var e = def.expected;
      if (rows.length !== e.length) return setFeedback(box, false, def.hints.count + " You have " + rows.length + ".");
      for (var i = 0; i < e.length; i++) if (rows[i].name !== e[i].name) return setFeedback(box, false, def.hints.order);
      for (var j = 0; j < e.length; j++) if (rows[j].newLine !== e[j].newLine) return setFeedback(box, false, def.hints.newline);
      setFeedback(box, true, def.success);
      done();
    }
    function reset() { rows = []; draw(); box.className = "feedback"; box.textContent = ""; }
    function reveal() { rows = def.expected.map(function (x) { return { name: x.name, newLine: x.newLine }; }); draw(); setFeedback(box, false, "Answers shown. Click **Check my work** to complete this exercise."); }

    var win = d365Window("Address format");
    win.appendChild(h("div", { class: "d365-form two" },
      h("div", { class: "field" }, h("label", null, "Address format"), h("input", { type: "text", value: def.formCode, readonly: true })),
      h("div", { class: "field" }, h("label", null, "Description"), h("input", { type: "text", value: def.formDescription, readonly: true }))
    ));
    win.appendChild(h("div", { class: "d365-section" },
      h("h4", null, "Address components"),
      h("div", { class: "add-row" },
        h("label", { class: "inline" }, "Component ", sel),
        h("label", { class: "inline check" }, nl, " New line"),
        h("button", { type: "button", class: "btn btn-small btn-primary", onclick: add }, "Add")
      ),
      h("div", { class: "table-scroll" }, h("table", { class: "data compact" },
        h("thead", null, h("tr", null, ["#", "Component", "New line", ""].map(function (t) { return h("th", { scope: "col" }, t); }))), tbody)),
      empty
    ));
    draw();
    return h("div", { class: "practice-body" }, win, finishBar(box, check, reset, reveal), box);
  }

  /* ---------- drill ---------- */
  function drillWidget(def, done) {
    var box = feedbackBox(), controls = [];
    var list = h("div", { class: "drill" });
    def.items.forEach(function (it, i) {
      var id = nextId("d");
      var c = it.kind === "select"
        ? h("select", { id: id }, [h("option", { value: "" }, "Select...")].concat(it.options.map(function (o) { return h("option", { value: o }, o); })))
        : h("input", { id: id, type: "text", autocomplete: "off", spellcheck: "false", placeholder: "Code" });
      c.addEventListener("input", function () { c.classList.remove("ok", "bad"); });
      c.addEventListener("keydown", function (e) { if (e.key === "Enter" && controls[i + 1]) controls[i + 1].focus(); });
      controls.push(c);
      list.appendChild(h("div", { class: "drill-row" }, h("label", { for: id }, it.prompt), c));
    });
    function accepted(it) { return [it.answer].concat(it.alt || []); }
    function check() {
      var right = 0;
      def.items.forEach(function (it, i) {
        var good = accepted(it).some(function (a) { return norm(a) === norm(controls[i].value); });
        controls[i].classList.toggle("ok", good);
        controls[i].classList.toggle("bad", !good);
        if (good) right += 1;
      });
      var total = def.items.length;
      if (right === total) { setFeedback(box, true, def.success); done(); }
      else setFeedback(box, false, right + " of " + total + " correct. Fix the highlighted rows and check again.");
    }
    function reset() { controls.forEach(function (c) { c.value = ""; c.classList.remove("ok", "bad"); }); box.className = "feedback"; box.textContent = ""; }
    function reveal() {
      def.items.forEach(function (it, i) { controls[i].value = it.answer; controls[i].classList.remove("ok", "bad"); });
      setFeedback(box, false, "Answers shown. Click **Check my work** to complete this exercise.");
    }
    return h("div", { class: "practice-body" }, list, finishBar(box, check, reset, reveal), box);
  }

  /* ---------- pick (multi-select) ---------- */
  function pickWidget(def, done) {
    var box = feedbackBox(), boxes = [];
    var list = h("div", { class: "pick" }, def.options.map(function (o) {
      var id = nextId("p");
      var cb = h("input", { type: "checkbox", id: id, value: o });
      boxes.push(cb);
      return h("label", { class: "pick-item", for: id }, cb, h("span", null, o));
    }));
    function check() {
      var missing = [], extra = [];
      boxes.forEach(function (cb) {
        var want = def.correct.indexOf(cb.value) >= 0;
        if (want && !cb.checked) missing.push(cb.value);
        if (!want && cb.checked) extra.push(cb.value);
        cb.parentNode.classList.toggle("ok", cb.checked && want);
        cb.parentNode.classList.toggle("bad", cb.checked && !want);
      });
      if (!missing.length && !extra.length) { setFeedback(box, true, def.success); done(); }
      else {
        var msg = [];
        if (extra.length) msg.push("Not Waterdeep wards: " + extra.join(", ") + ".");
        if (missing.length) msg.push(missing.length + (missing.length === 1 ? " ward is" : " wards are") + " still missing.");
        setFeedback(box, false, msg.join(" "));
      }
    }
    function reset() { boxes.forEach(function (cb) { cb.checked = false; cb.parentNode.classList.remove("ok", "bad"); }); box.className = "feedback"; box.textContent = ""; }
    return h("div", { class: "practice-body" }, list, finishBar(box, check, reset), box);
  }

  /* ---------- compose ---------- */
  function composeWidget(def, done) {
    var box = feedbackBox(), inputs = [];
    var preview = h("output", { class: "compose-preview", "aria-live": "polite" });
    function draw() {
      var vals = inputs.map(function (i) { return i.value.trim(); });
      preview.textContent = "";
      preview.appendChild(h("span", { class: "muted small" }, "Postal code: "));
      var s = h("span", { class: "code-big" }, vals.map(function (v, i) { return v || def.parts[i].placeholder.replace(/./g, "_"); }).join(def.separator));
      preview.appendChild(s);
    }
    var row = h("div", { class: "d365-form" }, def.parts.map(function (p) {
      var id = nextId("z");
      var inp = h("input", { id: id, type: "text", autocomplete: "off", spellcheck: "false", placeholder: p.placeholder, maxlength: "8" });
      inp.addEventListener("input", function () { inp.classList.remove("ok", "bad"); draw(); });
      inputs.push(inp);
      return h("div", { class: "field" }, h("label", { for: id }, p.label), inp);
    }));
    function check() {
      var val = inputs.map(function (i) { return i.value.trim(); }).join(def.separator);
      var good = val.toUpperCase() === def.expected.toUpperCase();
      inputs.forEach(function (i) { i.classList.toggle("ok", good); i.classList.toggle("bad", !good); });
      if (good) { setFeedback(box, true, def.success); done(); }
      else setFeedback(box, false, "Not yet. Region 01, then the Waterdeep abbreviation, then the abbreviation for Castle Ward.");
    }
    function reset() { inputs.forEach(function (i) { i.value = ""; i.classList.remove("ok", "bad"); }); draw(); box.className = "feedback"; box.textContent = ""; }
    function reveal() {
      var parts = def.expected.split(def.separator);
      inputs.forEach(function (i, n) { i.value = parts[n]; i.classList.remove("ok", "bad"); });
      draw(); setFeedback(box, false, "Answer shown. Click **Check my work** to complete this exercise.");
    }
    draw();
    return h("div", { class: "practice-body" }, row, preview, finishBar(box, check, reset, reveal), box);
  }

  var PRACTICE = { form: formWidget, components: componentsWidget, drill: drillWidget, pick: pickWidget, compose: composeWidget };
  function practice(def, done) { return PRACTICE[def.type](def, done); }

  /* ---------- quiz ---------- */
  function quiz(questions, saved, onPass) {
    var need = Math.ceil(questions.length * 0.75);
    var root = h("div", { class: "quiz" });

    function build() {
      root.textContent = "";
      var banner = h("div", { class: "quiz-banner" + (saved && saved.passed ? " passed" : "") });
      banner.appendChild(rich(saved && saved.passed
        ? "**Passed** with " + saved.score + " of " + saved.total + ". You can retake the quiz any time."
        : "Answer all " + questions.length + " questions. You need " + need + " correct to pass."));
      root.appendChild(banner);

      var model = questions.map(function (q, qi) {
        var opts = ui.shuffle(q.options.map(function (text, idx) { return { text: text, correct: idx === q.answer }; }));
        var name = nextId("q");
        var fs = h("fieldset", { class: "q" }, h("legend", null, h("span", { class: "qn" }, "Q" + (qi + 1)), rich(q.q)));
        var inputs = opts.map(function (o) {
          var id = nextId("o");
          var r = h("input", { type: "radio", name: name, id: id });
          fs.appendChild(h("label", { class: "opt", for: id }, r, h("span", null, rich(o.text))));
          return r;
        });
        var why = h("p", { class: "why", hidden: true }, rich(q.why));
        fs.appendChild(why);
        return { opts: opts, inputs: inputs, fs: fs, why: why };
      });
      model.forEach(function (m) { root.appendChild(m.fs); });

      var result = h("div", { class: "feedback", role: "status", "aria-live": "polite" });
      var submit = h("button", { type: "button", class: "btn btn-primary" }, "Submit answers");
      var retry = h("button", { type: "button", class: "btn", hidden: true, onclick: build }, "Try again");
      submit.addEventListener("click", function () {
        var unanswered = model.filter(function (m) { return !m.inputs.some(function (i) { return i.checked; }); });
        if (unanswered.length) { setFeedback(result, false, "Please answer every question first."); unanswered[0].inputs[0].focus(); return; }
        var score = 0;
        model.forEach(function (m) {
          var picked = m.inputs.findIndex(function (i) { return i.checked; });
          var good = m.opts[picked].correct;
          if (good) score += 1;
          m.inputs.forEach(function (i, n) {
            i.disabled = true;
            var lbl = i.parentNode;
            lbl.classList.toggle("ok", m.opts[n].correct);
            lbl.classList.toggle("bad", n === picked && !good);
          });
          m.fs.classList.add(good ? "right" : "wrong");
          m.why.hidden = false;
        });
        submit.hidden = true;
        var pass = score >= need;
        if (pass) {
          saved = { passed: true, score: Math.max(score, saved && saved.score || 0), total: questions.length };
          onPass(saved);
          setFeedback(result, true, "**" + score + " of " + questions.length + " correct.** Knowledge check passed.");
        } else {
          setFeedback(result, false, "**" + score + " of " + questions.length + " correct.** You need " + need + " to pass. Review the explanations and try again.");
        }
        retry.hidden = false;
      });
      root.appendChild(h("div", { class: "btn-row" }, submit, retry));
      root.appendChild(result);
    }
    build();
    return root;
  }

  A.widgets = { practice: practice, quiz: quiz };
})(window.ADND);
