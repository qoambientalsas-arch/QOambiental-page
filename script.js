document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════
    // ROUTING — SPA Navigation
    // ══════════════════════════════════════════
    const homeView      = document.getElementById('home-view');
    const subpageView   = document.getElementById('subpage-view');
    const navLinks      = document.querySelectorAll('.nav-link');
    const subpageSecs   = document.querySelectorAll('.subpage-section');
    const navbar        = document.getElementById('navbar');

    const viewMap = {
        '#inicio':      'home',
        '#nosotros':    'nosotros-content',
        '#servicios':   'servicios-content',
        '#portafolio':  'portafolio-content',
        '#trayectoria': 'trayectoria-content',
        '#contacto':    'contacto-content',
    };

    function handleRoute() {
        const hash = window.location.hash || '#inicio';
        const target = viewMap[hash];
        if (!target || target === 'home') {
            showView('home');
        } else {
            showView(target);
        }
        updateActiveLink(hash);
    }

    function showView(viewId) {
        if (viewId === 'home') {
            subpageView.style.display = 'none';
            homeView.style.display    = 'block';
            navbar.classList.remove('scrolled');
            updateNavbarTheme();
        } else {
            homeView.style.display    = 'none';
            subpageView.style.display = 'block';
            subpageSecs.forEach(s => s.style.display = 'none');
            const sec = document.getElementById(viewId);
            if (sec) sec.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navbar.classList.add('scrolled');
            // Init QR if portafolio view
            if (viewId === 'portafolio-content') initQR();
            // Trigger reveals
            setTimeout(triggerReveals, 100);
        }
    }

    function updateActiveLink(hash) {
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === hash) l.classList.add('active');
        });
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // ══════════════════════════════════════════
    // NAVBAR — Scroll behavior
    // ══════════════════════════════════════════
    function updateNavbarTheme() {
        const isHome = homeView.style.display !== 'none';
        if (isHome && window.scrollY < 60) {
            navbar.classList.remove('scrolled');
        } else {
            navbar.classList.add('scrolled');
        }
    }

    window.addEventListener('scroll', () => {
        updateNavbarTheme();
        // Scroll to top button
        const scrollBtn = document.getElementById('scroll-top');
        if (scrollBtn) {
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        }
        // Trigger reveals on scroll
        triggerReveals();
    }, { passive: true });

    // ══════════════════════════════════════════
    // MOBILE MENU
    // ══════════════════════════════════════════
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu    = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function closeMobileMenu() {
        navMenu?.classList.remove('active');
        navOverlay?.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function setMobileMenuState(isOpen) {
        navMenu?.classList.toggle('active', isOpen);
        navOverlay?.classList.toggle('active', isOpen);
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        }
    }

    menuToggle?.addEventListener('click', () => {
        if (!navMenu) return;
        const isOpen = !navMenu.classList.contains('active');
        setMobileMenuState(isOpen);
    });

    navOverlay?.addEventListener('click', closeMobileMenu);
    navLinks.forEach(l => l.addEventListener('click', closeMobileMenu));

    // ══════════════════════════════════════════
    // DARK MODE
    // ══════════════════════════════════════════
    const themeToggle = document.getElementById('theme-toggle');
    const savedDark   = localStorage.getItem('dark-mode') === 'true';
    if (savedDark) {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon(savedDark);

    themeToggle?.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', isDark);
        updateThemeIcon(isDark);
    });

    function updateThemeIcon(dark) {
        const icon = themeToggle?.querySelector('i');
        if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle?.setAttribute('aria-pressed', String(Boolean(dark)));
    }

    // ══════════════════════════════════════════
    // QR CODE — Portafolio
    // ══════════════════════════════════════════
    let qrGenerated = false;

    function initQR() {
        if (qrGenerated) return;
        const container = document.getElementById('qr-container');
        if (!container || typeof QRCode === 'undefined') return;

        container.innerHTML = '';

        // URL del portafolio: path relativo que apunta al PDF
        // En producción se puede cambiar a la URL final del sitio
        const portfolioURL = new URL('assets/docs/portafolio.pdf', window.location.href).href;

        try {
            new QRCode(container, {
                text:           portfolioURL,
                width:          188,
                height:         188,
                colorDark:      '#3d7b31',
                colorLight:     '#ffffff',
                correctLevel:   QRCode.CorrectLevel.M,
            });
            qrGenerated = true;
        } catch (e) {
            // Fallback: show URL
            container.innerHTML = `
                <div style="padding:20px; text-align:center; font-size:0.75rem; color:#3d7b31; word-break:break-all;">
                    <i class="fas fa-qrcode" style="font-size:3rem; display:block; margin-bottom:12px; opacity:0.5;"></i>
                    QR generado automáticamente
                </div>`;
        }
    }

    // ══════════════════════════════════════════
    // SCROLL REVEAL ANIMATIONS
    // ══════════════════════════════════════════
    function triggerReveals() {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        const windowH = window.innerHeight;
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowH - 80) {
                el.classList.add('active');
            }
        });
    }

    triggerReveals(); // Run once on load

    // ══════════════════════════════════════════
    // SCROLL TO TOP
    // ══════════════════════════════════════════
    document.getElementById('scroll-top')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ══════════════════════════════════════════
    // HERO BACKGROUND SLIDESHOW
    // ══════════════════════════════════════════
    const heroBgs = [
        "assets/media/PHOTO-2026-10-14-15-35-20_6.jpg",
        "assets/media/PHOTO-2026-10-14-15-35-20_3.jpg",
        "assets/media/PHOTO-2026-10-14-15-35-20.jpg",
        "assets/media/PHOTO-2026-10-14-15-35-19_1.jpg",
    ];
    let heroBgIndex = 0;
    const heroBgEl = document.getElementById('hero-bg');

    if (heroBgEl) {
        setInterval(() => {
            heroBgIndex = (heroBgIndex + 1) % heroBgs.length;
            heroBgEl.style.transition = 'opacity 1.5s ease';
            heroBgEl.style.opacity = '0';
            setTimeout(() => {
                heroBgEl.style.backgroundImage = `url('${heroBgs[heroBgIndex]}')`;
                heroBgEl.style.opacity = '1';
            }, 1500);
        }, 8000);
    }

    // ══════════════════════════════════════════
    // CONTACT FORM — EmailJS
    // ══════════════════════════════════════════
    const form    = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        const params = {
            name:    document.getElementById('name')?.value    || 'Prospecto Web',
            email:   document.getElementById('email')?.value   || '',
            phone:   document.getElementById('phone')?.value   || 'No proporcionado',
            service: document.getElementById('service')?.value || 'No especificado',
            message: document.getElementById('message')?.value || '',
        };

        try {
            await emailjs.send('service_yz77x7l', 'template_32qb98k', params);
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado correctamente!';
            submitBtn.style.background = 'var(--grad-green)';
            form.reset();
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled  = false;
                submitBtn.style.background = '';
            }, 4000);
        } catch (err) {
            console.error('EmailJS Error:', err);
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error al enviar';
            submitBtn.style.background = 'linear-gradient(135deg, #c0392b, #e74c3c)';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled  = false;
                submitBtn.style.background = '';
            }, 4000);
        }
    });

    // ══════════════════════════════════════════
    // COUNTER ANIMATION (stats)
    // ══════════════════════════════════════════
    function animateCounter(el, target, suffix = '') {
        let current = 0;
        const step  = Math.ceil(target / 40);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current + suffix;
        }, 40);
    }

    // Observe stats strip
    const statsStrip = document.querySelector('.stats-strip');
    if (statsStrip) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = statsStrip.querySelectorAll('.big');
                    const vals  = [10, 8, 3];
                    const sfx   = ['+', '', ''];
                    items.forEach((item, i) => {
                        if (!isNaN(parseInt(vals[i]))) {
                            animateCounter(item, vals[i], sfx[i]);
                        }
                    });
                    obs.disconnect();
                }
            });
        }, { threshold: 0.5 });
        obs.observe(statsStrip);
    }

}); // DOMContentLoaded
