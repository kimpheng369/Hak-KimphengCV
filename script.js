document.addEventListener('DOMContentLoaded', () => {

  let antigravityInstance = null;

  // Initialize Antigravity Particle Background
  const container = document.getElementById('antigravity-container');
  if (container && typeof THREE !== 'undefined' && typeof Antigravity !== 'undefined') {
    antigravityInstance = new Antigravity(container, {
      count: 100,
      magnetRadius: 17,
      ringRadius: 12,
      waveSpeed: 2,
      waveAmplitude: 1,
      particleSize: 1.5,
      lerpSpeed: 0.05,
      color: '#4f46e5', // Initialize with Light Theme primary color
      autoAnimate: true,
      particleVariance: 1,
      rotationSpeed: 0,
      depthFactor: 1,
      pulseSpeed: 3,
      particleShape: 'capsule',
      fieldStrength: 10
    });
  }

  // --- Theme Management ---
  const themeToggle = document.getElementById('theme-toggle');
  
  function getThemeColor(theme) {
    return theme === 'dark' ? '#00fbfc' : '#4f46e5';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update particle background color
    if (antigravityInstance) {
      antigravityInstance.updateColor(getThemeColor(theme));
    }
  }

  // Initialize Theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Mobile navigation menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Sticky header class updates on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  // --- Skills Filter and Sliding Pill ---
  const filterContainer = document.querySelector('.skills-filter-container');
  const filterPill = document.getElementById('skills-filter-pill');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillItems = document.querySelectorAll('.skill-item');

  function updateFilterPill(activeBtn) {
    if (filterPill && activeBtn && filterContainer) {
      const rect = activeBtn.getBoundingClientRect();
      const containerRect = filterContainer.getBoundingClientRect();
      
      filterPill.style.width = `${rect.width}px`;
      filterPill.style.height = `${rect.height}px`;
      filterPill.style.left = `${rect.left - containerRect.left}px`;
      filterPill.style.top = `${rect.top - containerRect.top}px`;
    }
  }

  // Initialize skills sliding pill after delay
  setTimeout(() => {
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) updateFilterPill(activeBtn);
  }, 150);

  // Resize listener for active tab indicator
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) updateFilterPill(activeBtn);
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateFilterPill(btn);

      const filterValue = btn.getAttribute('data-filter');

      skillItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });



  // --- Magnetic Buttons Effect ---
  const magneticElements = document.querySelectorAll('.btn, .social-icon, .theme-toggle-btn, .nav-btn-download');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transition = 'none'; // clear transition for real-time tracking
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = '';
    });
  });

  // --- 3D Tilt & Glare Card Effect ---
  const tiltCards = document.querySelectorAll('.project-card, .card, .stat-card');
  
  tiltCards.forEach(card => {
    const glare = document.createElement('div');
    glare.className = 'card-glare';
    card.appendChild(glare);
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const rotateX = -((y / rect.height) - 0.5) * 8; // slightly reduced rotation for subtler feel
      const rotateY = ((x / rect.width) - 0.5) * 8;
      
      card.style.transition = 'none'; // clear transition for instant response
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.setProperty('--glare-x', `${x}px`);
      card.style.setProperty('--glare-y', `${y}px`);
      
      glare.style.transition = 'opacity 0.15s ease';
      glare.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = '';
      
      glare.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      glare.style.opacity = '0';
    });
  });

  // --- Copy Clipboard triggers ---
  const copyTriggers = document.querySelectorAll('.copy-trigger');
  const copyToast = document.getElementById('copy-toast');

  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const textToCopy = trigger.getAttribute('data-copy');
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyToast.innerText = `Copied: ${textToCopy}`;
        copyToast.classList.add('show');
        
        const copyBtn = trigger.querySelector('.action-btn-copy');
        if (copyBtn) {
          copyBtn.style.transform = 'scale(1.2)';
          copyBtn.style.color = '#22c55e';
          setTimeout(() => {
            copyBtn.style.transform = '';
            copyBtn.style.color = '';
          }, 500);
        }

        setTimeout(() => {
          copyToast.classList.remove('show');
        }, 2500);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
  });

  // --- Print CV Actions ---
  const printButtons = document.querySelectorAll('.download-cv-btn');
  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // --- Contact Form submission ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const btnText = submitBtn.querySelector('span');
      const originalText = btnText ? btnText.innerText : 'Send Message';

      submitBtn.disabled = true;
      if (btnText) btnText.innerText = 'Sending Message...';
      formFeedback.classList.remove('success', 'error');
      formFeedback.innerText = '';
      formFeedback.style.opacity = '0';

      setTimeout(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.innerText = originalText;

        formFeedback.innerText = 'Thank you! Your message has been sent successfully.';
        formFeedback.classList.add('success');
        formFeedback.style.opacity = '1';

        contactForm.reset();

        setTimeout(() => {
          formFeedback.style.opacity = '0';
        }, 5000);
      }, 1500);
    });
  }

  // --- Scroll Stagger reveal animations ---
  const observerOptions = {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px' 
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || '0ms';
        
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, parseInt(delay));
        
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // Auto-assign stagger delays
  const groups = document.querySelectorAll('.skills-grid, .projects-grid, .stats-grid, .timeline');
  groups.forEach(group => {
    const children = group.querySelectorAll('.card, .project-card, .stat-card, .timeline-item');
    children.forEach((child, index) => {
      child.setAttribute('data-delay', `${index * 80}ms`);
    });
  });

  const animatedElements = document.querySelectorAll('.card, .timeline-item, .project-card, .stat-card, .section-header');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.98)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
});
