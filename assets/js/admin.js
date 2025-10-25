// ===== ADMIN PANEL JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 XTM1 Admin Panel Initializing...');
    
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initLoginPage();
            break;
        case 'dashboard':
            initDashboard();
            break;
        case 'jadwal':
            initJadwalManagement();
            break;
        case 'feed':
            initFeedManagement();
            break;
        case 'galeri':
            initGaleriManagement();
            break;
    }
    
    initCommonFeatures();
});

// ===== COMMON FEATURES =====
function initCommonFeatures() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Theme consistency
    initTheme();
}

function initTheme() {
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme + '-mode');
}

// ===== LOGIN PAGE =====
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (username && password) {
                // Simulate login process
                simulateLogin(username, password);
            } else {
                showNotification('Harap isi semua field!', 'error');
            }
        });
    }
}

function simulateLogin(username, password) {
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any non-empty credentials
        if (username && password) {
            showNotification('Login berhasil! Mengarahkan...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard';
            }, 1500);
        } else {
            showNotification('Username atau password salah!', 'error');
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }, 2000);
}

// ===== DASHBOARD =====
function initDashboard() {
    // Load dashboard statistics
    loadDashboardStats();
    
    // Initialize charts or other dashboard components
    initDashboardCharts();
}

function loadDashboardStats() {
    // Simulate loading data from API
    setTimeout(() => {
        // These would come from your backend API
        const stats = {
            jadwal: 16,
            feed: 5,
            galeri: 12,
            anggota: 41
        };
        
        // Update DOM elements
        document.getElementById('totalJadwal').textContent = stats.jadwal;
        document.getElementById('totalFeed').textContent = stats.feed;
        document.getElementById('totalGaleri').textContent = stats.galeri;
        document.getElementById('totalAnggota').textContent = stats.anggota;
    }, 1000);
}

function initDashboardCharts() {
    // Initialize any charts here
    // You can use Chart.js or other libraries
    console.log('Dashboard charts initialized');
}

// ===== JADWAL MANAGEMENT =====
function initJadwalManagement() {
    const tambahJadwalBtn = document.getElementById('tambahJadwalBtn');
    const jadwalModal = document.getElementById('jadwalModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModal = document.getElementById('cancelModal');
    const jadwalForm = document.getElementById('jadwalForm');
    const addFirstJadwal = document.getElementById('addFirstJadwal');
    
    // Load existing jadwal
    loadJadwalData();
    
    // Modal handlers
    if (tambahJadwalBtn) {
        tambahJadwalBtn.addEventListener('click', () => openJadwalModal());
    }
    
    if (addFirstJadwal) {
        addFirstJadwal.addEventListener('click', () => openJadwalModal());
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => closeJadwalModal());
    }
    
    if (cancelModal) {
        cancelModal.addEventListener('click', () => closeJadwalModal());
    }
    
    // Form submission
    if (jadwalForm) {
        jadwalForm.addEventListener('submit', handleJadwalSubmit);
    }
    
    // Filter and search
    const filterHari = document.getElementById('filterHari');
    const searchJadwal = document.getElementById('searchJadwal');
    
    if (filterHari) {
        filterHari.addEventListener('change', filterJadwal);
    }
    
    if (searchJadwal) {
        searchJadwal.addEventListener('input', filterJadwal);
    }
    
    // Close modal on outside click
    if (jadwalModal) {
        jadwalModal.addEventListener('click', function(e) {
            if (e.target === jadwalModal) {
                closeJadwalModal();
            }
        });
    }
}

function loadJadwalData() {
    // Simulate loading jadwal from API
    setTimeout(() => {
        // This would come from your backend
        const jadwalData = [
            {
                id: 1,
                hari: 'Senin',
                mata_pelajaran: 'Pemrograman Mikrokontroler',
                waktu: '07:30 - 09:00',
                guru: 'Pak Ahmad, S.Kom',
                ruangan: 'Lab. Komputer'
            },
            {
                id: 2,
                hari: 'Senin',
                mata_pelajaran: 'Sistem Kendali Elektronik',
                waktu: '09:30 - 11:00',
                guru: 'Bu Siti, M.T',
                ruangan: 'Lab. Elektro'
            }
            // ... more data
        ];
        
        updateJadwalTable(jadwalData);
    }, 1000);
}

