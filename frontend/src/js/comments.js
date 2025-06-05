// ===== COMMENTS API CLASS =====
class CommentsAPI {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api' 
            : '/api';
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    async getComments() {
        return this.request('/comments');
    }

    async addComment(commentData) {
        return this.request('/comments', {
            method: 'POST',
            body: JSON.stringify(commentData)
        });
    }

    async deleteComment(id) {
        return this.request(`/comments/${id}`, {
            method: 'DELETE'
        });
    }

    async getCommentsCount() {
        return this.request('/comments/count');
    }

    async healthCheck() {
        return this.request('/health');
    }
}

// ===== COMMENTS MANAGER CLASS =====
class CommentsManager {
    constructor() {
        this.api = new CommentsAPI();
        this.form = document.getElementById('commentForm');
        this.commentsList = document.getElementById('commentsList');
        this.commentsCount = document.getElementById('commentsCount');
        this.loadingElement = document.getElementById('commentsLoading');
        this.errorElement = document.getElementById('commentsError');
        this.refreshButton = document.getElementById('refreshComments');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadComments();
        this.updateCommentsCount();
        
        // Auto-refresh every 30 seconds
        setInterval(() => this.loadComments(true), 30000);
    }

    setupEventListeners() {
        // Form submission
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Refresh button
        this.refreshButton?.addEventListener('click', () => this.loadComments());
        
        // Real-time validation
        const inputs = this.form?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearValidationMessage(input));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const commentData = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            comment: formData.get('comment')?.trim()
        };

        // Validate form
        if (!this.validateForm(commentData)) {
            return;
        }

        const submitButton = this.form.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn__text');
        const buttonSpinner = submitButton.querySelector('.btn__spinner');

        try {
            // Show loading state
            submitButton.disabled = true;
            buttonText.style.display = 'none';
            buttonSpinner.style.display = 'inline-block';

            const response = await this.api.addComment(commentData);

            if (response.success) {
                this.showMessage('Комментарий успешно добавлен!', 'success');
                this.form.reset();
                this.loadComments();
                this.updateCommentsCount();
            } else {
                this.showMessage(response.message || 'Ошибка при добавлении комментария', 'error');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            this.showMessage('Ошибка соединения с сервером', 'error');
        } finally {
            // Hide loading state
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonSpinner.style.display = 'none';
        }
    }

    validateForm(data) {
        let isValid = true;

        // Name validation
        if (!data.name || data.name.length < 2) {
            this.showFieldError('name', 'Имя должно содержать минимум 2 символа');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('email', 'Введите корректный email адрес');
            isValid = false;
        }

        // Comment validation
        if (!data.comment || data.comment.length < 10) {
            this.showFieldError('comment', 'Комментарий должен содержать минимум 10 символов');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let message = '';

        switch (field.name) {
            case 'name':
                if (value.length < 2) message = 'Минимум 2 символа';
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) message = 'Некорректный email';
                break;
            case 'comment':
                if (value.length < 10) message = 'Минимум 10 символов';
                break;
        }

        if (message) {
            this.showFieldError(field.name, message);
        } else {
            this.clearFieldError(field.name);
        }
    }

    showFieldError(fieldName, message) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const formGroup = field.closest('.form-group');
        
        let errorElement = formGroup.querySelector('.validation-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'validation-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.classList.add('error');
    }

    clearFieldError(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.validation-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    clearValidationMessage(field) {
        this.clearFieldError(field.name);
    }

    async loadComments(silent = false) {
        if (!silent) {
            this.showLoading();
        }

        try {
            const response = await this.api.getComments();
            
            if (response.success) {
                this.renderComments(response.comments);
                this.hideError();
            } else {
                this.showError('Ошибка загрузки комментариев');
            }
        } catch (error) {
            console.error('Error loading comments:', error);
            if (!silent) {
                this.showError('Ошибка соединения с сервером');
            }
        } finally {
            this.hideLoading();
        }
    }

    renderComments(comments) {
        if (!this.commentsList) return;

        if (comments.length === 0) {
            this.commentsList.innerHTML = `
                <div class="empty-comments">
                    <div class="empty-comments-icon">💬</div>
                    <p>Пока нет комментариев. Будьте первым!</p>
                </div>
            `;
            return;
        }

        this.commentsList.innerHTML = comments.map(comment => 
            this.renderComment(comment)
        ).join('');

        // Add animation to new comments
        const commentElements = this.commentsList.querySelectorAll('.comment-item');
        commentElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    renderComment(comment) {
        const date = new Date(comment.created_at).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="comment-item" style="opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-author-name">${this.escapeHtml(comment.name)}</div>
                        <div class="comment-author-email">${this.escapeHtml(comment.email)}</div>
                    </div>
                    <div class="comment-date">${date}</div>
                </div>
                <p class="comment-text">${this.escapeHtml(comment.comment)}</p>
                <div class="comment-actions">
                    <button class="comment-action" onclick="commentsManager.likeComment(${comment.id})">
                        👍 Нравится
                    </button>
                    <button class="comment-action" onclick="commentsManager.reportComment(${comment.id})">
                        ⚠️ Пожаловаться
                    </button>
                </div>
            </div>
        `;
    }

    async updateCommentsCount() {
        try {
            const response = await this.api.getCommentsCount();
            if (response.success && this.commentsCount) {
                this.commentsCount.textContent = response.total;
            }
        } catch (error) {
            console.error('Error updating comments count:', error);
        }
    }

    likeComment(id) {
        this.showMessage('Функция "Нравится" будет добавлена в следующей версии!', 'info');
    }

    reportComment(id) {
        if (confirm('Пожаловаться на этот комментарий?')) {
            this.showMessage('Жалоба отправлена. Спасибо!', 'success');
        }
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    showError(message) {
        if (this.errorElement) {
            this.errorElement.style.display = 'block';
            this.errorElement.querySelector('p').textContent = message;
        }
    }

    hideError() {
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `${type}-message`;
        messageElement.textContent = message;

        // Insert before comment form
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            commentForm.parentNode.insertBefore(messageElement, commentForm);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ===== INITIALIZATION =====
let commentsManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize comments manager if comments section exists
    if (document.getElementById('comments')) {
        commentsManager = new CommentsManager();
        console.log('💬 Comments system initialized');
    }
});

// Global function for manual refresh
window.loadComments = () => {
    if (commentsManager) {
        commentsManager.loadComments();
    }
};