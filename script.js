// Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-btn');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Active Link Highlighting on Scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Using pageYOffset to support older browsers
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Scroll Animation
const fadeElements = document.querySelectorAll('.service-card, .timeline-item, .sector-card');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Unobserve after animation plays once
        }
    });
}, observerOptions);

fadeElements.forEach((el, index) => {
    el.classList.add('fade-in');
    // Add slightly delayed transitions based on index for grid items
    el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    observer.observe(el);
});

// Form Submission handling with Real-time DB simulation via localStorage
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather data
        const newMsg = {
            id: Date.now(),
            name: document.getElementById('name').value,
            company: document.getElementById('company').value || 'لا يوجد',
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            time: new Date().toISOString(), // Use ISO for easier sorting/parsing
            formattedTime: new Date().toLocaleString('ar-EG'),
            read: false
        };

        // Save to "DB" (localStorage)
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.unshift(newMsg); // Add to the top
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // Show success visual feedback
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = (translations[currentLang] && translations[currentLang]['success_msg']) ? translations[currentLang]['success_msg'] : 'تم الإرسال بنجاح! <i class="fas fa-check-circle"></i>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Reset form inputs
        contactForm.reset();
        
        // Reset button state after 3 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

// Theme and Language handling
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');

let currentLang = localStorage.getItem('lang') || 'ar';
let currentTheme = localStorage.getItem('theme') || 'dark';

// Load custom translations from Admin Dashboard
let customTranslations = JSON.parse(localStorage.getItem('customTranslations')) || {ar: {}, en: {}};
if (customTranslations) {
    if (customTranslations.ar) {
        Object.keys(customTranslations.ar).forEach(key => {
            translations.ar[key] = customTranslations.ar[key];
        });
    }
    if (customTranslations.en) {
        Object.keys(customTranslations.en).forEach(key => {
            translations.en[key] = customTranslations.en[key];
        });
    }
}

function applyTheme() {
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function applyLang() {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });
    
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.setAttribute('placeholder', translations[currentLang][key]);
        }
    });
    
    if (translations[currentLang]) {
        document.querySelector('meta[name="description"]').setAttribute('content', translations[currentLang]['desc']);
        document.title = translations[currentLang]['title'];
    }
}

applyTheme();
applyLang();

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    applyLang();
});

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
});

// Premium Social Icons 3D Tilt Effect
const socialIcons = document.querySelectorAll('.premium-social-icon, .tilt-element');

socialIcons.forEach(icon => {
    icon.addEventListener('mousemove', e => {
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Very subtle luxury tilt (max 10 degrees)
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        icon.style.setProperty('--tilt-x', `${rotateX}deg`);
        icon.style.setProperty('--tilt-y', `${rotateY}deg`);
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.setProperty('--tilt-x', `0deg`);
        icon.style.setProperty('--tilt-y', `0deg`);
    });
});
