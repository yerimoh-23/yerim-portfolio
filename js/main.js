import projects from "./data/project.js";

// ══════════════════════════════════════════
// CURSOR GLOW
// ══════════════════════════════════════════
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  function animateCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    cursorGlow.style.left = cx + "px";
    cursorGlow.style.top  = cy + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ══════════════════════════════════════════
// STAGGER ENTRANCE ANIMATION
// ══════════════════════════════════════════
function triggerStagger() {
  const items = document.querySelectorAll(".stagger-in");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 80 + i * 50);
  });
}

// ══════════════════════════════════════════
// 3D TILT EFFECT
// ══════════════════════════════════════════
function initTiltEffect() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform  = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)";
      card.style.transition = "transform 0.5s var(--ease-out)";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease-out";
    });
  });
}

// ══════════════════════════════════════════
// PROJECTS (projects.html에서만 실행)
// ══════════════════════════════════════════
function renderProjects() {
  const projectGrid = document.getElementById("project-grid");
  if (!projectGrid) return; // projects.html이 아니면 스킵

  projectGrid.innerHTML = projects.map((p) => `
    <a href="${p.link}" target="_blank" rel="noopener"
       class="project-card glass-card stagger-in" data-category="${p.category}" data-tilt>
      <div class="project-card-img">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <div class="project-card-overlay">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
      </div>
      <div class="project-card-body">
        <h3 class="project-card-title">${p.title}</h3>
        <div class="project-card-tags">
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
        <p class="project-card-desc">${p.description}</p>
        <span class="project-card-year">${p.year}</span>
      </div>
    </a>
  `).join("");
}

// ══════════════════════════════════════════
// LANGUAGE TOGGLE
// ══════════════════════════════════════════
const LANG_KEY = "portfolio-lang";

function initLang() {
  const saved = localStorage.getItem(LANG_KEY) || "en";
  applyLang(saved, false);
}

function applyLang(lang, save = true) {
  if (save) localStorage.setItem(LANG_KEY, lang);
  const btn = document.getElementById("lang-toggle");
  if (lang === "ko") {
    document.body.classList.add("ko");
    if (btn) btn.textContent = "ENG";
  } else {
    document.body.classList.remove("ko");
    if (btn) btn.textContent = "한국어";
  }
}

function toggleLang() {
  const isKo = document.body.classList.contains("ko");
  applyLang(isKo ? "en" : "ko");
}

const langToggleBtn = document.getElementById("lang-toggle");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", toggleLang);
}

// ══════════════════════════════════════════
// BOTTOM NAV — active 링크 표시
// ══════════════════════════════════════════
function initNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-btn[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
    else a.classList.remove("active");
  });
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  initLang();
  initNav();
  renderProjects();
  triggerStagger();
  initTiltEffect();
});