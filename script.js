// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== Footer year =====
$("#year").textContent = new Date().getFullYear();

// ===== Burger menu =====
const burger = $("#burger");
const navList = $("#navList");

function closeMenu() {
  navList.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
}
function toggleMenu() {
  const isOpen = navList.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(isOpen));
}

burger?.addEventListener("click", toggleMenu);

// Закрывать меню при клике на ссылку
$$(".nav__link").forEach(link => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 819px)").matches) closeMenu();
  });
});

// Закрывать меню при клике вне
document.addEventListener("click", (e) => {
  if (!navList.contains(e.target) && !burger.contains(e.target)) {
    closeMenu();
  }
});

// ===== Theme toggle (localStorage) =====
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon();

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute("data-theme");
  themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
}

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon();
});

// ===== Reveal on scroll (IntersectionObserver) =====
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// ===== To top button =====
const toTop = $("#toTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) toTop.classList.add("is-visible");
  else toTop.classList.remove("is-visible");
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Skills filter =====
const skillFilter = $("#skillFilter");
const skillGrid = $("#skillGrid");

skillFilter?.addEventListener("change", () => {
  const value = skillFilter.value;
  $$(".skill", skillGrid).forEach((card) => {
    const type = card.dataset.skill;
    const show = (value === "all" || value === type);
    card.style.display = show ? "" : "none";
  });
});

// ===== Contact form validation (без отправки на сервер) =====
const form = $("#contactForm");
const hint = $("#formHint");

function setError(name, message) {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = message || "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  hint.textContent = "";

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  let ok = true;

  setError("name", "");
  setError("email", "");
  setError("message", "");

  if (name.length < 2) { setError("name", "Введите имя (минимум 2 символа)."); ok = false; }
  if (!validateEmail(email)) { setError("email", "Введите корректный email."); ok = false; }
  if (message.length < 10) { setError("message", "Сообщение должно быть минимум 10 символов."); ok = false; }

  if (!ok) return;

  // Демонстрация "отправки"
  hint.textContent = "Сообщение готово к отправке ✅ (в учебной версии без сервера).";
  form.reset();
});
