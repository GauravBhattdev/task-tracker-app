const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const priorityInput = document.getElementById("priority");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let appTheme = "light"

renderTasks();

addTaskBtn.addEventListener("click", addTask);

searchInput.addEventListener("input", renderTasks);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        showToast("Task cannot be empty");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priorityInput.value
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    showToast("Task Added");
}
// add task feature completed fully
function renderTasks() {

    taskList.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchValue)
    );

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <div>
                <span>${task.text}</span>
                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>
            </div>

            <div class="task-buttons">

                <button onclick="toggleTask(${task.id})">
                  '\u2714'
                </button>

                <button onclick="editTask(${task.id})">
                   "\u270F"
                </button>

                <button onclick="deleteTask(${task.id})">
                    "\u2715"
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateCounters();
}

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

    showToast("Task Deleted");
}
 // delete task completed
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updatedText = prompt("Edit Task", task.text);

    if (updatedText !== null) {
        task.text = updatedText;

        saveTasks();

        renderTasks();

        showToast("Task Updated");
    }
}
// Search feature completed
function updateCounters() {

    const completedTasks = tasks.filter(task => task.completed).length;

    const pendingTasks = tasks.length - completedTasks;

    completedCount.textContent = completedTasks;

    pendingCount.textContent = pendingTasks;
}

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}