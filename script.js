// Takes username input and displays it everytime the page loads
let username = localStorage.getItem('username') || '';
if (username) {
    document.getElementById('greeting').textContent = `Welcome back, ${username}!`;
}
else {
    username = prompt('Please enter your name:');
    localStorage.setItem('username', username);
    document.getElementById('greeting').textContent = `Welcome, ${username}!`;
}


// Greets user based on the time of the day
let hour = new Date().getHours();
let greeting;

if (hour < 12) {
    greeting = "Good morning"
}
else if (hour < 15) {
    greeting = "Good afternoon"
}
else {
    greeting = "Good evening"
}
document.querySelector('h2').textContent = `${greeting}, ${username}!`;

// Random Quote
let quote = [
    "The secret of getting ahead is getting started.",
    "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
    "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    "Success is often achieved by those who don\'t know that failure is inevitable.",
    "Don\'t watch the clock; do what it does. Keep going."
];
let author = [
    "Mark Twain",
    "Paul J. Meyer",
    "Stephen King",
    "Coco Chanel",
    "Sam Levenson"
];
function randomQuotes() {
    let ranNum = Math.floor(Math.random() * quote.length);
    document.getElementById('quote').textContent = `"${quote[ranNum]}"`;
    document.getElementById('author').textContent = `- ${author[ranNum]}`;
};
randomQuotes();

// Logic for to-do list
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-button');
const list = document.getElementById('task-list');
// Add task on button click
addBtn.addEventListener('click', addTask);
// Add task on Enter key press
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter'){
        addTask();
    }
});
// Displays the number of characters in the input field
let count = document.getElementById('count');
input.addEventListener('input', function () {
    let counter = input.value.trim();
    count.textContent = `${counter.length}/120`;
    if (counter.length > 120) {
        count.style.color = 'red';
    } else {
        count.style.color = 'white';
    }
    if (counter.length === 0) {
        count.textContent = '';
    }
});

function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function updateStats() {
    document.getElementById('total-tasks').textContent = `Total tasks: ${tasks.length}`;
    const completed = tasks.filter(task => task.completed).length;
    
    document.getElementById('completed-tasks').textContent = `Completed: ${completed}`;
}

// Function to add tasks
function addTask() {
    const taskText = input.value.trim();
    if (taskText === '' || taskText.length > 120) {
        alert('Please enter a valid task (1-120 characters).');
        return;
    }
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasksToStorage();
    renderTasks();

    input.value = '';
    input.focus();
}     

function renderTasks() {
    list.innerHTML = '';
    // Sort: incomplete first, then completed
    const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);
    sortedTasks.forEach(task => renderTask(task));
    updateStats();
}

function renderTask(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) {
        li.classList.add('task-completed');
    }
    // Create task text
    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;
    taskSpan.classList.add('task-text');
    // Create action buttons
    const actionBox = document.createElement('div');
    actionBox.classList.add('task-actions');
    actionBox.style.display = 'none';
    //Create complete button
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeBtn.classList.add('complete-btn');
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    // Add the buttons to task-actions div
    actionBox.appendChild(completeBtn);
    actionBox.appendChild(deleteBtn);
    // Add everything to <li>
    li.appendChild(taskSpan);
    li.appendChild(actionBox);
    // Add the <li> to its list
    list.appendChild(li);

    // Toggle button visibility on click
    li.addEventListener('click', ()=> {
        const isVisible = actionBox.style.display === 'flex';

        // Hide all action boxes first 
        document.querySelectorAll('.task-actions').forEach(box => 
            box.style.display = 'none');
        actionBox.style.display = isVisible ? 'none' : 'flex';
    });
    
    // Complete button logic
    completeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();

    });

    // Delete button logic
    deleteBtn.addEventListener('click', (e)=> {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasksToStorage();
        renderTasks();
    });
}


// Initial render when page loads
renderTasks();
