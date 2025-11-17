function showToast(message, isError = false) {
  const box = document.getElementById("toast-box");
  const t = document.createElement("div");
  t.className = "toast" + (isError ? " error" : "");
  t.textContent = message;
  box.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

async function submitLogin() {
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");

  const email = emailInput.value.trim();
  const password = passInput.value.trim();

  if (!email || !password) {
    return showToast("Enter email and password.", true);
  }

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",  // backend will treat this as coach login (for now)
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      return showToast(data.error || "Login failed.", true);
    }

    // Use shared auth.js helper to persist session
    setAuth({
      role: data.role,
      token: data.token,
      coach_id: data.coach_id || null,
      student_id: data.student_id || null,
    });

    showToast("Login successful!");

    // Redirect based on role
    if (data.role === "superadmin") {
      window.location.href = "/superadmin/pages/index.html";
    } else if (data.role === "coach") {
      window.location.href = "/coach/pages/dashboard.html";
    } else if (data.role === "student") {
      window.location.href = "/student/pages/dashboard.html";
    } else {
      // Fallback: go to login again
      window.location.href = "/login/";
    }
  } catch (err) {
    showToast("Network error: " + err.message, true);
  }
}
