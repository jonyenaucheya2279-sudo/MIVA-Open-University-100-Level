/* =========================================================
   planner.js – Interactive academic task manager
   Demonstrates: arrays, functions, event handling,
   DOM manipulation and dynamic content updates.
   Tasks are saved in localStorage so they survive a refresh.
   ========================================================= */

const STORAGE_KEY = "jo-profile-planner-tasks";

// The array that holds every task object
let tasks = loadTasks();
let currentFilter = "all";

// DOM references
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("taskTitle");
const courseInput = document.getElementById("taskCourse");
const dateInput = document.getElementById("taskDate");
const priorityInput = document.getElementById("taskPriority");
const taskError = document.getElementById("taskError");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("taskFilter");
const clearDoneBtn = document.getElementById("clearCompleted");

/* ---------- Storage helpers ---------- */
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* storage unavailable – fall back to sample tasks */ }

  // Example tasks shown on first visit (based on this semester's courses)
  return [
    { id: 1, title: "Finish and submit the CSC 106 term project", course: "CSC 106", due: "2026-11-30", priority: "high", completed: false },
    { id: 2, title: "Write up the PHY 108 practical report", course: "PHY 108", due: "2026-11-24", priority: "high", completed: false },
    { id: 3, title: "Practise MTH 102 integration questions", course: "MTH 102", due: "", priority: "medium", completed: false },
    { id: 4, title: "Complete the next COS 102 problem-solving module", course: "COS 102", due: "", priority: "medium", completed: false },
    { id: 5, title: "Read GST 112 unit on Nigerian cultural groups", course: "GST 112", due: "", priority: "low", completed: true }
  ];
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) { /* ignore – tasks still work for this visit */ }
}

/* ---------- Core actions ---------- */
function addTask(title, course, due, priority) {
  const task = {
    id: Date.now(),
    title: title,
    course: course,
    due: due,
    priority: priority,
    completed: false
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id, element) {
  element.classList.add("removing");         // play the exit transition
  setTimeout(function () {
    tasks = tasks.filter(function (task) { return task.id !== id; });
    saveTasks();
    renderTasks();
  }, 300);
}

function clearCompleted() {
  const doneCount = tasks.filter(function (t) { return t.completed; }).length;
  if (doneCount === 0) return;
  tasks = tasks.filter(function (task) { return !task.completed; });
  saveTasks();
  renderTasks();
}

/* ---------- Helpers ---------- */
function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter(function (t) { return !t.completed; });
  if (currentFilter === "completed") return tasks.filter(function (t) { return t.completed; });
  return tasks;
}

function formatDate(dateString) {
  if (!dateString) return "date not set";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(task) {
  if (!task.due || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due + "T00:00:00") < today;
}

/* ---------- Rendering (dynamic DOM updates) ---------- */
function renderTasks() {
  taskList.innerHTML = "";
  const visible = getVisibleTasks();

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = currentFilter === "completed"
      ? "No completed tasks yet. Keep going!"
      : "No tasks here. Add one using the form.";
    taskList.appendChild(empty);
  }

  visible.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item priority-" + task.priority + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark \"" + task.title + "\" as completed");
    checkbox.addEventListener("change", function () { toggleTask(task.id); });

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const course = document.createElement("span");
    course.className = "code";
    course.textContent = task.course || "General";

    const due = document.createElement("span");
    due.textContent = "Due " + formatDate(task.due);
    if (isOverdue(task)) {
      due.classList.add("overdue");
      due.textContent += " (overdue)";
    }

    const priority = document.createElement("span");
    priority.className = "prio";
    priority.textContent = task.priority;

    meta.append(priority, course, due);
    info.append(title, meta);

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.type = "button";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete \"" + task.title + "\"");
    del.addEventListener("click", function () { deleteTask(task.id, li); });

    li.append(checkbox, info, del);
    taskList.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const total = tasks.length;
  const done = tasks.filter(function (t) { return t.completed; }).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  setCount("countTotal", total);
  setCount("countActive", total - done);
  setCount("countDone", done);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressBar").parentElement.classList.toggle("complete", total > 0 && done === total);
  document.getElementById("progressLabel").textContent =
    total > 0 && done === total ? "All tasks complete" : percent + "% complete";
}

/* Update a counter and play a short "bump" animation when it changes */
function setCount(id, value) {
  const el = document.getElementById(id);
  if (el.textContent === String(value)) return;
  el.textContent = value;
  el.classList.remove("bump");
  void el.offsetWidth;          // restart the animation
  el.classList.add("bump");
}

/* ---------- Event handling ---------- */
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();

  if (title === "") {
    taskError.textContent = "Please enter a task description.";
    titleInput.focus();
    return;
  }
  taskError.textContent = "";

  addTask(title, courseInput.value.trim(), dateInput.value, priorityInput.value);
  taskForm.reset();
  priorityInput.value = "medium";
  titleInput.focus();
});

filterSelect.addEventListener("change", function () {
  currentFilter = filterSelect.value;
  renderTasks();
});

clearDoneBtn.addEventListener("click", clearCompleted);

// First paint
renderTasks();
