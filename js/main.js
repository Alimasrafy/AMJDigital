async function loadComponents(root = document) {
  const placeholders = Array.from(root.querySelectorAll("[data-component]"));

  for (const node of placeholders) {
    const source = node.getAttribute("data-component");
    if (!source) {
      continue;
    }

    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${source}`);
      }

      node.innerHTML = await response.text();
      node.removeAttribute("data-component");
      await loadComponents(node);
    } catch (error) {
      node.innerHTML = `<!-- Component load error: ${source} -->`;
      console.error(error);
    }
  }
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
}

function initNavigationFallback() {
  const header = document.querySelector("[data-global-header]");
  if (!header || header.dataset.navBound === "true" || header.dataset.navFallbackBound === "true") {
    return;
  }

  const nav = header.querySelector(".global-nav");
  const toggle = header.querySelector(".global-nav-toggle");
  const backdrop = header.querySelector(".global-nav-backdrop");

  if (!nav || !toggle || !backdrop) {
    return;
  }

  header.dataset.navFallbackBound = "true";

  function setOpenState(isOpen) {
    header.classList.toggle("is-menu-open", isOpen);
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    nav.setAttribute("aria-hidden", String(!isOpen));
    backdrop.hidden = !isOpen;
    backdrop.classList.toggle("is-visible", isOpen);
    document.body.classList.toggle("has-menu-open", isOpen);
  }

  setOpenState(false);

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setOpenState(!expanded);
  });

  backdrop.addEventListener("click", () => setOpenState(false));

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) {
      setOpenState(false);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  setCurrentYear();

  const initNavigation =
    typeof window.initNavigation === "function" ? window.initNavigation : () => {};
  const initAnimations =
    typeof window.initAnimations === "function"
      ? window.initAnimations
      : typeof window.initRevealAnimations === "function"
      ? window.initRevealAnimations
      : () => {};
  const initInteractions =
    typeof window.initInteractions === "function" ? window.initInteractions : () => {};

  initNavigation();
  initAnimations();
  initInteractions();

  // Safety net: if navigation initializer fails for any reason, keep mobile menu usable.
  initNavigationFallback();
  window.setTimeout(initNavigationFallback, 250);
});
