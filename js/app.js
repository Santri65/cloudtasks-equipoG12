const newTaskButton = document.querySelector('#new-task-button');
const taskFormSection = document.querySelector('#task-form-section');
const cancelTaskButton = document.querySelector('#cancel-task-button');
const closeTaskButton = document.querySelector('#close-task-button');
const taskMenu = document.querySelector('.task-menu');

function setTaskFormOpen(isOpen) {
	taskFormSection.classList.toggle('is-open', isOpen);
	taskFormSection.setAttribute('aria-hidden', String(!isOpen));
	newTaskButton.setAttribute('aria-expanded', String(isOpen));

	if (isOpen) {
		taskFormSection.querySelector('input').focus();
	}
}

newTaskButton.addEventListener('click', () => {
	const isOpen = newTaskButton.getAttribute('aria-expanded') === 'true';
	setTaskFormOpen(!isOpen);
});

cancelTaskButton.addEventListener('click', () => setTaskFormOpen(false));
closeTaskButton.addEventListener('click', () => setTaskFormOpen(false));

document.addEventListener('click', (event) => {
	if (!taskMenu.contains(event.target)) {
		setTaskFormOpen(false);
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		setTaskFormOpen(false);
	}
});

document.querySelector('#task-form').addEventListener('submit', (event) => {
	event.preventDefault();
});
