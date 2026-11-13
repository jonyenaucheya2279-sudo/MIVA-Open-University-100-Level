/* =========================================================
   main.js – shared behaviour for every page
   Event handling, DOM manipulation and dynamic content updates
   ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", function () {
  setupThemeToggle();
  setupMobileMenu();
  highlightActiveLink();
  setFooterYear();
  setupScrollEffects();
  showGreeting();
  setupRoleRotator();
  setupCountUp();
  setupHeroNetwork();
  setupProjectFilter();
});

/* ---------- Light / dark theme toggle ---------- */
function setupThemeToggle() {
  const button = document.getElementById("themeToggle");
  if (!button) return;
  const root = document.documentElement;

  function isDark() {
    const chosen = root.getAttribute("data-theme");
    if (chosen) return chosen === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyState() {
    const dark = isDark();
    button.classList.toggle("is-dark", dark);
    button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  // Restore a saved choice
  try {
    const saved = localStorage.getItem("jo-profile-theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage unavailable */ }

  applyState();

  button.addEventListener("click", function () {
    const next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("jo-profile-theme", next); } catch (e) { /* ignore */ }
    applyState();
  });
}

/* ---------- Mobile navigation ---------- */
function setupMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close with the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && links.classList.contains("open")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

/* ---------- Mark the current page in the navigation ---------- */
function highlightActiveLink() {
  let current = window.location.pathname.split("/").pop();
  if (current === "") current = "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Scroll: header shadow, progress bar, back-to-top ---------- */
function setupScrollEffects() {
  const header = document.querySelector(".site-header");
  const bar = document.getElementById("scrollBar");
  const backToTop = document.getElementById("backToTop");
  let ticking = false;

  function update() {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? scrolled / max : 0;

    if (header) header.classList.toggle("scrolled", scrolled > 10);
    if (bar) bar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    if (backToTop) backToTop.classList.toggle("show", scrolled > 500);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
  update();
}

/* ---------- Time-based greeting ---------- */
function showGreeting() {
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return;
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  greetingEl.textContent = greeting + " · Welcome to my profile";
}

/* ---------- Typing role rotator (array of phrases) ---------- */
function setupRoleRotator() {
  const el = document.getElementById("roleText");
  if (!el || prefersReducedMotion) return;

  const roles = [
    "Cybersecurity undergraduate",
    "Aspiring security analyst",
    "Front-end developer in training",
    "Methodical problem solver"
  ];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  function tick() {
    const word = roles[roleIndex];
    if (deleting) {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(tick, 35);
    } else {
      const next = roles[roleIndex];
      charIndex++;
      el.textContent = next.slice(0, charIndex);
      if (charIndex === next.length) {
        deleting = true;
        setTimeout(tick, 2600);   // pause on the full phrase
      } else {
        setTimeout(tick, 65);
      }
    }
  }
  setTimeout(tick, 3200);
}

/* ---------- Count-up numbers ---------- */
function setupCountUp() {
  const items = document.querySelectorAll("[data-count]");
  if (items.length === 0 || prefersReducedMotion) return;

  items.forEach(function (el, i) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1400;
    const startTime = performance.now() + 400 + i * 120;

    function frame(now) {
      const progress = Math.min(Math.max((now - startTime) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);           // ease-out cubic
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    el.textContent = (0).toFixed(decimals);
    requestAnimationFrame(frame);
  });
}

/* ---------- Animated network background in the hero ---------- */
function setupHeroNetwork() {
  const canvas = document.getElementById("heroNet");
  if (!canvas || prefersReducedMotion || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const nodes = [];
  const pointer = { x: -9999, y: -9999 };
  let width = 0;
  let height = 0;
  let running = true;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.round(Math.min(70, (width * height) / 16000));
    nodes.length = 0;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
        alert: Math.random() < 0.08          // a few red "flagged" nodes
      });
    }
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    const linkDist = 130;

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < linkDist) {
          ctx.strokeStyle = "rgba(185, 200, 216," + (0.18 * (1 - dist / linkDist)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Lines to the pointer
      const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
      if (pd < 170) {
        ctx.strokeStyle = "rgba(214, 58, 47," + (0.45 * (1 - pd / 170)).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }

      ctx.fillStyle = a.alert ? "rgba(255, 109, 96, 0.9)" : "rgba(255, 255, 255, 0.55)";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.alert ? a.r + 1 : a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  const hero = canvas.parentElement;
  hero.addEventListener("pointermove", function (event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  hero.addEventListener("pointerleave", function () {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  // Pause the animation when the hero is off screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      const visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; requestAnimationFrame(draw); }
      if (!visible) running = false;
    }).observe(hero);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}

/* ---------- Filter project cards (Projects page) ---------- */
function setupProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (buttons.length === 0) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter;

      buttons.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      let delay = 0;
      cards.forEach(function (card) {
        const categories = card.dataset.category.split(" ");
        const show = filter === "all" || categories.includes(filter);
        card.classList.toggle("hidden", !show);
        card.classList.remove("pop");
        if (show) {
          void card.offsetWidth;                 // restart the animation
          card.style.animationDelay = delay + "ms";
          card.classList.add("pop");
          delay += 80;
        }
      });
    });
  });
}
