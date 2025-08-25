// Toggle Ingredients
const toggleBtn = document.querySelector(".toggle-btn");
const ingredients = document.querySelector(".ingredients");

toggleBtn.addEventListener("click", () => {
  ingredients.classList.toggle("hidden");
  toggleBtn.textContent = ingredients.classList.contains("hidden")
    ? "Show Ingredients"
    : "Hide Ingredients";
});

// Step Navigation
const steps = document.querySelectorAll(".steps li");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.querySelector(".progress");

let currentStep = 0;

startBtn.addEventListener("click", () => {
  steps.forEach(step => step.classList.remove("active"));
  currentStep = 0;
  steps[currentStep].classList.add("active");
  nextBtn.disabled = false;
  updateProgress();
});

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    steps[currentStep].classList.remove("active");
    currentStep++;
    steps[currentStep].classList.add("active");
    updateProgress();
  } else {
    nextBtn.disabled = true;
  }
});

// Progress Bar Update
function updateProgress() {
  const progressWidth = ((currentStep + 1) / steps.length) * 100;
  progress.style.width = progressWidth + "%";
}
