(function () {
  "use strict";

  function get(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function applyContent(dict) {
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var val = get(dict, node.getAttribute("data-i18n"));
      if (val !== null && typeof val === "string") node.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-list]").forEach(function (node) {
      var arr = get(dict, node.getAttribute("data-i18n-list"));
      if (!Array.isArray(arr)) return;
      node.innerHTML = "";
      arr.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        node.appendChild(li);
      });
    });

    renderServices(dict);
    renderTextList("who-list", get(dict, "who.items"));
    renderTextList("trade-list", get(dict, "trade.items"));
    renderHowSteps(get(dict, "how.steps"));
    renderTrackGrid(get(dict, "track.stats"));
    renderHeroStats(get(dict, "track.stats"));
    renderWhyStrip(get(dict, "why.items"));
    renderIndustries(get(dict, "industries.items"));
    renderCredentials(get(dict, "about.credentials"));
    renderInterestOptions(get(dict, "contact.form.options"));

    var langField = document.querySelector('input[name="_language"]');
    var emailLink = document.getElementById("contact-email");
    if (emailLink) {
      var email = get(dict, "contact.email");
      if (email) {
        emailLink.textContent = email;
        emailLink.closest("a").setAttribute("href", "mailto:" + email);
      }
    }
  }

  function renderServices(dict) {
    var wrap = document.getElementById("services-list");
    var items = get(dict, "services.items");
    if (!wrap || !Array.isArray(items)) return;
    wrap.innerHTML = "";
    items.forEach(function (item, i) {
      var row = el("div", "service-row");
      row.innerHTML =
        '<span class="service-num">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<div><h3>' + item.title + '</h3><p>' + item.desc + '</p></div>';
      wrap.appendChild(row);
    });
  }

  function renderTextList(elementId, items) {
    var wrap = document.getElementById(elementId);
    if (!wrap || !Array.isArray(items)) return;
    wrap.innerHTML = "";
    items.forEach(function (item) {
      var row = el("div", "text-list-item");
      row.innerHTML = "<h3>" + item.title + "</h3><p>" + item.desc + "</p>";
      wrap.appendChild(row);
    });
  }

  function renderHowSteps(steps) {
    var wrap = document.getElementById("how-steps");
    if (!wrap || !Array.isArray(steps)) return;
    wrap.innerHTML = "";
    steps.forEach(function (step, i) {
      var row = el("div", "how-step");
      row.innerHTML =
        '<span class="how-num">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<div><h3>' + step.title + '</h3><p>' + step.desc + '</p></div>';
      wrap.appendChild(row);
    });
  }

  function renderHeroStats(stats) {
    var wrap = document.getElementById("hero-stats");
    if (!wrap || !Array.isArray(stats)) return;
    wrap.innerHTML = "";
    stats.forEach(function (stat) {
      var card = el("div", "hero-stat");
      card.innerHTML = '<p class="n">' + stat.number + '</p><p class="l">' + stat.label + '</p>';
      wrap.appendChild(card);
    });
  }

  function renderTrackGrid(stats) {
    var wrap = document.getElementById("track-grid");
    if (!wrap || !Array.isArray(stats)) return;
    wrap.innerHTML = "";
    stats.forEach(function (stat) {
      var card = el("div", "track-card");
      card.innerHTML =
        '<p class="stat-number">' + stat.number + '</p>' +
        '<p class="stat-label">' + stat.label + '</p>' +
        '<p class="stat-sub">' + (stat.sub || "&nbsp;") + '</p>';
      wrap.appendChild(card);
    });
  }

  function renderWhyStrip(items) {
    var wrap = document.getElementById("why-strip");
    if (!wrap || !Array.isArray(items)) return;
    wrap.innerHTML = "";
    items.forEach(function (item, i) {
      var card = el("div");
      card.innerHTML =
        '<p class="why-num">' + String(i + 1).padStart(2, "0") + '</p>' +
        '<h3>' + item.title + '</h3><p>' + item.desc + '</p>';
      wrap.appendChild(card);
    });
  }

  var INDUSTRY_ICONS = {
    saas: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 26a6 6 0 0 1 1-11.9A8 8 0 0 1 28 16a6 6 0 0 1-1 10H12z"/></svg>',
    ai: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="14" width="12" height="12" rx="2"/><path d="M20 8v4M20 28v4M8 20h4M28 20h4M11.5 11.5l2.8 2.8M25.7 25.7l2.8 2.8M28.5 11.5l-2.8 2.8M14.3 25.7l-2.8 2.8"/></svg>',
    cyber: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7l11 4v9c0 7-4.6 11.6-11 13-6.4-1.4-11-6-11-13v-9l11-4z"/></svg>',
    fintech: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="12"/><path d="M20 13v14M23.5 16.3c0-1.8-1.6-2.8-3.5-2.8-2 0-3.5 1-3.5 2.6 0 3.6 7 1.8 7 5.4 0 1.7-1.6 2.7-3.5 2.7-2 0-3.6-1-3.6-2.8"/></svg>',
    hrtech: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="15" r="4.5"/><circle cx="26" cy="17" r="3.5"/><path d="M7 31c0-4.4 3.6-8 8-8s8 3.6 8 8M23 31c0-3.4 2-6.2 5-7.4"/></svg>',
    igaming: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="24" height="14" rx="4"/><path d="M15 21h-4M13 19v4"/><circle cx="24" cy="19" r="1.2" fill="currentColor" stroke="none"/><circle cx="27" cy="22" r="1.2" fill="currentColor" stroke="none"/></svg>',
    b2b: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="10" r="3.2"/><circle cx="9" cy="29" r="3.2"/><circle cx="31" cy="29" r="3.2"/><path d="M20 13.2v4.6M17.6 21.4L11.4 26M22.4 21.4l6.2 4.6"/></svg>',
    logistics: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="15" width="17" height="11" rx="1"/><path d="M22 19h6l4 4v3h-10z"/><circle cx="12" cy="28" r="2.4"/><circle cx="27" cy="28" r="2.4"/></svg>'
  };

  function renderIndustries(items) {
    var wrap = document.getElementById("industries-grid");
    if (!wrap || !Array.isArray(items)) return;
    wrap.innerHTML = "";
    items.forEach(function (item) {
      var cell = el("div", "industry-item");
      cell.innerHTML =
        '<div class="icon-chip">' + (INDUSTRY_ICONS[item.icon] || "") + '</div>' +
        "<span>" + item.label + "</span>" +
        '<div class="rule"></div>';
      wrap.appendChild(cell);
    });
  }

  function renderCredentials(items) {
    var wrap = document.getElementById("credentials-list");
    if (!wrap || !Array.isArray(items)) return;
    wrap.innerHTML = "";
    items.forEach(function (item) {
      var row = el("div", "credential-row");
      row.innerHTML =
        '<span class="cred-label">' + item.label + '</span>' +
        '<span class="cred-main">' + item.main + (item.sub ? '<span class="cred-sub">' + item.sub + '</span>' : '') + '</span>';
      wrap.appendChild(row);
    });
  }

  function renderInterestOptions(options) {
    var select = document.getElementById("f-interest");
    if (!select || !Array.isArray(options)) return;
    select.innerHTML = "";
    options.forEach(function (opt) {
      var o = document.createElement("option");
      o.textContent = opt;
      select.appendChild(o);
    });
  }

  function loadContent() {
    var lang = document.documentElement.getAttribute("lang") || "en";
    fetch("/content/site.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (data && data[lang]) {
          applyContent(data[lang]);
          initReveals();
        }
      })
      .catch(function () { /* keep baked-in fallback content */ });
  }

  function initHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initMobileNav() {
    var burger = document.getElementById("hamburger");
    var nav = document.getElementById("main-nav");
    if (!burger || !nav) return;
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initReveals() {
    var elsToReveal = document.querySelectorAll(".reveal:not(.in-view)");
    if (!("IntersectionObserver" in window)) {
      elsToReveal.forEach(function (e) { e.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elsToReveal.forEach(function (e) { io.observe(e); });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action");
      var msgSending = form.getAttribute("data-msg-sending") || "Sending...";
      var msgSuccess = form.getAttribute("data-msg-success") || "Thank you.";
      var msgError = form.getAttribute("data-msg-error") || "Something went wrong.";
      if (!action || action.indexOf("YOUR_FORM_ID") !== -1) {
        e.preventDefault();
        status.textContent = msgError;
        status.className = "form-status error";
        return;
      }
      e.preventDefault();
      status.textContent = msgSending;
      status.className = "form-status";
      fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) {
            status.textContent = msgSuccess;
            status.className = "form-status success";
            form.reset();
          } else {
            status.textContent = msgError;
            status.className = "form-status error";
          }
        })
        .catch(function () {
          status.textContent = msgError;
          status.className = "form-status error";
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    initHeaderScroll();
    initMobileNav();
    initReveals();
    initContactForm();
    loadContent();
  });
})();
