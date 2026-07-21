const app = document.getElementById("app");

const routeAliases = {
  elysium: "elysium",
  home: "elysium",
  rules: "rules",
  "elysium-start": "start",
  start: "start",
  "java-rules": "java",
  "bedrock-rules": "bedrock",
  "chat-rules": "chat",
  "telegram-rules": "chat",
  java: "java",
  bedrock: "bedrock",
  chat: "chat",
  donate: "donate",
  support: "donate",
  verify: "verify",
  shield: "verify",
  account: "account",
  profile: "account"
};

const routeHashes = {
  elysium: "elysium",
  rules: "rules",
  start: "elysium-start",
  java: "java-rules",
  bedrock: "bedrock-rules",
  chat: "chat-rules",
  donate: "donate",
  verify: "verify",
  account: "account"
};

function normalizeRoute(target) {
  const value = String(target || "elysium").replace("#", "").split("?")[0].toLowerCase();
  return routeAliases[value] || "elysium";
}

function routeFromHash() {
  return normalizeRoute(location.hash.replace("#", "") || "elysium");
}

function viewMarkup(route) {
  if (route === "elysium") return elysiumView();
  if (route === "rules") return rulesView();
  if (route === "start") return startView();
  if (route === "donate") return donateView();
  if (route === "verify") return verifyView();
  if (route === "account") return accountView();
  return sectionView(route);
}

function updateNavigation(route) {
  document.documentElement.dataset.route = route;
  document.querySelectorAll(".nav-links [data-target]").forEach((button) => {
    const active = normalizeRoute(button.dataset.target) === route;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function initializeView(route) {
  initHomepageMotion();
  initCopyButtons();
  initAmbientEffects(route);
  initExternalTransfer();
  initAccountExperience();
  initShieldVerification();
  window.ELYSIUM_RUNTIME?.applyServerStatus();
}

function render(target, updateHash = true, options = {}) {
  const route = normalizeRoute(target);
  if (!options.force && route === window.__elysiumCurrentRoute) return;

  app.innerHTML = viewMarkup(route);
  window.__elysiumCurrentRoute = route;
  updateNavigation(route);
  initializeView(route);

  if (updateHash) {
    const nextHash = "#" + routeHashes[route];
    if (location.hash !== nextHash) history.pushState(null, "", nextHash);
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: options.initial || matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-target]");
  if (!target || target.disabled) return;
  event.preventDefault();
  render(target.dataset.target);
});

window.addEventListener("popstate", () => render(routeFromHash(), false, { force: true }));
window.addEventListener("hashchange", () => render(routeFromHash(), false, { force: true }));

try {
  history.scrollRestoration = "manual";
} catch (error) {}

window.__elysiumCurrentRoute = null;

async function bootSite() {
  const status = await window.ELYSIUM_RUNTIME?.initialStatus;
  if (window.ELYSIUM_RUNTIME?.showMaintenance(status)) return;
  render(routeFromHash(), false, { initial: true, force: true });
  window.ELYSIUM_RUNTIME?.applyServerStatus(status);
  window.ELYSIUM_RUNTIME?.startPolling();
}

bootSite();
