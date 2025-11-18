document.addEventListener("DOMContentLoaded", () => {
  // Protect student pages (when auth is wired)
  enforceAuthForBodyRole();

  const sidebar = document.getElementById("sidebar");
  const collapseBtn = document.getElementById("collapse-btn");
  const mobileToggle = document.getElementById("mobile-toggle");
  const logoutBtn = document.getElementById("logout-btn");

  // Collapse / expand (desktop)
  collapseBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");
  });

  // Mobile toggle
  mobileToggle?.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Hide sidebar on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth >= 820) return;
    if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  });

  // Active menu state
  const pageName = document.body.dataset.page;
  if (pageName) {
    const activeItem = document.querySelector(`.menu-item[data-page="${pageName}"]`);
    if (activeItem) activeItem.classList.add("active");
  }

  // Logout
  logoutBtn?.addEventListener("click", () => {
    appLogout();
  });
});
