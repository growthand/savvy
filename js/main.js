/* ========================================
   GROWTH & SAVVY - MAIN JAVASCRIPT
   ======================================== */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================
  // CURRENT YEAR IN FOOTER
  // ========================================
  const yearElements = document.querySelectorAll('.current-year');
  yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ========================================
  // FORM HANDLING
  // ========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simple validation
      if (!data.email || !data.name) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification('Message sent successfully! We\'ll be in touch soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // ========================================
  // NOTIFICATION SYSTEM
  // ========================================
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg transform translate-y-full opacity-0 transition-all duration-300 z-50 ${
      type === 'success' ? 'bg-gold-primary text-bg-primary' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.classList.remove('translate-y-full', 'opacity-0');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-y-full', 'opacity-0');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ========================================
  // LAZY LOADING IMAGES
  // ========================================
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // ========================================
  // EXTERNAL LINKS HANDLING
  // ========================================
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ========================================
  // SMOOTH SCROLL POLYFILL FOR SAFARI
  // ========================================
  if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
      .then(() => {
        window.smoothScroll = smoothscroll;
      });
  }

  // ========================================
  // PERFORMANCE: CLEANUP ON PAGE HIDE
  // ========================================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause expensive animations when tab is hidden
      document.body.classList.add('tab-hidden');
    } else {
      document.body.classList.remove('tab-hidden');
    }
  });
});
