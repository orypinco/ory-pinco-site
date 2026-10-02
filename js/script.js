(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function isFormOrContact(target) {
    return !!(target && target.closest && target.closest("input, textarea, select, .contact-details"));
  }
  ["copy", "cut", "dragstart"].forEach(function (type) {
    document.addEventListener(type, function (e) {
      if (!isFormOrContact(e.target)) e.preventDefault();
    });
  });
  document.addEventListener("contextmenu", function (e) {
    if (e.target && e.target.tagName === "IMG") e.preventDefault();
  });

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

    // Home page
    renderTextList("home-why-list", get(dict, "home.why.items"));
    renderTextList("home-services-list", get(dict, "home.services.items"));
    renderTextList("home-who-list", get(dict, "home.who.items"));
    renderHeroStats("hero-stats", get(dict, "home.track.stats"));
    renderTrackGrid("track-grid", get(dict, "home.track.stats"));

    // Services page
    renderNumberedList("services-list", get(dict, "servicesPage.items"));

    // Why Romania page
    renderNumberedList("why-strip", get(dict, "whyPage.items"));

    // Romania <-> Israel page
    renderTextList("trade-list", get(dict, "bridgePage.trade.items"));

    // About page
    renderTrackGrid("about-track-grid", get(dict, "aboutPage.track.stats"));

    renderInterestOptions(get(dict, "contact.form.options"));

    var emailLinkText = document.getElementById("contact-email");
    var emailLinkAnchor = document.getElementById("contact-email-link");
    var email = get(dict, "meta.email") || get(dict, "contact.email");
    if (emailLinkText && email) {
      emailLinkText.textContent = email;
      if (emailLinkAnchor) emailLinkAnchor.setAttribute("href", "mailto:" + email);
    }

    var phoneLinkText = document.getElementById("contact-phone");
    var phoneLinkAnchor = document.getElementById("contact-phone-link");
    var phone = get(dict, "meta.phone") || get(dict, "contact.phone");
    var waLink = get(dict, "meta.waLink");
    if (phoneLinkText && phone) {
      phoneLinkText.textContent = phone;
      if (phoneLinkAnchor && waLink) phoneLinkAnchor.setAttribute("href", "https://wa.me/" + waLink);
    }
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

  function renderNumberedList(elementId, items) {
    var wrap = document.getElementById(elementId);
    if (!wrap || !Array.isArray(items)) return;
    wrap.innerHTML = "";
    items.forEach(function (item, i) {
      var row = el("div", "numbered-row");
      row.innerHTML =
        '<span class="numbered-row-n">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<div><h3>' + item.title + '</h3><p>' + item.desc + '</p></div>';
      wrap.appendChild(row);
    });
  }

  function renderHeroStats(elementId, stats) {
    var wrap = document.getElementById(elementId);
    if (!wrap || !Array.isArray(stats)) return;
    wrap.innerHTML = "";
    stats.forEach(function (stat) {
      var card = el("div", "hero-stat");
      card.innerHTML = '<p class="n">' + stat.number + '</p><p class="l">' + stat.label + '</p>';
      wrap.appendChild(card);
    });
  }

  function renderTrackGrid(elementId, stats) {
    var wrap = document.getElementById(elementId);
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
          scrollToHash();
        }
      })
      .catch(function () { /* keep baked-in fallback content */ });
  }

  function scrollToHash() {
    if (!location.hash) return;
    var target = document.querySelector(location.hash);
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  }

  function loadInsights() {
    var grid = document.getElementById("insights-grid");
    var nav = document.getElementById("article-nav");
    if (!grid && !nav) return;
    var lang = document.documentElement.getAttribute("lang") || "en";
    fetch("/content/insights.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (!data || !data[lang]) return;
        if (grid) renderInsightsGrid(grid, data[lang].articles, lang);
        if (nav) renderArticleNav(nav, data[lang].articles, lang);
        initReveals();
      })
      .catch(function () { /* keep baked-in fallback content */ });
  }

  var INSIGHTS_I18N = {
    en: { readMore: "Read more &rarr;", prevDir: "&larr; Previous", nextDir: "Next &rarr;" },
    he: { readMore: "קרא עוד &larr;", prevDir: "&rarr; הקודם", nextDir: "הבא &larr;" }
  };

  function renderInsightsGrid(wrap, articles, lang) {
    if (!Array.isArray(articles)) return;
    var strings = INSIGHTS_I18N[lang] || INSIGHTS_I18N.en;
    wrap.innerHTML = "";
    articles.forEach(function (a) {
      var href = "/" + lang + "/insights/" + a.slug + "/";
      var card = el("div", "insight-card reveal");
      card.innerHTML =
        '<a href="' + href + '" class="insight-card-image"><img src="' + a.image + '" alt="" loading="lazy"></a>' +
        '<h3><a href="' + href + '">' + a.title + '</a></h3>' +
        '<p>' + a.excerpt + '</p>' +
        '<a href="' + href + '" class="more-link">' + strings.readMore + '</a>';
      wrap.appendChild(card);
    });
  }

  function renderArticleNav(wrap, articles, lang) {
    if (!Array.isArray(articles)) return;
    var strings = INSIGHTS_I18N[lang] || INSIGHTS_I18N.en;
    var slug = wrap.getAttribute("data-current-slug");
    var index = -1;
    articles.forEach(function (a, i) { if (a.slug === slug) index = i; });
    if (index === -1) return;
    var prev = index > 0 ? articles[index - 1] : null;
    var next = index < articles.length - 1 ? articles[index + 1] : null;
    wrap.innerHTML = "";
    if (prev) {
      var prevLink = el("a", "article-nav-link");
      prevLink.href = "/" + lang + "/insights/" + prev.slug + "/";
      prevLink.innerHTML = '<span class="article-nav-dir">' + strings.prevDir + '</span><span class="article-nav-title">' + prev.title + '</span>';
      wrap.appendChild(prevLink);
    } else {
      wrap.appendChild(el("span", ""));
    }
    if (next) {
      var nextLink = el("a", "article-nav-link");
      nextLink.href = "/" + lang + "/insights/" + next.slug + "/";
      nextLink.innerHTML = '<span class="article-nav-dir">' + strings.nextDir + '</span><span class="article-nav-title">' + next.title + '</span>';
      wrap.appendChild(nextLink);
    }
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
      if (!action) {
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
    loadInsights();
  });
})();
