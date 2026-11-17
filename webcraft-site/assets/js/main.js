/* ============================================================
   建站学院 · 共享交互脚本
   ============================================================ */
(function () {
  "use strict";

  /* ---- 移动端菜单 ---- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- 二级下拉菜单 ---- */
  var dropdown = document.querySelector(".dropdown");
  var trigger = document.querySelector(".nav-trigger");
  if (dropdown && trigger) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) dropdown.classList.remove("open");
    });
  }

  /* ---- 当前页面导航高亮 ---- */
  var page = document.body.dataset.page || "";
  if (page) {
    var link = document.querySelector('.nav a[data-page="' + page + '"]');
    if (link) link.classList.add("active");
  }

  /* ---- 滚动进入动画 ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- 代码切换标签 ---- */
  var tabs = document.querySelectorAll(".code-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      document.querySelectorAll(".code-body").forEach(function (b) { b.classList.remove("active"); });
      tab.classList.add("active");
      var target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add("active");
    });
  });

  /* ---- 目录高亮 ---- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var sections = tocLinks
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    var toIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-80px 0px -65% 0px" });
    sections.forEach(function (s) { toIo.observe(s); });
  }

  /* ---- 返回顶部 ---- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- 交互演示：计数器 ---- */
  var countEl = document.getElementById("demoCount");
  if (countEl) {
    var count = 0;
    var out = document.getElementById("demoOutput");
    var render = function (msg) {
      countEl.textContent = count;
      if (out) out.textContent = "> " + msg + " · state = { count: " + count + " }";
    };
    document.getElementById("demoPlus").addEventListener("click", function () {
      count += 1; render("click: +1");
    });
    document.getElementById("demoMinus").addEventListener("click", function () {
      count -= 1; render("click: -1");
    });
    document.getElementById("demoReset").addEventListener("click", function () {
      count = 0; render("click: reset");
    });
    render("ready");
  }

  /* ---- 清单本地保存 ---- */
  var checks = document.querySelectorAll(".checklist input");
  if (checks.length) {
    var key = "webcraft-checklist-" + (document.body.dataset.page || "page");
    try {
      var saved = JSON.parse(localStorage.getItem(key) || "{}");
      checks.forEach(function (c) { if (saved[c.id]) c.checked = true; });
    } catch (e) { /* ignore */ }
    checks.forEach(function (c) {
      c.addEventListener("change", function () {
        var state = {};
        checks.forEach(function (x) { state[x.id] = x.checked; });
        try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) { /* ignore */ }
      });
    });
  }

  /* ---- 年份 ---- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
