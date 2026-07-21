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

  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });

  elements.forEach((element) => {
    element.classList.add("reveal-item");
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
