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

const priorityFilter = document.getElementById("priority-filter");
const dateFilter = document.getElementById("date-filter");

// =============================
// INITIALIZATION
// =============================

document.addEventListener("DOMContentLoaded", async () => {
    await loadTasks();
    renderTasks();
    updateDashboard();
});

// =============================
// LOAD TASKS FROM SUPABASE
// =============================

async function loadTasks() {

    const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading tasks:", error);

        taskList.innerHTML = `
            <div class="empty-state">
                <h3>Could not load tasks</h3>
                <p>Check the Supabase connection.</p>
            </div>
        `;

        return;
    }

    tasks = data || [];
}


// =============================
// OPEN FORM
// =============================

function openTaskForm() {

    taskFormSection.classList.add("is-open");

    taskFormSection.setAttribute(
        "aria-hidden",
        "false"
    );

    newTaskButton.setAttribute(
        "aria-expanded",
        "true"
    );

    titleInput.focus();
}


// =============================
// CLOSE FORM
// =============================

function closeTaskForm() {

    taskFormSection.classList.remove("is-open");

    taskFormSection.setAttribute(
        "aria-hidden",
        "true"
    );

    newTaskButton.setAttribute(
        "aria-expanded",
        "false"
    );
}


// =============================
// CREATE TASK
// =============================

async function createTask() {

    const task = {

        title: titleInput.value.trim(),

        description: descriptionInput.value.trim(),

        completed: false,

        deadline:
            deadlineInput.value === ""
                ? null
                : deadlineInput.value,

        priority: priorityInput.value
    };


    if (!validateTask(task)) {
        return;
    }


    const { data, error } = await supabaseClient
        .from("tasks")
        .insert([task])
        .select()
        .single();


    if (error) {

        console.error(
            "Error creating task:",
            error
        );

        alert("Could not create the task.");

        return;
    }


    tasks.unshift(data);

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


    if (task.deadline !== null) {

        const today = new Date();

        const deadline = new Date(
            task.deadline + "T00:00:00"
        );


        today.setHours(
            0,
            0,
            0,
            0
        );


        if (deadline < today) {

            alert(
                "The deadline cannot be in the past."
            );

            deadlineInput.focus();

            return false;
        }
    }


    return true;
}


// =============================
// COMPLETE TASK
// =============================

async function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) {

        alert("Task not found.");

        return;
    }


    const newCompletedState =
        !task.completed;


    const { data, error } = await supabaseClient
        .from("tasks")
        .update({
            completed: newCompletedState
        })
        .eq("id", id)
        .select()
        .single();


    if (error) {

        console.error(
            "Error updating task:",
            error
        );

        alert(
            "Could not update the task."
        );

        return;
    }


    const index = tasks.findIndex(
        task => task.id === id
    );


    tasks[index] = data;

    renderTasks();

    updateDashboard();
}


// =============================
// DELETE TASK
// =============================

async function deleteTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


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


    const { error } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(
            "Error deleting task:",
            error
        );

        alert(
            "Could not delete the task."
        );

        return;
    }


    tasks = tasks.filter(
        task => task.id !== id
    );


    renderTasks();

    updateDashboard();
}


// =============================
// FILTER LOGIC
// =============================

