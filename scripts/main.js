// ===================================
// Cicada Platform - Main JavaScript
// Advanced Animations & Interactions
// ===================================

// ===== Configuration =====
const config = {
  animationDuration: 300,
  scrollOffset: 100,
  counterSpeed: 2000,
  typingSpeed: 100,
  apiBaseUrl: 'https://api.cicada-platform.com/v1', // Change this to your API
};

// ===== Language Manager =====
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'ar';
    this.translations = {
      ar: {
        home: 'الرئيسية',
        features: 'المميزات',
        howItWorks: 'كيف يعمل',
        plans: 'خطط الاستثمار',
        tasks: 'المهام',
        about: 'من نحن',
        contact: 'اتصل بنا',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        dashboard: 'لوحة التحكم',
        logout: 'تسجيل الخروج',
        profile: 'الملف الشخصي',
        settings: 'الإعدادات',
        balance: 'الرصيد',
        earnings: 'الأرباح',
        investments: 'الاستثمارات',
        referrals: 'الإحالات',
        transactions: 'المعاملات',
        deposits: 'الإيداعات',
        withdrawals: 'السحوبات',
        kyc: 'التحقق من الهوية',
        support: 'الدعم الفني',
        terms: 'الشروط والأحكام',
        privacy: 'سياسة الخصوصية',
        blog: 'المدونة',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        success: 'تم بنجاح',
        warning: 'تحذير',
        info: 'معلومة',
        confirm: 'تأكيد',
        cancel: 'إلغاء',
        save: 'حفظ',
        edit: 'تعديل',
        delete: 'حذف',
        view: 'عرض',
        close: 'إغلاق',
        next: 'التالي',
        previous: 'السابق',
        submit: 'إرسال',
        search: 'بحث',
        filter: 'تصفية',
        sort: 'ترتيب',
        date: 'التاريخ',
        amount: 'المبلغ',
        status: 'الحالة',
        action: 'الإجراء',
        yes: 'نعم',
        no: 'لا',
        ok: 'موافق',
        back: 'رجوع',
        home: 'الرئيسية',
        welcome: 'مرحباً',
        welcomeBack: 'مرحباً بعودتك',
        welcomeToCicada: 'مرحباً في سيكادا',
        welcomeToCicadaDesc: 'منصة الاستثمار والمهام الرائدة',
        welcomeToCicadaDesc2: 'استثمر بذكاء واربح يومياً',
        welcomeToCicadaDesc3: 'انضم إلى آلاف المستثمرين الناجحين',
        welcomeToCicadaDesc4: 'حقق أرباحاً تصل إلى 3.5% يومياً',
        welcomeToCicadaDesc5: 'مهام بسيطة ومربحة',
        welcomeToCicadaDesc6: 'سحب سريع وآمن',
        welcomeToCicadaDesc7: 'دعم 24/7',
        welcomeToCicadaDesc8: 'برنامج إحالة مربح',
        welcomeToCicadaDesc9: 'حماية متقدمة',
        welcomeToCicadaDesc10: 'منصة موثوقة ومضمونة',
      },
      en: {
        home: 'Home',
        features: 'Features',
        howItWorks: 'How It Works',
        plans: 'Investment Plans',
        tasks: 'Tasks',
        about: 'About Us',
        contact: 'Contact',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        logout: 'Logout',
        profile: 'Profile',
        settings: 'Settings',
        balance: 'Balance',
        earnings: 'Earnings',
        investments: 'Investments',
        referrals: 'Referrals',
        transactions: 'Transactions',
        deposits: 'Deposits',
        withdrawals: 'Withdrawals',
        kyc: 'Identity Verification',
        support: 'Support',
        terms: 'Terms & Conditions',
        privacy: 'Privacy Policy',
        blog: 'Blog',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Info',
        confirm: 'Confirm',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        close: 'Close',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        date: 'Date',
        amount: 'Amount',
        status: 'Status',
        action: 'Action',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        back: 'Back',
        home: 'Home',
        welcome: 'Welcome',
        welcomeBack: 'Welcome Back',
        welcomeToCicada: 'Welcome to Cicada',
        welcomeToCicadaDesc: 'Leading Investment & Tasks Platform',
        welcomeToCicadaDesc2: 'Invest Smart & Earn Daily',
        welcomeToCicadaDesc3: 'Join Thousands of Successful Investors',
        welcomeToCicadaDesc4: 'Earn Up to 3.5% Daily',
        welcomeToCicadaDesc5: 'Simple & Profitable Tasks',
        welcomeToCicadaDesc6: 'Fast & Secure Withdrawals',
        welcomeToCicadaDesc7: '24/7 Support',
        welcomeToCicadaDesc8: 'Profitable Referral Program',
        welcomeToCicadaDesc9: 'Advanced Security',
        welcomeToCicadaDesc10: 'Trusted & Reliable Platform',
      },
      fr: {
        home: 'Accueil',
        features: 'Fonctionnalités',
        howItWorks: 'Comment ça marche',
        plans: 'Plans d\'investissement',
        tasks: 'Tâches',
        about: 'À propos',
        contact: 'Contact',
        login: 'Connexion',
        register: 'S\'inscrire',
        dashboard: 'Tableau de bord',
        logout: 'Déconnexion',
        profile: 'Profil',
        settings: 'Paramètres',
        balance: 'Solde',
        earnings: 'Gains',
        investments: 'Investissements',
        referrals: 'Parrainages',
        transactions: 'Transactions',
        deposits: 'Dépôts',
        withdrawals: 'Retraits',
        kyc: 'Vérification d\'identité',
        support: 'Support',
        terms: 'Conditions d\'utilisation',
        privacy: 'Politique de confidentialité',
        blog: 'Blog',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        warning: 'Avertissement',
        info: 'Info',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        save: 'Sauvegarder',
        edit: 'Modifier',
        delete: 'Supprimer',
        view: 'Voir',
        close: 'Fermer',
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Soumettre',
        search: 'Rechercher',
        filter: 'Filtrer',
        sort: 'Trier',
        date: 'Date',
        amount: 'Montant',
        status: 'Statut',
        action: 'Action',
        yes: 'Oui',
        no: 'Non',
        ok: 'OK',
        back: 'Retour',
        home: 'Accueil',
        welcome: 'Bienvenue',
        welcomeBack: 'Bon retour',
        welcomeToCicada: 'Bienvenue sur Cicada',
        welcomeToCicadaDesc: 'Plateforme d\'investissement et de tâches leader',
        welcomeToCicadaDesc2: 'Investissez intelligemment et gagnez quotidiennement',
        welcomeToCicadaDesc3: 'Rejoignez des milliers d\'investisseurs prospères',
        welcomeToCicadaDesc4: 'Gagnez jusqu\'à 3,5% par jour',
        welcomeToCicadaDesc5: 'Tâches simples et rentables',
        welcomeToCicadaDesc6: 'Retraits rapides et sécurisés',
        welcomeToCicadaDesc7: 'Support 24/7',
        welcomeToCicadaDesc8: 'Programme de parrainage rentable',
        welcomeToCicadaDesc9: 'Sécurité avancée',
        welcomeToCicadaDesc10: 'Plateforme fiable et de confiance',
      }
    };
    this.init();
  }

  init() {
    this.setLanguage(this.currentLang);
    this.attachEventListeners();
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      }
    });

    // Trigger animation on language change
    this.animateContentChange();
  }

  attachEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        this.setLanguage(lang);
      });
    });
  }

  animateContentChange() {
    const content = document.querySelectorAll('section, .navbar, .hero');
    content.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  translate(key) {
    return this.translations[this.currentLang][key] || key;
  }
}

