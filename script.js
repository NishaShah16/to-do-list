const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearAllBtn = document.getElementById("clearAllBtn");

window.addEventListener("load", loadTasks);
addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAll);

// Add new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = createTaskElement(taskText, false);
  taskList.appendChild(li);
  taskInput.value = "";
  saveTasks();
}

// Create <li> with icons
function createTaskElement(text, completed) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const tick = document.createElement("i");
  tick.className = completed ? "fa-solid fa-check tick" : "tick";

  const span = document.createElement("span");
  span.textContent = text;

  li.appendChild(tick);
  li.appendChild(span);

  // Toggle complete
  li.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) return;
    li.classList.toggle("completed");
    tick.className = li.classList.contains("completed")
      ? "fa-solid fa-check tick"
      : "tick";
    saveTasks();
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  li.appendChild(deleteBtn);
  return li;
}

// Save tasks
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach((task) => {
    const li = createTaskElement(task.text, task.completed);
    taskList.appendChild(li);
  });
}

// Filters
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    filterTasks(btn.dataset.filter);
  });
});

function filterTasks(filter) {
  const allTasks = document.querySelectorAll("#taskList li");
  allTasks.forEach((li) => {
    switch (filter) {
      case "all":
        li.style.display = "flex";
        break;
      case "completed":
        li.style.display = li.classList.contains("completed") ? "flex" : "none";
        break;
      case "pending":
        li.style.display = li.classList.contains("completed") ? "none" : "flex";
        break;
    }
  });
}

// Clear all
function clearAll() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
  }
}
