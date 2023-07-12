const form = document.querySelector("form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

// Add a task to the list
form.addEventListener("submit", async event => {
  event.preventDefault();
  const task = taskInput.value.trim();

  if (task !== "") {
    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task })
      });
      const newTask = await response.json();
      addTaskToDOM(newTask);
      taskInput.value = "";
      taskInput.focus();
    } catch (error) {
      console.error(error);
    }
  }
});

// Mark a task as complete or incomplete
taskList.addEventListener("change", async event => {
  const checkbox = event.target;
  const li = checkbox.parentNode;
  const id = li.dataset.id;
  const completed = checkbox.checked;

  try {
    const response = await fetch(`/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed })
    });
    const updatedTask = await response.json();
    li.classList.toggle("completed", updatedTask.completed);
  } catch (error) {
    console.error(error);
  }
});

// Delete a task from the list
taskList.addEventListener("click", async event => {
  const button = event.target;
  if (button.classList.contains("delete-button")) {
    const li = button.parentNode;
    const id = li.dataset.id;

    try {
      await fetch(`/tasks/${id}`, { method: "DELETE" });
      li.remove();
    } catch (error) {
      console.error(error);
    }
  }
});

// Populate the list with the existing tasks
async function getTasks() {
  try {
    const response = await fetch("/tasks");
    const data = await response.json();
    data.forEach(task => addTaskToDOM(task));
  } catch (error) {
    console.error(error);
  }
}

// Add a task to the DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  const span = document.createElement("span");
  span.textContent = task.task;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteButton);
  taskList.appendChild(li);
}

// Call getTasks when the page loads
getTasks();