// ===== Navigation Manager =====
class NavigationManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    this.handleScroll();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupActiveLinks();
  }

  handleScroll() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow on scroll
      if (currentScroll > 50) {
        this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        this.navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
      }

      // Hide/show navbar on scroll
      if (currentScroll > lastScroll && currentScroll > 500) {
        this.navbar.style.transform = 'translateY(-100%)';
      } else {
        this.navbar.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
    });
  }

  setupMobileMenu() {
    if (!this.mobileMenuBtn || !this.navMenu) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
      const icon = this.mobileMenuBtn.querySelector('i');
      
      if (this.navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
        this.navMenu.classList.remove('active');
        const icon = this.mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navMenu.classList.remove('active');
        const icon = this.mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          
          if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  setupActiveLinks() {
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.pageYOffset + 150;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }
}

// ===== Counter Animation =====
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        if (element.textContent.includes('$')) {
          element.textContent = '$' + Math.floor(current).toLocaleString();
        } else if (element.textContent.includes('%')) {
          element.textContent = current.toFixed(1) + '%';
        } else {
          element.textContent = Math.floor(current).toLocaleString();
        }
        requestAnimationFrame(updateCounter);
      } else {
        if (element.textContent.includes('$')) {
          element.textContent = '$' + target.toLocaleString();
        } else if (element.textContent.includes('%')) {
          element.textContent = target.toFixed(1) + '%';
        } else {
          element.textContent = target.toLocaleString();
        }
      }
    };

    updateCounter();
  }
}

// ===== Scroll Animations =====
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    // Animate sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'all 0.8s ease';
      observer.observe(section);
    });

    // Animate cards
    const cards = document.querySelectorAll('.feature-card, .step-card, .plan-card, .task-card, .testimonial-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `all 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });
  }
}

// ===== FAQ Accordion =====
class FAQAccordion {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
       
