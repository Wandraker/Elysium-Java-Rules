const ElysiumAccount = (() => {
  let session = undefined;
  let sessionPromise = null;
  let lastError = null;

  const config = () => window.ELYSIUM_SHIELD_CONFIG || {};
  const apiUrl = (path) => String(config().apiBase || "").replace(/\/+$/, "") + path;

  async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");
    return fetch(apiUrl(path), { ...options, headers, credentials: "include" });
  }

  async function loadSession(force = false) {
    if (!force && session !== undefined) return session;
    if (!force && sessionPromise) return sessionPromise;
    sessionPromise = (async () => {
      lastError = null;
      try {
        const response = await apiFetch(config().profileEndpoint || "/v1/profile/me", { method: "GET" });
        if (response.status === 401) { session = null; return session; }
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.authenticated !== true) throw new Error(payload.message || "Личный кабинет временно недоступен");
        session = payload;
        return session;
      } catch (error) {
        lastError = error;
        session = null;
        return session;
      } finally { sessionPromise = null; }
    })();
    return sessionPromise;
  }

  function beginTelegramLogin(returnUrl = "") {
    const endpoint = config().telegramLoginEndpoint || "/v1/auth/telegram/start";
    const destination = returnUrl || location.origin + location.pathname + "#account";
    location.assign(apiUrl(endpoint) + "?returnUrl=" + encodeURIComponent(destination));
  }

  async function authorizedMutation(path, body = undefined) {
    const current = await loadSession();
    if (!current?.csrfToken) throw new Error("Сессия истекла. Войдите повторно.");
    const response = await apiFetch(path, {
      method: "POST",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        "X-Elysium-CSRF": current.csrfToken
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.message || "Не удалось выполнить действие");
      error.payload = payload;
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  async function logout() {
    await authorizedMutation(config().logoutEndpoint || "/v1/profile/logout");
    session = null;
  }

  async function setActivityVisible(activityVisible) {
    await authorizedMutation(config().profilePreferencesEndpoint || "/v1/profile/preferences", { activityVisible: Boolean(activityVisible) });
    return loadSession(true);
  }

  return {
    loadSession,
    refresh: () => loadSession(true),
    beginTelegramLogin,
    logout,
    setActivityVisible,
    authorizedMutation,
    getSnapshot: () => session,
    getCsrfToken: () => session?.csrfToken || "",
    getLastError: () => lastError,
    apiFetch,
    apiUrl
  };
})();

window.ElysiumAccount = ElysiumAccount;

const accountUi = {
  payload: null,
  conversations: [],
  conversationMeta: null,
  sessions: [],
  activeTab: sessionStorage.getItem("elysiumAccountTab") || "overview",
  initializedTabs: new Set()
};

const APPEAL_MESSAGE_MIN_LENGTH = 10;
const APPEAL_MESSAGE_MAX_LENGTH = 4000;

function accountEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function accountLinkify(value) {
  const text = String(value ?? "");
  const pattern = /https?:\/\/[^\s<]+/gi;
  let result = "";
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    result += accountEscape(text.slice(cursor, match.index));
    let url = match[0];
    let suffix = "";
    while (/[),.!?;:]$/.test(url)) {
      suffix = url.slice(-1) + suffix;
      url = url.slice(0, -1);
    }
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("unsupported protocol");
      result += `<a href="${accountEscape(url)}" target="_blank" rel="noopener noreferrer">${accountEscape(url)}</a>${accountEscape(suffix)}`;
    } catch {
      result += accountEscape(match[0]);
    }
    cursor = match.index + match[0].length;
  }
  return result + accountEscape(text.slice(cursor));
}

