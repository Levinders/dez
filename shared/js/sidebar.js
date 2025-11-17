/* ==========================================================================
   SIDEBAR ENGINE — Linear / Vercel Style
   Shared by: /superadmin, /coach, /student
   ========================================================================== */

/* 
EXPECTED BODY ATTRIBUTES:
<body data-role="coach" data-page="dashboard">
*/

/* ==========================================================================
   LUCIDE ICONS — Minimal SVGs
   ========================================================================== */

const lucide = {
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>`,

  users: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-3-3.87M8 21v-2a4 
    4 0 0 1 3-3.87m5-6.13a4 4 0 1 0-8 0 
    4 4 0 0 0 8 0zM12 3a4 4 0 0 1 4 4"/></svg>`,

  book: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 
    6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 
    6.5 7H20v12H6.5A2.5 2.5 0 0 0 4 19.5V4.5z"/></svg>`,

  globe: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" 
    viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 
    10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 
    1 1-4-10 15.3 15.3 0 0 1 4-10"/></svg>`,

  settings: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0-3-3 
    3 3 0 0 0 3 3z"/><path d="M19.4 15a1.65 1.65 0 
    0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 
    2.83l-.06-.06a1.65 1.65 0 0 
    0-1.82-.33 1.65 1.65 0 0 
    0-1 1.51V21a2 2 0 1 1-4 
    0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 
    1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 
    1-2.83-2.83l.06-.06a1.65 1.65 0 0 
    0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 
    2 0 1 1 0-4h.09a1.65 1.65 0 0 0 
    1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 
    1 1 2.83-2.83l.06.06a1.65 1.65 0 0 
    0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 
    2 0 1 1 4 0v.09a1.65 1.65 0 
    0 0 1 1.51 1.65a1.65 1.65 0 0 0 
    0 1-1h.09Z"/></svg>`,

  logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 
    2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/>
    <path d="M21 12H9"/></svg>`,

  menu: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`,
};

/* ==========================================================================
   MENU DEFINITIONS PER ROLE
   ========================================================================== */

const menus = {
  superadmin: [
    { page: "dashboard", label: "Dashboard", icon: "dashboard", href: "/superadmin/pages/index.html" },
    { page: "coaches", label: "Coaches", icon: "users", href: "/superadmin/pages/coaches.html" },
    { page: "domains", label: "Domains", icon: "globe", href: "/superadmin/pages/domains.html" },
    { page: "plans", label: "Plans", icon: "book", href: "/superadmin/pages/plans.html" },
    { page: "settings", label: "Settings", icon: "settings", href: "/superadmin/pages/settings.html" },
  ],

  coach: [
    { page: "dashboard", label: "Dashboard", icon: "dashboard", href: "/coach/pages/dashboard.html" },
    { page: "students", label: "Students", icon: "users", href: "/coach/pages/students.html" },
    { page: "courses", label: "Courses", icon: "book", href: "/coach/pages/courses.html" },
    { page: "settings", label: "Settings", icon: "settings", href: "/coach/pages/settings.html" },
  ],

  student: [
    { page: "dashboard", label: "Dashboard", icon: "dashboard", href: "/student/pages/dashboard.html" },
    { page: "courses", label: "My Courses", icon: "book", href: "/student/pages/courses.html" },
    { page: "settings", label: "Settings", icon: "settings", href: "/student/pages/settings.html" },
  ],
};

/* ==========================================================================
   SIDEBAR RENDERING
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const role = document.body.dataset.role;
  const currentPage = document.body.dataset.page;
  const navEl = document.getElementById("sidebar-nav");
  const logoEl = document.getElementById("sidebar-logo");
  const footerEl = document.getElementById("sidebar-footer");

  if (!role || !menus[role]) return;

  /* ---- 1. Render Logo / Letter Avatar ---- */
  renderSidebarLogo(logoEl);

  /* ---- 2. Render Menu ---- */
  menus[role].forEach(item => {
    const isActive = item.page === currentPage;

    const el = document.createElement("button");
    el.className = "nav-item" + (isActive ? " is-active" : "");
    el.onclick = () => (window.location.href = item.href);

    el.innerHTML = `
      <div class="nav-icon">${lucide[item.icon]}</div>
      <span class="nav-label">${item.label}</span>
    `;

    navEl.appendChild(el);
  });

  /* ---- 3. Render Footer (Logout only for now) ---- */
  const logoutBtn = document.createElement("button");
  logoutBtn.className = "sidebar-icon-button";
  logoutBtn.innerHTML = lucide.logout;
  logoutBtn.onclick = () => appLogout();

  footerEl.appendChild(logoutBtn);

  /* ---- 4. Mobile Menu Button Icon ---- */
  const mobileBtn = document.getElementById("mobile-menu-button");
  if (mobileBtn) {
    mobileBtn.innerHTML = lucide.menu;
    mobileBtn.onclick = () => toggleMobileSidebar();
  }

  const overlay = document.getElementById("app-overlay");
  if (overlay) {
    overlay.onclick = () => closeMobileSidebar();
  }
});

/* ==========================================================================
   LOGO GENERATION (Letter Avatar)
   ========================================================================== */

function renderSidebarLogo(el) {
  const auth = getAuth();

  // Coach branding can override here later.
  // For now: Simple first-letter avatar.
  const letter =
    (auth.role === "coach" && auth.coach_id)
      ? "C"
      : (auth.role === "student" && auth.student_id)
      ? "S"
      : "A";

  el.textContent = letter.toUpperCase();
}

/* ==========================================================================
   MOBILE SIDEBAR TOGGLE
   ========================================================================== */

function toggleMobileSidebar() {
  document.body.classList.toggle("sidebar-open");
}

function closeMobileSidebar() {
  document.body.classList.remove("sidebar-open");
}

/* ==========================================================================
   DESKTOP COLLAPSE/EXPAND SUPPORT (Optional)
   JS can toggle body.is-collapsed
   ========================================================================== */

function toggleSidebarCollapse() {
  document.body.classList.toggle("is-collapsed");
}
window.toggleSidebarCollapse = toggleSidebarCollapse;
