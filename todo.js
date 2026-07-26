// مصفوفة لتخزين المهام
let tasks = [];

// دالة إضافة مهمة جديدة
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskText = taskInput.value.trim();
    
    if (taskText === "") {
        alert("من فضلك اكتب مهمة أولاً!");
        return;
    }
    
    // نضيف المهمة للمصفوفة
    var task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    taskInput.value = "";
    
    // نعرض المهام
    renderTasks();
}

// دالة عرض المهام على الشاشة
function renderTasks() {
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    tasks.forEach(function(task) {
        var li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) {
            li.classList.add("completed");
        }
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">حذف</button>
        `;
        
        taskList.appendChild(li);
    });
    
    // نحدث عدد المهام
    updateTaskCount();
}

// دالة حذف مهمة
function deleteTask(taskId) {
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    renderTasks();
}

// دالة إكمال/إلغاء إكمال مهمة
function toggleTask(taskId) {
    var task = tasks.find(function(t) {
        return t.id === taskId;
    });
    
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// دالة تحديث عدد المهام
function updateTaskCount() {
    var remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    });
    
    document.getElementById("taskCount").innerText = remainingTasks.length;
}

// السماح بالإضافة بزر Enter
document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});
