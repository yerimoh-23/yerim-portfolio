import experience from "./experience.js";

// ── 카테고리 태그 HTML 생성 ──
function categoryTag(category) {
  const map = {
    work:      { cls: "tag-work",  en: "Work",     ko: "경력" },
    activity:  { cls: "tag-act",   en: "Activity", ko: "활동" },
    award:     { cls: "tag-award", en: "Award",    ko: "수상" },
    education: { cls: "tag-edu",   en: "Edu",      ko: "학력" },
  };
  const t = map[category] || { cls: "tag-edu", en: category, ko: category };
  return `<span class="tag ${t.cls} tl-tag">
    <span data-en>${t.en}</span><span data-ko>${t.ko}</span>
  </span>`;
}

// ── 설명 리스트 HTML ──
function renderDesc(items) {
  if (!items || items.length === 0) return "";
  if (items.length === 1) return `<div class="tl-detail">${items[0]}</div>`;
  return items.map(d => `<div class="tl-detail">· ${d}</div>`).join("");
}

// ══════════════════════════════════════════
// TIMELINE VIEW
// ══════════════════════════════════════════
function renderTimeline() {
  const container = document.getElementById("timeline");
  if (!container) return;

  const all = [
    ...experience.work,
    ...experience.activities,
    ...experience.awards,
    ...experience.education,
  ];

  all.sort((a, b) => b.date_sort.localeCompare(a.date_sort));

  const groups = {};
  all.forEach(item => {
    const year = item.date_sort.split("-")[0];
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  });

  const sortedYears = Object.keys(groups).sort((a, b) => b - a);

  container.innerHTML = sortedYears.map(year => `
    <div class="year-block">
      <div class="year-label">${year}</div>
      <div class="tl-rows">
        ${groups[year].map(item => `
          <div class="tl-row">
            ${categoryTag(item.category)}
            <div class="tl-body">
              <div class="tl-title">
                ${item.companyUrl
                  ? `<a href="${item.companyUrl}" target="_blank" style="color:inherit;text-decoration:none;">${item.company}</a>`
                  : item.company
                }
                —
                <span data-en>${item.role_en || ""}</span>
                <span data-ko>${item.role_ko || ""}</span>
                <span class="badge">
                  <span data-en>${item.date_en}</span>
                  <span data-ko>${item.date_ko}</span>
                </span>
              </div>
              <span data-en>${renderDesc(item.description_en)}</span>
              <span data-ko>${renderDesc(item.description_ko)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

// ══════════════════════════════════════════
// CATEGORY VIEW
// ══════════════════════════════════════════
function renderCategoryGroup(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="cat-item">
      <div class="cat-period">
        <span data-en>${item.date_en}</span>
        <span data-ko>${item.date_ko}</span>
      </div>
      <div class="cat-name">
        ${item.companyUrl
          ? `<a href="${item.companyUrl}" target="_blank" style="color:inherit;text-decoration:none;">${item.company}</a>`
          : item.company
        }
        ${item.role_en ? `— <span data-en>${item.role_en}</span>` : ""}
        ${item.role_ko ? `<span data-ko>${item.role_ko}</span>` : ""}
      </div>
      <div class="cat-sub">
        <span data-en>${(item.description_en || []).join("<br>")}</span>
        <span data-ko>${(item.description_ko || []).join("<br>")}</span>
      </div>
    </div>
  `).join("");
}

function renderCategory() {
  renderCategoryGroup("work-timeline",       experience.work);
  renderCategoryGroup("activities-timeline", experience.activities);
  renderCategoryGroup("awards-timeline",     experience.awards);
  renderCategoryGroup("edu-timeline",        experience.education);
}

// ══════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════
function initTabs() {
  const tabBtns  = document.querySelectorAll(".tab-btn");
  const tabViews = document.querySelectorAll(".tl-view");

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b  => b.classList.remove("active"));
      tabViews.forEach(v => v.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add("active");
    });
  });
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
export function initExperience() {
  renderTimeline();
  renderCategory();
  initTabs();

  // 언어 전환 시 재렌더링
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      setTimeout(() => {
        renderTimeline();
        renderCategory();
      }, 10);
    });
  }
}