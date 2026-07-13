const ElysiumAccount = (() => {
  let session = undefined;
  let sessionPromise = null;
  let lastError = null;

  function config() {
    return window.ELYSIUM_SHIELD_CONFIG || {};
  }

  function apiUrl(path) {
    return String(config().apiBase || "").replace(/\/+$/, "") + path;
  }

  async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    return fetch(apiUrl(path), {
      ...options,
      headers,
      credentials: "include"
    });
  }

  async function loadSession(force = false) {
    if (!force && session !== undefined) {
      return session;
    }

    if (!force && sessionPromise) {
      return sessionPromise;
    }

    sessionPromise = (async () => {
      lastError = null;

      try {
        const response = await apiFetch(
          config().profileEndpoint || "/v1/profile/me",
          {
            method: "GET"
          }
        );

        if (response.status === 401) {
          session = null;
          return session;
        }

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || payload.authenticated !== true) {
          throw new Error(payload.message || "Личный кабинет временно недоступен");
        }

        session = payload;
        return session;
      } catch (error) {
        lastError = error;
        session = null;
        return session;
      } finally {
        sessionPromise = null;
      }
    })();

    return sessionPromise;
  }

  function beginTelegramLogin(returnUrl = "") {
    const endpoint = config().telegramLoginEndpoint || "/v1/auth/telegram/start";
    const destination = returnUrl ||
      location.origin + location.pathname + "#account";
    const target = apiUrl(endpoint) +
      "?returnUrl=" + encodeURIComponent(destination);

    location.assign(target);
  }

  async function logout() {
    const current = await loadSession();
    if (!current?.csrfToken) return;

    const response = await apiFetch(
      config().logoutEndpoint || "/v1/profile/logout",
      {
        method: "POST",
        headers: {
          "X-Elysium-CSRF": current.csrfToken
        }
      }
    );

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || "Не удалось выйти из аккаунта");
    }

    session = null;
  }

  return {
    loadSession,
    refresh: () => loadSession(true),
    beginTelegramLogin,
    logout,
    getSnapshot: () => session,
    getCsrfToken: () => session?.csrfToken || "",
    getLastError: () => lastError,
    apiFetch,
    apiUrl
  };
})();

window.ElysiumAccount = ElysiumAccount;

function getAccountAuthResult() {
  const rawHash = location.hash.replace(/^#/, "");
  const queryIndex = rawHash.indexOf("?");
  if (queryIndex === -1) return "";

  const params = new URLSearchParams(rawHash.slice(queryIndex + 1));
  return String(params.get("auth") || "");
}

function setAccountNotice(element, text, type = "info") {
  if (!element) return;
  element.hidden = !text;
  element.className = "account-notice " + type;
  element.textContent = text;
}

function accountInitials(name) {
  const parts = String(name || "E")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "E";
}

function renderAccountAvatar(container, profile, compact = false) {
  if (!container) return;
  container.innerHTML = "";

  if (profile?.avatarUrl) {
    const image = document.createElement("img");
    image.src = profile.avatarUrl;
    image.alt = "";
    image.referrerPolicy = "no-referrer";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      container.textContent = accountInitials(profile.displayName);
    }, { once: true });
    container.appendChild(image);
    return;
  }

  container.textContent = compact ? "✦" : accountInitials(profile?.displayName);
}

function updateAccountEntry(payload) {
  const entry = document.getElementById("accountEntry");
  if (!entry) return;

  const avatar = entry.querySelector("[data-account-avatar]");
  const title = entry.querySelector("[data-account-entry-title]");
  const subtitle = entry.querySelector("[data-account-entry-subtitle]");
  const action = entry.matches("[data-account-entry-action]")
    ? entry
    : entry.querySelector("[data-account-entry-action]");

  if (!avatar || !title || !subtitle || !action) return;

  if (action.dataset.ready !== "true") {
    action.dataset.ready = "true";
    action.addEventListener("click", () => {
      if (ElysiumAccount.getSnapshot()) {
        render("account");
      } else {
        ElysiumAccount.beginTelegramLogin();
      }
    });
  }

  if (payload?.authenticated) {
    entry.classList.add("authenticated");
    renderAccountAvatar(avatar, payload.profile, true);
    title.textContent = payload.profile.displayName || "Telegram";
    subtitle.textContent =
      "Кабинет · " +
      payload.limits.used +
      " из " +
      payload.limits.accountLimit;
    action.dataset.accountEntryAction = "account";
    action.setAttribute("aria-label", "Открыть личный кабинет");
  } else {
    entry.classList.remove("authenticated");
    avatar.textContent = "✦";
    title.textContent = "Войти";
    subtitle.textContent = "через Telegram";
    action.dataset.accountEntryAction = "login";
    action.setAttribute("aria-label", "Войти через Telegram");
  }
}

