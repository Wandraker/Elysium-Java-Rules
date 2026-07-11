const app = document.getElementById("app");

const routeAliases = {
      "elysium": "elysium",
      "home": "elysium",
      "rules": "rules",
      "elysium-start": "start",
      "java-rules": "java",
      "bedrock-rules": "bedrock",
      "chat-rules": "chat",
      "java": "java",
      "bedrock": "bedrock",
      "chat": "chat",
      "donate": "donate",
      "support": "donate",
      "verify": "verify",
      "shield": "verify"
    };

    const routeHashes = {
      "elysium": "elysium",
      "rules": "rules",
      "start": "elysium-start",
      "java": "java-rules",
      "bedrock": "bedrock-rules",
      "chat": "chat-rules",
      "donate": "donate",
      "verify": "verify"
    };

    function normalizeRoute(target) {
      return routeAliases[String(target || "elysium").replace("#", "").split("?")[0].toLowerCase()] || "elysium";
    }

function render(target, updateHash = true, options = {}) {
      const key = normalizeRoute(target);
      const now = Date.now();

      if (window.__elysiumRenderBusy === true) return;

      if (!options.force && now < window.__elysiumRenderCooldownUntil) return;

      if (!options.force && updateHash && key === window.__elysiumCurrentRoute) {
        setRenderCooldown(420);
        return;
      }

      window.__elysiumRenderBusy = true;
      setRenderCooldown(options.initial === true ? 260 : 520);

      document.body.classList.remove("homepage-intro-locked");

      if (key === "elysium") {
        app.innerHTML = elysiumView();
      } else if (key === "rules") {
        app.innerHTML = rulesView();
      } else if (key === "start") {
        app.innerHTML = startView();
      } else if (key === "donate") {
        app.innerHTML = donateView();
      } else if (key === "verify") {
        app.innerHTML = verifyView();
      } else {
        app.innerHTML = sectionView(key);
      }

      window.__elysiumCurrentRoute = key;

      document.querySelectorAll("[data-target]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          render(button.dataset.target);
        });
      });

      initHomepageMotion();
      initCopyButtons();
      initAmbientEffects(key);
      initExternalTransfer();
      initShieldVerification();

      if (updateHash) {
        const nextHash = "#" + routeHashes[key];

        if (location.hash !== nextHash) {
          history.pushState(null, "", nextHash);
        }
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: options.initial === true ? "auto" : "smooth"
      });

      window.setTimeout(() => {
        window.__elysiumRenderBusy = false;
      }, 90);
    }

    function fromHash() {
      const hash = location.hash.replace("#", "").split("?")[0].toLowerCase();
      return normalizeRoute(hash || "elysium");
    }

    window.addEventListener("popstate", () => render(fromHash(), false, { force: true }));

    window.addEventListener("pageshow", () => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });

    render(fromHash(), false, { initial: true, force: true });
