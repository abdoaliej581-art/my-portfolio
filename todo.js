// نجيب المهام من LocalStorage (أو نبدأ بمصفوفة فاضية)
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

// دالة حفظ المهام في LocalStorage
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// دالة إضافة مهمة جديدة
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskText = taskInput.value.trim();
    
    if (taskText === "") {
        alert("من فضلك اكتب مهمة أولاً!");
        return;
    }
    
    var task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();  // نحفظ
    taskInput.value = "";
    renderTasks();
}

// دالة عرض المهام
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
    
    updateTaskCount();
}

// دالة حذف مهمة
function deleteTask(taskId) {
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    saveTasks();  // نحفظ
    renderTasks();
}

// دالة إكمال/إلغاء مهمة
function toggleTask(taskId) {
    var task = tasks.find(function(t) {
        return t.id === taskId;
    });
    
    if (task) {
        task.completed = !task.completed;
        saveTasks();  // نحفظ
        renderTasks();
    }
}

// دالة تحديث العدّاد
function updateTaskCount() {
    var remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    });
    document.getElementById("taskCount").innerText = remainingTasks.length;
}

// Enter لإضافة مهمة
document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// نعرض المهام أول ما الصفحة تفتح
renderTasks();
