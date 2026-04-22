document.addEventListener('DOMContentLoaded', () => {

    const homeView = document.getElementById('home-view');
    const subpageView = document.getElementById('subpage-view');
    const navLinks = document.querySelectorAll('.nav-link');
    const subpageSections = document.querySelectorAll('.subpage-section');
    const navbar = document.getElementById('navbar');

    function handleRoute() {
        const hash = window.location.hash || '#inicio';

        // Mapping hashes to their respective subpage-view section IDs
        const viewMapping = {
            '#inicio': 'home',
            '#nosotros': 'nosotros-content',
            '#servicios': 'servicios-content',
            '#trayectoria': 'trayectoria-content',
            '#contacto': 'contacto-content'
        };

        const targetView = viewMapping[hash];

        if (targetView === 'home') {
            showView('home');
        } else if (targetView) {
            showView(targetView);
        } else {
            showView('home');
        }
        
        updateActiveLink(hash);
    }

    function showView(viewId) {
        if (viewId === 'home') {
            subpageView.style.display = 'none';
            homeView.style.display = 'block';
        } else {
            homeView.style.display = 'none';
            subpageView.style.display = 'block';
            
            // Hide all sub-sections and show the specific one
            subpageSections.forEach(sec => sec.style.display = 'none');
            const targetSec = document.getElementById(viewId);
            if (targetSec) targetSec.style.display = 'block';
            
            window.scrollTo(0, 0);
        }
    }

    function updateActiveLink(hash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) link.classList.add('active');
        });
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('dark-mode') === 'true') document.body.classList.add('dark-mode');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('dark-mode', isDark);
            const icon = themeToggle.querySelector('i');
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // Mobil Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-links');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
        navLinks.forEach(l => l.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        }));
    }

    // EmailJS Form Handling
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            const params = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            emailjs.send('service_yz77x7l', 'template_32qb98k', params)
                .then(() => {
                    btn.innerText = '¡Enviado!';
                    form.reset();
                    setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
                }, (err) => {
                    console.error(err);
                    alert('Error al enviar. Intente de nuevo.');
                    btn.innerText = originalText; btn.disabled = false;
                });
        });
    }
});
