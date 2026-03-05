(function () {
  function initRevealAnimations() {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    nodes.forEach((node) => {
      const delay = Number.parseInt(node.dataset.revealDelay || "0", 10);
      const distance = Number.parseInt(node.dataset.revealDistance || "16", 10);

      if (!Number.isNaN(delay) && delay > 0) {
        node.style.transitionDelay = `${delay}ms`;
      }

      if (!Number.isNaN(distance) && distance > 0) {
        node.style.setProperty("--reveal-distance", `${distance}px`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  window.initRevealAnimations = initRevealAnimations;
  window.initAnimations = initRevealAnimations;
})();
