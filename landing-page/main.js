/**
 * TodoPro Landing Page - Refined Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. OS Detection for Download Buttons
    const detectOS = () => {
        const platform = window.navigator.platform.toLowerCase();
        const userAgent = window.navigator.userAgent.toLowerCase();
        
        const btns = {
            win: document.getElementById('btn-win'),
            mac: document.getElementById('btn-mac'),
            linux: document.getElementById('btn-linux'),
            android: document.getElementById('btn-android')
        };

        if (!btns.win) return; // Guard

        // Reset all buttons
        Object.values(btns).forEach(btn => btn.classList.remove('active'));

        if (platform.includes('win')) {
            btns.win.classList.add('active');
        } else if (platform.includes('mac') || platform.includes('iphone') || platform.includes('ipad')) {
            btns.mac.classList.add('active');
        } else if (platform.includes('linux')) {
            btns.linux.classList.add('active');
        } else if (userAgent.includes('android')) {
            btns.android.classList.add('active');
        } else {
            btns.win.classList.add('active');
        }
    };

    detectOS();

    // 2. Refined Scroll Reveals
    const revealOnScroll = () => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once visible, no need to observe anymore
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Targeted elements for reveal
        const targets = document.querySelectorAll('.feature-card, .download-box, .section-header, .hero-content, .hero-image-container');
        targets.forEach(target => {
            target.classList.add('fade-up');
            observer.observe(target);
        });
    };

    revealOnScroll();

    // 3. Navbar Adaptive Look
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.style.height = '80px';
            navbar.style.background = 'rgba(252, 253, 254, 0.85)';
            navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.04)';
        } else {
            navbar.style.height = '90px';
            navbar.style.background = 'rgba(252, 253, 254, 0.6)';
            navbar.style.boxShadow = 'none';
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init state

    // 4. Elegant Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            
            if (target) {
                const navHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
