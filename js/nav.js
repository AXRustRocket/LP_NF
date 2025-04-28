document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('#menuBtn');
    const mobileMenu = document.querySelector('#mobileMenu');
    
    console.log("Menu button:", menuBtn);
    console.log("Mobile menu:", mobileMenu);
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            console.log("Menu button clicked");
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            
            if (expanded) {
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
            } else {
                mobileMenu.classList.remove('translate-x-full');
                mobileMenu.classList.add('translate-x-0');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
            }
        });

        // Close mobile menu when menu links are clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
            });
        });
    }
    
    // Desktop dropdown toggle
    const menuBtnDesk = document.querySelector('#menuBtnDesk');
    const deskDrop = document.querySelector('#deskDrop');
    
    console.log("Desktop menu button:", menuBtnDesk);
    console.log("Desktop dropdown:", deskDrop);
    
    function openDropdown() {
        if (deskDrop) {
            console.log("Opening dropdown");
            deskDrop.classList.remove('hidden');
            deskDrop.dataset.state = 'open';
            menuBtnDesk.setAttribute('aria-expanded', 'true');
        }
    }
    
    function closeDropdown() {
        if (deskDrop) {
            console.log("Closing dropdown");
            deskDrop.classList.add('hidden');
            deskDrop.dataset.state = 'closed';
            menuBtnDesk.setAttribute('aria-expanded', 'false');
        }
    }
    
    if (menuBtnDesk && deskDrop) {
        // Initialize
        deskDrop.classList.add('hidden');
        deskDrop.dataset.state = 'closed';
        menuBtnDesk.setAttribute('aria-expanded', 'false');

        menuBtnDesk.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log("Desktop menu button clicked");
            
            const isOpen = deskDrop.dataset.state === 'open';
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && deskDrop.dataset.state === 'open') {
                closeDropdown();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtnDesk.contains(e.target) && !deskDrop.contains(e.target) && deskDrop.dataset.state === 'open') {
                closeDropdown();
            }
        });

        // Close when dropdown links are clicked
        const dropdownLinks = deskDrop.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeDropdown();
            });
        });
    }
}); 