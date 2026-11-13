/* =========================================================
   projects.js – project details window (Projects page)
   An array of project objects drives the cards' detail view:
   title, description, feature list, screenshot gallery and
   a "Test it now" link.
   ========================================================= */

const projects = [
  {
    id: "website",
    title: "Personal Profile Website",
    summary: "The five-page site you are on now, written by hand without frameworks.",
    description: "I built this site to present my studies and work in one place. It uses semantic HTML for structure, a single external stylesheet for the whole design, and plain JavaScript for every interactive feature. The layout adapts from a phone screen up to a wide desktop, and it has a light and a dark theme.",
    features: [
      "Five pages sharing one header, footer and stylesheet",
      "Responsive layout built with CSS Grid and Flexbox",
      "Light and dark themes with a toggle that remembers your choice",
      "Animated hero, count-up statistics and scroll effects"
    ],
    tags: ["HTML5", "CSS Grid", "Flexbox", "Responsive"],
    link: "index.html",
    linkText: "Test the website now",
    shots: [
      { src: "images/shots/site-home.jpg", caption: "Home page with the animated network background and academic summary" },
      { src: "images/shots/site-courses.jpg", caption: "About page: this semester's courses in a table with progress bars" },
      { src: "images/shots/site-dark.jpg", caption: "The same About page in the dark theme" },
      { src: "images/shots/site-mobile.jpg", caption: "Home page on a phone, with the collapsible menu" }
    ]
  },
  {
    id: "planner",
    title: "Academic Planner",
    summary: "A coursework tracker for adding, completing and deleting tasks.",
    description: "Studying online means managing my own deadlines, so I built a planner for them. Each task records a course code, due date and priority. Ticking a task off updates the counters and progress bar straight away, and overdue tasks are flagged. Tasks are kept in an array and saved in the browser, so they are still there after a refresh.",
    features: [
      "Add tasks with a course code, due date and priority",
      "Mark tasks complete, delete them, or clear all completed tasks",
      "Filter by all, pending or completed",
      "Live counters, a progress bar and overdue warnings"
    ],
    tags: ["JavaScript", "Arrays", "DOM", "localStorage"],
    link: "planner.html",
    linkText: "Test the planner now",
    shots: [
      { src: "images/shots/planner-list.jpg", caption: "Task list with priorities, course codes and due dates" },
      { src: "images/shots/planner-add.jpg", caption: "Adding a task: a missing description is caught before saving" },
      { src: "images/shots/planner-done.jpg", caption: "Every task ticked off: the progress bar reports all tasks complete" },
      { src: "images/shots/planner-mobile.jpg", caption: "The planner on a phone" }
    ]
  },
  {
    id: "contact",
    title: "Validated Contact Form",
    summary: "A contact form that checks every field before it submits.",
    description: "This form checks each field as you leave it and again when you press send. It rejects empty fields, email addresses in the wrong format and phone numbers that contain anything other than digits. Each problem is explained next to its field, invalid fields shake to draw attention, and a confirmation appears once everything is correct.",
    features: [
      "Required name, email, phone number and message",
      "Email format checked with a regular expression",
      "Phone number must contain digits only (7 to 15)",
      "Clear error messages announced to screen readers"
    ],
    tags: ["JavaScript", "Regex", "Forms", "Accessibility"],
    link: "contact.html",
    linkText: "Test the form now",
    shots: [
      { src: "images/shots/contact-errors.jpg", caption: "Invalid entries flagged with an explanation under each field" },
      { src: "images/shots/contact-success.jpg", caption: "Confirmation shown once every field passes" },
      { src: "images/shots/contact-mobile.jpg", caption: "The form on a phone" }
    ]
  }
];

/* ---------- DOM references ---------- */
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalFeatures = document.getElementById("modalFeatures");
const modalTags = document.getElementById("modalTags");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalCounter = document.getElementById("modalCounter");
const modalThumbs = document.getElementById("modalThumbs");
const modalTest = document.getElementById("modalTest");
const prevBtn = document.getElementById("shotPrev");
const nextBtn = document.getElementById("shotNext");

let currentProject = null;
let currentShot = 0;
let lastFocus = null;

/* ---------- Gallery ---------- */
function showShot(index) {
  const shots = currentProject.shots;
  currentShot = (index + shots.length) % shots.length;   // wrap around
  const shot = shots[currentShot];

  modalImage.classList.remove("swap");
  void modalImage.offsetWidth;                            // restart fade
  modalImage.src = shot.src;
  modalImage.alt = currentProject.title + ": " + shot.caption;
  modalImage.classList.add("swap");
  modalCaption.textContent = shot.caption;
  modalCounter.textContent = (currentShot + 1) + " / " + shots.length;

  modalThumbs.querySelectorAll("button").forEach(function (btn, i) {
    btn.classList.toggle("active", i === currentShot);
    btn.setAttribute("aria-current", i === currentShot ? "true" : "false");
  });
}

/* ---------- Open / close ---------- */
function openProject(id) {
  currentProject = projects.find(function (p) { return p.id === id; });
  if (!currentProject) return;
  lastFocus = document.activeElement;

  modalTitle.textContent = currentProject.title;
  modalDesc.textContent = currentProject.description;

  modalFeatures.innerHTML = "";
  currentProject.features.forEach(function (feature) {
    const li = document.createElement("li");
    li.textContent = feature;
    modalFeatures.appendChild(li);
  });

  modalTags.innerHTML = "";
  currentProject.tags.forEach(function (tag) {
    const li = document.createElement("li");
    li.textContent = tag;
    modalTags.appendChild(li);
  });

  modalThumbs.innerHTML = "";
  currentProject.shots.forEach(function (shot, i) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Show screenshot " + (i + 1) + ": " + shot.caption);
    const img = document.createElement("img");
    img.src = shot.src;
    img.alt = "";
    btn.appendChild(img);
    btn.addEventListener("click", function () { showShot(i); });
    modalThumbs.appendChild(btn);
  });

  modalTest.href = currentProject.link;
  modalTest.querySelector("span").textContent = currentProject.linkText;

  showShot(0);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(function () { modal.classList.add("open"); });
  modal.querySelector(".modal-close").focus();
}

function closeProject() {
  modal.classList.remove("open");
  document.body.classList.remove("modal-open");
  setTimeout(function () { modal.hidden = true; }, 250);
  if (lastFocus) lastFocus.focus();
}

/* ---------- Event handling ---------- */
document.querySelectorAll("[data-open-project]").forEach(function (trigger) {
  trigger.addEventListener("click", function () {
    openProject(trigger.dataset.openProject);
  });
});

modal.querySelectorAll("[data-close]").forEach(function (el) {
  el.addEventListener("click", closeProject);
});
prevBtn.addEventListener("click", function () { showShot(currentShot - 1); });
nextBtn.addEventListener("click", function () { showShot(currentShot + 1); });

document.addEventListener("keydown", function (event) {
  if (modal.hidden) return;
  if (event.key === "Escape") closeProject();
  if (event.key === "ArrowRight") showShot(currentShot + 1);
  if (event.key === "ArrowLeft") showShot(currentShot - 1);

  // Keep keyboard focus inside the window
  if (event.key === "Tab") {
    const focusable = modal.querySelectorAll("button, a[href]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

// Swipe between screenshots on touch screens
let touchStartX = null;
modalImage.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
modalImage.addEventListener("touchend", function (e) {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) showShot(currentShot + (dx < 0 ? 1 : -1));
  touchStartX = null;
});