function accountAttachmentSize(value) {
  const bytes = Number(value || 0);
  if (!bytes) return "";
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(bytes >= 10485760 ? 0 : 1)} МБ`;
  return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}

function accountAttachmentMarkup(attachment) {
  const url = ElysiumAccount.apiUrl(`/v1/profile/attachments/${encodeURIComponent(attachment.id)}`);
  const label = attachment.fileName || ({
    PHOTO: "Фотография",
    VIDEO: "Видео",
    ANIMATION: "Анимация",
    DOCUMENT: "Файл",
    STICKER: "Стикер",
    AUDIO: "Аудио",
    VOICE: "Голосовое сообщение",
    VIDEO_NOTE: "Видеосообщение"
  }[attachment.mediaType] || "Вложение");
  const meta = [attachment.mimeType, accountAttachmentSize(attachment.fileSize)].filter(Boolean).join(" · ");
  if (attachment.mediaType === "PHOTO") {
    return `<a class="account-message-attachment" href="${accountEscape(url)}" target="_blank" rel="noopener"><img src="${accountEscape(url)}" alt="${accountEscape(label)}" loading="lazy"></a>`;
  }
  if (["VIDEO", "ANIMATION", "VIDEO_NOTE"].includes(attachment.mediaType)) {
    return `<div class="account-message-attachment"><video src="${accountEscape(url)}" controls playsinline preload="metadata"></video></div>`;
  }
  if (["AUDIO", "VOICE"].includes(attachment.mediaType)) {
    return `<div class="account-message-attachment"><audio src="${accountEscape(url)}" controls preload="none"></audio></div>`;
  }
  if (attachment.mediaType === "STICKER" && ["image/webp", "image/png"].includes(attachment.mimeType)) {
    return `<a class="account-message-attachment account-message-sticker" href="${accountEscape(url)}" target="_blank" rel="noopener"><img src="${accountEscape(url)}" alt="${accountEscape(attachment.stickerEmoji || label)}" loading="lazy"></a>`;
  }
  if (attachment.mediaType === "STICKER" && attachment.mimeType === "video/webm") {
    return `<div class="account-message-attachment account-message-sticker"><video src="${accountEscape(url)}" autoplay loop muted playsinline></video></div>`;
  }
  return `<a class="account-message-attachment account-message-file" href="${accountEscape(url)}" target="_blank" rel="noopener noreferrer">📎 ${accountEscape(label)}${meta ? `<span>${accountEscape(meta)}</span>` : ""}</a>`;
}

function accountMessageMarkup(message) {
  const body = message.body ? `<p>${accountLinkify(message.body).replace(/\n/g, "<br>")}</p>` : "";
  const attachments = Array.isArray(message.attachments) && message.attachments.length
    ? `<div class="account-message-attachments">${message.attachments.map(accountAttachmentMarkup).join("")}</div>`
    : "";
  return body + attachments;
}

function accountInitials(name) {
  return String(name || "E").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "E";
}

function formatAccountDate(timestamp, withTime = false) {
  const value = Number(timestamp || 0);
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(value * 1000));
  } catch { return "—"; }
}

function formatRestrictionExpiry(expiresAt) {
  return Number(expiresAt || 0) > 0 ? "До " + formatAccountDate(expiresAt, true) : "Бессрочно";
}

function setAccountNotice(element, text, type = "info") {
  if (!element) return;
  element.hidden = !text;
  element.className = "account-notice " + type;
  element.textContent = text;
}

function getAccountAuthResult() {
  const rawHash = location.hash.replace(/^#/, "");
  const queryIndex = rawHash.indexOf("?");
  if (queryIndex === -1) return "";
  return String(new URLSearchParams(rawHash.slice(queryIndex + 1)).get("auth") || "");
}

function renderAccountAvatar(container, profile, compact = false) {
  if (!container) return;
  container.replaceChildren();
  if (profile?.avatarUrl) {
    const image = document.createElement("img");
    image.src = profile.avatarUrl;
    image.alt = "";
    image.referrerPolicy = "no-referrer";
    image.loading = "lazy";
    image.addEventListener("error", () => { container.replaceChildren(document.createTextNode(accountInitials(profile.displayName))); }, { once: true });
    container.appendChild(image);
  } else container.textContent = compact ? "✦" : accountInitials(profile?.displayName);
}

function accountIsBlocked(payload) {
  return payload?.profile?.status === "BANNED" && Boolean(payload.profile.restriction);
}

function updateAccountEntry(payload) {
  const entry = document.getElementById("accountEntry");
  if (!entry) return;
  const avatar = entry.querySelector("[data-account-avatar]");
  const title = entry.querySelector("[data-account-entry-title]");
  const subtitle = entry.querySelector("[data-account-entry-subtitle]");
  if (!avatar || !title || !subtitle) return;
  if (entry.dataset.ready !== "true") {
    entry.dataset.ready = "true";
    entry.addEventListener("click", () => ElysiumAccount.getSnapshot() ? render("account") : ElysiumAccount.beginTelegramLogin());
  }
  if (payload?.authenticated) {
    entry.classList.add("authenticated");
    entry.classList.toggle("blocked", accountIsBlocked(payload));
    renderAccountAvatar(avatar, payload.profile, true);
    title.textContent = payload.profile.displayName || "Telegram";
    subtitle.textContent = accountIsBlocked(payload) ? "Доступ ограничен" : `Кабинет · ${payload.limits.used} из ${payload.limits.accountLimit}`;
    entry.setAttribute("aria-label", "Открыть личный кабинет");
  } else {
    entry.classList.remove("authenticated", "blocked");
    avatar.replaceChildren(document.createTextNode("✦"));
    title.textContent = "Войти";
    subtitle.textContent = "через Telegram";
    entry.setAttribute("aria-label", "Войти через Telegram");
  }
}

function accountSourceLabel(source) {
  return { TELEGRAM_BOT: "Telegram-бот", SITE_ACCOUNT: "Сайт", MIGRATED: "Перенесён", ADMIN: "Администратор" }[source] || "Elysium Shield";
}

function accountStatusInfo(account) {
  if (account.restriction) return { label: "Заблокирован", className: "blocked" };
  if (account.status === "ACTIVE" && Number(account.verifiedAt || 0) <= 0) return { label: "Нужен код", className: "verification" };
  return { ACTIVE: { label: "Активен", className: "active" }, UNLINKED: { label: "Отвязан", className: "inactive" }, REVOKED: { label: "Отозван", className: "revoked" }, BLOCKED: { label: "Заблокирован", className: "blocked" } }[account.status] || { label: account.status || "Неизвестно", className: "inactive" };
}

function createMinecraftAccountCard(account) {
  const status = accountStatusInfo(account);
  const needsVerification = status.className === "verification";
  const accountMeta = needsVerification
    ? `Требуется новый код · ${accountSourceLabel(account.source)}`
    : `Подтверждён ${formatAccountDate(account.verifiedAt)} · ${accountSourceLabel(account.source)}`;
  const card = document.createElement("article");
  card.className = "minecraft-account-card status-" + status.className;
  card.innerHTML = `<div class="minecraft-account-mark">${account.restriction ? "×" : (needsVerification ? "!" : "◆")}</div><div class="minecraft-account-copy"><strong>${accountEscape(account.playerName)}</strong><span>${accountEscape(accountMeta)}</span>${account.restriction ? `<small class="minecraft-account-reason">${accountEscape(account.restriction.reason || "Нарушение правил")}</small>` : ""}</div><div class="minecraft-account-status ${status.className}">${accountEscape(status.label)}</div>`;
  return card;
}

function createActivityItem(event) {
  const item = document.createElement("article");
  item.className = "account-activity-item" + (event.critical ? " critical" : "");
  const parts = [formatAccountDate(event.createdAt, true)];
  if (event.administratorTitle) parts.push(event.administratorTitle);
  if (event.playerName) parts.push(event.playerName);
  item.innerHTML = `<div class="account-activity-mark">${event.critical ? "!" : "•"}</div><div><strong>${accountEscape(event.message || "Событие профиля")}</strong><span>${accountEscape(parts.join(" · "))}</span></div>`;
  return item;
}

function showAccountState(name) {
  for (const id of ["accountLoading", "accountGuest", "accountDashboard"]) {
    const element = document.getElementById(id);
    if (element) element.hidden = id !== ({ loading: "accountLoading", guest: "accountGuest", dashboard: "accountDashboard" }[name]);
  }
}

function activateAccountTab(tab) {
  const allowed = ["overview", "minecraft", "support", "appeals", "sessions", "history"];
  const selected = allowed.includes(tab) ? tab : "overview";
  accountUi.activeTab = selected;
  sessionStorage.setItem("elysiumAccountTab", selected);
  document.querySelectorAll("[data-account-tab]").forEach((button) => button.classList.toggle("active", button.dataset.accountTab === selected));
  document.querySelectorAll("[data-account-panel]").forEach((panel) => {
    const active = panel.dataset.accountPanel === selected;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
  if (selected === "support" || selected === "appeals") loadConversations().catch(showAccountError);
  if (selected === "sessions") loadSessions().catch(showAccountError);
}

function showAccountError(error) {
  setAccountNotice(document.getElementById("accountAuthNotice"), error?.message || "Не удалось выполнить действие.", "error");
}

function renderBlockedProfile(payload) {
  const restriction = payload.profile.restriction || {};
  document.getElementById("accountBlockReason").textContent = restriction.reason || "Нарушение правил сервера";
  document.getElementById("accountBlockExpires").textContent = formatRestrictionExpiry(restriction.expiresAt);
  document.getElementById("accountBlockDecision").textContent = restriction.decisionCode || "ES-SHIELD";
  const affected = document.getElementById("accountBlockedAccounts");
  affected.replaceChildren();
  if (payload.accounts.length) {
    const chips = document.createElement("div");
    chips.className = "account-blocked-account-chips";
    payload.accounts.forEach((account) => { const chip = document.createElement("span"); chip.textContent = account.playerName; chips.appendChild(chip); });
    affected.appendChild(chips);
  }
}

function renderOverview(payload) {
  const blocked = accountIsBlocked(payload);
  document.getElementById("accountSummaryStatus").textContent = blocked ? "Ограничен" : "Активен";
  document.getElementById("accountSummaryStatusNote").textContent = blocked ? payload.profile.restriction?.decisionCode || "Решение администрации" : "Ограничений нет";
  document.getElementById("accountSummaryAccounts").textContent = `${payload.limits.used} / ${payload.limits.accountLimit}`;
  const list = document.getElementById("accountOverviewEvents");
  list.replaceChildren();
  const events = (payload.events || []).slice(0, 5);
  events.forEach((event) => list.appendChild(createActivityItem(event)));
  document.getElementById("accountOverviewEmpty").hidden = events.length !== 0;
}

function renderMinecraft(payload) {
  const list = document.getElementById("accountList");
  list.replaceChildren();
  payload.accounts.forEach((account) => list.appendChild(createMinecraftAccountCard(account)));
  document.getElementById("accountEmpty").hidden = payload.accounts.length !== 0;
  document.getElementById("accountLimitBadge").textContent = `${payload.limits.used} из ${payload.limits.accountLimit}`;
  const blocked = accountIsBlocked(payload);
  document.getElementById("accountMinecraftBlockedHint").hidden = !blocked;
  const panel = document.getElementById("accountLinkPanel");
  panel.classList.toggle("disabled-panel", blocked);
  panel.querySelectorAll("input,button").forEach((element) => { element.disabled = blocked; });
}

function renderActivity(payload) {
  const list = document.getElementById("accountActivityList");
  const empty = document.getElementById("accountActivityEmpty");
  const toggle = document.getElementById("accountActivityToggle");
  const visible = payload.preferences?.activityVisible !== false;
  toggle.dataset.visible = visible ? "true" : "false";
  toggle.setAttribute("aria-pressed", visible ? "true" : "false");
  toggle.textContent = visible ? "Обычные события: включены" : "Обычные события: скрыты";
  list.replaceChildren();
  const events = payload.events || [];
  events.forEach((event) => list.appendChild(createActivityItem(event)));
  empty.hidden = events.length !== 0;
}

function renderAccountDashboard(payload) {
  accountUi.payload = payload;
  renderAccountAvatar(document.getElementById("accountAvatar"), payload.profile);
  document.getElementById("accountDisplayName").textContent = payload.profile.displayName || "Telegram";
  document.getElementById("accountUsername").textContent = payload.profile.username ? "@" + payload.profile.username : "Telegram-профиль";
  const blocked = accountIsBlocked(payload);
  document.getElementById("accountProfileState").textContent = blocked ? "Ограничен" : "Активен";
  document.getElementById("accountProfileState").classList.toggle("blocked", blocked);
  document.getElementById("accountBlocked").hidden = !blocked;
  if (blocked) renderBlockedProfile(payload);
  renderOverview(payload);
  renderMinecraft(payload);
  renderActivity(payload);
  activateAccountTab(accountUi.activeTab);
}

function authResultMessage(result) {
  return { success: ["Вход через Telegram выполнен.", "success"], cancelled: ["Вход через Telegram был отменён.", "warning"], expired: ["Запрос на вход истёк. Попробуйте ещё раз.", "warning"], replayed: ["Этот запрос уже был использован.", "error"], blocked: ["Профиль открыт в ограниченном режиме. Доступна подача апелляции.", "warning"], rate_limited: ["Слишком много попыток входа. Подождите минуту.", "warning"], unavailable: ["Авторизация Telegram пока не настроена.", "warning"], invalid_callback: ["Telegram вернул некорректный ответ.", "error"], failed: ["Не удалось завершить вход через Telegram.", "error"] }[result] || null;
}

function accountNormalizeShieldCode(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 12);
}

async function accountLoadTurnstileScript() {
  if (window.turnstile) return window.turnstile;
  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existing) { existing.addEventListener("load", resolve, { once: true }); existing.addEventListener("error", reject, { once: true }); return; }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return window.turnstile;
}

function accountGetShieldConfig() { return window.ELYSIUM_SHIELD_CONFIG || {}; }

async function initAccountLinking() {
  const input = document.getElementById("accountLinkCode");
  const button = document.getElementById("accountLinkButton");
  const turnstileBox = document.getElementById("accountTurnstile");
  const status = document.getElementById("accountLinkStatus");
  const retry = document.getElementById("accountLinkRetry");
  if (!input || !button || button.dataset.ready === "true") return;
  button.dataset.ready = "true";
  const setStatus = (text, type = "info") => { status.className = "account-link-status " + type; status.textContent = text; };
  input.addEventListener("input", () => { input.value = accountNormalizeShieldCode(input.value); });
  const reset = () => { input.disabled = false; button.disabled = accountIsBlocked(accountUi.payload); turnstileBox.hidden = true; turnstileBox.replaceChildren(); retry.hidden = true; setStatus("Введите новый код Elysium Shield."); input.focus(); };
  const begin = async () => {
    const code = accountNormalizeShieldCode(input.value);
    input.value = code;
    if (!/^[A-Z0-9]{4}-?[A-Z0-9]{2}$/.test(code)) { setStatus("Введите код в формате K7P4-XM.", "error"); return; }
    if (accountIsBlocked(accountUi.payload)) { setStatus("Привязка недоступна во время блокировки.", "error"); return; }
    button.disabled = true; input.disabled = true; retry.hidden = true; setStatus("Загружаем Cloudflare Turnstile…", "loading");
    try {
      const turnstile = await accountLoadTurnstileScript();
      turnstileBox.hidden = false; turnstileBox.replaceChildren();
      turnstile.render(turnstileBox, {
        sitekey: accountGetShieldConfig().turnstileSiteKey, theme: "dark", size: "flexible",
        callback: async (token) => {
          setStatus("Привязываем Minecraft-ник…", "loading");
          try {
            const response = await ElysiumAccount.apiFetch(accountGetShieldConfig().verifyEndpoint || "/v1/site/verify", { method: "POST", headers: { "Content-Type": "application/json", "X-Elysium-CSRF": ElysiumAccount.getCsrfToken() }, body: JSON.stringify({ code, token }) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.status !== "VERIFIED") throw new Error(result.message || "Не удалось привязать код");
            const refreshed = await ElysiumAccount.refresh();
            renderAccountDashboard(refreshed); updateAccountEntry(refreshed);
            setStatus("Готово ✓ Ник добавлен в профиль.", "success");
            input.value = ""; input.disabled = false; button.disabled = false; turnstileBox.hidden = true; turnstileBox.replaceChildren();
          } catch (error) { setStatus(error.message, "error"); retry.hidden = false; }
        },
        "expired-callback": () => { setStatus("Проверка истекла. Повторите её.", "warning"); retry.hidden = false; },
        "error-callback": () => { setStatus("Cloudflare не завершила проверку.", "error"); retry.hidden = false; }
      });
    } catch { setStatus("Не удалось загрузить Turnstile.", "error"); retry.hidden = false; }
  };
  button.addEventListener("click", begin);
  input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); begin(); } });
  retry.addEventListener("click", reset);
}

function initActivityPreferences() {
  const toggle = document.getElementById("accountActivityToggle");
  if (!toggle || toggle.dataset.ready === "true") return;
  toggle.dataset.ready = "true";
  toggle.addEventListener("click", async () => {
    toggle.disabled = true;
    try {
      const refreshed = await ElysiumAccount.setActivityVisible(toggle.dataset.visible !== "true");
      accountUi.payload = refreshed; renderActivity(refreshed); renderOverview(refreshed); updateAccountEntry(refreshed);
    } catch (error) { showAccountError(error); }
    finally { toggle.disabled = false; }
  });
}

function conversationStatusLabel(status) {
  return { NEW: "Новое", ASSIGNED: "Назначено", WAITING_PLAYER: "Ожидает вашего ответа", WAITING_STAFF: "Ожидает ответа команды", UNDER_REVIEW: "На рассмотрении", APPROVED: "Одобрено", REJECTED: "Отклонено", CLOSED: "Закрыто" }[status] || status;
}

function conversationIsOpen(status) {
  return ["NEW", "ASSIGNED", "WAITING_PLAYER", "WAITING_STAFF", "UNDER_REVIEW"].includes(status);
}

async function loadConversations(force = false) {
  if (accountUi.conversationMeta && !force) { renderConversationViews(); return; }
  const response = await ElysiumAccount.apiFetch(accountGetShieldConfig().conversationsEndpoint || "/v1/profile/conversations", { method: "GET" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Не удалось загрузить обращения");
  accountUi.conversations = payload.items || [];
  accountUi.conversationMeta = payload;
  renderConversationViews();
}

function createConversationCard(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "account-conversation-card status-" + String(item.status).toLowerCase();
  button.innerHTML = `<span class="account-conversation-icon">${item.kind === "APPEAL" ? "⚖" : "✉"}</span><span class="account-conversation-copy"><strong>${accountEscape(item.subject)}</strong><small>${accountEscape(item.code)} · ${accountEscape(item.categoryLabel)}</small></span><span class="account-conversation-state"><b>${accountEscape(conversationStatusLabel(item.status))}</b><time>${accountEscape(formatAccountDate(item.updatedAt, true))}</time></span>`;
  button.addEventListener("click", () => openProfileConversation(item));
  return button;
}

function renderConversationViews() {
  const support = accountUi.conversations.filter((item) => item.kind === "SUPPORT");
  const supportList = document.getElementById("accountSupportList");
  supportList.replaceChildren();
  support.forEach((item) => supportList.appendChild(createConversationCard(item)));
  document.getElementById("accountSupportEmpty").hidden = support.length !== 0;
  const limits = accountUi.conversationMeta?.limits || {};
  const cooldownActive = Number(limits.supportNextCreateAt || 0) > Math.floor(Date.now() / 1000);
  const cooldownText = cooldownActive ? ` · новое с ${formatAccountDate(limits.supportNextCreateAt, true)}` : "";
  document.getElementById("accountSupportLimit").textContent = `${limits.supportOpen || 0} из ${limits.supportOpenLimit || 3} открытых · ${limits.supportCreated30Days || 0} из ${limits.supportCreated30DaysLimit || 10} за 30 дней${cooldownText}`;
  document.getElementById("accountSummarySupport").textContent = String(accountUi.conversations.filter((item) => conversationIsOpen(item.status)).length);
  const supportRestriction = accountUi.conversationMeta?.restrictions?.support;
  const supportRestrictionBox = document.getElementById("accountSupportRestriction");
  supportRestrictionBox.hidden = !supportRestriction;
  supportRestrictionBox.textContent = supportRestriction ? `Создание и отправка сообщений ограничены: ${supportRestriction.reason}${supportRestriction.expiresAt ? " · до " + formatAccountDate(supportRestriction.expiresAt, true) : " · бессрочно"}` : "";
  document.getElementById("accountSupportNew").disabled = Boolean(supportRestriction)
    || Number(limits.supportOpen || 0) >= Number(limits.supportOpenLimit || 3)
    || Number(limits.supportCreated30Days || 0) >= Number(limits.supportCreated30DaysLimit || 10)
    || cooldownActive;

  renderDecisions();
}

function collectDecisions() {
  const decisions = [];
  const profileRestriction = accountUi.payload?.profile?.restriction;
  if (profileRestriction) decisions.push({ type: "PROFILE", label: "Профиль Elysium", restriction: profileRestriction });
  for (const account of accountUi.payload?.accounts || []) if (account.restriction) decisions.push({ type: "MINECRAFT_ACCOUNT", label: account.playerName, restriction: account.restriction });
  return decisions;
}

function latestAppeal(decisionCode) {
  return accountUi.conversations.filter((item) => item.kind === "APPEAL" && item.decisionCode === decisionCode).sort((a, b) => b.attemptNumber - a.attemptNumber || b.id - a.id)[0] || null;
}

function renderDecisions() {
  const list = document.getElementById("accountDecisionList");
  list.replaceChildren();
  const decisions = collectDecisions();
  document.getElementById("accountDecisionEmpty").hidden = decisions.length !== 0;
  const appealRestriction = accountUi.conversationMeta?.restrictions?.appeal;
  const restrictionBox = document.getElementById("accountAppealRestriction");
  restrictionBox.hidden = !appealRestriction;
  restrictionBox.textContent = appealRestriction ? `Подача и отправка апелляций ограничены: ${appealRestriction.reason}${appealRestriction.expiresAt ? " · до " + formatAccountDate(appealRestriction.expiresAt, true) : " · бессрочно"}` : "";

  decisions.forEach((decision) => {
    const appeal = latestAppeal(decision.restriction.decisionCode);
    const card = document.createElement("article");
    card.className = "account-decision-card";
    let actionLabel = "Подать апелляцию";
    let disabled = Boolean(appealRestriction);
    if (appeal && conversationIsOpen(appeal.status)) actionLabel = "Открыть апелляцию";
    else if (appeal?.status === "APPROVED") { actionLabel = "Решение пересмотрено"; disabled = true; }
    else if (appeal?.status === "REJECTED") {
      const retryReady = appeal.retryAllowed && (!appeal.retryAvailableAt || appeal.retryAvailableAt <= Math.floor(Date.now() / 1000)) && appeal.attemptNumber < 2 && !appeal.finalDecision;
      if (retryReady) actionLabel = "Подать повторно";
      else if (appeal.retryAllowed && appeal.retryAvailableAt && appeal.retryAvailableAt > Math.floor(Date.now() / 1000)) actionLabel = `Повторно с ${formatAccountDate(appeal.retryAvailableAt)}`;
      else actionLabel = "Апелляция закрыта";
      disabled = disabled || !retryReady;
    }
    card.innerHTML = `<div class="account-decision-mark">⚖</div><div class="account-decision-copy"><span>${accountEscape(decision.label)}</span><strong>${accountEscape(decision.restriction.reason)}</strong><small>${accountEscape(decision.restriction.decisionCode)} · ${accountEscape(formatRestrictionExpiry(decision.restriction.expiresAt))}</small>${appeal ? `<em>${accountEscape(conversationStatusLabel(appeal.status))} · попытка ${appeal.attemptNumber}</em>` : ""}</div><button class="main-btn secondary account-small-action" type="button" aria-controls="accountAppealComposer" aria-expanded="false" ${disabled ? "disabled" : ""}>${accountEscape(actionLabel)}</button>`;
    const button = card.querySelector("button");
    if (!disabled) button.addEventListener("click", () => {
      if (appeal && conversationIsOpen(appeal.status)) openProfileConversation(appeal, "appeal").catch(showAccountError);
      else openAppealComposer(decision, button);
    });
    list.appendChild(card);
  });
}

function openSupportComposer(show) {
  document.getElementById("accountSupportComposer").hidden = !show;
  if (show) document.getElementById("accountSupportSubject").focus();
}

function setAppealComposerStatus(message, type = "info") {
  const status = document.getElementById("accountAppealStatus");
  if (!status) return;
  status.hidden = !message;
  status.className = `account-link-status ${type}`;
  status.textContent = message;
}

function appealMessageState(value) {
  const length = String(value || "").trim().length;
  return {
    length,
    remaining: Math.max(0, APPEAL_MESSAGE_MIN_LENGTH - length),
    valid: length >= APPEAL_MESSAGE_MIN_LENGTH && length <= APPEAL_MESSAGE_MAX_LENGTH
  };
}

function updateAppealComposerState() {
  const message = document.getElementById("accountAppealMessage");
  const hint = document.getElementById("accountAppealHint");
  const submit = document.getElementById("accountAppealSubmit");
  if (!message || !submit) return appealMessageState("");
  const state = appealMessageState(message.value);
  submit.disabled = !state.valid;
  if (hint) {
    hint.className = `account-field-hint ${state.valid ? "valid" : ""}`;
    hint.textContent = state.remaining
      ? `Ещё ${state.remaining} симв. до отправки`
      : `${state.length} / ${APPEAL_MESSAGE_MAX_LENGTH}`;
  }
  return state;
}

function openAppealComposer(decision, trigger = null) {
  const composer = document.getElementById("accountAppealComposer");
  composer.hidden = false;
  document.getElementById("accountAppealDecisionCode").value = decision.restriction.decisionCode;
  document.getElementById("accountAppealTitle").textContent = `Обжаловать ${decision.restriction.decisionCode}`;
  document.getElementById("accountAppealSubject").value = `Апелляция решения ${decision.restriction.decisionCode}`;
  document.getElementById("accountAppealMessage").value = "";
  updateAppealComposerState();
  document.querySelectorAll('[aria-controls="accountAppealComposer"]').forEach((button) => button.setAttribute("aria-expanded", button === trigger ? "true" : "false"));
  setAppealComposerStatus("Форма открыта. Опишите, почему решение нужно пересмотреть.");
  requestAnimationFrame(() => {
    composer.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("accountAppealMessage").focus({ preventScroll: true });
  });
}

async function createConversation(kind) {
  const isAppeal = kind === "APPEAL";
  const body = isAppeal ? {
    kind, decisionCode: document.getElementById("accountAppealDecisionCode").value,
    subject: document.getElementById("accountAppealSubject").value.trim(),
    message: document.getElementById("accountAppealMessage").value.trim()
  } : {
    kind, category: document.getElementById("accountSupportCategory").value,
    subject: document.getElementById("accountSupportSubject").value.trim(),
    message: document.getElementById("accountSupportMessage").value.trim()
  };
  if (isAppeal && !body.decisionCode) throw new Error("Не найден номер решения для апелляции.");
  if (isAppeal && body.message.length < APPEAL_MESSAGE_MIN_LENGTH) throw new Error(`Напишите обоснование апелляции — минимум ${APPEAL_MESSAGE_MIN_LENGTH} символов.`);
  if (isAppeal) setAppealComposerStatus("Отправляем апелляцию…", "loading");
  const result = await ElysiumAccount.authorizedMutation(accountGetShieldConfig().conversationsEndpoint || "/v1/profile/conversations", body);
  accountUi.conversationMeta = null;
  await loadConversations(true);
  if (isAppeal) {
    setAppealComposerStatus("Апелляция отправлена.", "success");
    document.getElementById("accountAppealComposer").hidden = true;
    const item = accountUi.conversations.find((entry) => entry.id === result.id);
    if (item) openProfileConversation(item, "appeal");
  } else {
    openSupportComposer(false);
    document.getElementById("accountSupportSubject").value = "";
    document.getElementById("accountSupportMessage").value = "";
    const item = accountUi.conversations.find((entry) => entry.id === result.id);
    if (item) openProfileConversation(item);
  }
}

async function openProfileConversation(item, target = item.kind === "APPEAL" ? "appeal" : "support") {
  const container = document.getElementById(target === "appeal" ? "accountAppealDetail" : "accountConversationDetail");
  container.hidden = false;
  container.innerHTML = `<div class="account-state-card"><div class="account-spinner"></div><div><strong>Загружаем переписку…</strong></div></div>`;
  const response = await ElysiumAccount.apiFetch(`${accountGetShieldConfig().conversationsEndpoint || "/v1/profile/conversations"}/${item.id}`, { method: "GET" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Не удалось открыть переписку");
  const c = data.conversation;
  const open = conversationIsOpen(c.status);
  container.innerHTML = `<div class="account-panel-head"><div><p class="account-kicker">${accountEscape(c.code)}</p><h2>${accountEscape(c.subject)}</h2><p>${accountEscape(conversationStatusLabel(c.status))}${c.decisionCode ? " · " + accountEscape(c.decisionCode) : ""}</p></div><button class="account-text-button" data-close-conversation type="button">Скрыть</button></div><div class="account-conversation-thread">${data.messages.map((message) => `<article class="account-message ${message.authorType.toLowerCase()}"><div><strong>${accountEscape(message.authorLabel)}</strong><time>${accountEscape(formatAccountDate(message.createdAt, true))}</time></div>${accountMessageMarkup(message)}</article>`).join("")}</div>${open ? `<div class="account-conversation-reply"><textarea maxlength="4000" placeholder="Напишите ответ"></textarea><button class="main-btn green" type="button">Отправить</button>${c.kind === "SUPPORT" ? `<button class="account-text-button danger" data-close-support type="button">Закрыть обращение</button>` : ""}</div>` : `<div class="account-conversation-resolution">${accountEscape(c.resolution || "Переписка завершена.")}</div>`}`;
  container.querySelector("[data-close-conversation]").addEventListener("click", () => { container.hidden = true; });
  if (open) {
    const textarea = container.querySelector("textarea");
    const send = container.querySelector(".account-conversation-reply .main-btn");
    send.addEventListener("click", async () => {
      const message = textarea.value.trim();
      if (!message) return;
      send.disabled = true;
      try {
        await ElysiumAccount.authorizedMutation(`${accountGetShieldConfig().conversationsEndpoint || "/v1/profile/conversations"}/${c.id}/messages`, { message });
        accountUi.conversationMeta = null; await loadConversations(true); await openProfileConversation(accountUi.conversations.find((entry) => entry.id === c.id) || c, target);
      } catch (error) { showAccountError(error); send.disabled = false; }
    });
    container.querySelector("[data-close-support]")?.addEventListener("click", async () => {
      if (!confirm("Закрыть это обращение?")) return;
      try { await ElysiumAccount.authorizedMutation(`${accountGetShieldConfig().conversationsEndpoint || "/v1/profile/conversations"}/${c.id}/close`, {}); accountUi.conversationMeta = null; await loadConversations(true); container.hidden = true; }
      catch (error) { showAccountError(error); }
    });
  }
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadSessions(force = false) {
  if (accountUi.sessions.length && !force) { renderSessions(); return; }
  const response = await ElysiumAccount.apiFetch(accountGetShieldConfig().sessionsEndpoint || "/v1/profile/sessions", { method: "GET" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Не удалось загрузить сеансы");
  accountUi.sessions = payload.items || [];
  renderSessions();
}

function renderSessions() {
  const list = document.getElementById("accountSessionList");
  list.replaceChildren();
  accountUi.sessions.forEach((session, index) => {
    const row = document.createElement("article");
    row.className = "account-session-card" + (session.current ? " current" : "");
    row.innerHTML = `<div class="account-session-icon">${session.current ? "✓" : "⌁"}</div><div><strong>${session.current ? "Текущий сеанс" : `Сеанс ${index + 1}`}</strong><span>Активность: ${accountEscape(formatAccountDate(session.lastSeenAt, true))} · создан ${accountEscape(formatAccountDate(session.createdAt, true))}</span></div>${session.current ? `<span class="account-session-current">Текущий</span>` : `<button class="main-btn secondary account-small-action" type="button">Завершить</button>`}`;
    row.querySelector("button")?.addEventListener("click", async () => {
      try { await ElysiumAccount.authorizedMutation(`${accountGetShieldConfig().sessionsEndpoint || "/v1/profile/sessions"}/${session.id}/revoke`, {}); accountUi.sessions = []; await loadSessions(true); }
      catch (error) { showAccountError(error); }
    });
    list.appendChild(row);
  });
  document.getElementById("accountSessionEmpty").hidden = accountUi.sessions.length !== 0;
  document.getElementById("accountSummarySessions").textContent = String(accountUi.sessions.length || "—");
  document.getElementById("accountSessionsRevokeOthers").disabled = accountUi.sessions.filter((session) => !session.current).length === 0;
}

function initAccountActions() {
  document.querySelectorAll("[data-account-tab]").forEach((button) => button.addEventListener("click", () => activateAccountTab(button.dataset.accountTab)));
  document.querySelectorAll("[data-account-open-tab]").forEach((button) => button.addEventListener("click", () => activateAccountTab(button.dataset.accountOpenTab)));
  document.getElementById("accountSupportNew")?.addEventListener("click", () => openSupportComposer(true));
  document.getElementById("accountSupportCancel")?.addEventListener("click", () => openSupportComposer(false));
  document.getElementById("accountSupportSubmit")?.addEventListener("click", async (event) => { event.currentTarget.disabled = true; try { await createConversation("SUPPORT"); } catch (error) { showAccountError(error); } finally { event.currentTarget.disabled = false; } });
  document.getElementById("accountAppealCancel")?.addEventListener("click", () => {
    document.getElementById("accountAppealComposer").hidden = true;
    document.querySelectorAll('[aria-controls="accountAppealComposer"]').forEach((button) => button.setAttribute("aria-expanded", "false"));
    setAppealComposerStatus("");
  });
  const appealComposer = document.getElementById("accountAppealComposer");
  const appealMessage = document.getElementById("accountAppealMessage");
  appealMessage?.addEventListener("input", () => {
    const state = updateAppealComposerState();
    setAppealComposerStatus(
      state.valid ? "Форма готова к отправке." : `Добавьте ещё ${state.remaining} симв. в обоснование.`,
      state.valid ? "success" : "info"
    );
  });
  appealComposer?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const state = updateAppealComposerState();
    if (!state.valid) {
      setAppealComposerStatus(`Добавьте ещё ${state.remaining} симв. в обоснование.`, "error");
      appealMessage?.focus();
      return;
    }
    const submit = document.getElementById("accountAppealSubmit");
    const originalLabel = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Отправляем…";
    try {
      await createConversation("APPEAL");
    } catch (error) {
      setAppealComposerStatus(error?.message || "Не удалось отправить апелляцию.", "error");
      showAccountError(error);
    } finally {
      submit.textContent = originalLabel;
      updateAppealComposerState();
    }
  });
  document.getElementById("accountSessionsRevokeOthers")?.addEventListener("click", async () => {
    if (!confirm("Завершить все остальные сеансы?")) return;
    try { await ElysiumAccount.authorizedMutation((accountGetShieldConfig().sessionsEndpoint || "/v1/profile/sessions") + "/revoke-others", {}); accountUi.sessions = []; await loadSessions(true); }
    catch (error) { showAccountError(error); }
  });
}

async function initAccountPage() {
  const page = document.getElementById("accountView");
  if (!page || page.dataset.ready === "true") return;
  page.dataset.ready = "true";
  const notice = document.getElementById("accountAuthNotice");
  const result = authResultMessage(getAccountAuthResult());
  if (result) setAccountNotice(notice, result[0], result[1]);
  document.getElementById("accountLoginButton")?.addEventListener("click", () => ElysiumAccount.beginTelegramLogin());
  document.getElementById("accountLogoutButton")?.addEventListener("click", async (event) => {
    event.currentTarget.disabled = true;
    try {
      await ElysiumAccount.logout();
      accountUi.payload = null; accountUi.conversations = []; accountUi.conversationMeta = null; accountUi.sessions = [];
      updateAccountEntry(null); showAccountState("guest"); setAccountNotice(notice, "Вы вышли из аккаунта.", "success");
    } catch (error) { showAccountError(error); }
    finally { event.currentTarget.disabled = false; }
  });
  initAccountActions();
  showAccountState("loading");
  const payload = await ElysiumAccount.loadSession(true);
  updateAccountEntry(payload);
  if (!payload) {
    showAccountState("guest");
    if (ElysiumAccount.getLastError() && !result) setAccountNotice(notice, "Не удалось связаться с Elysium Shield.", "error");
    return;
  }
  renderAccountDashboard(payload);
  showAccountState("dashboard");
  initAccountLinking();
  initActivityPreferences();
  loadConversations().catch(() => {});
  loadSessions().catch(() => {});
}

function initAccountExperience() {
  const entry = document.getElementById("accountEntry");
  if (entry) ElysiumAccount.loadSession().then(updateAccountEntry);
  initAccountPage();
}
