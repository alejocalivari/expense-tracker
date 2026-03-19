const body = document.body;
const emptyToggle = document.querySelector("[data-empty-toggle]");
const restoreButtons = document.querySelectorAll("[data-restore]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const backdrop = document.querySelector("[data-backdrop]");
const navItems = document.querySelectorAll("[data-nav-item]");

const syncEmptyToggle = () => {
  if (!emptyToggle) {
    return;
  }

  const isEmpty = body.classList.contains("show-empty");
  emptyToggle.textContent = isEmpty ? "Back to dashboard" : "Preview empty state";
  emptyToggle.setAttribute("aria-pressed", String(isEmpty));
};

const closeSidebar = () => {
  body.classList.remove("sidebar-open");
};

window.addEventListener("load", () => {
  window.setTimeout(() => {
    body.classList.remove("is-loading");
  }, 950);
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    body.classList.toggle("sidebar-open");
  });
}

if (backdrop) {
  backdrop.addEventListener("click", closeSidebar);
}

if (emptyToggle) {
  syncEmptyToggle();
  emptyToggle.addEventListener("click", () => {
    body.classList.toggle("show-empty");
    closeSidebar();
    syncEmptyToggle();
  });
}

restoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    body.classList.remove("show-empty");
    syncEmptyToggle();
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.navItem;

    navItems.forEach((candidate) => {
      candidate.classList.toggle("is-active", candidate.dataset.navItem === target);
    });

    closeSidebar();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1120) {
    closeSidebar();
  }
});
