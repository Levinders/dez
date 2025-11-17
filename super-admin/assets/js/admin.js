/* ==========================================================================
   GLOBAL HELPERS
   ========================================================================== */

function showToast(message, type="success") {
    let box = document.getElementById("toast-container");
    if (!box) {
        box = document.createElement("div");
        box.id = "toast-container";
        document.body.appendChild(box);
    }

    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerText = message;

    box.appendChild(t);

    // animate in
    setTimeout(() => t.classList.add("show"), 20);
    // remove
    setTimeout(() => {
        t.classList.remove("show");
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

async function api(action, data={}) {
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
   SIDEBAR LOADER
   ========================================================================== */

async function loadSidebar(activePage) {
    const html = await fetch("../templates/sidebar.html").then(r => r.text());
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    document.body.prepend(wrapper);

    // highlight active link
    document.querySelectorAll(".nav-link").forEach(a => {
        if (a.dataset.page === activePage) {
            a.classList.add("active");
        }
    });
}

/* ==========================================================================
   ADD COACH WIZARD LOGIC
   ========================================================================== */

let wizardStep = 1;
let coachData = {};

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "add-coach") {
        loadStep1();
    }
});

function loadStep1() {
    wizardStep = 1;
    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Coach Details</h2>

            <div class="form-group">
                <label>Coach Name</label>
                <input type="text" id="coach_name">
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" id="coach_email">
            </div>

            <div class="form-group">
                <label>Plan</label>
                <select id="coach_plan">
                    <option>Starter</option>
                    <option>Pro</option>
                    <option>Premium</option>
                </select>
            </div>

            <button class="btn-primary" onclick="saveStep1()">Next</button>
        </div>
    `;
}

function saveStep1() {
    const name = v("coach_name"), email = v("coach_email");
    if (!name || !email) return showToast("Name and email required", "error");

    coachData = {
        coach_name: name,
        email,
        plan: v("coach_plan"),
        coach_id: "C" + Date.now()
    };

    loadStep2();
}

function loadStep2() {
    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Domain</h2>
            <div class="form-group">
                <label>Custom Domain</label>
                <input id="coach_domain" placeholder="courses.brand.com">
            </div>

            <button class="btn-secondary" onclick="loadStep1()">Back</button>
            <button class="btn-primary" onclick="saveStep2()">Next</button>
        </div>
    `;
}

function saveStep2() {
    const d = v("coach_domain");
    if (!d) return showToast("Domain is required", "error");
    coachData.domain = d;
    loadStep3();
}

function loadStep3() {
    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Google Sheet</h2>
            <div class="form-group">
                <label>Sheet ID</label>
                <input id="sheet_id">
            </div>

            <button class="btn-secondary" onclick="loadStep2()">Back</button>
            <button class="btn-primary" onclick="saveStep3()">Next</button>
        </div>
    `;
}

function saveStep3() {
    const id = v("sheet_id");
    if (!id) return showToast("Sheet ID required", "error");
    coachData.sheet_id = id;
    loadStep4();
}

function loadStep4() {
    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Apps Script URL</h2>
            <div class="form-group">
                <label>Web App /exec URL</label>
                <input id="script_url">
            </div>

            <button class="btn-secondary" onclick="loadStep3()">Back</button>
            <button class="btn-primary" onclick="saveStep4()">Next</button>
        </div>
    `;
}

function saveStep4() {
    const url = v("script_url");
    if (!url.endsWith("/exec"))
        return showToast("Must end with /exec", "error");

    coachData.admin_script_url = url;
    loadStep5();
}

function loadStep5() {
    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Confirm</h2>
            <pre>${JSON.stringify(coachData, null, 2)}</pre>

            <button class="btn-secondary" onclick="loadStep4()">Back</button>
            <button class="btn-primary" onclick="submitCoach()">Create Coach</button>
        </div>
    `;
}

async function submitCoach() {
    let btn = document.querySelector(".btn-primary");
    btn.innerHTML = "Creating...";
    btn.disabled = true;

    const res = await api("addcoach", coachData);

    if (res.success) {
        showToast("Coach created!", "success");
        document.getElementById("wizard").innerHTML = `
            <div class="wizard-step" style="background:#ecfdf5;border-left:4px solid #10b981;">
                <h2>Success!</h2>
                <p>The coach environment is ready.</p>
            </div>
        `;
    } else {
        showToast(res.error || "Failed to create coach", "error");
    }

    btn.disabled = false;
    btn.innerHTML = "Create Coach";
}

/* Helper */
function v(id){ return document.getElementById(id).value.trim(); }
