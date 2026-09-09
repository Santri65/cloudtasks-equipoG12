let tasks = [];

// =============================
// DOM ELEMENTS
// =============================

const newTaskButton = document.getElementById("new-task-button");
const closeTaskButton = document.getElementById("close-task-button");
const cancelTaskButton = document.getElementById("cancel-task-button");

const taskFormSection = document.getElementById("task-form-section");
const taskForm = document.getElementById("task-form");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const deadlineInput = document.getElementById("deadline");
const priorityInput = document.getElementById("priority");

const taskList = document.getElementById("task-list");

const totalTasks = document.getElementById("total-tasks");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");

// NUEVO: Elementos DOM para los Filtros
const priorityFilter = document.getElementById("priority-filter");
const dateFilter = document.getElementById("date-filter");


// =============================
// INITIALIZATION
// =============================

document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
    renderTasks();
    updateDashboard();
});


// =============================
// INITIAL DATA
// =============================

function loadInitialData() {
    tasks = [];
}


// =============================
// OPEN FORM
// =============================

function openTaskForm() {
    taskFormSection.classList.add("is-open");
    taskFormSection.setAttribute("aria-hidden", "false");
    newTaskButton.setAttribute("aria-expanded", "true");
    titleInput.focus();
}


// =============================
// CLOSE FORM
// =============================

function closeTaskForm() {
    taskFormSection.classList.remove("is-open");
    taskFormSection.setAttribute("aria-hidden", "true");
    newTaskButton.setAttribute("aria-expanded", "false");
}


// =============================
// CREATE TASK
// =============================

function createTask() {
    const task = {
        id: Date.now(),
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        completed: false,
        created_at: new Date().toISOString(),
        deadline: deadlineInput.value,
        priority: priorityInput.value
    };

    if (!validateTask(task)) {
        return;
    }

    tasks.push(task);

    clearForm();
    closeTaskForm();
    renderTasks();
    updateDashboard();
}


// =============================
// VALIDATION
// =============================

function validateTask(task) {
    if (task.title === "") {
        alert("The task title is required.");
        titleInput.focus();
        return false;
    }

    if (task.deadline !== "") {
        const today = new Date();
        const deadline = new Date(task.deadline);

        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        if (deadline < today) {
            alert("The deadline cannot be in the past.");
            deadlineInput.focus();
            return false;
        }
    }

    return true;
}


// =============================
// COMPLETE TASK
// =============================

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        alert("Task not found.");
        return;
    }

    task.completed = !task.completed;

    renderTasks();
    updateDashboard();
}


// =============================
// DELETE TASK
// =============================

function deleteTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        alert("Task not found.");
        return;
    }

    const confirmation = confirm(
        `Do you want to delete "${task.title}"?`
    );

    if (!confirmation) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    renderTasks();
    updateDashboard();
}


// =============================
// FILTER LOGIC (NUEVO)
// =============================

function getFilteredTasks() {
    const selectedPriority = priorityFilter ? priorityFilter.value : "all";
    const selectedDate = dateFilter ? dateFilter.value : "all";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
        // 1. Filtro por Prioridad
        const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;

        // 2. Filtro por Fecha
        let matchesDate = true;
        if (task.deadline) {
            const taskDeadline = new Date(task.deadline + "T00:00:00");
            taskDeadline.setHours(0, 0, 0, 0);

            if (selectedDate === "today") {
                matchesDate = taskDeadline.getTime() === today.getTime();
            } else if (selectedDate === "upcoming") {
                matchesDate = taskDeadline > today;
            } else if (selectedDate === "overdue") {
                matchesDate = taskDeadline < today && !task.completed;
            } else if (selectedDate === "no-deadline") {
                matchesDate = false;
            }
        } else if (selectedDate === "no-deadline") {
            matchesDate = true;
        } else if (selectedDate !== "all") {
            matchesDate = false;
        }

        return matchesPriority && matchesDate;
    });
}


// =============================
// RENDER TASKS (MODIFICADO)
// =============================

function renderTasks() {
    taskList.innerHTML = "";

    // Obtener las tareas filtradas en lugar de todas
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks match your criteria</h3>
                <p>Try changing the filters or create a new task.</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const taskCard = document.createElement("article");
        taskCard.classList.add("task-card");

        if (task.completed) {
            taskCard.classList.add("completed");
        }

        const deadlineText = task.deadline
            ? formatDate(task.deadline)
            : "No deadline";

        taskCard.innerHTML = `
            <div class="task-main">
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                    aria-label="Mark task as completed"
                >

                <div class="task-content">
                    <h3>
                        ${escapeHTML(task.title)}
                    </h3>

                    <p>
                        ${escapeHTML(task.description)}
                    </p>

                    <span class="task-deadline">
                        Deadline: ${deadlineText}
                    </span>
                </div>
            </div>

            <div class="task-info">
                <span class="task-priority ${task.priority}">
                    ${capitalize(task.priority)}
                </span>

                <button
                    type="button"
                    class="delete-task"
                >
                    Delete
                </button>
            </div>
        `;

        const checkbox = taskCard.querySelector(".task-checkbox");
        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const deleteButton = taskCard.querySelector(".delete-task");
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(taskCard);
    });
}


// =============================
// DASHBOARD
// =============================

function updateDashboard() {
    const total = tasks.length;

    const completed = tasks.filter(task =>
        task.completed
    ).length;

    const pending = tasks.filter(task =>
        !task.completed
    ).length;

    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
}


// =============================
// CLEAR FORM
// =============================

function clearForm() {
    taskForm.reset();
    priorityInput.value = "medium";
}


// =============================
// FORMAT DATE
// =============================

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}


// =============================
// CAPITALIZE TEXT
// =============================

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


// =============================
// HTML SECURITY
// =============================

function escapeHTML(text) {
    const element = document.createElement("div");
    element.textContent = text;
    return element.innerHTML;
}


// =============================
// EVENT LISTENERS
// =============================

newTaskButton.addEventListener("click", () => {
    if (taskFormSection.classList.contains("is-open")) {
        closeTaskForm();
    } else {
        openTaskForm();
    }
});

closeTaskButton.addEventListener("click", () => {
    closeTaskForm();
});

cancelTaskButton.addEventListener("click", () => {
    clearForm();
    closeTaskForm();
});

taskForm.addEventListener("submit", event => {
    event.preventDefault();
    createTask();
});

// NUEVO: Escuchadores de eventos para aplicar los filtros al cambiar las opciones
if (priorityFilter) {
    priorityFilter.addEventListener("change", renderTasks);
}

if (dateFilter) {
    dateFilter.addEventListener("change", renderTasks);
}