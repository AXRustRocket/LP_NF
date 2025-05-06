document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('#menuBtn');
    const mobileMenu = document.querySelector('#mobileMenu');
    
    if (menuBtn && mobileMenu) {
        // Store menu state to minimize DOM access
        let mobileMenuOpen = false;
        
        // Optimized open/close functions
        function openMobileMenu() {
            if (!mobileMenuOpen) {
                mobileMenu.classList.remove('translate-x-full');
                mobileMenu.classList.add('translate-x-0');
                menuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuOpen = true;
            }
        }
        
        function closeMobileMenu() {
            if (mobileMenuOpen) {
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuOpen = false;
            }
        }
        
        // Toggle menu on button click
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenuOpen ? closeMobileMenu() : openMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileMenuOpen && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu when menu links are clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }
    
    // Desktop dropdown toggle - FIXED
    const navMenuBtn = document.getElementById('navMenuBtn');
    const navDropdown = document.getElementById('navDropdown');
    
    if (navMenuBtn && navDropdown) {
        // Store dropdown state
        let dropdownOpen = false;
        
        // Optimized functions
        function openDropdown() {
            if (!dropdownOpen) {
                navDropdown.classList.remove('hidden');
                navDropdown.dataset.state = 'open';
                navMenuBtn.setAttribute('aria-expanded', 'true');
                dropdownOpen = true;
            }
        }
        
        function closeDropdown() {
            if (dropdownOpen) {
                navDropdown.classList.add('hidden');
                navDropdown.dataset.state = 'closed';
                navMenuBtn.setAttribute('aria-expanded', 'false');
                dropdownOpen = false;
            }
        }
        
        // Initialize hidden state
        navDropdown.classList.add('hidden');
        navDropdown.dataset.state = 'closed';
        navMenuBtn.setAttribute('aria-expanded', 'false');

        // Toggle dropdown
        navMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownOpen ? closeDropdown() : openDropdown();
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdownOpen) {
                closeDropdown();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (dropdownOpen && !navMenuBtn.contains(e.target) && !navDropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        // Close when dropdown links are clicked
        const dropdownLinks = navDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', closeDropdown);
        });
    } else {
        // Debug error logging for missing elements
        if (!navMenuBtn) {
            console.error('Navigation error: #navMenuBtn element not found');
        }
        if (!navDropdown) {
            console.error('Navigation error: #navDropdown element not found');
        }
    }
    
    // Legacy dropdown toggle (backup for old implementation)
    const menuBtnDesk = document.querySelector('#menuBtnDesk');
    const deskDrop = document.querySelector('#deskDrop');
    
    if (menuBtnDesk && deskDrop) {
        // Store dropdown state
        let dropdownOpen = false;
        
        // Optimized functions
        function openDropdown() {
            if (!dropdownOpen) {
                deskDrop.classList.remove('hidden');
                deskDrop.dataset.state = 'open';
                menuBtnDesk.setAttribute('aria-expanded', 'true');
                dropdownOpen = true;
            }
        }
        
        function closeDropdown() {
            if (dropdownOpen) {
                deskDrop.classList.add('hidden');
                deskDrop.dataset.state = 'closed';
                menuBtnDesk.setAttribute('aria-expanded', 'false');
                dropdownOpen = false;
            }
        }
        
        // Initialize hidden state
        deskDrop.classList.add('hidden');
        deskDrop.dataset.state = 'closed';
        menuBtnDesk.setAttribute('aria-expanded', 'false');

        // Toggle dropdown
        menuBtnDesk.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownOpen ? closeDropdown() : openDropdown();
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdownOpen) {
                closeDropdown();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (dropdownOpen && !menuBtnDesk.contains(e.target) && !deskDrop.contains(e.target)) {
                closeDropdown();
            }
        });

        // Close when dropdown links are clicked
        const dropdownLinks = deskDrop.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', closeDropdown);
        });
    }
}); 