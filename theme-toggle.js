/* ============================================================
   Theme Toggle — Surface Evolver Documentation
   ============================================================
   Three-state cycle:  auto → dark → light → auto → …
   "auto" detects system prefers-color-scheme and listens for
   changes. All theme switching is JS-driven via data-theme attr.
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "evdoc-theme";
  var html = document.documentElement;

  /* ---- detect system preference ---------------------------- */
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /* ---- resolve "auto" to actual theme ---------------------- */
  function resolveAuto() {
    return systemPrefersDark() ? "dark" : "light";
  }

  /* ---- apply theme by setting data-theme on <html> --------- */
  function applyTheme(mode) {
    var resolved = mode === "" ? resolveAuto() : mode;
    html.setAttribute("data-theme", resolved);
    void html.offsetHeight;
  }

  /* ---- update button icon & tooltip ------------------------ */
  function updateButton(btn, mode) {
    var labels = { dark: "暗色模式", light: "亮色模式", "": "跟随系统" };
    btn.title = "当前：" + labels[mode] + "（点击切换）";
    var sun  = btn.querySelector(".icon-sun");
    var moon = btn.querySelector(".icon-moon");
    if (!sun || !moon) return;
    var resolved = mode === "" ? resolveAuto() : mode;
    sun.style.display  = resolved === "dark" ? "inline" : "none";
    moon.style.display = resolved === "dark" ? "none"   : "inline";
  }

  /* ---- restore saved preference ---------------------------- */
  var saved = localStorage.getItem(STORAGE_KEY);
  var currentMode = (saved === "dark" || saved === "light") ? saved : "";
  applyTheme(currentMode);

  /* ---- listen for system theme changes (auto mode) --------- */
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", function () {
      if (currentMode === "") {
        applyTheme("");
        var btn = document.querySelector(".theme-toggle");
        if (btn) updateButton(btn, "");
      }
    });
  }

  /* ---- build the button ------------------------------------ */
  function createButton() {
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Toggle theme");
    btn.innerHTML = '<span class="icon-sun">\u2600</span><span class="icon-moon">\u263E</span>';
    updateButton(btn, currentMode);

    btn.addEventListener("click", function () {
      if (currentMode === "") {
        currentMode = "dark";
      } else if (currentMode === "dark") {
        currentMode = "light";
      } else {
        currentMode = "";
      }
      applyTheme(currentMode);
      updateButton(btn, currentMode);
      if (currentMode) {
        localStorage.setItem(STORAGE_KEY, currentMode);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    });
    return btn;
  }

  /* ---- inject button if not already present ---------------- */
  function inject() {
    var existing = document.querySelector(".theme-toggle");
    if (!existing) {
      document.body.appendChild(createButton());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

  /* ---- expose init for nav-panel.js re-init ---------------- */
  window.initThemeToggle = function() {
    var existing = document.querySelector(".theme-toggle");
    if (existing) {
      updateButton(existing, currentMode);
    } else {
      inject();
    }
  };
})();
