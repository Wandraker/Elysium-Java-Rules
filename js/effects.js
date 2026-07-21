const elysiumMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

function canUseElysiumMotion() {
  return Boolean(window.ELYSIUM_MOTION?.animate) && !elysiumMotionMedia.matches;
}

function clearMotionStyles(element, properties = ["opacity", "transform", "filter", "will-change"]) {
  properties.forEach((property) => element.style.removeProperty(property));
}

function playElysiumMotion(element, keyframes, options = {}, cleanup = true) {
  if (!element || element.hidden || !canUseElysiumMotion()) {
    if (element) clearMotionStyles(element);
    return null;
  }

  element.style.willChange = Object.keys(keyframes).join(", ");
  const controls = window.ELYSIUM_MOTION.animate(element, keyframes, options);
  if (cleanup) {
    Promise.resolve(controls.finished)
      .catch(() => {})
      .finally(() => clearMotionStyles(element));
  }
  return controls;
}

function revealWithMotion(element, index = 0, distance = 16) {
  if (!element || element.dataset.motionVisible === "true") return;
  element.dataset.motionVisible = "true";
  playElysiumMotion(element, {
    opacity: [0, 1],
    transform: [`translate3d(0, ${distance}px, 0) scale(.985)`, "translate3d(0, 0, 0) scale(1)"]
  }, {
    duration: 0.48,
    delay: Math.min(index, 8) * 0.055,
    ease: "ease-out"
  });
}

function animateMotionList(container) {
  if (!container || !canUseElysiumMotion()) return;
  const items = Array.from(container.children).filter((item) => !item.hidden).slice(0, 12);
  items.forEach((item, index) => {
    delete item.dataset.motionVisible;
    revealWithMotion(item, index, 10);
  });
}

function animateMotionPanel(panel) {
  if (!panel || panel.hidden || !canUseElysiumMotion()) return;
  playElysiumMotion(panel, {
    opacity: [0, 1],
    transform: ["translate3d(0, 8px, 0)", "translate3d(0, 0, 0)"]
  }, { duration: 0.3, ease: "ease-out" });

  const cards = panel.querySelectorAll(".account-summary-grid > article, .account-dashboard-grid > *, .account-two-column > *, .account-v2-panel, .account-accounts-panel, .account-link-panel");
  Array.from(cards).slice(0, 8).forEach((card, index) => {
    playElysiumMotion(card, {
      opacity: [0, 1],
      transform: ["translate3d(0, 10px, 0) scale(.99)", "translate3d(0, 0, 0) scale(1)"]
    }, { duration: 0.34, delay: index * 0.045, ease: "ease-out" });
  });
}

function pulseMotionStatus(element) {
  if (!element || !canUseElysiumMotion()) return;
  playElysiumMotion(element, {
    opacity: [0.55, 1],
    transform: ["translate3d(0, 2px, 0) scale(.97)", "translate3d(0, 0, 0) scale(1)"],
    filter: ["brightness(1.35)", "brightness(1)"]
  }, { duration: 0.34, ease: "ease-out" });
}

function initDynamicMotion(view) {
  window.__elysiumMotionObserver?.disconnect();
  if (!view || !canUseElysiumMotion() || !("MutationObserver" in window)) return;

  const selectors = [
    ".account-activity-item",
    ".minecraft-account-card",
    ".account-conversation-button",
    ".account-decision-card",
    ".account-session-card",
    ".account-message",
    ".account-notice:not([hidden])"
  ].join(",");

  window.__elysiumMotionObserver = new MutationObserver((records) => {
    const added = [];
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(selectors)) added.push(node);
      node.querySelectorAll?.(selectors).forEach((item) => added.push(item));
    }));
    added.slice(0, 12).forEach((item, index) => revealWithMotion(item, index, 9));
  });
  window.__elysiumMotionObserver.observe(view, { childList: true, subtree: true });
}

