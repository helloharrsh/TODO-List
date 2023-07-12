const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let tasks = [
  { id: 1, task: "Buy groceries", completed: false },
  { id: 2, task: "Do laundry", completed: false },
  { id: 3, task: "Finish project", completed: true }
];
let nextTaskId = 4;

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add a task
app.post("/tasks", (req, res) => {
  const task = req.body.task;
  const newTask = { id: nextTaskId, task: task, completed: false };
  tasks.push(newTask);
  nextTaskId++;
  res.json(newTask);
});

// Mark a task as complete or incomplete
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const completed = req.body.completed;
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].completed = completed;
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send("Task not found");
  }
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send("Task not found");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
