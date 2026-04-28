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
    if (btn) btn.textContent = 'EN';
  } else {
    document.body.classList.remove('ko');
    if (btn) btn.textContent = '한국어';
  }
}

function toggleLang() {
  const isKo = document.body.classList.contains('ko');
  setLang(isKo ? 'en' : 'ko');
}

// ── Dark Mode Toggle ──
const THEME_KEY = 'portfolio-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  setTheme(saved, false);
}

function setTheme(theme, save = true) {
  if (save) localStorage.setItem(THEME_KEY, theme);
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
}

// ── Active Nav Link ──
function initNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Tab Switch ──
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabViews = document.querySelectorAll('.tl-view');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
  initNav();
  initTabs();
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.addEventListener('click', toggleLang);
  // Optional: add keyboard shortcut for dark mode toggle (Ctrl+Shift+D)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      toggleTheme();
    }
  });
});
