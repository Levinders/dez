/* ==========================================================================
   GLOBAL TOAST + API
   ========================================================================== */

function showToast(message, type = "success") {
  let box = document.getElementById("toast-container");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-container";
    document.body.appendChild(box);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  box.appendChild(toast);

  // animate in
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // remove after 3s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

async function api(action, data = {}) {
  const payload = { action, ...data };

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function loadSidebar(activePage) {
  try {
    // Correct relative path for ALL pages in /pages/
    const sidebarHTML = await fetch("../templates/sidebar.html").then(r => r.text());

    const container = document.createElement("div");
    container.innerHTML = sidebarHTML;
    document.body.prepend(container);

    // Highlight the active link
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.page === activePage) {
        link.classList.add("active");
      }
    });

  } catch (err) {
    console.error("Sidebar failed to load:", err);

    // Fallback UI (still usable)
    const fallback = document.createElement("div");
    fallback.id = "sidebar";
    fallback.innerHTML = `
      <div class="logo">SuperAdmin</div>
      <nav>
        <div style="padding:10px;color:#64748b;font-size:14px;">
          (Sidebar failed to load)
        </div>
      </nav>
    `;
    document.body.prepend(fallback);
  }
}


/* ==========================================================================
   ADD COACH WIZARD
   ========================================================================== */

const COACH_WIZARD_STEPS = [
  { id: 1, key: "details", label: "Coach details" },
  { id: 2, key: "domain", label: "Domain mapping" },
  { id: 3, key: "sheet", label: "Google Sheet" },
  { id: 4, key: "script", label: "Apps Script URL" },
  { id: 5, key: "confirm", label: "Confirm & create" },
];

let coachWizardStep = 1;
let coachData = {
  coach_name: "",
  email: "",
  plan: "Starter",
  coach_id: "",
  domain: "",
  sheet_id: "",
  admin_script_url: "",
};

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function initAddCoachWizard() {
  coachWizardStep = 1;
  coachData = {
    coach_name: "",
    email: "",
    plan: "Starter",
    coach_id: "",
    domain: "",
    sheet_id: "",
    admin_script_url: "",
  };
  renderWizardProgress();
  renderWizardStep();
}

function renderWizardProgress() {
  const container = document.getElementById("wizard-progress");
  if (!container) return;

  // Build step pills
  let stepsHtml = '<div class="wizard-steps">';
  COACH_WIZARD_STEPS.forEach((step) => {
    let cls = "wizard-step-pill";
    if (step.id < coachWizardStep) cls += " done";
    if (step.id === coachWizardStep) cls += " active";

    stepsHtml += `
      <div class="${cls}">
        <div class="dot">${step.id < coachWizardStep ? "✓" : step.id}</div>
        <span>${step.label}</span>
      </div>
    `;
  });
  stepsHtml += "</div>";

  // Progress bar
  const progressPercent =
    ((coachWizardStep - 1) / (COACH_WIZARD_STEPS.length - 1)) * 100;

  const progressBar = `
    <div class="wizard-progress-bar">
      <div class="wizard-progress-bar-fill" style="width:${progressPercent}%;"></div>
    </div>
    <div class="wizard-current-label">
      Step ${coachWizardStep} of ${COACH_WIZARD_STEPS.length} • ${
    COACH_WIZARD_STEPS[coachWizardStep - 1].label
  }
    </div>
  `;

  container.innerHTML = stepsHtml + progressBar;
}

function renderWizardStep() {
  const wrapper = document.getElementById("wizard");
  if (!wrapper) return;

  let html = "";

  switch (coachWizardStep) {
    case 1:
      html = renderStepDetails();
      break;
    case 2:
      html = renderStepDomain();
      break;
    case 3:
      html = renderStepSheet();
      break;
    case 4:
      html = renderStepScript();
      break;
    case 5:
      html = renderStepConfirm();
      break;
  }

  wrapper.innerHTML = html;
}

/* ---- STEP 1: COACH DETAILS ---- */

function renderStepDetails() {
  return `
    <div class="wizard-step-card">
      <h2>Coach details</h2>
      <p>Capture the basic information for this coaching business. You can edit later if needed.</p>

      <div id="step-error"></div>

      <div class="form-group">
        <label>Coach name</label>
        <input id="coach_name" placeholder="Example: Alpha Coaching Studio" value="${coachData.coach_name || ""}">
      </div>

      <div class="form-group">
        <label>Admin email</label>
        <input id="coach_email" type="email" placeholder="founder@coachbrand.com" value="${coachData.email || ""}">
        <small>This will be used for communication and login notifications.</small>
      </div>

      <div class="form-group">
        <label>Plan</label>
        <select id="coach_plan">
          <option ${coachData.plan === "Starter" ? "selected" : ""}>Starter</option>
          <option ${coachData.plan === "Pro" ? "selected" : ""}>Pro</option>
          <option ${coachData.plan === "Premium" ? "selected" : ""}>Premium</option>
        </select>
      </div>

      <div class="btn-row">
        <button class="btn-primary" onclick="saveStep1()">Continue</button>
      </div>
    </div>
  `;
}

function showStepError(message) {
  const box = document.getElementById("step-error");
  if (!box) return;
  box.innerHTML = `<div class="form-error">${message}</div>`;
}

