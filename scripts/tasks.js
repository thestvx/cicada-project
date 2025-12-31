/**
 * Tasks Page JavaScript
 */

// Daily Check-in
function dailyCheckIn() {
    const btn = event.target;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert('تم تسجيل حضورك بنجاح! 🎉\nلقد حصلت على $2.00');
        location.reload();
    }, 1500);
}

// Complete Task
function completeTask(taskId) {
    const btn = event.target;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert('تم إكمال المهمة بنجاح! 🎉');
        location.reload();
    }, 1500);
}

// Share Referral
function shareReferral() {
    alert('سيتم فتح نافذة المشاركة');
}

// Category Filter
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const category = tab.getAttribute('data-category');
        filterTasks(category);
    });
});

function filterTasks(category) {
    const tasks = document.querySelectorAll('.task-card');
    
    tasks.forEach(task => {
        if (category === 'all' || task.classList.contains(category)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

// Mobile Menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});