function initRouteMotion(route) {
  const view = document.querySelector("#app > .view");
  if (!view) return;
  if (!canUseElysiumMotion()) {
    document.documentElement.classList.remove("motion-enhanced");
    return;
  }

  document.documentElement.classList.add("motion-enhanced");
  playElysiumMotion(view, {
    opacity: [0, 1],
    transform: ["translate3d(0, 7px, 0)", "translate3d(0, 0, 0)"]
  }, { duration: 0.34, ease: "ease-out" });

  const routeElements = route === "elysium"
    ? [".hero-kicker", ".hero-front h1", ".hero-front .lead", ".hero-primary-actions", ".social-dock"]
    : [".back-btn", ".page-hero > *", ".rules-page > h1", ".rules-page > p", ".account-heading", ".shield-badge", ".shield-kicker", ".shield-shell > h1", ".shield-lead", ".shield-account-hint", ".shield-panel"];

  routeElements
    .flatMap((selector) => Array.from(view.querySelectorAll(selector)))
    .filter((element) => !element.hidden)
    .slice(0, 10)
    .forEach((element, index) => revealWithMotion(element, index, 14));

  const consoleCard = view.querySelector(".hero-console");
  if (consoleCard) {
    playElysiumMotion(consoleCard, {
      opacity: [0, 1],
      transform: ["translate3d(24px, 0, 0) scale(.975)", "translate3d(0, 0, 0) scale(1)"]
    }, { duration: 0.58, delay: 0.12, ease: "ease-out" });
  }

  initDynamicMotion(view);
}

function initMotionPressResponse() {
  if (document.documentElement.dataset.motionPressReady) return;
  document.documentElement.dataset.motionPressReady = "true";
  document.addEventListener("click", (event) => {
    if (!canUseElysiumMotion()) return;
    const button = event.target.closest("button, .main-btn, .choice-btn, .social-link");
    if (!button || button.disabled || button.closest(".nav-links") || button.hasAttribute("data-target")) return;
    playElysiumMotion(button, {
      transform: ["scale(1)", "scale(.965)", "scale(1)"]
    }, { duration: 0.22, ease: "ease-out" });
  });
}

function initStaffCarousel() {
  document.querySelectorAll(".staff-carousel").forEach((carousel) => {
    if (carousel.dataset.dragReady) return;
    carousel.dataset.dragReady = "true";
    let pointerId = null;
    let origin = 0;
    let scrollOrigin = 0;

    carousel.addEventListener("pointerdown", (event) => {
      pointerId = event.pointerId;
      origin = event.clientX;
      scrollOrigin = carousel.scrollLeft;
      carousel.setPointerCapture(pointerId);
      carousel.classList.add("dragging");
    });

    carousel.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) return;
      carousel.scrollLeft = scrollOrigin - (event.clientX - origin);
    });

    const stop = (event) => {
      if (pointerId !== event.pointerId) return;
      carousel.classList.remove("dragging");
      pointerId = null;
    };

    carousel.addEventListener("pointerup", stop);
    carousel.addEventListener("pointercancel", stop);
  });
}

function initHomepageMotion() {
  initStaffCarousel();
  initCardResponse();
  initMotionPressResponse();

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    if (button.dataset.scrollReady) return;
    button.dataset.scrollReady = "true";
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget);
      if (!target) return;
      target.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  const elements = document.querySelectorAll(".home-card, .staff-card, .team-section, .choice, .connect-card, .donate-card, .rule-card");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window) || elysiumMotionMedia.matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (canUseElysiumMotion()) revealWithMotion(entry.target, Number(entry.target.dataset.motionOrder || 0));
      else entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });

  elements.forEach((element, index) => {
    element.dataset.motionOrder = String(index % 3);
    if (!canUseElysiumMotion()) element.classList.add("reveal-item");
    observer.observe(element);
  });
}

function initCardResponse() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".home-card, .staff-card, .choice, .connect-card, .donate-card, .hero-card, .rule-card").forEach((card) => {
    if (card.dataset.motionReady) return;
    card.dataset.motionReady = "true";
    card.classList.add("motion-card");

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
      const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
      card.style.setProperty("--pointer-x", `${x}px`);
      card.style.setProperty("--pointer-y", `${y}px`);
      card.style.setProperty("--tilt-x", `${((0.5 - y / bounds.height) * 2.2).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${((x / bounds.width - 0.5) * 2.2).toFixed(2)}deg`);
      card.classList.add("is-pointer-active");
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-pointer-active");
    }, { passive: true });
  });
}