function setAccountLinkStatus(element, text, type = "info") {
  if (!element) return;
  element.className = "account-link-status " + type;
  element.textContent = text;
}

function formatAccountDate(timestamp) {
  const value = Number(timestamp || 0);
  if (!value) return "дата неизвестна";

  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(value * 1000));
  } catch {
    return "дата неизвестна";
  }
}

function createMinecraftAccountCard(account) {
  const card = document.createElement("article");
  card.className = "minecraft-account-card";

  const mark = document.createElement("div");
  mark.className = "minecraft-account-mark";
  mark.textContent = "◆";

  const copy = document.createElement("div");
  copy.className = "minecraft-account-copy";

  const name = document.createElement("strong");
  name.textContent = account.playerName;

  const meta = document.createElement("span");
  meta.textContent =
    "Подтверждён " + formatAccountDate(account.verifiedAt) +
    " · " + (account.source === "TELEGRAM_BOT" ? "Telegram-бот" : "Сайт");

  const status = document.createElement("div");
  status.className = "minecraft-account-status";
  status.textContent = "Активен";

  copy.append(name, meta);
  card.append(mark, copy, status);
  return card;
}

function renderAccountDashboard(payload) {
  const avatar = document.getElementById("accountAvatar");
  const displayName = document.getElementById("accountDisplayName");
  const username = document.getElementById("accountUsername");
  const limitBadge = document.getElementById("accountLimitBadge");
  const list = document.getElementById("accountList");
  const empty = document.getElementById("accountEmpty");

  renderAccountAvatar(avatar, payload.profile);
  displayName.textContent = payload.profile.displayName || "Telegram";
  username.textContent = payload.profile.username
    ? "@" + payload.profile.username
    : "Telegram-профиль";
  limitBadge.textContent =
    payload.limits.used + " из " + payload.limits.accountLimit;

  list.innerHTML = "";
  payload.accounts.forEach((account) => {
    list.appendChild(createMinecraftAccountCard(account));
  });

  empty.hidden = payload.accounts.length !== 0;
}

function showAccountState(name) {
  const loading = document.getElementById("accountLoading");
  const guest = document.getElementById("accountGuest");
  const dashboard = document.getElementById("accountDashboard");

  if (loading) loading.hidden = name !== "loading";
  if (guest) guest.hidden = name !== "guest";
  if (dashboard) dashboard.hidden = name !== "dashboard";
}

function authResultMessage(result) {
  const messages = {
    success: ["Вход через Telegram выполнен.", "success"],
    cancelled: ["Вход через Telegram был отменён.", "warning"],
    expired: ["Запрос на вход истёк. Попробуйте ещё раз.", "warning"],
    replayed: ["Этот запрос на вход уже был использован.", "error"],
    blocked: ["Профиль заблокирован. Обратитесь к администрации.", "error"],
    rate_limited: ["Слишком много попыток входа. Подождите минуту.", "warning"],
    unavailable: ["Авторизация Telegram пока не настроена.", "warning"],
    invalid_callback: ["Telegram вернул некорректный ответ.", "error"],
    failed: ["Не удалось завершить вход через Telegram.", "error"]
  };

  return messages[result] || null;
}

