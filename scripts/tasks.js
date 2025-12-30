/**
 * Tasks Page Script
 * Handles all tasks-related functionality
 */

// Demo tasks data
const demoTasks = [
    {
        id: 1,
        title: 'مشاهدة فيديو ترويجي',
        description: 'شاهد فيديو قصير مدته 3 دقائق عن منصة Cicada',
        category: 'video',
        reward: 2.50,
        timeRequired: '3 دقائق',
        difficulty: 'سهل',
        status: 'available',
        icon: 'fa-video',
        completedCount: 1250
    },
    {
        id: 2,
        title: 'إكمال استبيان قصير',
        description: 'أجب على 10 أسئلة بسيطة عن تجربتك مع المنصة',
        category: 'survey',
        reward: 4.00,
        timeRequired: '5 دقائق',
        difficulty: 'سهل',
        status: 'available',
        icon: 'fa-clipboard-list',
        completedCount: 890
    },
    {
        id: 3,
        title: 'مشاركة على Facebook',
        description: 'شارك منشور Cicada على صفحتك في Facebook',
        category: 'social',
        reward: 3.00,
        timeRequired: '2 دقيقة',
        difficulty: 'سهل جداً',
        status: 'completed',
        icon: 'fa-share-alt',
        completedCount: 2100
    },
    {
        id: 4,
        title: 'كتابة تقييم',
        description: 'اكتب تقييماً صادقاً عن تجربتك مع المنصة (50 كلمة على الأقل)',
        category: 'review',
        reward: 5.50,
        timeRequired: '10 دقائق',
        difficulty: 'متوسط',
        status: 'available',
        icon: 'fa-star',
        completedCount: 450
    },
    {
        id: 5,
        title: 'دعوة 3 أصدقاء',
        description: 'ادع 3 أصدقاء للانضمام إلى المنصة عبر رابط الإحالة الخاص بك',
        category: 'referral',
        reward: 10.00,
        timeRequired: '15 دقيقة',
        difficulty: 'متوسط',
        status: 'locked',
        icon: 'fa-user-friends',
        completedCount: 320,
        requirement: 'يتطلب إتمام 5 مهام'
    },
    {
        id: 6,
        title: 'مشاهدة إعلان',
        description: 'شاهد إعلان مدته 30 ثانية',
        category: 'video',
        reward: 1.00,
        timeRequired: '30 ثانية',
        difficulty: 'سهل جداً',
        status: 'available',
        icon: 'fa-ad',
        completedCount: 5600
    },
    {
        id: 7,
        title: 'تحميل التطبيق',
        description: 'حمّل تطبيق Cicada على هاتفك المحمول',
        category: 'app',
        reward: 8.00,
        timeRequired: '5 دقائق',
        difficulty: 'سهل',
        status: 'available',
        icon: 'fa-mobile-alt',
        completedCount: 780
    },
    {
        id: 8,
        title: 'متابعة على Instagram',
        description: 'تابع حساب Cicada الرسمي على Instagram',
        category: 'social',
        reward: 2.00,
        timeRequired: '1 دقيقة',
        difficulty: 'سهل جداً',
        status: 'completed',
        icon: 'fa-instagram',
        completedCount: 3200
    }
];

// Tasks state
let currentFilter = 'all';
let currentSort = 'reward-desc';

/**
 * Initialize tasks page
 */
function initTasksPage() {
    updateTasksStats();
    renderTasks();
    initTaskFilters();
    initTaskSort();
    initTaskActions();
}

/**
 * Update tasks statistics
 */
function updateTasksStats() {
    const completedTasks = demoTasks.filter(t => t.status === 'completed').length;
    const totalTasks = demoTasks.length;
    const todayEarnings = demoTasks
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.reward, 0);
    const availableTasks = demoTasks.filter(t => t.status === 'available').length;

    // Update stat cards
    updateStatValue('completed-tasks', completedTasks);
    updateStatValue('total-tasks', totalTasks);
    updateStatValue('today-earnings', '$' + todayEarnings.toFixed(2));
    updateStatValue('available-tasks', availableTasks);
}

