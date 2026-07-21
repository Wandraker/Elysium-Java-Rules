(() => {
  const config = window.ELYSIUM_SHIELD_CONFIG || {};
  const base = String(config.apiBase || "").replace(/\/$/, "");
  const endpoint = base ? base + "/v1/site/status" : "";
  let currentStatus = null;
  let timer = null;
  let maintenanceVisible = false;

  async function fetchStatus() {
    if (!endpoint) return fallbackStatus();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1600);
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "omit",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("status unavailable");
      const payload = await response.json();
      currentStatus = payload;
      return payload;
    } catch (error) {
      currentStatus = fallbackStatus();
      return currentStatus;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function fallbackStatus() {
    return {
      server: { state: "UNKNOWN", online: false },
      maintenance: { enabled: false, configured: false }
    };
  }

  function applyServerStatus(status = currentStatus) {
    const state = String(status?.server?.state || "UNKNOWN").toUpperCase();
    const states = {
      ONLINE: ["online", "В СЕТИ"],
      STALE: ["stale", "НЕСТАБИЛЬНО"],
      OFFLINE: ["offline", "ОФЛАЙН"],
      NO_HEARTBEAT: ["unknown", "НЕТ ДАННЫХ"],
      SCHEMA_MISSING: ["unknown", "НЕТ ДАННЫХ"],
      UNKNOWN: ["unknown", "СТАТУС НЕДОСТУПЕН"]
    };
    const [className, label] = states[state] || states.UNKNOWN;
    document.querySelectorAll("[data-server-status]").forEach((node) => {
      node.className = className;
      const labelNode = node.querySelector("span");
      if (labelNode) labelNode.textContent = label;
    });
    document.querySelectorAll("[data-server-signal]").forEach((node) => {
      node.className = "console-signal " + className;
    });
    document.querySelectorAll("[data-server-network]").forEach((node) => {
      node.className = "console-network " + className;
    });
  }

  function showMaintenance(status = currentStatus) {
    if (!status?.maintenance?.enabled || maintenanceVisible) return false;
    maintenanceVisible = true;
    document.querySelector(".topbar")?.setAttribute("hidden", "");
    const screen = document.createElement("section");
    screen.className = "maintenance-screen";
    const card = document.createElement("div");
    card.className = "maintenance-card";
    const mark = document.createElement("div");
    mark.className = "maintenance-mark";
    mark.textContent = "E";
    const eyebrow = document.createElement("div");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "ELYSIUM MAINTENANCE";
    const title = document.createElement("h1");
    title.textContent = status.maintenance.title || "Технические работы";
    const message = document.createElement("p");
    message.textContent = status.maintenance.message || "Мы обновляем Elysium. Сайт скоро вернётся в строй.";
    const retry = document.createElement("button");
    retry.className = "main-btn green";
    retry.type = "button";
    retry.textContent = "Проверить снова";
    retry.addEventListener("click", () => window.location.reload());
    card.append(mark, eyebrow, title, message, retry);
    screen.append(card);
    document.getElementById("app")?.replaceChildren(screen);
    return true;
  }

  async function refresh() {
    const status = await fetchStatus();
    if (status?.maintenance?.enabled) showMaintenance(status);
    else applyServerStatus(status);
    return status;
  }

  function startPolling() {
    if (timer) return;
    timer = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 60000);
  }

  window.ELYSIUM_RUNTIME = {
    initialStatus: fetchStatus(),
    applyServerStatus,
    showMaintenance,
    startPolling,
    refresh,
    get currentStatus() { return currentStatus; }
  };
})();
