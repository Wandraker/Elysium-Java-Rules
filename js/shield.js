function getShieldConfig() {
  return window.ELYSIUM_SHIELD_CONFIG || {};
}

function getShieldCodeFromHash() {
  const rawHash = location.hash.replace(/^#/, "");
  const queryIndex = rawHash.indexOf("?");

  if (queryIndex === -1) return "";

  const params = new URLSearchParams(rawHash.slice(queryIndex + 1));
  return normalizeShieldCode(params.get("code") || "");
}

function normalizeShieldCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 32);
}

function setShieldStatus(element, text, type = "info") {
  element.className = "shield-status " + type;
  element.textContent = text;
}

function setShieldStep(name) {
  document.querySelectorAll("[data-shield-step]").forEach((element) => {
    const current = element.dataset.shieldStep;
    element.classList.toggle("active", current === name);
    element.classList.toggle(
      "done",
      (name === "human" && current === "code") ||
      (name === "done" && (current === "code" || current === "human"))
    );
  });
}

function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (window.__elysiumTurnstilePromise) {
    return window.__elysiumTurnstilePromise;
  }

  window.__elysiumTurnstilePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        reject(new Error("Turnstile API unavailable"));
      }
    };

    script.onerror = () => reject(new Error("Turnstile script failed"));
    document.head.appendChild(script);
  });

  return window.__elysiumTurnstilePromise;
}

async function getShieldAccountSession() {
  if (!window.ElysiumAccount) return null;
  return await window.ElysiumAccount.loadSession();
}

async function submitShieldToken(code, token, status, retryButton) {
  const config = getShieldConfig();
  const endpoint = String(config.apiBase || "").replace(/\/+$/, "")
    + String(config.verifyEndpoint || "/v1/site/verify");

  setShieldStatus(status, "Подтверждаем проверку…", "loading");

  try {
    const session = await getShieldAccountSession();

    if (!session?.authenticated || !session?.csrfToken) {
      throw new Error("Сначала войдите через Telegram.");
    }

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Elysium-CSRF": session.csrfToken
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ code, token })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || payload.reason || "Сервис временно недоступен");
    }

    if (String(payload.status || "").toUpperCase() !== "VERIFIED") {
      throw new Error(payload.message || payload.reason || "Код не был подтверждён");
    }

    if (payload.linked === true && window.ElysiumAccount) {
      await window.ElysiumAccount.refresh();
    }

    setShieldStep("done");
    setShieldStatus(
      status,
      payload.linked === true
        ? "Проверка пройдена ✓ Ник привязан к вашему профилю. Вернитесь в Minecraft и подключитесь повторно."
        : "Проверка пройдена ✓ Вернитесь в Minecraft и подключитесь к серверу повторно.",
      "success"
    );
    retryButton.hidden = true;
  } catch (error) {
    setShieldStatus(
      status,
      error && error.message
        ? error.message
        : "Не удалось связаться с Elysium Shield. Повторите позже.",
      "error"
    );
    retryButton.hidden = false;
  }
}

function updateVerifyAccountHint(session) {
  const hint = document.getElementById("shieldAccountHint");
  const action = document.getElementById("shieldAccountAction");
  if (!hint || !action) return;

  const startButton = document.getElementById("shieldStartButton");
  const verificationContent = document.getElementById("shieldVerificationContent");

  if (session?.authenticated) {
    if (verificationContent) verificationContent.hidden = false;
    hint.className = "shield-account-hint authenticated";
    hint.querySelector("strong").textContent =
      "Вы вошли как " + (session.profile?.displayName || "Telegram");
    hint.querySelector("span").textContent =
      "После проверки Minecraft-ник автоматически появится в личном кабинете.";
    action.textContent = "Открыть кабинет";
    action.onclick = () => render("account");
    if (startButton) startButton.disabled = false;
  } else {
    if (verificationContent) verificationContent.hidden = true;
    hint.className = "shield-account-hint required";
    hint.querySelector("strong").textContent = "Требуется вход через Telegram";
    hint.querySelector("span").textContent =
      "Без Telegram-профиля подтвердить новый Minecraft-ник нельзя.";
    action.textContent = "Войти через Telegram";
    action.onclick = () => window.ElysiumAccount?.beginTelegramLogin(location.href);
    if (startButton) startButton.disabled = true;
  }
}

function initShieldVerification() {
  const view = document.getElementById("verifyView");
  if (!view || view.dataset.ready === "true") return;

  view.dataset.ready = "true";

  const config = getShieldConfig();
  const input = document.getElementById("shieldCode");
  const startButton = document.getElementById("shieldStartButton");
  const turnstileBox = document.getElementById("shieldTurnstile");
  const status = document.getElementById("shieldStatus");
  const retryButton = document.getElementById("shieldRetryButton");

  getShieldAccountSession().then(updateVerifyAccountHint);

  const initialCode = getShieldCodeFromHash();
  if (initialCode) {
    input.value = initialCode;
    setShieldStatus(status, "Код найден. Нажмите «Продолжить».", "info");
  }

  input.addEventListener("input", () => {
    const normalized = normalizeShieldCode(input.value);
    if (input.value !== normalized) {
      input.value = normalized;
    }
  });

  const begin = async () => {
    const session = await getShieldAccountSession();

    if (!session?.authenticated) {
      setShieldStatus(
        status,
        "Сначала войдите через Telegram, затем подтвердите код.",
        "warning"
      );
      return;
    }

    const code = normalizeShieldCode(input.value);
    input.value = code;

    if (!/^[A-Z0-9]{4}-?[A-Z0-9]{2}$/.test(code)) {
      setShieldStatus(status, "Введите код в формате K7P4-XM.", "error");
      input.focus();
      return;
    }

    if (!config.enabled || !config.turnstileSiteKey) {
      setShieldStatus(
        status,
        "Elysium Shield уже добавлен на сайт, но серверная проверка пока настраивается.",
        "warning"
      );
      return;
    }

    startButton.disabled = true;
    input.disabled = true;
    retryButton.hidden = true;
    setShieldStep("human");
    setShieldStatus(status, "Загружаем защищённую проверку Cloudflare…", "loading");

    try {
      const turnstile = await loadTurnstileScript();
      turnstileBox.hidden = false;
      turnstileBox.innerHTML = "";

      turnstile.render(turnstileBox, {
        sitekey: config.turnstileSiteKey,
        theme: "dark",
        size: "flexible",
        callback: (token) => submitShieldToken(code, token, status, retryButton),
        "expired-callback": () => {
          setShieldStatus(status, "Проверка истекла. Пройдите её ещё раз.", "warning");
          retryButton.hidden = false;
        },
        "error-callback": () => {
          setShieldStatus(status, "Cloudflare не смогла завершить проверку.", "error");
          retryButton.hidden = false;
        }
      });
    } catch {
      setShieldStatus(status, "Не удалось загрузить Cloudflare Turnstile.", "error");
      retryButton.hidden = false;
    }
  };

  startButton.addEventListener("click", begin);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      begin();
    }
  });

  retryButton.addEventListener("click", () => {
    startButton.disabled = false;
    input.disabled = false;
    turnstileBox.hidden = true;
    turnstileBox.innerHTML = "";
    retryButton.hidden = true;
    setShieldStep("code");
    setShieldStatus(status, "Проверьте код и попробуйте ещё раз.", "info");
    input.focus();
  });
}
