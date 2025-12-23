// Data
let tasks = [
    { id: 1, title: "Laporan Keuangan", priority: "high", completed: true },
    { id: 2, title: "Presentasi Klien", priority: "high", completed: false },
    { id: 3, title: "Update Website", priority: "medium", completed: false },
    { id: 4, title: "Riset Pasar", priority: "low", completed: true },
    { id: 5, title: "Meeting Tim", priority: "medium", completed: false }
];

let users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "active" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", status: "inactive" },
    { id: 4, name: "Maria Garcia", email: "maria@example.com", status: "active" }
];

// Utility Functions
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    const toastId = 'toast-' + Date.now();
    const icons = {
        success: 'bi-check-circle',
        danger: 'bi-exclamation-triangle',
        warning: 'bi-exclamation-circle',
        info: 'bi-info-circle'
    };

    const toast = `
                <div id="${toastId}" class="toast align-items-center text-bg-${type}" role="alert">
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="bi ${icons[type] || 'bi-info-circle'} me-2"></i>
                            ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            `;

    container.insertAdjacentHTML('beforeend', toast);
    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();

    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
}

function updateStats() {
    document.getElementById('taskCount').textContent = tasks.length;
    document.getElementById('userCount').textContent = users.length;
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const searchTerm = document.getElementById('taskSearch').value.toLowerCase();
    let filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));

    if (filteredTasks.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Tidak ada tugas</p>';
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <input class="form-check-input me-2" type="checkbox" 
                                   ${task.completed ? 'checked' : ''} data-id="${task.id}">
                            <span>${task.title}</span>
                            <span class="badge ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-success'} ms-2">
                                ${task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                            </span>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" data-id="${task.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

    // Add event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const taskId = parseInt(this.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                updateStats();
                renderTasks();
                showToast(`Tugas "${task.title}" ${task.completed ? 'diselesaikan' : 'dibatalkan'}`, 'success');
            }
        });
    });

    container.querySelectorAll('.btn-outline-danger').forEach(btn => {
        btn.addEventListener('click', function () {
            const taskId = parseInt(this.dataset.id);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                const taskTitle = tasks[taskIndex].title;
                tasks.splice(taskIndex, 1);
                updateStats();
                renderTasks();
                showToast(`Tugas "${taskTitle}" dihapus`, 'danger');
            }
        });
    });
}

function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                            ${user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-warning me-1" data-id="${user.id}">
                            <i class="bi bi-arrow-repeat"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${user.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

    // Add event listeners
    tbody.querySelectorAll('.btn-outline-warning').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = parseInt(this.dataset.id);
            const user = users.find(u => u.id === userId);
            if (user) {
                user.status = user.status === 'active' ? 'inactive' : 'active';
                renderUsers();
                showToast(`Status pengguna "${user.name}" diperbarui`, 'success');
            }
        });
    });

    tbody.querySelectorAll('.btn-outline-danger').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = parseInt(this.dataset.id);
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                const userName = users[userIndex].name;
                users.splice(userIndex, 1);
                updateStats();
                renderUsers();
                showToast(`Pengguna "${userName}" dihapus`, 'danger');
            }
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize
    updateStats();
    renderTasks();
    renderUsers();

    // Navigation
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.list-group-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');

            const sectionId = this.dataset.section;
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId + 'Section').classList.add('active');

            if (sectionId === 'tasks') renderTasks();
            if (sectionId === 'users') renderUsers();
        });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', function () {
        const body = document.body;
        if (body.classList.contains('bg-dark')) {
            body.classList.remove('bg-dark', 'text-white');
            this.innerHTML = '<i class="bi bi-moon"></i> Mode Gelap';
        } else {
            body.classList.add('bg-dark', 'text-white');
            this.innerHTML = '<i class="bi bi-sun"></i> Mode Terang';
        }
    });

    // Notifications
    document.getElementById('notificationBtn').addEventListener('click', function () {
        showToast('Anda memiliki 3 notifikasi belum dibaca', 'info');
    });

    // Counter
    let counter = 0;
    document.getElementById('increaseBtn').addEventListener('click', function () {
        counter++;
        document.getElementById('clickCounter').textContent = counter;
    });

    document.getElementById('decreaseBtn').addEventListener('click', function () {
        if (counter > 0) {
            counter--;
            document.getElementById('clickCounter').textContent = counter;
        }
    });

    // Toast demo
    document.getElementById('showToastBtn').addEventListener('click', function () {
        showToast('Ini adalah contoh notifikasi toast!', 'success');
    });

    // Add task
    document.getElementById('addTaskBtn').addEventListener('click', function () {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('taskModal')).show();
    });

    document.getElementById('addTaskBtn2').addEventListener('click', function () {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('taskModal')).show();
    });

    document.getElementById('saveTaskBtn').addEventListener('click', function () {
        const title = document.getElementById('taskTitle').value.trim();
        const priority = document.getElementById('taskPriority').value;

        if (!title) {
            showToast('Judul tugas tidak boleh kosong', 'warning');
            return;
        }

        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        tasks.push({ id: newId, title, priority, completed: false });
        updateStats();
        renderTasks();
        showToast(`Tugas "${title}" ditambahkan`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        document.getElementById('taskTitle').value = '';
    });

    // Add user
    document.getElementById('addUserBtn').addEventListener('click', function () {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal')).show();
    });

    document.getElementById('addUserBtn2').addEventListener('click', function () {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal')).show();
    });

    document.getElementById('saveUserBtn').addEventListener('click', function () {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();

        if (!name || !email) {
            showToast('Nama dan email harus diisi', 'warning');
            return;
        }

        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ id: newId, name, email, status: 'active' });
        updateStats();
        renderUsers();
        showToast(`Pengguna "${name}" ditambahkan`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
    });

    // Clear completed tasks
    document.getElementById('clearCompletedBtn').addEventListener('click', function () {
        const completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            showToast('Tidak ada tugas selesai', 'warning');
            return;
        }

        tasks = tasks.filter(t => !t.completed);
        updateStats();
        renderTasks();
        showToast(`${completedCount} tugas selesai dihapus`, 'success');
    });

    // Task search
    document.getElementById('taskSearchBtn').addEventListener('click', renderTasks);
    document.getElementById('taskSearch').addEventListener('keyup', function (e) {
        if (e.key === 'Enter') renderTasks();
    });

    // Update datetime
    function updateDateTime() {
        const now = new Date();
        document.getElementById('currentDateTime').textContent =
            `Waktu: ${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}`;
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Welcome message
    setTimeout(() => {
        showToast('Selamat datang di Program Menggunakan Bootstrap', 'success');
    }, 500);
});