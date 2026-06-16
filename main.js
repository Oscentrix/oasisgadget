/* ===== IFEBUIKE GADGETS STORE - MAIN JAVASCRIPT ===== */
/* This file contains all interactive functionality for the website */

/* ===== DOCUMENT READY / INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is fully loaded
    initNavigation();
    initThemeToggle();
    initContactForm();
    initMobileMenu();
    updateActiveNavLink();
});

/* ===== 1. NAVIGATION & SMOOTH SCROLLING ===== */
/**
 * Initialize navigation smooth scrolling
 * Handles smooth scroll to sections when nav links are clicked
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section from the href attribute
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Smooth scroll to the target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link styling
                updateActiveNavLink();
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

/**
 * Update the active navigation link based on current scroll position
 * Highlights the nav link of the section currently in view
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    // Find which section is currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the current section's nav link
    if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

/* ===== 2. DARK/LIGHT MODE TOGGLE ===== */
/**
 * Initialize theme toggle functionality
 * Manages dark/light mode switching and persistence
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check if user has a saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark-mode');
        updateThemeIcon();
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        htmlElement.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        if (htmlElement.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Update icon to reflect current theme
        updateThemeIcon();
    });
}

/**
 * Update the theme toggle button icon based on current theme
 */
function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    if (htmlElement.classList.contains('dark-mode')) {
        // Show sun icon when in dark mode (to switch to light)
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        // Show moon icon when in light mode (to switch to dark)
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Switch to Dark Mode';
    }
}

/* ===== 3. MOBILE HAMBURGER MENU ===== */
/**
 * Initialize mobile hamburger menu functionality
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            closeMobileMenu();
        }
    });
}

/**
 * Close the mobile menu
 */
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

/* ===== 4. CONTACT FORM VALIDATION & SUBMISSION ===== */
/**
 * Initialize contact form functionality
 * Handles validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Reset previous error states
        clearFormErrors();
        
        // Validate form
        let isValid = true;
        
        // Validate name (non-empty)
        if (!validateName(nameInput.value)) {
            showFieldError('name', 'Please enter your full name');
            isValid = false;
        }
        
        // Validate email (valid format)
        if (!validateEmail(emailInput.value)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message (non-empty, min 10 characters)
        if (!validateMessage(messageInput.value)) {
            showFieldError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        // If form is valid, show success message and reset form
        if (isValid) {
            showSuccessMessage();
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(hideSuccessMessage, 5000);
        }
    });
}

/**
 * Validate name field
 * @param {string} name - The name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateName(name) {
    return name.trim().length >= 2;
}

/**
 * Validate email field
 * Uses regex pattern to check email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate message field
 * @param {string} message - The message to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateMessage(message) {
    return message.trim().length >= 10;
}

/**
 * Display error message for a specific form field
 * @param {string} fieldId - The ID of the field with error
 * @param {string} errorMessage - The error message to display
 */
function showFieldError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    // Add error class to field
    field.parentElement.classList.add('error');
    
    // Display error message
    errorElement.textContent = errorMessage;
}

/**
 * Clear all form error displays
 */
function clearFormErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    const errorMessages = document.querySelectorAll('.error-message');
    
    formGroups.forEach(group => {
        group.classList.remove('error');
    });
    
    errorMessages.forEach(message => {
        message.textContent = '';
    });
}

/**
 * Display success message
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Scroll to success message
    successMessage.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

/**
 * Hide success message
 */
function hideSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('show');
}

/* ===== 5. OPTIONAL: SCROLL ANIMATIONS ===== */
/**
 * Initialize Intersection Observer for scroll-triggered animations
 * Elements with 'animate-on-scroll' class will animate when scrolled into view
 * (Currently disabled - uncomment to enable)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ===== 6. UTILITY: ADD ACTIVE CLASS TO PRODUCT CARDS ===== */
/**
 * Add interactive hover effects to product cards
 * (Already handled by CSS, this is optional for additional JS interactions)
 */
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            // Optional: Handle product card click
            // Can be used to navigate to product details or open modal
            console.log('Product card clicked:', this);
        });
    });
}

/* ===== 7. UTILITY: SOCIAL MEDIA LINKS ===== */
/**
 * Initialize social media links tracking (optional)
 */
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('aria-label') || 'Social';
            console.log(`Clicked: ${platform}`);
            // Could add analytics tracking here
        });
    });
}

/* ===== 8. INITIALIZE ALL ON PAGE LOAD ===== */
// Note: The main initialization is done in the DOMContentLoaded event listener
// If you want to enable additional features, uncomment the calls below:

// Optional: Uncomment to enable scroll animations
// window.addEventListener('load', initScrollAnimations);

// Optional: Initialize product card interactivity
// window.addEventListener('load', initProductCards);

// Optional: Initialize social media tracking
// window.addEventListener('load', initSocialLinks);

/* ===== END OF MAIN.JS ===== */
