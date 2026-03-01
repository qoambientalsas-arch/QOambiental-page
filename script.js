document.addEventListener('DOMContentLoaded', () => {

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle icon from bars to times
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Ensure icon color contrasts well in mobile
                icon.style.color = 'var(--color-text-main)';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                if (window.scrollY <= 50) {
                    icon.style.color = 'var(--color-white)';
                }
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                if (window.scrollY <= 50) {
                    icon.style.color = 'var(--color-white)';
                }
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Contact Form Handling (EmailJS Integration) ---
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Referencia al botón para dar feedback de envío
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Cambiar estado a enviando
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // Collect form data matching HTML template bindings: {{name}}, {{email}}, etc.
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value || 'No proporcionado';
            const serviceSelect = document.getElementById('service');
            const service = serviceSelect.options[serviceSelect.selectedIndex].text;
            const message = document.getElementById('message').value;

            // Parametros para enviar a la plantilla
            const templateParams = {
                name: name,
                email: email,
                phone: phone,
                service: service,
                message: message
            };

            // Enviar usando EmailJS (Service ID, Template ID, params)
            emailjs.send('service_yz77x7l', 'template_32qb98k', templateParams)
                .then(function (response) {
                    console.log('EXITO!', response.status, response.text);
                    // Mostrar exito
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Mensaje Enviado!';
                    submitBtn.style.backgroundColor = 'var(--color-secondary)';

                    // Limpiar el formulario
                    form.reset();

                    // Regresar el botón a la normalidad después de unos segundos
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 3000);

                }, function (error) {
                    console.log('FALLO...', error);
                    alert('Hubo un error al intentar enviar tu mensaje. Por favor, intenta usar nuestros medios de contacto directos.');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

});
