// main.js - BAACafe Website Functionality (for all pages except order.html)

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Mobile Navigation Toggle
    // ======================
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
    
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    
    if (nav && navUl) {
        nav.insertBefore(mobileMenuBtn, nav.firstChild);
        
        function toggleMobileMenu() {
            const isExpanded = navUl.style.display === 'flex';
            navUl.style.display = isExpanded ? 'none' : 'flex';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.innerHTML = isExpanded ? '☰' : '✕';
        }
        
        function checkScreenSize() {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                navUl.style.display = 'none';
                navUl.style.flexDirection = 'column';
                navUl.style.width = '100%';
                navUl.style.marginTop = '1rem';
                navUl.style.alignItems = 'flex-start';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenuBtn.style.display = 'none';
                navUl.style.display = 'flex';
                navUl.style.flexDirection = 'row';
            }
        }
        
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    }

    // ======================
    // Current Year in Footer
    // ======================
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ======================
    // Form Validation (for contact and feedback forms)
    // ======================
    const forms = document.querySelectorAll('form:not(#contactForm)');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        // Add real-time validation
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            } else {
                // Form submission success
                if (form.id === 'feedbackForm') {
                    showNotification('Thank you for your feedback! We appreciate your input.');
                } else if (form.classList.contains('contact-form')) {
                    showNotification('Your message has been sent. We will get back to you soon!');
                    form.reset();
                }
            }
        });
    });
    
    function validateField(field) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Remove invalid class
        field.classList.remove('invalid');
        
        // Validate based on field type
        if (field.required && !field.value.trim()) {
            errorElement.textContent = 'This field is required';
            field.parentNode.appendChild(errorElement);
            field.classList.add('invalid');
            return false;
        }
        
        if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            errorElement.textContent = 'Please enter a valid email address';
            field.parentNode.appendChild(errorElement);
            field.classList.add('invalid');
            return false;
        }
        
        if (field.type === 'tel' && field.value.trim() && !/^[0-9]{8}$/.test(field.value)) {
            errorElement.textContent = 'Please enter a valid 8-digit Botswana number';
            field.parentNode.appendChild(errorElement);
            field.classList.add('invalid');
            return false;
        }
        
        return true;
    }

    // ======================
    // Notification System
    // ======================
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'global-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ======================
    // Gallery Lightbox (for gallery.html)
    // ======================
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        
        const lightboxImg = document.createElement('img');
        const lightboxClose = document.createElement('span');
        lightboxClose.innerHTML = '&times;';
        lightboxClose.className = 'lightbox-close';
        
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(lightboxClose);
        document.body.appendChild(lightbox);
        
        // Add click events to gallery items
        galleryItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                lightboxImg.src = imgSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === lightboxClose) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }

    // ======================
    // Scroll to Top Button
    // ======================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top-btn';
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ======================
    // Active Navigation Link Highlighting
    // ======================
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ======================
    // Dynamic Loading Animations
    // ======================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});

// Add global notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .global-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .global-notification.show {
        opacity: 1;
    }

    /* Lightbox Styles */
    #lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }
    
    #lightbox.active {
        opacity: 1;
        pointer-events: all;
    }
    
    #lightbox img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    }
    
    .lightbox-close {
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
    }

    /* Scroll to Top Button */
    .scroll-to-top-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #8d6e63;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
        z-index: 999;
    }
    
    .scroll-to-top-btn.show {
        opacity: 0.8;
        visibility: visible;
    }
    
    .scroll-to-top-btn:hover {
        opacity: 1;
    }

    /* Animation Classes */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s, transform 0.6s;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(notificationStyle);