/**
 * Update stat value
 */
function updateStatValue(statName, value) {
    const element = document.querySelector(`[data-stat="${statName}"]`);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Render tasks
 */
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    if (!container) return;

    // Filter tasks
    let filteredTasks = demoTasks;
    if (currentFilter !== 'all') {
        if (currentFilter === 'completed') {
            filteredTasks = demoTasks.filter(t => t.status === 'completed');
        } else if (currentFilter === 'available') {
            filteredTasks = demoTasks.filter(t => t.status === 'available');
        } else {
            filteredTasks = demoTasks.filter(t => t.category === currentFilter);
        }
    }

    // Sort tasks
    filteredTasks = sortTasks(filteredTasks, currentSort);

    // Render
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem; color:var(--text-light);">
                <i class="fas fa-inbox fa-3x" style="margin-bottom:1rem; opacity:0.3;"></i>
                <p>لا توجد مهام متاحة حالياً في هذا التصنيف</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');
}

/**
 * Sort tasks
 */
function sortTasks(tasks, sortType) {
    const sorted = [...tasks];
    
    switch(sortType) {
        case 'reward-desc':
            return sorted.sort((a, b) => b.reward - a.reward);
        case 'reward-asc':
            return sorted.sort((a, b) => a.reward - b.reward);
        case 'newest':
            return sorted.reverse();
        case 'popular':
            return sorted.sort((a, b) => b.completedCount - a.completedCount);
        default:
            return sorted;
    }
}

/**
 * Create task card HTML
 */
function createTaskCard(task) {
    const statusClass = task.status === 'completed' ? 'completed' : 
                       task.status === 'locked' ? 'locked' : 'available';
    
    const statusText = task.status === 'completed' ? 'مكتملة' : 
                      task.status === 'locked' ? 'مقفلة' : 'متاحة';
    
    const buttonHTML = task.status === 'available' ? 
        `<button class="btn-primary" onclick="startTask(${task.id})">
            <i class="fas fa-play"></i> ابدأ المهمة
        </button>` :
        task.status === 'completed' ?
        `<button class="btn-secondary" disabled>
            <i class="fas fa-check"></i> تم الإكمال
        </button>` :
        `<button class="btn-secondary" disabled>
            <i class="fas fa-lock"></i> مقفلة
        </button>`;

    return `
        <div class="task-card ${statusClass}">
            <div class="task-icon">
                <i class="fas ${task.icon}"></i>
            </div>
            <div class="task-info">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <span class="task-reward">+$${task.reward.toFixed(2)}</span>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-meta">
                    <span class="task-time">
                        <i class="fas fa-clock"></i> ${task.timeRequired}
                    </span>
                    <span class="task-difficulty ${task.difficulty.replace(' ', '-')}">
                        <i class="fas fa-signal"></i> ${task.difficulty}
                    </span>
                    <span class="task-completed-count">
                        <i class="fas fa-users"></i> ${task.completedCount.toLocaleString()} شخص أكمل
                    </span>
                </div>
                ${task.requirement ? `<div class="task-requirement"><i class="fas fa-info-circle"></i> ${task.requirement}</div>` : ''}
            </div>
            <div class="task-actions">
                ${buttonHTML}
                <span class="task-status status-badge ${statusClass}">${statusText}</span>
            </div>
        </div>
    `;
}

/**
 * Initialize task filters
 */
function initTaskFilters() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Re-render tasks
            renderTasks();
        });
    });
}

/**
 * Initialize task sorting
 */
function initTaskSort() {
    const sortSelect = document.getElementById('taskSort');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderTasks();
        });
    }
}

/**
 * Initialize task actions
 */
