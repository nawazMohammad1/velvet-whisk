/* =========================================================
   VELVET WHISK
   Universal Website JavaScript
   One script for ALL HTML pages
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
       01. PAGE LOADER
    ===================================================== */

  const pageLoader = document.querySelector(".page-loader");

  if (pageLoader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        pageLoader.classList.add("hidden");
      }, 450);
    });
  }

  /* =====================================================
       02. MOBILE NAVIGATION
       Supports:
       .menu-toggle + .nav-menu
       .menu-toggle + #navLinks
    ===================================================== */

  const menuToggle =
    document.querySelector(".menu-toggle") ||
    document.getElementById("menuToggle");

  const navMenu =
    document.querySelector(".nav-menu") || document.getElementById("navLinks");

  if (menuToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove("active");

      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");

      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      navMenu.classList.add("active");

      menuToggle.classList.add("active");

      menuToggle.setAttribute("aria-expanded", "true");

      document.body.classList.add("menu-open");
    };

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = navMenu.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Close after clicking navigation link */

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    /* Close when clicking outside */

    document.addEventListener("click", (event) => {
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    /* Close menu after resizing to desktop */

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) {
        closeMenu();
      }
    });
  }

  /* =====================================================
       03. STICKY HEADER
       Supports .site-header and #header
    ===================================================== */

  const header =
    document.querySelector(".site-header") || document.getElementById("header");

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, { passive: true });

  /* =====================================================
       04. ACTIVE PAGE NAVIGATION
       Automatically highlights:
       Home / Cakes / About / Gallery etc.
    ===================================================== */

  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

  const navigationLinks = document.querySelectorAll(".nav-menu a, #navLinks a");

  navigationLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const cleanHref = href
      .split("#")[0]
      .split("?")[0]
      .split("/")
      .pop()
      .toLowerCase();

    if (cleanHref === currentPage && cleanHref !== "") {
      link.classList.add("active");
    }
  });

  /* =====================================================
       05. SCROLL REVEAL
    ===================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length) {
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px",
        },
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("show");
      });
    }
  }

  /* =====================================================
       06. SMOOTH ANCHOR SCROLLING
    ===================================================== */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header?.offsetHeight || 0;

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 15;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /* =====================================================
       07. CAKE CATEGORY FILTER
       Works only when .cake-filter exists.
       Safe on every other page.
    ===================================================== */

  const filterButtons = document.querySelectorAll(".cake-filter");

  const cakeCards = document.querySelectorAll(".cake-card");

  if (filterButtons.length && cakeCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";

        /* Active filter */

        filterButtons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        /* Filter cards */

        cakeCards.forEach((card) => {
          const categories =
            card.dataset.category?.toLowerCase().split(" ") || [];

          const shouldShow = filter === "all" || categories.includes(filter);

          if (shouldShow) {
            card.classList.remove("filter-hidden");

            card.classList.add("filter-show");

            setTimeout(() => {
              card.classList.remove("filter-show");
            }, 500);
          } else {
            card.classList.remove("filter-show");

            card.classList.add("filter-hidden");
          }
        });
      });
    });
  }

  /* =====================================================
       08. FAVORITE / HEART BUTTONS
       Works on Cakes page and future product pages.
    ===================================================== */

  const favoriteButtons = document.querySelectorAll(".favorite-btn");

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      event.stopPropagation();

      button.classList.toggle("active");

      const icon = button.querySelector("i");

      if (!icon) return;

      if (button.classList.contains("active")) {
        icon.classList.remove("fa-regular");

        icon.classList.add("fa-solid");

        button.setAttribute("aria-label", "Remove from favorites");
      } else {
        icon.classList.remove("fa-solid");

        icon.classList.add("fa-regular");

        button.setAttribute("aria-label", "Add to favorites");
      }
    });
  });

  /* =====================================================
       09. PRODUCT QUICK VIEW
       Works with:
       .quick-view
       .product-card
       .cake-card
    ===================================================== */

  const quickViewButtons = document.querySelectorAll(".quick-view");

  quickViewButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const card = button.closest(".product-card, .cake-card");

      if (!card) return;

      const name =
        card.querySelector("h3")?.textContent?.trim() || "Selected Cake";

      const price =
        card
          .querySelector(
            ".cake-bottom strong, .product-price, .product-top > strong",
          )
          ?.textContent?.trim() || "";

      showQuickMessage(`${name}${price ? " — " + price : ""}`);
    });
  });

  /* =====================================================
       10. QUICK MESSAGE
    ===================================================== */

  function showQuickMessage(message) {
    const existing = document.querySelector(".quick-message");

    if (existing) {
      existing.remove();
    }

    const messageBox = document.createElement("div");

    messageBox.className = "quick-message";

    messageBox.innerHTML = `
            <div class="quick-message-icon">
                <i class="fa-solid fa-cake-candles"></i>
            </div>

            <div>
                <strong>${escapeHTML(message)}</strong>
                <span>
                    Visit Custom Cakes to place your order.
                </span>
            </div>

            <button
                class="quick-message-close"
                aria-label="Close message"
                type="button"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

    document.body.appendChild(messageBox);

    requestAnimationFrame(() => {
      messageBox.classList.add("visible");
    });

    const closeButton = messageBox.querySelector(".quick-message-close");

    closeButton?.addEventListener("click", () => {
      closeQuickMessage(messageBox);
    });

    setTimeout(() => {
      if (document.body.contains(messageBox)) {
        closeQuickMessage(messageBox);
      }
    }, 4000);
  }

  function closeQuickMessage(element) {
    element.classList.remove("visible");

    setTimeout(() => {
      if (element.parentNode) {
        element.remove();
      }
    }, 300);
  }

  /* =====================================================
       11. BUTTON RIPPLE EFFECT
    ===================================================== */

  const buttons = document.querySelectorAll(
    ".btn, .nav-order, .nav-order-btn, .cake-order",
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      /*
                    Don't create ripple when
                    clicking keyboard navigation.
                */

      if (event.clientX === 0 && event.clientY === 0) {
        return;
      }

      const rect = this.getBoundingClientRect();

      const ripple = document.createElement("span");

      ripple.className = "button-ripple";

      ripple.style.left = `${event.clientX - rect.left}px`;

      ripple.style.top = `${event.clientY - rect.top}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 650);
    });
  });

  /* =====================================================
       12. IMAGE LOAD ANIMATION
    ===================================================== */

  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    const markLoaded = () => {
      image.classList.add("loaded");
    };

    if (image.complete) {
      if (image.naturalWidth > 0) {
        markLoaded();
      }
    } else {
      image.addEventListener("load", markLoaded, { once: true });
    }
  });

  /* =====================================================
       13. IMAGE ERROR HANDLING
    ===================================================== */

  images.forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.classList.add("image-error");
      },
      { once: true },
    );
  });

  /* =====================================================
       14. WHATSAPP ORDER
    ===================================================== */

  const whatsappButtons = document.querySelectorAll(
    ".whatsapp-btn, [data-whatsapp]",
  );

  whatsappButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Opening Velvet Whisk WhatsApp order...");
    });
  });

  /* =====================================================
       15. CONTACT / ORDER FORMS
       Prevents empty submission and provides
       a simple success state.

       If a real backend is added later,
       this section can be replaced.
    ===================================================== */

  const forms = document.querySelectorAll("form[data-velvet-form]");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const requiredFields = form.querySelectorAll("[required]");

      let valid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;

          field.classList.add("input-error");
        } else {
          field.classList.remove("input-error");
        }
      });

      if (!valid) {
        showQuickMessage("Please fill in all required fields.");

        return;
      }

      showQuickMessage("Thank you! Your request has been received.");

      form.reset();
    });
  });

  /* =====================================================
       16. ESCAPE KEY
    ===================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    /* Close mobile menu */

    if (navMenu?.classList.contains("active")) {
      navMenu.classList.remove("active");

      menuToggle?.classList.remove("active");

      menuToggle?.setAttribute("aria-expanded", "false");

      document.body.classList.remove("menu-open");
    }

    /* Close quick message */

    const message = document.querySelector(".quick-message");

    if (message) {
      closeQuickMessage(message);
    }
  });

  /* =====================================================
       17. CURRENT YEAR
    ===================================================== */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =====================================================
       18. PAGE READY
    ===================================================== */

  document.body.classList.add("page-ready");

  /* =====================================================
       19. HELPER
       Prevent HTML injection inside dynamic messages.
    ===================================================== */

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
