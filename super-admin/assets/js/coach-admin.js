/* ==========================================================================
   TOASTS
   ========================================================================== */
function coachShowToast(message, type = "success") {
  let box = document.getElementById("coach-toast-container");
  if (!box) {
    box = document.createElement("div");
    box.id = "coach-toast-container";
    document.body.appendChild(box);
  }

  const t = document.createElement("div");
  t.className = `coach-toast ${type}`;
  t.textContent = message;
  box.appendChild(t);

  // animate
  requestAnimationFrame(() => t.classList.add("show"));

  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 250);
  }, 3000);
}

/* ==========================================================================
   API HELPER (through single Worker)
   ========================================================================== */

async function coachApi(action, data = {}) {
  const payload = { action, ...data };

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/* ==========================================================================
   DASHBOARD INITIALIZATION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "coach-dashboard") {
    loadCoachDashboard();
  }
});

async function loadCoachDashboard() {
  // 1) Get settings + summary (white-label labels, brand, etc.)
  const boot = await coachApi("bootstrap");

  if (!boot.success) {
    coachShowToast(boot.error || "Failed to load coach settings.", "error");
    return;
  }

  const settings = boot.settings?.data || boot.settings || {};

  // Apply brand
  if (settings.brand_name) {
    document.getElementById("coachBrandName").innerText = settings.brand_name;
    document.title = `${settings.brand_name} • Dashboard`;
  }

  if (settings.logo_url) {
    const logoEl = document.getElementById("coachLogo");
    logoEl.style.backgroundImage = `url(${settings.logo_url})`;
    logoEl.style.backgroundSize = "cover";
    logoEl.textContent = ""; // remove emoji
  }

  // Apply labels (students/leads/clients)
  const labelStudentSingular = settings.label_students_singular || "Student";
  const labelStudentPlural = settings.label_students_plural || "Students";

  document.getElementById("coachPageSubtitle").innerText =
    `Overview of your ${labelStudentPlural.toLowerCase()} and programs.`;

  document.getElementById("label-total-students").innerText =
    `Total ${labelStudentPlural}`;
  document.getElementById("label-active-students").innerText =
    `Active ${labelStudentPlural}`;

  document.getElementById("label-student-singular-btn").innerText =
    labelStudentSingular;
  document.getElementById("label-student-plural-btn").innerText =
    labelStudentPlural;

  // Summary metrics
  const summary = boot.summary || {};
  setMetricValue("metric-total-students", summary.total_students);
  setMetricValue("metric-active-students", summary.active_students);
  setMetricValue("metric-total-courses", summary.total_courses);

  // 2) Load detailed dashboard stats (for activity, completion, etc.)
  const dash = await coachApi("coachdashboard");

  if (!dash.success) {
    coachShowToast(dash.error || "Failed to load dashboard data.", "error");
    return;
  }

  // Completion rate
  setMetricValue("metric-completion-rate", dash.completion_rate, "%");

  // Recent activity
  const feed = document.getElementById("coach-activity-feed");
  feed.innerHTML = "";

  if (!dash.activity || dash.activity.length === 0) {
    feed.innerHTML = `<div class="coach-activity-item">
      <strong>No activity yet.</strong>
      <span>New signups and actions will appear here.</span>
    </div>`;
  } else {
    dash.activity.forEach(item => {
      const label = item.title || "New activity";
      const name = item.name ? ` • ${item.name}` : "";
      const email = item.email ? ` (${item.email})` : "";
      const time = item.time || "";

      const div = document.createElement("div");
      div.className = "coach-activity-item";
      div.innerHTML = `
        <strong>${label}${name}${email}</strong>
        <span>${time}</span>
      `;
      feed.appendChild(div);
    });
  }

  coachShowToast("Dashboard loaded", "success");
}

/* Helper to update metric cards */
function setMetricValue(cardId, value, suffix = "") {
  const el = document.querySelector(`#${cardId} .metric-value`);
  if (!el) return;
  const v = value == null ? "0" : value;
  el.innerText = suffix ? `${v}${suffix}` : v;
}

/* ==========================================================================
   NAV / QUICK ACTION HANDLERS (wired later to real pages/forms)
   ========================================================================== */

function coachOpenAddStudent() {
  coachShowToast("Open Add Student modal (to be wired).", "success");
}

function coachGoToStudents() {
  // Example: navigate to /coach-admin/pages/students.html
  window.location.href = "students.html";
}

function coachGoToCourses() {
  // Example: navigate to /coach-admin/pages/courses.html
  window.location.href = "courses.html";
}
