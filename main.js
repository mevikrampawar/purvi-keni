/* Purvi Keni — portfolio interactions (no dependencies) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---------- theme ---------- */

  var themeToggle = document.getElementById("themeToggle");
  var themeMeta = document.getElementById("theme-color");

  function syncThemeMeta() {
    if (themeMeta) themeMeta.setAttribute("content", root.dataset.theme === "ink" ? "#14130E" : "#F4EEE3");
  }

  function syncThemeButton() {
    if (!themeToggle) return;
    var dark = root.dataset.theme === "ink";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  syncThemeMeta();

  if (themeToggle) {
    syncThemeButton();
    themeToggle.addEventListener("click", function () {
      var next = root.dataset.theme === "ink" ? "light" : "ink";
      if (next === "ink") {
        root.dataset.theme = "ink";
      } else {
        delete root.dataset.theme;
      }
      try {
        localStorage.setItem("pk-theme", next);
      } catch (e) {}
      syncThemeButton();
      syncThemeMeta();
    });
  }

  /* ---------- scroll state: header, progress, back-to-top, timeline ---------- */

  var header = document.getElementById("siteHeader");
  var progressBar = document.getElementById("progressBar");
  var toTop = document.getElementById("toTop");
  var timelineWrap = document.getElementById("timeline");
  var timelineFill = document.getElementById("timelineFill");
  var jobEls = timelineWrap ? Array.prototype.slice.call(timelineWrap.querySelectorAll(".job")) : [];
  var ticking = false;

  function updateTimeline() {
    if (!timelineWrap || !timelineFill) return;
    var rect = timelineWrap.getBoundingClientRect();
    var vh = window.innerHeight;
    var focus = vh * 0.62;
    var total = rect.height;
    var passed = Math.min(Math.max(focus - rect.top, 0), total);
    timelineFill.style.height = ((passed / total) * 100) + "%";
    jobEls.forEach(function (job) {
      var r = job.getBoundingClientRect();
      var active = r.top < focus && r.bottom > focus * 0.3;
      job.classList.toggle("is-active", active);
    });
  }

  function onScrollFrame() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (progressBar) progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (toTop) toTop.hidden = y < 640;

    if (!reduceMotion) updateTimeline();

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScrollFrame();

  // static timeline for reduced motion: fill rail, mark all active
  if (reduceMotion && timelineFill) {
    timelineFill.style.height = "100%";
    jobEls.forEach(function (job) { job.classList.add("is-active"); });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- mobile menu ---------- */

  var menuBtn = document.getElementById("menuBtn");
  var mobileNav = document.getElementById("mobileNav");

  function closeMenu(restoreFocus) {
    if (!menuBtn || !mobileNav) return;
    mobileNav.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    if (restoreFocus) menuBtn.focus();
  }

  function openMenu() {
    if (!menuBtn || !mobileNav) return;
    mobileNav.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    var first = mobileNav.querySelector("a");
    if (first) first.focus();
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      if (menuBtn.getAttribute("aria-expanded") === "true") {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });

    document.addEventListener("click", function (event) {
      if (menuBtn.getAttribute("aria-expanded") !== "true") return;
      if (event.target.closest("#mobileNav") || event.target.closest("#menuBtn")) return;
      closeMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && menuBtn.getAttribute("aria-expanded") === "true") {
        closeMenu(false);
      }
    });
  }

  /* ---------- smooth anchor + close menu ---------- */

  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href");
    if (!id || id === "#") return;
    var target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    try {
      if (history.pushState) history.pushState(null, "", id);
    } catch (e) {}
  });

  /* ---------- active nav ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sectionMap = {};
  navLinks.forEach(function (link) {
    sectionMap[link.getAttribute("data-nav")] = link;
  });

  var watched = ["work", "about", "capabilities", "experience", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && watched.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var active = link.getAttribute("data-nav") === entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    watched.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- reveal on scroll ---------- */

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  revealEls.forEach(function (el) {
    var siblings = Array.prototype.slice.call(el.parentElement.children).filter(function (child) {
      return child.classList && child.classList.contains("reveal");
    });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--delay", Math.min(index * 70, 280) + "ms");
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- count up ---------- */

  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    var duration = 1100;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  function setCounterFinal(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (!isNaN(target)) el.textContent = String(target);
  }

  if (reduceMotion) {
    counters.forEach(setCounterFinal);
  } else if ("IntersectionObserver" in window && counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(setCounterFinal);
  }

  /* ---------- work: filters ---------- */

  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var cases = Array.prototype.slice.call(document.querySelectorAll(".case"));
  var emptyState = document.getElementById("casesEmpty");

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");

      filters.forEach(function (other) {
        var active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });

      var visible = 0;
      cases.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-cat") === filter;
        item.hidden = !show;
        if (!show) collapseCase(item);
        if (show) {
          item.classList.add("is-in");
          visible += 1;
        }
      });

      if (emptyState) emptyState.hidden = visible !== 0;
    });
  });

  /* ---------- work: accordion ---------- */

  function collapseCase(article) {
    var button = article.querySelector(".case__button");
    var panel = article.querySelector(".case__panel");
    article.classList.remove("is-open");
    if (button) button.setAttribute("aria-expanded", "false");
    if (panel) panel.setAttribute("aria-hidden", "true");
  }

  function expandCase(article) {
    var button = article.querySelector(".case__button");
    var panel = article.querySelector(".case__panel");
    article.classList.add("is-open");
    if (button) button.setAttribute("aria-expanded", "true");
    if (panel) panel.setAttribute("aria-hidden", "false");
  }

  cases.forEach(function (article) {
    var button = article.querySelector(".case__button");
    if (!button) return;

    button.addEventListener("click", function () {
      var isOpen = article.classList.contains("is-open");
      cases.forEach(collapseCase);
      if (!isOpen) expandCase(article);
    });
  });

  /* ---------- hero card tilt ---------- */

  var stack = document.getElementById("brandstack");
  var stackInner = stack ? stack.querySelector(".brandstack__inner") : null;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  if (stack && stackInner && finePointer && !reduceMotion) {
    var tiltTicking = false;
    stack.addEventListener("pointermove", function (event) {
      if (tiltTicking) return;
      tiltTicking = true;
      window.requestAnimationFrame(function () {
        var rect = stack.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        stackInner.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
        stackInner.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
        tiltTicking = false;
      });
    });

    stack.addEventListener("pointerleave", function () {
      stackInner.style.setProperty("--ry", "0deg");
      stackInner.style.setProperty("--rx", "0deg");
    });
  }

  /* ---------- toast ---------- */

  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  /* ---------- copy email ---------- */

  var copyBtn = document.getElementById("copyEmail");

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(area);
    return ok;
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email") || "";
      var done = function () {
        copyBtn.textContent = "Copied";
        copyBtn.classList.add("is-done");
        showToast("Email copied to clipboard");
        window.setTimeout(function () {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("is-done");
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          if (legacyCopy(email)) done();
          else showToast("Could not copy — " + email);
        });
      } else if (legacyCopy(email)) {
        done();
      } else {
        showToast("Could not copy — " + email);
      }
    });
  }

  /* ---------- contact form ---------- */

  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(name, message) {
    if (!form) return;
    var field = form.querySelector('[name="' + name + '"]');
    if (!field) return;
    var wrap = field.closest(".field");
    var error = form.querySelector('[data-error-for="' + name + '"]');
    if (wrap) wrap.classList.toggle("has-error", Boolean(message));
    if (error) error.textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate() {
    if (!form) return null;
    var fields = form.elements;
    var name = fields.name.value.trim();
    var email = fields.email.value.trim();
    var message = fields.message.value.trim();
    var firstBad = null;

    if (name.length < 2) {
      setError("name", "Please tell me your name.");
      firstBad = firstBad || fields.name;
    } else {
      setError("name", "");
    }

    if (!emailPattern.test(email)) {
      setError("email", "Please add a valid email address.");
      firstBad = firstBad || fields.email;
    } else {
      setError("email", "");
    }

    if (message.length < 5) {
      setError("message", "Please add a short message.");
      firstBad = firstBad || fields.message;
    } else {
      setError("message", "");
    }

    if (firstBad) {
      firstBad.focus();
      return null;
    }

    return { name: name, email: email, message: message };
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var values = validate();
      if (!values) {
        if (statusEl) statusEl.textContent = "Please fix the highlighted fields.";
        return;
      }

      var subject = "Portfolio enquiry from " + values.name;
      var body = values.message + "\n\n— " + values.name + " (" + values.email + ")";
      var url =
        "mailto:kenipurvi@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      if (statusEl) statusEl.textContent = "Opening your email app with the message ready to send…";
      window.location.href = url;
    });

    Array.prototype.slice.call(form.querySelectorAll("input, textarea")).forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") setError(field.name, "");
      });
    });
  }

  /* ---------- year ---------- */

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- ready flag (reveal failsafe lives in <head>) ---------- */

  window.__pkReady = true;
})();
