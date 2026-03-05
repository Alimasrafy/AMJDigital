(function () {
  const MAX_INIT_RETRIES = 25;

  function normalize(pathname) {
    return pathname
      .replace(/index\.html$/, "")
      .replace(/\.html$/, "")
      .replace(/\/$/, "") || "/";
  }

  function isDesktop() {
    return window.matchMedia("(min-width: 1025px)").matches;
  }

  function closeAllDropdowns(root) {
    root.querySelectorAll(".global-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      const toggle = dropdown.querySelector(".global-dropdown__toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setActiveLinks(root) {
    const current = normalize(window.location.pathname);

    root.querySelectorAll("a[href]").forEach((link) => {
      const url = new URL(link.href, window.location.origin);
      const target = normalize(url.pathname);

      if (target === current || (target !== "/" && current.startsWith(`${target}/`))) {
        link.classList.add("is-active");
      }
    });
  }

  function setStickyState(header) {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function scheduleRetry() {
    const retries = Number.parseInt(document.body.dataset.navInitRetries || "0", 10);
    if (retries >= MAX_INIT_RETRIES) {
      return;
    }

    document.body.dataset.navInitRetries = String(retries + 1);
    window.setTimeout(() => {
      if (typeof window.initNavigation === "function") {
        window.initNavigation();
      }
    }, 120);
  }

  window.initNavigation = function initNavigation() {
    const header = document.querySelector("[data-global-header]");
    if (!header) {
      scheduleRetry();
      return;
    }

    if (header.dataset.navBound === "true") {
      return;
    }

    const nav = header.querySelector(".global-nav");
    const toggle = header.querySelector(".global-nav-toggle");
    const backdrop = header.querySelector(".global-nav-backdrop");

    if (!nav || !toggle || !backdrop) {
      scheduleRetry();
      return;
    }

    header.dataset.navBound = "true";
    document.body.dataset.navInitRetries = "0";

    setActiveLinks(header);
    setStickyState(header);
    window.addEventListener("scroll", () => setStickyState(header), { passive: true });

    // Ensure a clean baseline in case previous state was cached.
    header.classList.remove("is-menu-open");
    nav.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    backdrop.hidden = true;
    document.body.classList.remove("has-menu-open");
    nav.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");

    function openMobileMenu() {
      header.classList.add("is-menu-open");
      nav.classList.add("is-open");
      nav.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
      backdrop.hidden = false;
      requestAnimationFrame(() => {
        backdrop.classList.add("is-visible");
      });
      document.body.classList.add("has-menu-open");
    }

    function closeMobileMenu() {
      header.classList.remove("is-menu-open");
      nav.classList.remove("is-open");
      nav.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
      backdrop.classList.remove("is-visible");
      window.setTimeout(() => {
        if (!header.classList.contains("is-menu-open")) {
          backdrop.hidden = true;
        }
      }, 220);
      document.body.classList.remove("has-menu-open");
      closeAllDropdowns(header);
    }

    function handleMenuToggle() {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    toggle.addEventListener("click", handleMenuToggle);

    backdrop.addEventListener("click", closeMobileMenu);

    nav.querySelectorAll(".global-dropdown__toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const dropdown = button.closest(".global-dropdown");
        if (!dropdown) {
          return;
        }

        const expanded = button.getAttribute("aria-expanded") === "true";
        if (!expanded) {
          closeAllDropdowns(header);
        }

        dropdown.classList.toggle("is-open", !expanded);
        button.setAttribute("aria-expanded", String(!expanded));
      });
    });

    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link) {
        return;
      }

      if (!isDesktop() && nav.classList.contains("is-open")) {
        closeMobileMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) {
        closeAllDropdowns(header);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllDropdowns(header);
        if (nav.classList.contains("is-open")) {
          closeMobileMenu();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (isDesktop()) {
        closeMobileMenu();
      }
    });
  };
})();
