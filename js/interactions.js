(function () {
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = targetId ? document.querySelector(targetId) : null;

        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function initPointerGlowCards(selector) {
    const cards = document.querySelectorAll(selector);
    if (!cards.length) {
      return;
    }

    cards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
      });

      card.addEventListener("mouseenter", () => {
        card.classList.add("is-hovered");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-hovered");
      });
    });
  }

  function initTiltCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tiltNodes = document.querySelectorAll("[data-tilt]");
    tiltNodes.forEach((node) => {
      node.addEventListener("mousemove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 8;
        const rotateX = (0.5 - y) * 8;

        node.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      node.addEventListener("mouseleave", () => {
        node.style.transform = "";
      });
    });
  }

  function initServicesCardEffects() {
    initPointerGlowCards(".services-card");
  }

  function initIndustryCardEffects() {
    initPointerGlowCards(".industry-card");
  }

  function initPortfolioCardEffects() {
    initPointerGlowCards(".case-card");
  }

  function initHomeCardEffects() {
    initPointerGlowCards(".problem-card, .service-card, .process-card, .signal-card");
  }

  function initAboutCardEffects() {
    initPointerGlowCards(".about-profile-card");
  }

  function initProjectCaseCardEffects() {
    initPointerGlowCards(".project-case-page .surface");
  }

  function initContactCardEffects() {
    initPointerGlowCards(".contact-form-card");
  }

  function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) {
      return;
    }

    const fields = Array.from(form.querySelectorAll("input, textarea"));
    const status = form.querySelector(".form-status");

    function syncFieldState(field) {
      const wrapper = field.closest(".form-field");
      if (wrapper) {
        wrapper.classList.toggle("has-value", field.value.trim().length > 0);
      }
    }

    fields.forEach((field) => {
      syncFieldState(field);
      field.addEventListener("input", () => syncFieldState(field));
      field.addEventListener("blur", () => syncFieldState(field));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (status) {
        status.textContent = "Thanks! Your message has been received. I will get back to you soon.";
        status.classList.add("is-visible");
      }

      form.reset();
      fields.forEach((field) => syncFieldState(field));
    });
  }

  function initPlumbingFeatureEffects() {
    initPointerGlowCards(".plumbing-feature-card");
  }

  function initElectricalFeatureEffects() {
    initPointerGlowCards(".electrical-feature-card");
  }

  function initPestFeatureEffects() {
    initPointerGlowCards(".pest-feature-card");
  }

  function initRoofingFeatureEffects() {
    initPointerGlowCards(".roofing-feature-card");
  }

  function initCleaningFeatureEffects() {
    initPointerGlowCards(".cleaning-feature-card");
  }

  function initWpDesignFeatureEffects() {
    initPointerGlowCards(".wp-design-feature-card");
  }

  function initRedesignFeatureEffects() {
    initPointerGlowCards(".redesign-feature-card");
  }

  function initLandingDesignEffects() {
    initPointerGlowCards(".landing-use-case-card, .landing-feature-card");
  }

  function initSpeedOptimizationEffects() {
    initPointerGlowCards(".speed-benefit-card, .speed-improvement-card");
  }

  function initMaintenanceFeatureEffects() {
    initPointerGlowCards(".maintenance-feature-card");
  }

  function initBlogCardEffects() {
    initPointerGlowCards(".blog-post-card");
  }

  function initCaseStudyArticleAnimations() {
    const sections = document.querySelectorAll("[data-case-section]");
    if (!sections.length) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("is-in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initDesignTipsArticleAnimations() {
    const sections = document.querySelectorAll("[data-tips-section]");
    if (!sections.length) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("is-in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  window.initInteractions = function initInteractions() {
    initSmoothScroll();
    initTiltCards();
    initServicesCardEffects();
    initIndustryCardEffects();
    initPortfolioCardEffects();
    initHomeCardEffects();
    initAboutCardEffects();
    initProjectCaseCardEffects();
    initContactCardEffects();
    initContactForm();
    initPlumbingFeatureEffects();
    initElectricalFeatureEffects();
    initPestFeatureEffects();
    initRoofingFeatureEffects();
    initCleaningFeatureEffects();
    initWpDesignFeatureEffects();
    initRedesignFeatureEffects();
    initLandingDesignEffects();
    initSpeedOptimizationEffects();
    initMaintenanceFeatureEffects();
    initBlogCardEffects();
    initCaseStudyArticleAnimations();
    initDesignTipsArticleAnimations();
  };
})();
