/* ==========================================================================
   AUTH & ROUTE GUARD
   Shared by: /superadmin, /coach, /student
   ========================================================================== */
// TEMPORARILY DISABLED FOR DEVELOPMENT
const DEV_MODE = true;


const ROLE_BASE_PATHS = {
  superadmin: "/superadmin/",
  coach: "/coach/",
  student: "/student/",
};

const LOGIN_PATH = "/login/";

/**
 * Get auth state from localStorage
 */
function getAuth() {
  return {
    role: localStorage.getItem("auth_role") || null,
    token: localStorage.getItem("auth_token") || null,
    coach_id: localStorage.getItem("coach_id") || null,
    student_id: localStorage.getItem("student_id") || null,
  };
}

/**
 * Save auth state to localStorage
 */
function setAuth({ role, token, coach_id = null, student_id = null }) {
  if (role) localStorage.setItem("auth_role", role);
  if (token) localStorage.setItem("auth_token", token);

  if (coach_id !== null) localStorage.setItem("coach_id", coach_id);
  if (student_id !== null) localStorage.setItem("student_id", student_id);
}

/**
 * Clear auth (logout)
 */
function clearAuth() {
  localStorage.removeItem("auth_role");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("coach_id");
  localStorage.removeItem("student_id");
}

/**
 * Global logout function (attach to buttons)
 */
function appLogout() {
  clearAuth();
  window.location.href = LOGIN_PATH;
}

/**
 * Redirect helper
 */
function redirectToLogin() {
  window.location.href = LOGIN_PATH;
}

/**
 * Ensure user is logged in AND has the correct role.
 * 
 * Usage on a page:
 *   <body data-role="coach">
 *   ...
 *   <script src="/shared/js/auth.js"></script>
 *   <script>enforceAuth();</script>
 * 
 * Or explicitly:
 *   enforceAuth(["coach"]); // allow coach only
 *   enforceAuth(["superadmin", "coach"]); // allow either
 */
function enforceAuth(allowedRoles) {
  if (DEV_MODE) return; // skip all checks

  const auth = getAuth();

  // 1. Must have token & role
  if (!auth.token || !auth.role) {
    return redirectToLogin();
  }

  // 2. Check allowedRoles (if specified)
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(auth.role)) {
      return redirectToLogin();
    }
  }

  // 3. Check that current path matches the role's base folder
  const path = window.location.pathname;
  const expectedBase = ROLE_BASE_PATHS[auth.role];

  if (expectedBase && !path.includes(expectedBase)) {
    // If user is in wrong folder, send them to their own dashboard
    let target = expectedBase;

    if (auth.role === "superadmin") {
      target += "pages/index.html";
    } else if (auth.role === "coach") {
      target += "pages/dashboard.html";
    } else if (auth.role === "student") {
      target += "pages/dashboard.html";
    }

    return (window.location.href = target);
  }
}

/**
 * Helper to enforce based on <body data-role="...">
 * 
 * Call this once after DOMContentLoaded on every dashboard page:
 *   enforceAuthForBodyRole();
 */
function enforceAuthForBodyRole() {
  if (DEV_MODE) return; // skip all checks
  const body = document.body;
  const roleAttr = body.dataset.role || null;

  if (!roleAttr) {
    // If no data-role, just require any authenticated user
    return enforceAuth();
  }

  return enforceAuth([roleAttr]);
}

// Expose to global scope
window.getAuth = getAuth;
window.setAuth = setAuth;
window.appLogout = appLogout;
window.enforceAuth = enforceAuth;
window.enforceAuthForBodyRole = enforceAuthForBodyRole;
