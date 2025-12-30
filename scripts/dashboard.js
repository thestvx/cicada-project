// ===================================
// Cicada Platform - Dashboard Logic
// Sidebar, Topbar, Stats & Protection
// ===================================

// حماية صفحة لوحة التحكم (باستخدام دوال من auth.js)
function protectDashboard() {
  if (window.CicadaAuth && typeof window.CicadaAuth.protectPage === 'function') {
    window.CicadaAuth.protectPage();
  } else {
    // احتياطاً: تحقق بسيط من localStorage
    const isAuth = localStorage.getItem('cicada_isAuthenticated') === 'true';
    if (!isAuth) {
      window.location.href = 'login.html';
    }
  }
}

// تحميل بيانات المستخدم من localStorage وعرضها في الواجهة
function loadUserInfo() {
  const userJson = localStorage.getItem('cicada_user');
  if (!userJson) return;

  const user = JSON.parse(userJson);

  const nameEls = document.querySelectorAll('[data-user="name"]');
  const emailEls = document.querySelectorAll('[data-user="email"]');
  const phoneEls = document.querySelectorAll('[data-user="phone"]');

  nameEls.forEach(el => el.textContent = user.name || 'مستخدم');
  emailEls.forEach(el => el.textContent = user.email || '');
  phoneEls.forEach(el => el.textContent = user.phone || '');
}

// تهيئة زر إظهار/إخفاء الـ Sidebar في الموبايل
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  const toggleButtons = document.querySelectorAll('.toggle-sidebar');
  
  if (!sidebar || !toggleButtons.length) return;

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    });
  });

  // إغلاق الـ sidebar عند الضغط خارجها في الموبايل
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    if (!sidebar.classList.contains('active')) return;

    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedToggle = Array.from(toggleButtons).some(btn => btn.contains(e.target));

    if (!clickedInsideSidebar && !clickedToggle) {
      sidebar.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  });
}

// تفعيل عناصر القائمة الجانبية بناءً على الصفحة الحالية
function highlightActiveMenu() {
  const menuLinks = document.querySelectorAll('.menu-item');
  const path = window.location.pathname;

  menuLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || link.dataset.href;
    if (!href) return;

    if (path.endsWith(href)) {
      link.classList.add('active');
    }
  });
}

// تعبئة إحصائيات افتراضية في لوحة التحكم (يمكن ربطها بـ API لاحقاً)
function loadDashboardStats() {
  const balanceEl = document.querySelector('[data-stat="balance"]');
  const dailyEarningsEl = document.querySelector('[data-stat="daily-earnings"]');
  const totalEarningsEl = document.querySelector('[data-stat="total-earnings"]');
  const tasksCompletedEl = document.querySelector('[data-stat="tasks-completed"]');

  // قيم تجريبية (يمكن استبدالها ببيانات حقيقية من API)
  const stats = {
    balance: 1250.75,
    dailyEarnings: 45.30,
    totalEarnings: 5320.10,
    tasksCompleted: 128,
  };

  if (balanceEl) balanceEl.textContent = `$${stats.balance.toLocaleString()}`;
  if (dailyEarningsEl) dailyEarningsEl.textContent = `$${stats.dailyEarnings.toLocaleString()}`;
  if (totalEarningsEl) totalEarningsEl.textContent = `$${stats.totalEarnings.toLocaleString()}`;
  if (tasksCompletedEl) tasksCompletedEl.textContent = stats.tasksCompleted.toLocaleString();
}

// تعبئة جدول آخر المعاملات ببيانات تجريبية
function loadRecentTransactions() {
  const tableBody = document.querySelector('[data-table="recent-transactions"]');
  if (!tableBody) return;

  const transactions = [
    { type: 'إيداع', date: '2025-12-25', amount: 250, status: 'success' },
    { type: 'سحب', date: '2025-12-24', amount: 120, status: 'pending' },
    { type: 'أرباح يومية', date: '2025-12-24', amount: 15.75, status: 'success' },
    { type: 'مهمة مكتملة', date: '2025-12-23', amount: 5.00, status: 'success' },
    { type: 'إحالة جديدة', date: '2025-12-22', amount: 12.50, status: 'success' },
  ];

  tableBody.innerHTML = transactions.map(tx => `
    <tr>
      <td>${tx.type}</td>
      <td>${tx.date}</td>
      <td>$${tx.amount.toFixed(2)}</td>
      <td>
        <span class="status-badge ${tx.status === 'success' ? 'success' : tx.status === 'pending' ? 'pending' : 'failed'}">
          ${tx.status === 'success' ? 'ناجحة' : tx.status === 'pending' ? 'قيد المعالجة' : 'فشلت'}
        </span>
      </td>
    </tr>
  `).join('');
}

// تعبئة قائمة المهام السريعة في اللوحة الرئيسية
function loadQuickTasks() {
  const tasksContainer = document.querySelector('[data-section="quick-tasks"]');
  if (!tasksContainer) return;

  const tasks = [
    { icon: 'fa-video', title: 'مشاهدة فيديو ترويجي', reward: '$2.50' },
    { icon: 'fa-clipboard-list', title: 'إكمال استبيان قصير', reward: '$4.00' },
    { icon: 'fa-share-alt', title: 'مشاركة رابط الإحالة', reward: '$3.00' },
    { icon: 'fa-user-friends', title: 'دعوة صديق جديد', reward: '$5.00' },
  ];

  tasksContainer.innerHTML = tasks.map(task => `
    <button class="quick-action-btn">
      <i class="fas ${task.icon}"></i>
      <span>${task.title}</span>
      <small style="margin-top:6px;color:#2ecc71;font-weight:600;">${task.reward}</small>
    </button>
  `).join('');
}

// تهيئة أزرار الإيداع والسحب في كرت الرصيد
function initBalanceActions() {
  const depositBtn = document.querySelector('[data-action="go-deposit"]');
  const withdrawBtn = document.querySelector('[data-action="go-withdraw"]');

  if (depositBtn) {
    depositBtn.addEventListener('click', () => {
      window.location.href = 'deposits.html';
    });
  }

  if (withdrawBtn) {
    withdrawBtn.addEventListener('click', () => {
      window.location.href = 'withdrawals.html';
    });
  }
}

// التعامل مع زر تسجيل الخروج في الواجهة العلوية أو في القائمة الجانبية
function initLogoutButtons() {
  const logoutButtons = document.querySelectorAll('[data-logout="true"]');

  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.CicadaAuth && typeof window.CicadaAuth.logoutUser === 'function') {
        window.CicadaAuth.logoutUser(true);
      } else {
        localStorage.removeItem('cicada_isAuthenticated');
        localStorage.removeItem('cicada_user');
        localStorage.removeItem('cicada_userEmail');
        window.location.href = 'login.html';
      }
    });
  });
}

// تهيئة بعض الحركات البسيطة في البطاقات داخل لوحة التحكم
function initDashboardAnimations() {
  const cards = document.querySelectorAll('.stat-card, .card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    card.style.transition = `all 0.4s ease ${index * 0.05}s`;

    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  });
}

// ===== Initialize Dashboard =====
document.addEventListener('DOMContentLoaded', () => {
  protectDashboard();
  loadUserInfo();
  initSidebarToggle();
  highlightActiveMenu();
  loadDashboardStats();
  loadRecentTransactions();
  loadQuickTasks();
  initBalanceActions();
  initLogoutButtons();
  initDashboardAnimations();
});
