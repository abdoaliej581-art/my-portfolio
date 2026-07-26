// Initialize tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.style.borderColor = '#f56565';
        setTimeout(() => {
            taskInput.style.borderColor = '';
        }, 1000);
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
    updateStats();
}

// Render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>لا توجد مهام لعرضها</p>
            </div>
        `;
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `).join('');
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Delete task
function deleteTask(id) {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('لا توجد مهام مكتملة للحذف');
        return;
    }
    
    if (confirm(`هل أنت متأكد من حذف ${completedCount} مهمة مكتملة؟`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow adding task with Enter key
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();
updateStats();

console.log('%c✅ To-Do List loaded successfully!', 'color: #667eea; font-weight: bold;');
