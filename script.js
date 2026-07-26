// Hide loader when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);
});

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('.theme-toggle i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
document.querySelector('.theme-toggle i').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.getAttribute('data-width');
            progressBar.style.width = width + '%';
            skillObserver.unobserve(progressBar);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-progress').forEach(bar => {
    skillObserver.observe(bar);
});

// Contact Form
function sendMessage() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const responseEl = document.getElementById('response');
    
    // Validation
    if (name === '' || email === '' || message === '') {
        responseEl.textContent = '⚠️ من فضلك املأ كل الحقول!';
        responseEl.className = 'form-response show error';
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        responseEl.textContent = '️ من فضلك أدخل بريد إلكتروني صحيح!';
        responseEl.className = 'form-response show error';
        return;
    }
    
    // Success message
    responseEl.textContent = `✅ شكراً يا ${name}! استلمنا رسالتك وهنرد عليك قريباً.`;
    responseEl.className = 'form-response show success';
    
    // Clear form
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        responseEl.classList.remove('show');
    }, 5000);
}

// Show welcome message on first visit
if (!sessionStorage.getItem('visited')) {
    setTimeout(() => {
        console.log('%c👋 أهلاً بيك في موقعي!', 'font-size: 20px; color: #667eea; font-weight: bold;');
        console.log('%cأنا عبدالرحمن، مطور واجهات ويب', 'font-size: 14px; color: #764ba2;');
    }, 2000);
    sessionStorage.setItem('visited', 'true');
}

// Add scroll effect to navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Add animation to project cards on scroll
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            projectObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    projectObserver.observe(card);
});

console.log('%c🚀 Portfolio loaded successfully!', 'color: #667eea; font-weight: bold;');