function saveStep1() {
  const name = v("coach_name");
  const email = v("coach_email");
  const plan = v("coach_plan");

  if (!name || !email) {
    showStepError("Coach name and admin email are required.");
    showToast("Please fill in required fields.", "error");
    return;
  }

  coachData.coach_name = name;
  coachData.email = email;
  coachData.plan = plan;
  coachData.coach_id = coachData.coach_id || "C" + Date.now();

  coachWizardStep = 2;
  renderWizardProgress();
  renderWizardStep();
}

/* ---- STEP 2: DOMAIN ---- */

function renderStepDomain() {
  return `
    <div class="wizard-step-card">
      <h2>Domain mapping</h2>
      <p>Connect the coach's whitelabel domain. This must CNAME to your Cloudflare Worker.</p>

      <div id="step-error"></div>

      <div class="form-group">
        <label>Custom domain</label>
        <input id="coach_domain" placeholder="courses.coachbrand.com" value="${coachData.domain || ""}">
        <small>Example: courses.alphaacademy.com → CNAME → your-worker.pages.dev</small>
      </div>

      <div class="btn-row">
        <button class="btn-secondary" onclick="goBackToStep(1)">Back</button>
        <button class="btn-primary" onclick="saveStep2()">Continue</button>
      </div>
    </div>
  `;
}

function saveStep2() {
  const domain = v("coach_domain");
  if (!domain) {
    showStepError("Custom domain is required.");
    showToast("Domain is required.", "error");
    return;
  }
  coachData.domain = domain;

  coachWizardStep = 3;
  renderWizardProgress();
  renderWizardStep();
}

/* ---- STEP 3: SHEET ---- */

function renderStepSheet() {
  return `
    <div class="wizard-step-card">
      <h2>Google Sheet</h2>
      <p>Link the coach's master Google Sheet (their copy of your LMS template).</p>

      <div id="step-error"></div>

      <div class="form-group">
        <label>Sheet ID</label>
        <input id="sheet_id" placeholder="1AbCdEfGhijk..." value="${coachData.sheet_id || ""}">
        <small>Paste only the spreadsheet ID (the long ID in the URL).</small>
      </div>

      <div class="btn-row">
        <button class="btn-secondary" onclick="goBackToStep(2)">Back</button>
        <button class="btn-primary" onclick="saveStep3()">Continue</button>
      </div>
    </div>
  `;
}

function saveStep3() {
  const sheetId = v("sheet_id");
  if (!sheetId) {
    showStepError("Google Sheet ID is required.");
    showToast("Sheet ID is required.", "error");
    return;
  }
  coachData.sheet_id = sheetId;

  coachWizardStep = 4;
  renderWizardProgress();
  renderWizardStep();
}

/* ---- STEP 4: SCRIPT ---- */

function renderStepScript() {
  return `
    <div class="wizard-step-card">
      <h2>Apps Script backend</h2>
      <p>Connect the coach's dedicated Apps Script web app (must end with <code>/exec</code>).</p>

      <div id="step-error"></div>

      <div class="form-group">
        <label>Web App URL</label>
        <input id="script_url" placeholder="https://script.google.com/macros/s/XYZ/exec" value="${coachData.admin_script_url || ""}">
        <small>Deploy as a web app & set access appropriately. Use the <strong>/exec</strong> URL.</small>
      </div>

      <div class="btn-row">
        <button class="btn-secondary" onclick="goBackToStep(3)">Back</button>
        <button class="btn-primary" onclick="saveStep4()">Continue</button>
      </div>
    </div>
  `;
}

function saveStep4() {
  const url = v("script_url");
  if (!url || !url.endsWith("/exec")) {
    showStepError("Apps Script URL must be valid and end with /exec.");
    showToast("Invalid Apps Script URL.", "error");
    return;
  }
  coachData.admin_script_url = url;

  coachWizardStep = 5;
  renderWizardProgress();
  renderWizardStep();
}

/* ---- STEP 5: CONFIRM ---- */

function renderStepConfirm() {
  const pretty = JSON.stringify(coachData, null, 2);

  return `
    <div class="wizard-step-card">
      <h2>Confirm & create</h2>
      <p>Review the configuration below. If everything looks good, create the coach instance.</p>

      <pre style="background:#0f172a; color:#e5e7eb; padding:10px 12px; border-radius:8px; font-size:12px; overflow:auto;">${pretty}</pre>

      <div class="btn-row">
        <button class="btn-secondary" onclick="goBackToStep(4)">Back</button>
        <button class="btn-primary" onclick="submitCoach()">
          <span>Create coach</span>
        </button>
      </div>
    </div>
  `;
}

function goBackToStep(step) {
  coachWizardStep = step;
  renderWizardProgress();
  renderWizardStep();
}

async function submitCoach() {
  const btn = document.querySelector(".btn-primary");
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = "Creating…";

  const result = await api("addcoach", coachData);

  if (result.success) {
    showToast("Coach created successfully.", "success");

    const wrapper = document.getElementById("wizard");
    wrapper.innerHTML = `
      <div class="success-card">
        <h2>Coach environment created 🎉</h2>
        <p>The coach has been added to your registry and domain routing table. You can manage them from the Coaches and Domains pages.</p>
      </div>
    `;

    renderWizardProgress();
  } else {
    showToast(result.error || "Failed to create coach.", "error");
    btn.disabled = false;
    btn.innerHTML = "Create coach";
  }
}

/* ==========================================================================
   PAGE INITIALIZATION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const activePage = document.body.dataset.page || "";
  loadSidebar(activePage);

  if (activePage === "add-coach") {
    initAddCoachWizard();
  }
});
