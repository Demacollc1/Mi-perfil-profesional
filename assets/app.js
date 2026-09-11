(function () {
  const data = window.PROFILE_DATA;
  const STORAGE_LANG = "profile.lang";
  const STORAGE_THEME = "profile.theme";
  const SUPPORTED_LANGS = ["en", "es", "pt"];

  // ---- language ----
  function currentLang() {
    let stored;
    try { stored = localStorage.getItem(STORAGE_LANG); } catch (_) { stored = null; }
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(nav) ? nav : "en";
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    try { localStorage.setItem(STORAGE_LANG, lang); } catch (_) {}
    document.documentElement.lang = lang;

    // Header buttons
    document.querySelectorAll(".lang-switcher button").forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    // i18n strings
    const strings = data.i18n[lang] || data.i18n.en;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (strings[key] != null) el.innerHTML = strings[key];
    });

    renderProjects(lang);
    renderTimeline(lang);
    renderSkills(lang);
    renderEducation(lang);
    renderLanguages(lang);
    renderCertifications();
  }

  // ---- theme ----
  function currentTheme() {
    let stored;
    try { stored = localStorage.getItem(STORAGE_THEME); } catch (_) { stored = null; }
    return stored === "dark" || stored === "light" ? stored : null;
  }

  function setTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      try { localStorage.setItem(STORAGE_THEME, theme); } catch (_) {}
    } else {
      document.documentElement.removeAttribute("data-theme");
      try { localStorage.removeItem(STORAGE_THEME); } catch (_) {}
    }
  }

  function toggleTheme() {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "dark") setTheme("light");
    else if (explicit === "light") setTheme("dark");
    else {
      const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemDark ? "light" : "dark");
    }
  }

  // ---- rendering ----
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(k => {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(c => {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function renderProjects(lang) {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    grid.innerHTML = "";
    data.projects.forEach(p => {
      const t = p.lang[lang] || p.lang.en;
      const primaryCat = Array.isArray(p.category) ? p.category[0] : p.category;
      const card = el("article", {
        class: "project-card",
        "data-cats": (Array.isArray(p.category) ? p.category.join(" ") : p.category)
      }, [
        el("div", { class: "project-head" }, [
          el("h3", null, [t.title]),
          el("span", { class: "project-tag" }, [primaryCat.toUpperCase()])
        ]),
        el("p", { class: "project-meta" }, [t.meta]),
        el("p", null, [t.summary]),
        el("ul", { class: "project-bullets" },
          (t.bullets || []).map(b => el("li", null, [b]))
        ),
        el("div", { class: "project-stack" },
          (p.stack || []).map(s => el("span", { class: "stack-tag" }, [s]))
        )
      ]);
      grid.appendChild(card);
    });
  }

  function applyProjectFilter(cat) {
    document.querySelectorAll(".project-card").forEach(card => {
      const cats = (card.dataset.cats || "").split(" ");
      const show = cat === "all" || cats.includes(cat);
      card.hidden = !show;
    });
    document.querySelectorAll(".filter-bar button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === cat);
    });
  }

  function renderTimeline(lang) {
    const list = document.getElementById("timeline");
    if (!list) return;
    list.innerHTML = "";
    data.experience.forEach(job => {
      const t = job.lang[lang] || job.lang.en;
      const li = el("li", null, [
        el("div", { class: "tl-head" }, [
          el("span", { class: "tl-role" }, [t.role]),
          el("span", { class: "tl-date" }, [t.date])
        ]),
        el("p", { class: "tl-company" }, [t.company]),
        el("ul", { class: "tl-bullets" },
          (t.bullets || []).map(b => el("li", null, [b]))
        )
      ]);
      list.appendChild(li);
    });
  }

  function renderSkills(lang) {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;
    grid.innerHTML = "";
    data.skills.forEach(group => {
      const t = group.lang[lang] || group.lang.en;
      const block = el("div", { class: "skill-block" }, [
        el("h3", null, [t.title]),
        el("ul", { class: "skill-list" },
          group.items.map(item => el("li", null, [
            el("span", null, [item.name]),
            el("span", { class: "skill-level" }, [
              typeof item.level === "string" ? item.level : (item.level[lang] || item.level.en)
            ])
          ]))
        )
      ]);
      grid.appendChild(block);
    });
  }

  function renderEducation(lang) {
    const list = document.getElementById("education-list");
    if (!list) return;
    list.innerHTML = "";
    data.education.forEach(edu => {
      const t = edu.lang[lang] || edu.lang.en;
      const li = el("li", null, [
        el("p", { class: "edu-title" }, [t.title]),
        el("p", { class: "edu-institution" }, [t.institution]),
        el("span", { class: "edu-date" }, [t.date])
      ]);
      list.appendChild(li);
    });
  }

  function renderLanguages(lang) {
    const list = document.getElementById("language-list");
    if (!list) return;
    list.innerHTML = "";
    data.languages.forEach(l => {
      list.appendChild(el("li", null, [
        el("span", null, [l.lang[lang] || l.lang.en]),
        el("span", { class: "lang-level" }, [l.level[lang] || l.level.en])
      ]));
    });
  }

  function renderCertifications() {
    const list = document.getElementById("cert-list");
    if (!list) return;
    list.innerHTML = "";
    data.certifications.forEach(c => list.appendChild(el("li", null, [c])));
  }

  // ---- boot ----
  document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const savedTheme = currentTheme();
    if (savedTheme) setTheme(savedTheme);

    const lang = currentLang();
    setLang(lang);

    document.querySelectorAll(".lang-switcher button").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });

    document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);

    document.querySelectorAll(".filter-bar button").forEach(btn => {
      btn.addEventListener("click", () => applyProjectFilter(btn.dataset.filter));
    });

    // Scroll reveal — one shot, section headers only.
    // Guarded by prefers-reduced-motion (CSS also flattens it).
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      const targets = document.querySelectorAll(".section h2, .section .section-lead");
      targets.forEach(t => t.classList.add("reveal"));
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      targets.forEach(t => io.observe(t));
    }

    // Formspree fallback: if endpoint is placeholder, prevent submit and open mailto
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (ev) => {
        const action = form.getAttribute("action") || "";
        if (action.includes("YOUR_FORM_ID")) {
          ev.preventDefault();
          const name = form.name.value.trim();
          const email = form.email.value.trim();
          const subject = form.subject.value.trim();
          const message = form.message.value.trim();
          const body = encodeURIComponent(
            "From: " + name + " <" + email + ">\n\n" + message
          );
          window.location.href = "mailto:demacollc@gmail.com?subject=" +
            encodeURIComponent("[Profile] " + subject) + "&body=" + body;
        }
      });
    }
  });
})();
