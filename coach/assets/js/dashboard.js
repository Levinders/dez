document.addEventListener("DOMContentLoaded", async () => {
  enforceAuthForBodyRole();

  // Placeholder / mock data until API is ready
  document.getElementById("stat-students").textContent = "32";
  document.getElementById("stat-courses").textContent = "6";
  document.getElementById("stat-revenue").textContent = "$8,400";
  document.getElementById("stat-new").textContent = "4";

  // Simulated activity feed
  const activityList = document.getElementById("activity-list");
  activityList.innerHTML = "";

  const sample = [
    "New student enrolled in 'Starter Program'",
    "Uploaded new module in 'Mindset Basics'",
    "Student John completed Lesson 3",
    "Payment received: $249",
    "New student signup"
  ];

  sample.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    activityList.appendChild(li);
  });
});
