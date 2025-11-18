document.addEventListener("DOMContentLoaded", () => {
  enforceAuthForBodyRole(); // can be disabled in dev

  let currentStep = 1;

  const steps = document.querySelectorAll(".wizard-step");
  const stepIndicators = document.querySelectorAll(".step");
  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const reviewBox = document.getElementById("review-box");

  function showStep(step) {
    steps.forEach(s => s.classList.add("hidden"));
    stepIndicators.forEach(s => s.classList.remove("active"));

    document.querySelector(`.wizard-step[data-step="${step}"]`).classList.remove("hidden");
    document.querySelector(`.step[data-step="${step}"]`).classList.add("active");

    backBtn.style.visibility = step === 1 ? "hidden" : "visible";
    nextBtn.textContent = step === 3 ? "Create Course" : "Next";

    currentStep = step;
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep === 1) {
      const title = document.getElementById("course-title").value.trim();
      if (!title) return toast("Please enter a course title", true);
    }

    if (currentStep === 2) {
      generateReview();
    }

    if (currentStep < 3) {
      showStep(currentStep + 1);
    } else {
      createCourse();
    }
  });

  backBtn.addEventListener("click", () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });


  // REVIEW STEP
  function generateReview() {
    const t = document.getElementById("course-title").value;
    const d = document.getElementById("course-desc").value;
    const c = document.getElementById("course-category").value;
    const diff = document.getElementById("course-difficulty").value;
    const vis = document.getElementById("course-visibility").value;
    const status = document.getElementById("course-status").value;

    reviewBox.innerHTML = `
      <strong>Title:</strong> ${t}<br/>
      <strong>Description:</strong> ${d}<br/>
      <strong>Category:</strong> ${c}<br/>
      <strong>Difficulty:</strong> ${diff}<br/>
      <br/>
      <strong>Visibility:</strong> ${vis}<br/>
      <strong>Status:</strong> ${status}<br/>
    `;
  }


  // CREATE COURSE (Temp local response, later API)
  function createCourse() {
    toast("Course created! (Not saved yet)", false);

    setTimeout(() => {
      window.location.href = "./courses.html";
    }, 800);
  }


  function toast(msg, error = false) {
    const div = document.createElement("div");
    div.className = "toast" + (error ? " error" : "");
    div.textContent = msg;
    document.getElementById("toast-box").appendChild(div);
    setTimeout(() => div.remove(), 2500);
  }

  showStep(1);
});
