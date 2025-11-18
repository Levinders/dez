document.addEventListener("DOMContentLoaded", () => {
  enforceAuthForBodyRole();

  const sidebar = document.getElementById("sidebar");
  const collapseBtn = document.getElementById("collapse-btn");
  const mobileToggle = document.getElementById("mobile-toggle");

  // Desktop collapse
  collapseBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");
  });

  // Mobile toggle
  mobileToggle?.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Close sidebar on outside click (mobile only)
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth < 820 &&
      !sidebar.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }
  });

  // Set active menu item
  const pageName = document.body.dataset.page;
  if (pageName) {
    const activeLink = document.querySelector(`.menu-item[data-page="${pageName}"]`);
    if (activeLink) activeLink.classList.add("active");
  }

  // Logout
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    appLogout();
  });
});