async function initAccountLinking() {
  const input = document.getElementById("accountLinkCode");
  const button = document.getElementById("accountLinkButton");
  const turnstileBox = document.getElementById("accountTurnstile");
  const status = document.getElementById("accountLinkStatus");
  const retry = document.getElementById("accountLinkRetry");

  if (!input || !button || button.dataset.ready === "true") return;
  button.dataset.ready = "true";

  input.addEventListener("input", () => {
    const normalized = normalizeShieldCode(input.value);
    if (input.value !== normalized) input.value = normalized;
  });

  const reset = () => {
    input.disabled = false;
    button.disabled = false;
    turnstileBox.hidden = true;
    turnstileBox.innerHTML = "";
    retry.hidden = true;
    setAccountLinkStatus(status, "Введите новый код Elysium Shield.", "info");
    input.focus();
  };

  const begin = async () => {
    const code = normalizeShieldCode(input.value);
    input.value = code;

    if (!/^[A-Z0-9]{4}-?[A-Z0-9]{2}$/.test(code)) {
      setAccountLinkStatus(status, "Введите код в формате K7P4-XM.", "error");
      input.focus();
      return;
    }

    const current = await ElysiumAccount.loadSession();
    if (!current?.csrfToken) {
      setAccountLinkStatus(status, "Сессия истекла. Войдите повторно.", "error");
      return;
    }

    button.disabled = true;
    input.disabled = true;
    retry.hidden = true;
    setAccountLinkStatus(status, "Загружаем Cloudflare Turnstile…", "loading");

    try {
      const turnstile = await loadTurnstileScript();
      turnstileBox.hidden = false;
      turnstileBox.innerHTML = "";

      turnstile.render(turnstileBox, {
        sitekey: getShieldConfig().turnstileSiteKey,
        theme: "dark",
        size: "flexible",
        callback: async (token) => {
          setAccountLinkStatus(status, "Привязываем Minecraft-ник…", "loading");

          try {
            const response = await ElysiumAccount.apiFetch(
              getShieldConfig().verifyEndpoint || "/v1/site/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Elysium-CSRF": current.csrfToken
                },
                body: JSON.stringify({ code, token })
              }
            );

            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.status !== "VERIFIED") {
              throw new Error(result.message || "Не удалось привязать код");
            }

            const refreshed = await ElysiumAccount.refresh();
            if (!refreshed?.authenticated) {
              throw new Error("Сессия истекла. Войдите через Telegram ещё раз.");
            }

            renderAccountDashboard(refreshed);
            updateAccountEntry(refreshed);
            setAccountLinkStatus(
              status,
              "Готово ✓ Ник добавлен в ваш профиль. Вернитесь в Minecraft.",
              "success"
            );
            retry.hidden = true;
            button.disabled = false;
            input.disabled = false;
            input.value = "";
            turnstileBox.hidden = true;
            turnstileBox.innerHTML = "";
          } catch (error) {
            setAccountLinkStatus(
              status,
              error?.message || "Не удалось привязать код.",
              "error"
            );
            retry.hidden = false;
          }
        },
        "expired-callback": () => {
          setAccountLinkStatus(status, "Проверка истекла. Повторите её.", "warning");
          retry.hidden = false;
        },
        "error-callback": () => {
          setAccountLinkStatus(status, "Cloudflare не завершила проверку.", "error");
          retry.hidden = false;
        }
      });
    } catch {
      setAccountLinkStatus(status, "Не удалось загрузить Turnstile.", "error");
      retry.hidden = false;
    }
  };

  button.addEventListener("click", begin);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      begin();
    }
  });
  retry.addEventListener("click", reset);
}

async function initAccountPage() {
  const page = document.getElementById("accountView");
  if (!page || page.dataset.ready === "true") return;
  page.dataset.ready = "true";

  const notice = document.getElementById("accountAuthNotice");
  const login = document.getElementById("accountLoginButton");
  const logout = document.getElementById("accountLogoutButton");
  const result = authResultMessage(getAccountAuthResult());

  if (result) setAccountNotice(notice, result[0], result[1]);

  login?.addEventListener("click", () => ElysiumAccount.beginTelegramLogin());
  logout?.addEventListener("click", async () => {
    logout.disabled = true;

    try {
      await ElysiumAccount.logout();
      updateAccountEntry(null);
      showAccountState("guest");
      setAccountNotice(notice, "Вы вышли из аккаунта.", "success");
    } catch (error) {
      setAccountNotice(notice, error?.message || "Не удалось выйти.", "error");
    } finally {
      logout.disabled = false;
    }
  });

  showAccountState("loading");
  const payload = await ElysiumAccount.loadSession(true);
  updateAccountEntry(payload);

  if (!payload) {
    showAccountState("guest");

    if (ElysiumAccount.getLastError() && !result) {
      setAccountNotice(
        notice,
        "Не удалось связаться с Elysium Shield. Проверьте доступность сервиса.",
        "error"
      );
    }
    return;
  }

  renderAccountDashboard(payload);
  showAccountState("dashboard");
  initAccountLinking();
}

function initAccountExperience() {
  const entry = document.getElementById("accountEntry");

  if (entry) {
    ElysiumAccount.loadSession().then(updateAccountEntry);
  }

  initAccountPage();
}
