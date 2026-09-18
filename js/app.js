const SUPABASE_URL = 'https://ynpiszwcyjfoahgzqhyl.supabase.co';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY_AQUI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let tasks = [];

// =============================
// DOM ELEMENTS
// =============================

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const loginForm = document.getElementById("login-form");
const loginEmailInput = document.getElementById("login-email");
const authMessage = document.getElementById("auth-message");
const logoutButton = document.getElementById("logout-button");

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

const priorityFilter = document.getElementById("priority-filter");
const dateFilter = document.getElementById("date-filter");


// =============================
// INITIALIZATION
// =============================

document.addEventListener("DOMContentLoaded", async () => {
    initEventListeners();

    const { data: { session } } = await supabase.auth.getSession();
    handleSessionVisibility(session);

    supabase.auth.onAuthStateChange((_event, session) => {
        handleSessionVisibility(session);
    });
});


// =============================
// AUTH & SESSION HANDLING
// =============================

function handleSessionVisibility(session) {
    if (session) {
        if (authSection) authSection.style.display = 'none';
        if (appSection) appSection.style.display = 'block';
        fetchTasks();
    } else {
        if (authSection) authSection.style.display = 'flex';
        if (appSection) appSection.style.display = 'none';
        tasks = [];
        updateDashboard();
    }
}


// =============================
// SUPABASE DATABASE OPERATIONS
// =============================

async function fetchTasks() {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tasks from Supabase:', error.message);
        return;
    }

    tasks = data || [];
    renderTasks();
    updateDashboard();
}

async function createTask() {
    const taskData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        completed: false,
        deadline: deadlineInput.value || null,
        priority: priorityInput.value
    };

    if (!validateTask(taskData)) {
        return;
    }

    const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

    if (error) {
        alert(`Error saving task: ${error.message}`);
        return;
    }

    clearForm();
    closeTaskForm();
    fetchTasks();
}

async function toggleTask(id, currentStatus) {
    const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', id);

    if (error) {
        alert(`Error updating status: ${error.message}`);
    } else {
        fetchTasks();
    }
}

async function deleteTask(id, taskTitle) {
    const confirmation = confirm(`Do you want to delete "${taskTitle}"?`);

    if (!confirmation) return;

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        alert(`Error deleting task: ${error.message}`);
    } else {
        fetchTasks();
    }
}


// =============================
// FORM UI CONTROLS
// =============================

function openTaskForm() {
    taskFormSection.classList.add("is-open");
    taskFormSection.setAttribute("aria-hidden", "false");
    newTaskButton.setAttribute("aria-expanded", "true");
    titleInput.focus();
}

function closeTaskForm() {
    taskFormSection.classList.remove("is-open");
    taskFormSection.setAttribute("aria-hidden", "true");
    newTaskButton.setAttribute("aria-expanded", "false");
}

function clearForm() {
    taskForm.reset();
    priorityInput.value = "medium";
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

    if (task.deadline) {
        const today = new Date();
        const deadline = new Date(task.deadline + "T00:00:00");

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
// FILTER LOGIC
// =============================

function getFilteredTasks() {
    const selectedPriority = priorityFilter ? priorityFilter.value : "all";
    const selectedDate = dateFilter ? dateFilter.value : "all";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
        const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;

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
// RENDER TASKS
// =============================

function renderTasks() {
    taskList.innerHTML = "";

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
                        ${escapeHTML(task.description || "")}
                    </p>

                    <span class="task-deadline">
                        Deadline: ${deadlineText}
                    </span>
                </div>
            </div>

            <div class="task-info">
                <span class="task-priority ${task.priority || 'medium'}">
                    ${capitalize(task.priority || 'medium')}
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
            toggleTask(task.id, task.completed);
        });

        const deleteButton = taskCard.querySelector(".delete-task");
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id, task.title);
        });

        taskList.appendChild(taskCard);
    });
}


// =============================
// DASHBOARD
// =============================

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    if (totalTasks) totalTasks.textContent = total;
    if (pendingTasks) pendingTasks.textContent = pending;
    if (completedTasks) completedTasks.textContent = completed;
}


// =============================
// UTILS
// =============================

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function capitalize(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHTML(text) {
    if (!text) return "";
    const element = document.createElement("div");
    element.textContent = text;
    return element.innerHTML;
}


// =============================
// EVENT LISTENERS
// =============================

function initEventListeners() {
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = loginEmailInput.value;
            authMessage.textContent = 'Sending magic link...';

            const { error } = await supabase.auth.signInWithOtp({ email });

            if (error) {
                authMessage.textContent = `Error: ${error.message}`;
            } else {
                authMessage.textContent = 'Check your email inbox for the magic sign-in link!';
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            await supabase.auth.signOut();
        });
    }

    if (newTaskButton) {
        newTaskButton.addEventListener("click", () => {
            if (taskFormSection.classList.contains("is-open")) {
                closeTaskForm();
            } else {
                openTaskForm();
            }
        });
    }

    if (closeTaskButton) {
        closeTaskButton.addEventListener("click", closeTaskForm);
    }

    if (cancelTaskButton) {
        cancelTaskButton.addEventListener("click", () => {
            clearForm();
            closeTaskForm();
        });
    }

    if (taskForm) {
        taskForm.addEventListener("submit", event => {
            event.preventDefault();
            createTask();
        });
    }

    if (priorityFilter) {
        priorityFilter.addEventListener("change", renderTasks);
    }

    if (dateFilter) {
        dateFilter.addEventListener("change", renderTasks);
    }
}