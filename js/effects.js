function initStaffCarousel() {
      document.querySelectorAll(".staff-carousel").forEach((carousel) => {
        if (carousel.dataset.dragReady === "true") return;
        carousel.dataset.dragReady = "true";

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        carousel.addEventListener("pointerdown", (event) => {
          isDown = true;
          startX = event.clientX;
          scrollLeft = carousel.scrollLeft;
          carousel.classList.add("dragging");
          carousel.setPointerCapture(event.pointerId);
        });

        carousel.addEventListener("pointermove", (event) => {
          if (!isDown) return;
          const delta = event.clientX - startX;
          carousel.scrollLeft = scrollLeft - delta;
        });

        function stopDrag(event) {
          if (!isDown) return;
          isDown = false;
          carousel.classList.remove("dragging");

          try {
            carousel.releasePointerCapture(event.pointerId);
          } catch (error) {}
        }

        carousel.addEventListener("pointerup", stopDrag);
        carousel.addEventListener("pointercancel", stopDrag);
        carousel.addEventListener("pointerleave", stopDrag);
      });
    }

    function initIntroScrollLock() {
      if (window.__elysiumIntroScrollLockReady === true) return;
      window.__elysiumIntroScrollLockReady = true;

      const shouldBlock = () => document.body.classList.contains("homepage-intro-locked");

      const block = (event) => {
        if (!shouldBlock()) return;
        event.preventDefault();
      };

      window.addEventListener("wheel", block, { passive: false });
      window.addEventListener("touchmove", block, { passive: false });

      window.addEventListener("keydown", (event) => {
        if (!shouldBlock()) return;

        const blockedKeys = [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " "
        ];

        if (blockedKeys.includes(event.key)) {
          event.preventDefault();
        }
      }, { passive: false });
    }

    function markIntroButtonUsed(options = {}) {
      const view = document.querySelector("#elysiumView");
      const hero = view?.querySelector(".hero-front");
      const actions = view?.querySelector(".hero-actions");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const useGlitch = options.glitch === true && !reducedMotion && hero && window.__elysiumIntroUsed !== true;

      window.__elysiumIntroUsed = true;

      const finish = () => {
        document.body.classList.remove("homepage-intro-locked");
        view?.classList.remove("intro-scroll-locked");

        actions?.classList.add("intro-hidden");
        hero?.classList.remove("glitching");
        hero?.classList.add("intro-used");

        if (typeof options.after === "function") {
          options.after();
        }
      };

      if (!view) {
        finish();
        return;
      }

      if (useGlitch) {
        hero.classList.add("glitching");
        window.setTimeout(finish, 620);
        return;
      }

      finish();
    }

    function applyIntroButtonState() {
      const view = document.querySelector("#elysiumView");

      if (!view) {
        document.body.classList.remove("homepage-intro-locked");
        return;
      }

      if (window.__elysiumIntroUsed === true) {
        document.body.classList.remove("homepage-intro-locked");
        view.classList.remove("intro-scroll-locked");
        view.querySelector(".hero-actions")?.classList.add("intro-hidden");
        view.querySelector(".hero-front")?.classList.add("intro-used");
        return;
      }

      document.body.classList.add("homepage-intro-locked");
      view.classList.add("intro-scroll-locked");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    function initHomepageMotion() {
      initIntroScrollLock();
      applyIntroButtonState();

      document.querySelectorAll("[data-scroll-target]").forEach((button) => {
        if (button.dataset.scrollReady === "true") return;
        button.dataset.scrollReady = "true";

        button.addEventListener("click", () => {
          const target = document.querySelector(button.dataset.scrollTarget);
          if (!target) return;

          markIntroButtonUsed({
            glitch: true,
            after: () => {
              target.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "start"
              });
            }
          });
        });
      });

      const items = document.querySelectorAll("#elysiumView .home-card, #elysiumView .team-section, #elysiumView .staff-card");

      if (!items.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      items.forEach((item, index) => {
        item.classList.add("reveal-item");
        item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      });

      items.forEach((item) => observer.observe(item));
    }

    try {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    } catch (error) {}

    window.__elysiumCurrentRoute = null;
    window.__elysiumRenderBusy = false;
    window.__elysiumRenderCooldownUntil = 0;

    function setRenderCooldown(ms = 520) {
      window.__elysiumRenderCooldownUntil = Date.now() + ms;

      document.querySelectorAll("[data-target]").forEach((button) => {
        button.classList.add("is-cooling");
        button.disabled = true;
      });

      window.setTimeout(() => {
        document.querySelectorAll("[data-target]").forEach((button) => {
          button.classList.remove("is-cooling");
          button.disabled = false;
        });
      }, ms);
    }

    function initExternalTransfer() {
      document.querySelectorAll("[data-transfer-node]").forEach((link) => {
        if (link.dataset.transferReady === "true") return;
        link.dataset.transferReady = "true";

        link.addEventListener("click", (event) => {
          event.preventDefault();
          const href = link.getAttribute("href");
          if (!href) return;
          runExternalTransfer(href, link.dataset.transferNode || "External Node");
        });
      });
    }

    function runExternalTransfer(url, nodeName) {
      let screen = document.querySelector(".transfer-screen");

      if (!screen) {
        screen = document.createElement("div");
        screen.className = "transfer-screen";
        screen.innerHTML = `
          <div class="transfer-box" role="dialog" aria-modal="true" aria-label="Переход на внешний узел">
            <div class="transfer-head">
              <div class="transfer-title">
                <b>ELYSIUM TRANSFER NODE</b>
                <span>Внешний маршрут оплаты</span>
              </div>
              <div class="transfer-status"><span class="loader"></span></div>
            </div>
            <div class="transfer-body">
              <div class="transfer-node">
                <span>Целевой узел</span>
                <code class="transfer-url"></code>
              </div>
              <div class="transfer-lines">
                <div class="transfer-line" data-step="0">&gt; подготовка защищённого перехода...</div>
                <div class="transfer-line" data-step="1">&gt; проверка узла оплаты...</div>
                <div class="transfer-line" data-step="2">&gt; маршрут подтверждён ✓</div>
                <div class="transfer-line" data-step="3">&gt; выполняется перемещение...</div>
              </div>
              <div class="transfer-progress"><span></span></div>
              <button class="transfer-cancel" type="button">Отменить переход</button>
            </div>
          </div>
        `;
        document.body.appendChild(screen);
      }

      const status = screen.querySelector(".transfer-status");
      const urlBox = screen.querySelector(".transfer-url");
      const progress = screen.querySelector(".transfer-progress span");
      const cancel = screen.querySelector(".transfer-cancel");
      const lines = Array.from(screen.querySelectorAll(".transfer-line"));

      let cancelled = false;
      let timers = [];
      const cleanupTimers = () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        timers = [];
      };
      const close = () => {
        cancelled = true;
        cleanupTimers();
        screen.classList.remove("active");
      };

      cancel.onclick = close;
      urlBox.textContent = nodeName;
      progress.style.width = "0%";
      status.className = "transfer-status";
      status.innerHTML = '<span class="loader"></span>';
      lines.forEach((line) => line.classList.remove("active", "ok"));
      screen.classList.add("active");

      [
        { delay: 130, width: "23%", index: 0 },
        { delay: 620, width: "52%", index: 1 },
        { delay: 1120, width: "78%", index: 2, ok: true },
        { delay: 1540, width: "100%", index: 3 }
      ].forEach((step) => {
        timers.push(window.setTimeout(() => {
          if (cancelled) return;
          lines[step.index]?.classList.add("active");
          if (step.ok) {
            lines[step.index]?.classList.add("ok");
            status.className = "transfer-status ok";
            status.innerHTML = "✓";
          }
          progress.style.width = step.width;
        }, step.delay));
      });

      timers.push(window.setTimeout(() => {
        if (cancelled) return;

        cleanupTimers();
        window.location.assign(url);
      }, 2050));
    }

    function initAmbientEffects(routeKey) {
      const isAmbientRoute = routeKey === "elysium" || routeKey === "start";
      document.body.classList.toggle("ambient-route", isAmbientRoute);

      if (!isAmbientRoute || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      let glow = document.querySelector(".cursor-glow");

      if (!glow) {
        glow = document.createElement("div");
        glow.className = "cursor-glow";
        document.body.appendChild(glow);
      }

      if (window.__elysiumGlowReady === true) return;
      window.__elysiumGlowReady = true;

      let raf = 0;
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      const update = () => {
        raf = 0;
        document.documentElement.style.setProperty("--glow-x", x + "px");
        document.documentElement.style.setProperty("--glow-y", y + "px");
      };

      window.addEventListener("pointermove", (event) => {
        if (!document.body.classList.contains("ambient-route")) return;

        x = event.clientX;
        y = event.clientY;

        if (!raf) {
          raf = window.requestAnimationFrame(update);
        }
      }, { passive: true });
    }

    function initCopyButtons() {
      document.querySelectorAll("[data-copy]").forEach((button) => {
        if (button.dataset.copyReady === "true") return;
        button.dataset.copyReady = "true";

        const originalText = button.textContent;

        button.addEventListener("click", async () => {
          const value = button.dataset.copy || "";
          if (!value) return;

          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(value);
            } else {
              const textarea = document.createElement("textarea");
              textarea.value = value;
              textarea.setAttribute("readonly", "");
              textarea.style.position = "fixed";
              textarea.style.left = "-9999px";
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand("copy");
              textarea.remove();
            }

            button.textContent = "Скопировано ✓";
            showCopyToast("IP скопирован: " + value);

            window.setTimeout(() => {
              button.textContent = originalText;
            }, 1400);
          } catch (error) {
            button.textContent = "Не скопировалось";
            showCopyToast("Не удалось скопировать автоматически");

            window.setTimeout(() => {
              button.textContent = originalText;
            }, 1400);
          }
        });
      });
    }

    function showCopyToast(text) {
      let toast = document.querySelector(".copy-toast");

      if (!toast) {
        toast = document.createElement("div");
        toast.className = "copy-toast";
        document.body.appendChild(toast);
      }

      toast.textContent = text;
      toast.classList.add("show");

      window.clearTimeout(window.__elysiumCopyToastTimer);
      window.__elysiumCopyToastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
      }, 1600);
    }
