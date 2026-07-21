document.addEventListener('DOMContentLoaded', () => {

  // Initialize Antigravity Particle Background
  const container = document.getElementById('antigravity-container');
  if (container && typeof THREE !== 'undefined' && typeof Antigravity !== 'undefined') {
    new Antigravity(container, {
      count: 100,
      magnetRadius: 17,
      ringRadius: 12,
      waveSpeed: 2,
      waveAmplitude: 1,
      particleSize: 1.5,
      lerpSpeed: 0.05,
      color: '#00fbfc',
      autoAnimate: true,
      particleVariance: 1,
      rotationSpeed: 0,
      depthFactor: 1,
      pulseSpeed: 3,
      particleShape: 'capsule',
      fieldStrength: 10
    });
  }

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


  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(248, 250, 252, 0.95)';
      header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
      header.style.height = '70px';
    } else {
      header.style.background = 'rgba(248, 250, 252, 0.8)';
      header.style.boxShadow = 'none';
      header.style.height = '80px';
    }
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillItems = document.querySelectorAll('.skill-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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

  const printButtons = document.querySelectorAll('.download-cv-btn');
  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

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

  const animatedElements = document.querySelectorAll('.card, .timeline-item, .project-card, .stat-card, .section-header');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' 
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });
});
