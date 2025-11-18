document.addEventListener("DOMContentLoaded", () => {
  // Auth guard already runs in student.js, but it's safe
  enforceAuthForBodyRole();

  // Later we'll read from getAuth() / API
  const auth = getAuth();
  const greetingEl = document.getElementById("student-greeting");

  const name = auth && auth.student_name ? auth.student_name : "Welcome back 👋";
  if (auth && auth.student_name) {
    greetingEl.textContent = `Welcome back, ${auth.student_name}`;
  }

  // Mock stats
  document.getElementById("stat-active").textContent = "2";
  document.getElementById("stat-lessons").textContent = "14";
  document.getElementById("stat-time").textContent = "5.3";

  // Mock continue course
  const titleEl = document.getElementById("continue-title");
  const subEl = document.getElementById("continue-sub");
  const progressEl = document.getElementById("continue-progress");

  titleEl.textContent = "High-Ticket Sales Foundations";
  subEl.textContent = "You're halfway there. Next up: Handling objections with confidence.";
  progressEl.textContent = "52% complete";
});