function updateJadwalTable(data) {
    const tableBody = document.querySelector('#jadwalTable tbody');
    const emptyState = document.getElementById('emptyJadwal');
    
    if (!tableBody) return;
    
    if (data.length === 0) {
        tableBody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    tableBody.innerHTML = data.map(jadwal => `
        <tr>
            <td>${jadwal.hari}</td>
            <td>${jadwal.mata_pelajaran}</td>
            <td>${jadwal.waktu}</td>
            <td>${jadwal.guru}</td>
            <td>${jadwal.ruangan}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editJadwal(${jadwal.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteJadwal(${jadwal.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openJadwalModal(editData = null) {
    const modal = document.getElementById('jadwalModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('jadwalForm');
    
    if (!modal) return;
    
    if (editData) {
        // Edit mode
        modalTitle.textContent = 'Edit Jadwal';
        populateForm(editData);
    } else {
        // Add mode
        modalTitle.textContent = 'Tambah Jadwal Baru';
        form.reset();
    }
    
    modal.classList.add('active');
}

function closeJadwalModal() {
    const modal = document.getElementById('jadwalModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function populateForm(data) {
    // Fill form with existing data for editing
    document.getElementById('inputHari').value = data.hari;
    document.getElementById('inputMapel').value = data.mata_pelajaran;
    document.getElementById('inputGuru').value = data.guru;
    document.getElementById('inputRuangan').value = data.ruangan;
    
    // Split waktu if needed
    if (data.waktu) {
        const [start, end] = data.waktu.split(' - ');
        document.getElementById('inputWaktuMulai').value = start;
        document.getElementById('inputWaktuSelesai').value = end;
    }
}

function handleJadwalSubmit(e) {
    e.preventDefault();
    
    const formData = {
        hari: document.getElementById('inputHari').value,
        mata_pelajaran: document.getElementById('inputMapel').value,
        waktu_mulai: document.getElementById('inputWaktuMulai').value,
        waktu_selesai: document.getElementById('inputWaktuSelesai').value,
        guru: document.getElementById('inputGuru').value,
        ruangan: document.getElementById('inputRuangan').value
    };
    
    // Validate form
    if (!formData.hari || !formData.mata_pelajaran) {
        showNotification('Harap isi semua field yang required!', 'error');
        return;
    }
    
    // Simulate API call
    simulateSaveJadwal(formData);
}

function simulateSaveJadwal(formData) {
    const submitBtn = document.querySelector('#jadwalForm .btn-primary');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Jadwal berhasil disimpan!', 'success');
        closeJadwalModal();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reload data
        loadJadwalData();
    }, 1500);
}

function editJadwal(id) {
    // Find jadwal data by ID and open modal in edit mode
    console.log('Edit jadwal:', id);
    // You would fetch the specific jadwal data here
}

function deleteJadwal(id) {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
        // Simulate delete
        showNotification('Jadwal berhasil dihapus!', 'success');
        // You would call your delete API here
    }
}

function filterJadwal() {
    const hariFilter = document.getElementById('filterHari').value;
    const searchTerm = document.getElementById('searchJadwal').value.toLowerCase();
    
    // This would be handled by your backend in real implementation
    console.log('Filtering:', { hariFilter, searchTerm });
}

// ===== FEED MANAGEMENT =====
function initFeedManagement() {
    console.log('Feed management initialized');
    // Similar structure to jadwal management
}

// ===== GALERI MANAGEMENT =====
function initGaleriManagement() {
    console.log('Galeri management initialized');
    // Similar structure to jadwal management
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#00b894',
        error: '#ff4757',
        warning: '#ffa502',
        info: '#2ed573'
    };
    return colors[type] || '#2ed573';
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

console.log('✅ XTM1 Admin Panel Ready!');