function initAmbientEffects(route) {
  document.body.classList.toggle("ambient-route", route === "elysium" || route === "start");
}

function initExternalTransfer() {
  document.querySelectorAll("[data-transfer-node]").forEach((link) => {
    if (link.dataset.transferReady) return;
    link.dataset.transferReady = "true";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      if (href) runExternalTransfer(href, link.dataset.transferNode || "Внешний сервис");
    });
  });
}

function runExternalTransfer(url, nodeName) {
  let destination;
  try {
    destination = new URL(url, window.location.href);
    if (!["http:", "https:"].includes(destination.protocol)) return;
  } catch (error) {
    return;
  }

  let screen = document.querySelector(".transfer-screen");
  if (!screen) {
    screen = document.createElement("div");
    screen.className = "transfer-screen";
    screen.innerHTML = `
      <div class="transfer-box" role="dialog" aria-modal="true" aria-label="Переход на внешний сервис">
        <div class="transfer-head"><div><b>Переход на внешний узел</b><span>ELYSIUM SECURE RELAY</span></div><i></i></div>
        <div class="transfer-route">
          <div class="transfer-endpoint"><span>Источник</span><strong>Elysium</strong></div>
          <div class="transfer-link"></div>
          <div class="transfer-endpoint"><span>Назначение</span><strong class="transfer-service"></strong></div>
        </div>
        <div class="transfer-node"><span>Проверенный адрес</span><strong class="transfer-url"></strong></div>
        <div class="transfer-progress"><span></span></div>
        <div class="transfer-status" aria-live="polite">01 / ПРОВЕРЯЕМ АДРЕС НАЗНАЧЕНИЯ</div>
        <div class="transfer-actions"><button class="transfer-cancel" type="button">Отмена</button><a class="transfer-now" rel="noopener noreferrer">Перейти сейчас</a></div>
      </div>`;
    document.body.appendChild(screen);
  }

  const progress = screen.querySelector(".transfer-progress span");
  const direct = screen.querySelector(".transfer-now");
  const status = screen.querySelector(".transfer-status");
  screen.querySelector(".transfer-service").textContent = nodeName;
  screen.querySelector(".transfer-url").textContent = destination.hostname;
  direct.href = destination.href;
  screen.classList.add("active");
  progress.style.width = "0%";
  requestAnimationFrame(() => { progress.style.width = "100%"; });

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = [
    window.setTimeout(() => { status.textContent = "02 / УСТАНАВЛИВАЕМ ЗАЩИЩЁННЫЙ ПЕРЕХОД"; }, reducedMotion ? 80 : 450),
    window.setTimeout(() => { status.textContent = `03 / ОТКРЫВАЕМ ${destination.hostname.toUpperCase()}`; }, reducedMotion ? 160 : 1050),
    window.setTimeout(() => window.location.assign(destination.href), reducedMotion ? 260 : 1550)
  ];
  const stop = () => timers.forEach(window.clearTimeout);
  screen.querySelector(".transfer-cancel").onclick = () => {
    stop();
    screen.classList.remove("active");
  };
  direct.onclick = stop;
}

function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    if (button.dataset.copyReady) return;
    button.dataset.copyReady = "true";
    const initial = button.textContent;

    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      if (!value) return;
      const copied = await copyText(value);
      button.textContent = copied ? "Скопировано ✓" : "Скопируйте вручную";
      showCopyToast(copied ? "IP скопирован: " + value : value);
      window.setTimeout(() => { button.textContent = initial; }, 1600);
    });
  });
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise((_, reject) => setTimeout(() => reject(new Error("clipboard-timeout")), 450))
      ]);
      return true;
    } catch (error) {}
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  return copied;
}

function showCopyToast(text) {
  let toast = document.querySelector(".copy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "copy-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.__elysiumCopyToastTimer);
  window.__elysiumCopyToastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

window.ELYSIUM_MOTION_UI = Object.freeze({
  initRoute: initRouteMotion,
  animatePanel: animateMotionPanel,
  animateList: animateMotionList,
  pulseStatus: pulseMotionStatus
});
