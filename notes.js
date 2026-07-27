let notes = JSON.parse(localStorage.getItem('proNotes')) || [];
let editingId = null;
let selectedColor = 'white';

// إضافة أو تحديث ملاحظة
function addNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title && !content) {
        alert('⚠️ من فضلك اكتب عنواناً أو محتوى للملاحظة!');
        return;
    }
    
    const note = {
        id: editingId || Date.now(),
        title: title || 'ملاحظة بدون عنوان',
        content,
        color: selectedColor,
        pinned: editingId ? notes.find(n => n.id === editingId).pinned : false,
        date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    
    if (editingId) {
        const index = notes.findIndex(n => n.id === editingId);
        notes[index] = note;
        editingId = null;
        document.getElementById('addBtn').innerHTML = '<i class="fas fa-plus"></i> إضافة';
    } else {
        notes.unshift(note);
    }
    
    saveNotes();
    renderNotes();
    clearInputs();
}

// عرض الملاحظات
function renderNotes(searchTerm = '') {
    const grid = document.getElementById('notesGrid');
    
    let filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // ترتيب: المثبتة أولاً
    filteredNotes.sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1);
    
    if (filteredNotes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>${searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد ملاحظات بعد. ابدأ بإضافة فكرة جديدة!'}</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredNotes.map(note => `
        <div class="note-card ${note.pinned ? 'pinned' : ''}" data-color="${note.color}">
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button onclick="togglePin(${note.id})" title="${note.pinned ? 'إلغاء التثبيت' : 'تثبيت'}">
                        <i class="fas fa-thumbtack" style="${note.pinned ? 'color: var(--primary); transform: rotate(45deg);' : ''}"></i>
                    </button>
                    <button onclick="editNote(${note.id})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="note-content">${escapeHtml(note.content)}</p>
            <div class="note-footer">
                <span><i class="far fa-clock"></i> ${note.date}</span>
                <span style="font-size: 0.8rem; opacity: 0.7;">${note.pinned ? '📌 مثبت' : ''}</span>
            </div>
        </div>
    `).join('');
}

// تبديل التثبيت
function togglePin(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.pinned = !note.pinned;
        saveNotes();
        renderNotes(document.getElementById('searchInput').value);
    }
}

// تعديل ملاحظة
function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        document.getElementById('noteTitle').value = note.title === 'ملاحظة بدون عنوان' ? '' : note.title;
        document.getElementById('noteContent').value = note.content;
        selectColor(note.color);
        editingId = id;
        document.getElementById('addBtn').innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';
        document.getElementById('noteInputCard').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('noteTitle').focus();
    }
}

// حذف ملاحظة
function deleteNote(id) {
    if (confirm('هل أنت متأكد من حذف هذه الملاحظة نهائياً؟')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes(document.getElementById('searchInput').value);
    }
}

// البحث
function searchNotes() {
    renderNotes(document.getElementById('searchInput').value);
}

// اختيار اللون
function selectColor(color) {
    selectedColor = color;
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === color);
    });
}

// تصدير الملاحظات
function exportNotes() {
    if (notes.length === 0) {
        alert('لا توجد ملاحظات لتصديرها!');
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "my_notes_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// حفظ في LocalStorage
function saveNotes() {
    localStorage.setItem('proNotes', JSON.stringify(notes));
}

// مسح الحقول
function clearInputs() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    selectColor('white');
}

// حماية من XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// تبديل الوضع الليلي
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('notesTheme', newTheme);
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('notesTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    renderNotes();
    
    // إضافة بزر Ctrl+Enter
    document.getElementById('noteContent').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            addNote();
        }
    });
});