function initTaskActions() {
    // Task search
    const searchInput = document.getElementById('taskSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const taskCards = document.querySelectorAll('.task-card');
            
            taskCards.forEach(card => {
                const title = card.querySelector('.task-title').textContent.toLowerCase();
                const description = card.querySelector('.task-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Start a task
 */
function startTask(taskId) {
    const task = demoTasks.find(t => t.id === taskId);
    if (!task) return;

    // Show confirmation
    if (confirm(`هل تريد بدء المهمة: "${task.title}"؟\nالمكافأة: $${task.reward.toFixed(2)}`)) {
        // Simulate task start
        showTaskModal(task);
    }
}

/**
 * Show task modal
 */
function showTaskModal(task) {
    // Create modal overlay
    const modalHTML = `
        <div class="modal-overlay" id="taskModal">
            <div class="modal-content" style="max-width:600px;">
                <div class="modal-header">
                    <h2>${task.title}</h2>
                    <button class="modal-close" onclick="closeTaskModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="task-modal-info">
                        <div class="task-modal-icon">
                            <i class="fas ${task.icon} fa-3x"></i>
                        </div>
                        <p>${task.description}</p>
                        <div class="task-modal-details">
                            <div class="detail-item">
                                <i class="fas fa-dollar-sign"></i>
                                <span>المكافأة: <strong>$${task.reward.toFixed(2)}</strong></span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>المدة المتوقعة: <strong>${task.timeRequired}</strong></span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-signal"></i>
                                <span>الصعوبة: <strong>${task.difficulty}</strong></span>
                            </div>
                        </div>
                    </div>
                    <div class="task-instructions">
                        <h3>التعليمات:</h3>
                        <ol>
                            <li>اضغط على زر "بدء المهمة" أدناه</li>
                            <li>أكمل المهمة المطلوبة</li>
                            <li>انتظر التحقق التلقائي</li>
                            <li>ستضاف المكافأة إلى محفظتك فوراً</li>
                        </ol>
                    </div>
                    <div class="task-progress" id="taskProgress" style="display:none;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="taskProgressFill"></div>
                        </div>
                        <p id="taskProgressText">جاري التحميل...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeTaskModal()">إلغاء</button>
                    <button class="btn-primary" onclick="executeTask(${task.id})">
                        <i class="fas fa-play"></i> بدء المهمة
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Execute task
 */
function executeTask(taskId) {
    const task = demoTasks.find(t => t.id === taskId);
    if (!task) return;

    // Hide start button, show progress
    const modalFooter = document.querySelector('.modal-footer');
    const progressContainer = document.getElementById('taskProgress');
    
    if (modalFooter) modalFooter.style.display = 'none';
    if (progressContainer) progressContainer.style.display = 'block';

    // Simulate task execution
    let progress = 0;
    const progressFill = document.getElementById('taskProgressFill');
    const progressText = document.getElementById('taskProgressText');

    const interval = setInterval(() => {
        progress += 10;
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = `جاري إكمال المهمة... ${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            completeTask(taskId);
        }
    }, 300);
}

/**
 * Complete task
 */
function completeTask(taskId) {
    const task = demoTasks.find(t => t.id === taskId);
    if (!task) return;

    // Update task status
    task.status = 'completed';

    // Show success message
    setTimeout(() => {
        closeTaskModal();
        
        if (window.CicadaAuth && window.CicadaAuth.showAuthAlert) {
            window.CicadaAuth.showAuthAlert('success', 
                `تم إكمال المهمة بنجاح! تم إضافة $${task.reward.toFixed(2)} إلى محفظتك.`
            );
        } else {
            alert(`تم إكمال المهمة بنجاح! تم إضافة $${task.reward.toFixed(2)} إلى محفظتك.`);
        }

        // Update UI
        updateTasksStats();
        renderTasks();
    }, 500);
}

/**
 * Close task modal
 */
function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.remove();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on tasks page
    if (window.location.pathname.includes('tasks.html')) {
        initTasksPage();
    }
});

// Export functions for global use
window.startTask = startTask;
window.executeTask = executeTask;
window.closeTaskModal = closeTaskModal;
