let wizardStep = 1;

let coachData = {
    coach_name: "",
    email: "",
    coach_id: "",
    plan: "",
    domain: "",
    sheet_id: "",
    admin_script_url: ""
};

document.addEventListener("DOMContentLoaded", () => {
    loadStep1();
});

function loadStep1() {
    wizardStep = 1;
    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Step 1: Coach Details</h2>

            <div class="form-group">
                <label>Coach Name</label>
                <input type="text" id="coach_name">
            </div>

            <div class="form-group">
                <label>Coach Email</label>
                <input type="email" id="coach_email">
            </div>

            <div class="form-group">
                <label>Plan</label>
                <select id="coach_plan">
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Premium">Premium</option>
                </select>
            </div>

            <button class="btn-primary" onclick="saveStep1()">Next</button>
        </div>
    `;
}

function saveStep1() {
    const name = document.getElementById("coach_name").value.trim();
    const email = document.getElementById("coach_email").value.trim();
    const plan = document.getElementById("coach_plan").value;

    if (!name || !email) {
        alert("Name and email are required.");
        return;
    }

    coachData.coach_name = name;
    coachData.email = email;
    coachData.plan = plan;

    coachData.coach_id = "C" + Date.now(); // auto-generated

    loadStep2();
}

// Step 2 — Domain
function loadStep2() {
    wizardStep = 2;

    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Step 2: Domain Setup</h2>

            <p>Enter the coach's custom domain (CNAME to your Cloudflare Worker).</p>

            <div class="form-group">
                <label>Domain</label>
                <input type="text" id="coach_domain" placeholder="courses.coachbrand.com">
            </div>

            <button class="btn-secondary" onclick="loadStep1()">Back</button>
            <button class="btn-primary" onclick="saveStep2()">Next</button>
        </div>
    `;
}

function saveStep2() {
    let domain = document.getElementById("coach_domain").value.trim();

    if (!domain) {
        alert("Domain is required.");
        return;
    }

    coachData.domain = domain;

    loadStep3();
}


// Step 3 — Sheet ID
function loadStep3() {
    wizardStep = 3;

    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Step 3: Coach Google Sheet</h2>

            <div class="form-group">
                <label>Google Sheet ID</label>
                <input type="text" id="sheet_id" placeholder="1AbCdEfGhijk123...">
            </div>

            <button class="btn-secondary" onclick="loadStep2()">Back</button>
            <button class="btn-primary" onclick="saveStep3()">Next</button>
        </div>
    `;
}

function saveStep3() {
    const sheet_id = document.getElementById("sheet_id").value.trim();

    if (!sheet_id) {
        alert("Sheet ID is required.");
        return;
    }

    coachData.sheet_id = sheet_id;
    loadStep4();
}


// Step 4 — Apps Script URL
function loadStep4() {
    wizardStep = 4;

    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Step 4: Apps Script Backend</h2>

            <div class="form-group">
                <label>Apps Script Web App URL (must end with /exec)</label>
                <input type="text" id="script_url" placeholder="https://script.google.com/macros/s/.../exec">
            </div>

            <button class="btn-secondary" onclick="loadStep3()">Back</button>
            <button class="btn-primary" onclick="saveStep4()">Next</button>
        </div>
    `;
}

function saveStep4() {
    const url = document.getElementById("script_url").value.trim();

    if (!url || !url.endsWith("/exec")) {
        alert("Invalid Apps Script URL.");
        return;
    }

    coachData.admin_script_url = url;

    loadStep5();
}


// Step 5 — Summary + Submit
function loadStep5() {
    document.getElementById("wizard").innerHTML = `
        <div class="wizard-step">
            <h2>Step 5: Confirm and Create Coach</h2>

            <pre>${JSON.stringify(coachData, null, 2)}</pre>

            <button class="btn-secondary" onclick="loadStep4()">Back</button>
            <button class="btn-primary" onclick="submitCoach()">Create Coach</button>
        </div>
    `;
}

// Final submission
async function submitCoach() {
    const result = await api("addcoach", coachData);

    if (result.success) {
        document.getElementById("wizard").innerHTML = `
            <div id="success-box">
                ✓ Coach created successfully!
            </div>
        `;
    } else {
        alert("Error: " + result.error);
    }
}
