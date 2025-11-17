/* ==========================================================================
   API WRAPPER → All requests go through the Worker
   Shared by: /superadmin, /coach, /student
   ========================================================================== */

/**
 * Unified API request function.
 * Usage:
 *    const res = await api("liststudents", { status: "active" });
 */
async function api(action, data = {}) {
  const auth = getAuth();

  const payload = {
    action,
    ...data,
    // Attach session
    auth_role: auth.role || null,
    auth_token: auth.token || null,
    coach_id: auth.coach_id || null,
    student_id: auth.student_id || null
  };

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // If Worker returns unauthorized
    if (res.status === 401 || res.status === 403) {
      appLogout();
      return { success: false, error: "Session expired" };
    }

    const json = await res.json();

    // If backend says unauthorized
    if (json.error === "unauthorized" || json.error === "invalid token") {
      appLogout();
      return { success: false, error: "Session expired" };
    }

    return json;
  } catch (err) {
    return {
      success: false,
      error: "Network error: " + err.message
    };
  }
}

/**
 * GET request helper (rarely needed since you mostly POST)
 */
async function apiGet(params = {}) {
  const url = new URL(WORKER_URL);
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (res.status === 401 || res.status === 403) {
      appLogout();
      return { success: false, error: "Session expired" };
    }

    return await res.json();
  } catch (err) {
    return {
      success: false,
      error: "Network error: " + err.message
    };
  }
}

// Expose globally
window.api = api;
window.apiGet = apiGet;
