// المتغيرات
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingId = null;

// إضافة ملاحظة
function addNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        alert('⚠️ من فضلك اكتب عنوان ومحتوى الملاحظة!');
        return;
    }
    
    const note = {
        id: editingId || Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    if (editingId) {
        const index = notes.findIndex(n => n.id === editingId);
        notes[index] = note;
        editingId = null;
        document.querySelector('.add-btn').innerHTML = '<i class="fas fa-plus"></i> إضافة ملاحظة';
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
    
    let filteredNotes = notes;
    if (searchTerm) {
        filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredNotes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <p>${searchTerm ? 'لا توجد ملاحظات تطابق بحثك' : 'لا توجد ملاحظات بعد. ابدأ بإضافة ملاحظة!'}</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredNotes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="edit-btn" onclick="editNote(${note.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="note-content">${escapeHtml(note.content)}</p>
            <div class="note-date">
                <i class="fas fa-clock"></i> ${note.date}
            </div>
        </div>
    `).join('');
}

// تعديل ملاحظة
function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        editingId = id;
        document.querySelector('.add-btn').innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';
        document.getElementById('noteTitle').focus();
    }
}

// حذف ملاحظة
function deleteNote(id) {
    if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
    }
}

// البحث في الملاحظات
function searchNotes() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    renderNotes(searchTerm);
}

// حفظ الملاحظات في LocalStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// مسح الحقول
function clearInputs() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

// حماية من XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// السماح بالإضافة بزر Enter
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('noteContent').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            addNote();
        }
    });
    
    renderNotes();
});

console.log('%c📝 تطبيق الملاحظات جاهز!', 'color: #667eea; font-weight: bold;');
