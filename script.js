document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        theme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // --- 0.5 Navbar Scroll & Active State ---
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Navbar style on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 0.7 Intersection Observer for Scroll Animations ---
    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- 1. Dynamic Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. Smooth Scrolling for Navigation & Buttons ---
    const scrollLinks = document.querySelectorAll('a[href^="#"], #btn-get-started');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') || '#contact'; // fallback for button
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Form Validation ---
    const contactForm = document.getElementById('contact-form');
    const btnClear = document.getElementById('btn-clear');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Name validation
            const nameInput = document.getElementById('name');
            if (nameInput.value.trim().length < 3) {
                setErrorFor(nameInput);
                isValid = false;
            } else {
                setSuccessFor(nameInput);
            }
            
            // Email validation
            const emailInput = document.getElementById('email');
            if (!isEmailValid(emailInput.value.trim())) {
                setErrorFor(emailInput);
                isValid = false;
            } else {
                setSuccessFor(emailInput);
            }
            
            // Subject validation
            const subjectInput = document.getElementById('subject');
            if (subjectInput.value.trim() === '') {
                setErrorFor(subjectInput);
                isValid = false;
            } else {
                setSuccessFor(subjectInput);
            }
            
            // Message validation
            const messageInput = document.getElementById('message');
            if (messageInput.value.trim().length < 10) {
                setErrorFor(messageInput);
                isValid = false;
            } else {
                setSuccessFor(messageInput);
            }
            
            if (isValid) {
                // Simulate form submission
                formSuccess.classList.remove('hidden');
                
                setTimeout(() => {
                    contactForm.reset();
                    resetFormStates();
                    formSuccess.classList.add('hidden');
                }, 3000);
            }
        });

        // Clear button functionality
        btnClear.addEventListener('click', () => {
            contactForm.reset();
            resetFormStates();
            formSuccess.classList.add('hidden');
        });

        // Remove error states on input
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const formGroup = input.parentElement;
                formGroup.classList.remove('error');
                formGroup.classList.remove('success');
            });
        });
    }

    function setErrorFor(input) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
    }

    function setSuccessFor(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    }

    function isEmailValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function resetFormStates() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
    }

    // --- 4. Dynamic Task List ---
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');
    
    // Stats elements
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');
    const taskProgressEl = document.getElementById('task-progress');
    
    let tasks = [
        { id: 1, text: 'Complete HTML practice', completed: false },
        { id: 2, text: 'Learn CSS Grid', completed: true },
        { id: 3, text: 'Practice JavaScript DOM', completed: false }
    ];

    function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content" data-id="${task.id}">
                    <div class="task-checkbox">
                        ${task.completed ? '✓' : ''}
                    </div>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <button class="btn-delete" data-id="${task.id}" aria-label="Delete task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            
            taskList.appendChild(li);
        });
        
        updateStats();
    }

    function updateStats() {
        if (!totalTasksEl) return;
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        pendingTasksEl.textContent = pending;

        if (taskProgressEl) {
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
            taskProgressEl.style.width = `${percentage}%`;
        }
    }

    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = taskInput.value.trim();
            if (text !== '') {
                tasks.push({
                    id: Date.now(),
                    text: text,
                    completed: false
                });
                taskInput.value = '';
                renderTasks();
            }
        });
    }

    if (taskList) {
        taskList.addEventListener('click', (e) => {
            // Handle Toggle completion
            const taskContent = e.target.closest('.task-content');
            if (taskContent) {
                const id = parseInt(taskContent.getAttribute('data-id'));
                const task = tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    renderTasks();
                }
            }
            
            // Handle Delete
            const deleteBtn = e.target.closest('.btn-delete');
            if (deleteBtn) {
                const id = parseInt(deleteBtn.getAttribute('data-id'));
                const li = deleteBtn.closest('.task-item');
                // Add animating out class
                li.classList.add('deleting');
                
                // Wait for animation to finish before removing from array and re-rendering
                setTimeout(() => {
                    tasks = tasks.filter(t => t.id !== id);
                    renderTasks();
                }, 250); // Matches CSS transition duration
            }
        });
    }

    // Helper to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initial render
    renderTasks();
});
