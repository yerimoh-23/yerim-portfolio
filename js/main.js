import projects from "./data/project.js";
import experience from "./data/experience.js";
import skills from "./data/skill.js";


// --- Navigation with sliding indicator ---
const navLinks = document.querySelectorAll(".nav-btn");
const navIndicator = document.querySelector(".nav-indicator");
const sections = document.querySelectorAll(".section");

function positionIndicator(btn) {
  if (!navIndicator || !btn) return;
  navIndicator.style.width = btn.offsetWidth + "px";
  navIndicator.style.left = btn.offsetLeft + "px";
}

function setActiveSection(targetId) {
  sections.forEach((s) => s.classList.toggle("active", s.id === targetId));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.section === targetId));

  const activeBtn = document.querySelector(`.nav-btn[data-section="${targetId}"]`);
  positionIndicator(activeBtn);
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Trigger stagger animations for new section
  requestAnimationFrame(() => {
    const items = document.querySelectorAll(`#${targetId} .stagger-in`);
    items.forEach((el, i) => {
      el.classList.remove("visible");
      setTimeout(() => el.classList.add("visible"), 60 + i * 50);
    });
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveSection(link.dataset.section));
});

// Position indicator on load
window.addEventListener("load", () => {
  const activeBtn = document.querySelector(".nav-btn.active");
  positionIndicator(activeBtn);
});
window.addEventListener("resize", () => {
  const activeBtn = document.querySelector(".nav-btn.active");
  positionIndicator(activeBtn);
});

// --- Cursor glow ---
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
    cursorGlow.style.top = cy + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// --- Projects ---
const projectGrid = document.getElementById("project-grid");
const categories = ["All", ...new Set(projects.map((p) => p.category))];

const categoryLabels = {
  "ar/vr": "AR/VR",
  crafting: "Crafting",
  ai: "AI",
  ios: "iOS",
  macos: "MacOS",
  game: "Game",
  android: "Android",
  web: "Web",
};

function renderCategoryLabels() {
  const container = document.getElementById("filter-bar");
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn glass-pill" + (cat === "All" ? " active" : "");
    btn.dataset.category = cat;
    btn.textContent = cat === "All" ? "All" : categoryLabels[cat] || cat;
    btn.addEventListener("click", () => filterProjects(cat, btn));
    container.appendChild(btn);
  });
}

function filterProjects(category, activeBtn) {
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  activeBtn.classList.add("active");

  const items = document.querySelectorAll(".project-card");
  let delay = 0;
  items.forEach((item) => {
    const match = category === "All" || item.dataset.category === category;
    if (match) {
      item.style.display = "";
      item.style.animation = "none";
      item.offsetHeight;
      item.style.animationDelay = delay * 30 + "ms";
      item.style.animation = "fadeScale 0.4s var(--ease-out) forwards";
      delay++;
    } else {
      item.style.display = "none";
    }
  });
}

function renderProjects() {
  renderCategoryLabels();
  projectGrid.innerHTML = projects
    .map(
      (p, i) => `
    <a href="${p.link}" target="_blank" rel="noopener"
       class="project-card glass-card stagger-in" data-category="${p.category}" data-tilt>
      <div class="project-card-img">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <div class="project-card-overlay">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  `
    )
    .join("");
}

// --- Skills
function renderSkills() {
  const skillsContainer = document.getElementById("skills-list");
  skillsContainer.innerHTML = skills
    .map((skill) => `
      <div class="skill-card glass-card">
        <h3 class="skill-card-title">${skill.name}</h3>
        <p class="skill-card-desc">${skill.description}</p>
      </div>
    `)
    .join("");
}

// --- Experience ---
function renderDescription(desc) {
  const items = Array.isArray(desc) ? desc : [desc];
  return `<ul class="timeline-desc-list">${items.map((d) => `<li>${d}</li>`).join("")}</ul>`;
}

function renderExperience() {
  const workTimeline = document.getElementById("work-timeline");
  workTimeline.innerHTML = experience.work
    .map(
      (item, i) => `
    <div class="timeline-entry stagger-in">
      <div class="timeline-marker"></div>
      <div class="timeline-content glass-card">
        <div class="timeline-header">
          <a href="${item.companyUrl}" target="_blank" rel="noopener" class="timeline-company-link">
            <img src="${item.logo}" alt="${item.company}" class="timeline-logo" />
            <span class="timeline-company">${item.company}</span>
          </a>
          <span class="timeline-date">${item.date}</span>
        </div>
        <p class="timeline-role">${item.role}</p>
        ${renderDescription(item.description)}
        <div class="timeline-tags">
          ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");

  const eduTimeline = document.getElementById("edu-timeline");
  eduTimeline.innerHTML = experience.education
    .map(
      (item, i) => `
    <div class="timeline-entry stagger-in">
      <div class="timeline-marker"></div>
      <div class="timeline-content glass-card">
        <div class="timeline-header">
          <a href="${item.url}" target="_blank" rel="noopener" class="timeline-company-link">
            <span class="timeline-company">${item.institution}</span>
          </a>
          <span class="timeline-date">${item.date}</span>
        </div>
        <p class="timeline-desc">${item.description}</p>
        ${
          item.highlights.length
            ? `<ul class="timeline-highlights">
            ${item.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>`
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");
}

// --- 3D tilt effect on cards ---
function initTiltEffect() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)";
      card.style.transition = "transform 0.5s var(--ease-out)";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease-out";
    });
  });
}

// --- Stagger entrance for active section ---
function triggerStagger(sectionId) {
  const items = document.querySelectorAll(`#${sectionId} .stagger-in`);
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 80 + i * 50);
  });
}

// ── Language Toggle ──
const LANG_KEY = 'portfolio-lang';

function initLang() {
  const saved = localStorage.getItem(LANG_KEY) || 'en';
  setLang(saved, false);
}

function setLang(lang, save = true) {
  if (save) localStorage.setItem(LANG_KEY, lang);
  const btn = document.getElementById('lang-toggle');
  if (lang === 'ko') {
    document.body.classList.add('ko');
    if (btn) btn.textContent = 'ENG';
  } else {
    document.body.classList.remove('ko');
    if (btn) btn.textContent = '한국어';
  }
}

function toggleLang() {
  const isKo = document.body.classList.contains('ko');
  setLang(isKo ? 'en' : 'ko');
}


// Lang toggle button
const langToggleBtn = document.getElementById('lang-toggle');
if (langToggleBtn) {
  langToggleBtn.addEventListener('click', toggleLang);
}

// --- Init ---
initLang();
renderProjects();
renderExperience();
renderSkills();

requestAnimationFrame(() => {
  triggerStagger("about");
  initTiltEffect();
});