function getFilteredTasks() {

    const selectedPriority =
        priorityFilter
            ? priorityFilter.value
            : "all";


    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "all";


    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const startOfWeek =
        new Date(today);

    const day =
        startOfWeek.getDay();


    const daysFromMonday =
        day === 0
            ? 6
            : day - 1;


    startOfWeek.setDate(
        startOfWeek.getDate()
        - daysFromMonday
    );


    const endOfWeek =
        new Date(startOfWeek);

    endOfWeek.setDate(
        endOfWeek.getDate() + 6
    );


    const startOfMonth =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );


    const endOfMonth =
        new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
        );


    return tasks.filter(task => {

        // =============================
        // PRIORITY
        // =============================

        const matchesPriority =
            selectedPriority === "all"
            ||
            task.priority === selectedPriority;


        // =============================
        // DATE
        // =============================

        let matchesDate = true;


        if (task.deadline) {

            const taskDeadline =
                new Date(
                    task.deadline + "T00:00:00"
                );


            if (
                selectedDate === "today"
            ) {

                matchesDate =
                    taskDeadline.getTime()
                    === today.getTime();

            } else if (
                selectedDate === "week"
            ) {

                matchesDate =
                    taskDeadline >= startOfWeek
                    &&
                    taskDeadline <= endOfWeek;

            } else if (
                selectedDate === "month"
            ) {

                matchesDate =
                    taskDeadline >= startOfMonth
                    &&
                    taskDeadline <= endOfMonth;

            } else if (
                selectedDate === "upcoming"
            ) {

                matchesDate =
                    taskDeadline > today;

            } else if (
                selectedDate === "overdue"
            ) {

                matchesDate =
                    taskDeadline < today
                    &&
                    !task.completed;

            } else if (
                selectedDate === "no-deadline"
            ) {

                matchesDate = false;
            }

        } else if (
            selectedDate === "no-deadline"
        ) {

            matchesDate = true;

        } else if (
            selectedDate !== "all"
        ) {

            matchesDate = false;
        }

        return (
            matchesPriority
            &&
            matchesDate
        );
    });
}


// =============================
// RENDER TASKS
// =============================

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks match your criteria</h3>
                <p>
                    Try changing the filters
                    or create a new task.
                </p>
            </div>
        `;

        return;
    }


    filteredTasks.forEach(task => {

        const taskCard =
            document.createElement("article");


        taskCard.classList.add(
            "task-card"
        );


        if (task.completed) {

            taskCard.classList.add(
                "completed"
            );
        }


        const deadlineText =
            task.deadline
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
                        ${escapeHTML(
                            task.description || ""
                        )}
                    </p>

                    <span class="task-deadline">
                        Deadline: ${deadlineText}
                    </span>

                </div>

            </div>


            <div class="task-info">

                <span
                    class="task-priority ${task.priority}"
                >
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


        const checkbox =
            taskCard.querySelector(
                ".task-checkbox"
            );


        checkbox.addEventListener(
            "change",
            () => toggleTask(task.id)
        );


        const deleteButton =
            taskCard.querySelector(
                ".delete-task"
            );


        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        taskList.appendChild(
            taskCard
        );
    });
}


// =============================
// DASHBOARD
// =============================

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        tasks.filter(
            task => !task.completed
        ).length;


    totalTasks.textContent =
        total;


    pendingTasks.textContent =
        pending;


    completedTasks.textContent =
        completed;
}


// =============================
// CLEAR FORM
// =============================

function clearForm() {

    taskForm.reset();

    priorityInput.value =
        "medium";
}


// =============================
// FORMAT DATE
// =============================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


// =============================
// CAPITALIZE TEXT
// =============================

function capitalize(text) {

    return (
        text.charAt(0).toUpperCase()
        +
        text.slice(1)
    );
}


// =============================
// HTML SECURITY
// =============================

function escapeHTML(text) {

    const element =
        document.createElement("div");


    element.textContent =
        text;


    return element.innerHTML;
}


// =============================
// EVENT LISTENERS
// =============================

newTaskButton.addEventListener(
    "click",
    () => {

        if (
            taskFormSection.classList.contains(
                "is-open"
            )
        ) {

            closeTaskForm();

        } else {

            openTaskForm();
        }
    }
);


closeTaskButton.addEventListener(
    "click",
    () => closeTaskForm()
);


cancelTaskButton.addEventListener(
    "click",
    () => {

        clearForm();

        closeTaskForm();
    }
);


taskForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        createTask();
    }
);


if (priorityFilter) {

    priorityFilter.addEventListener(
        "change",
        renderTasks
    );
}


if (dateFilter) {

    dateFilter.addEventListener(
        "change",
        renderTasks
    );
}