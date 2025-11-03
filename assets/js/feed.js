// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlv1vOjzQyUM7yY89Cb40o79PIT6AiuYc",
    authDomain: "xtm1-79048.firebaseapp.com",
    databaseURL: "https://xtm1-79048-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "xtm1-79048",
    storageBucket: "xtm1-79048.firebasestorage.app",
    messagingSenderId: "36588922230",
    appId: "1:36588922230:web:28ed2d2dc9f58ec9f6c657"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Feed Management Functions
class FeedManager {
    constructor() {
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadFeeds();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tambah Feed Button
        document.getElementById('tambahFeedBtn').addEventListener('click', () => this.showModal());
        document.getElementById('addFirstFeed').addEventListener('click', () => this.showModal());
        
        // Modal Events
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
        document.getElementById('cancelModal').addEventListener('click', () => this.hideModal());
        
        // Form Submit
        document.getElementById('feedForm').addEventListener('submit', (e) => this.saveFeed(e));
        
        // Image Preview
        document.getElementById('inputGambar').addEventListener('change', (e) => this.previewImage(e));
        document.getElementById('removeImage').addEventListener('click', () => this.removeImagePreview());
        
        // Filter Events
        document.getElementById('filterStatus').addEventListener('change', () => this.loadFeeds());
        document.getElementById('searchFeed').addEventListener('input', () => this.loadFeeds());
    }

    async loadFeeds() {
        try {
            const snapshot = await database.ref('feeds').once('value');
            const feeds = snapshot.val() || {};
            this.displayFeeds(feeds);
        } catch (error) {
            console.error('Error loading feeds:', error);
            this.showNotification('Error memuat feeds', 'error');
        }
    }

    displayFeeds(feeds) {
        const feedGrid = document.getElementById('feedGrid');
        const emptyState = document.getElementById('emptyFeed');
        
        if (Object.keys(feeds).length === 0) {
            feedGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        let html = '';
        const searchTerm = document.getElementById('searchFeed').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        
        Object.entries(feeds).forEach(([id, feed]) => {
            // Apply filters
            if (searchTerm && !feed.judul.toLowerCase().includes(searchTerm)) {
                return;
            }
            
            if (statusFilter !== 'all' && feed.status !== statusFilter) {
                return;
            }
            
            const date = new Date(feed.timestamp).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            html += `
                <div class="feed-card" data-id="${id}">
                    <div class="feed-image">
                        <img src="${feed.gambar || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${feed.judul}">
                    </div>
                    <div class="feed-content">
                        <div class="feed-header">
                            <h3 class="feed-title">${feed.judul}</h3>
                            <span class="feed-status ${feed.status}">${feed.status === 'published' ? 'Published' : 'Draft'}</span>
                        </div>
                        <p class="feed-excerpt">${feed.konten.substring(0, 100)}...</p>
                        <div class="feed-meta">
                            <span class="feed-date"><i class="far fa-calendar"></i> ${date}</span>
                            <span class="feed-author"><i class="far fa-user"></i> ${feed.author || 'Admin XTM1'}</span>
                        </div>
                    </div>
                    <div class="feed-actions">
                        <button class="btn-edit" onclick="feedManager.editFeed('${id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="feedManager.deleteFeed('${id}')" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-preview" onclick="feedManager.previewFeed('${id}')" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        feedGrid.innerHTML = html || '<p>Tidak ada feed yang sesuai dengan filter</p>';
    }

    showModal(editId = null) {
        this.currentEditId = editId;
        const modal = document.getElementById('feedModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('feedForm');
        
        if (editId) {
            modalTitle.textContent = 'Edit Feed';
            this.loadFeedData(editId);
        } else {
            modalTitle.textContent = 'Buat Feed Baru';
            form.reset();
            this.removeImagePreview();
        }
        
        modal.style.display = 'block';
    }

    hideModal() {
        document.getElementById('feedModal').style.display = 'none';
        this.currentEditId = null;
    }

    async loadFeedData(feedId) {
        try {
            const snapshot = await database.ref(`feeds/${feedId}`).once('value');
            const feed = snapshot.val();
            
            if (feed) {
                document.getElementById('inputJudul').value = feed.judul;
                document.getElementById('inputKonten').value = feed.konten;
                document.getElementById('inputStatus').value = feed.status;
                
                if (feed.gambar) {
                    document.getElementById('previewImage').src = feed.gambar;
                    document.getElementById('imagePreview').style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Error loading feed data:', error);
        }
    }

    async saveFeed(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const feedData = {
            judul: formData.get('judul'),
            konten: formData.get('konten'),
            status: formData.get('status'),
            author: 'Admin XTM1',
            timestamp: Date.now()
        };

        // Handle image upload (simplified - you might want to use Firebase Storage)
        const imageFile = document.getElementById('inputGambar').files[0];
        if (imageFile) {
            // For now, we'll just store the file name
            // In production, upload to Firebase Storage and get URL
            feedData.gambar = URL.createObjectURL(imageFile);
            feedData.imageName = imageFile.name;
        }

        try {
            if (this.currentEditId) {
                // Update existing feed
                await database.ref(`feeds/${this.currentEditId}`).update(feedData);
                this.showNotification('Feed berhasil diupdate!', 'success');
            } else {
                // Create new feed
                await database.ref('feeds').push(feedData);
                this.showNotification('Feed berhasil dibuat!', 'success');
            }
            
            this.hideModal();
            this.loadFeeds();
        } catch (error) {
            console.error('Error saving feed:', error);
            this.showNotification('Error menyimpan feed', 'error');
        }
    }

    async editFeed(feedId) {
        this.showModal(feedId);
    }

    async deleteFeed(feedId) {
        if (confirm('Apakah Anda yakin ingin menghapus feed ini?')) {
            try {
                await database.ref(`feeds/${feedId}`).remove();
                this.showNotification('Feed berhasil dihapus!', 'success');
                this.loadFeeds();
            } catch (error) {
                console.error('Error deleting feed:', error);
                this.showNotification('Error menghapus feed', 'error');
            }
        }
    }

    previewFeed(feedId) {
        // Implement preview functionality
        alert('Preview functionality - akan dibuka di tab baru');
    }

    previewImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    removeImagePreview() {
        document.getElementById('inputGambar').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('previewImage').src = '';
    }

    showNotification(message, type = 'info') {
        // Simple notification - you can enhance this with better UI
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Feed Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.feedManager = new FeedManager();
});
