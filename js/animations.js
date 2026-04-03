/* ========================================
   GROWTH & SAVVY - GSAP ANIMATIONS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Show all elements immediately
    gsap.set('.reveal-up, .reveal-left, .reveal-right, .reveal-text, .hero-eyebrow, .hero-headline, .hero-subheadline, .hero-ctas, .hero-social', {
      opacity: 1,
      y: 0,
      x: 0
    });
    return;
  }

  // ========================================
  // HERO ANIMATIONS
  // ========================================
  
  const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  
  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
    .to('.hero-headline .reveal-text', { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      stagger: 0.1 
    }, '-=0.4')
    .to('.hero-subheadline', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero-social', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');

  // Set initial states for hero
  gsap.set('.hero-eyebrow, .hero-subheadline, .hero-ctas, .hero-social', { y: 30 });
  gsap.set('.hero-headline .reveal-text', { y: 100, opacity: 0 });

  // ========================================
  // SCROLL REVEALS
  // ========================================
  
  // Reveal Up
  gsap.utils.toArray('.reveal-up').forEach((elem, i) => {
    gsap.fromTo(elem, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Reveal Left
  gsap.utils.toArray('.reveal-left').forEach((elem) => {
    gsap.fromTo(elem,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Reveal Right
  gsap.utils.toArray('.reveal-right').forEach((elem) => {
    gsap.fromTo(elem,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ========================================
  // COUNTER ANIMATION
  // ========================================
  
  gsap.utils.toArray('.counter').forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          onUpdate: function() {
            counter.innerHTML = Math.round(this.targets()[0].innerHTML);
          }
        });
      },
      once: true
    });
  });

  // ========================================
  // NAVIGATION SCROLL EFFECT
  // ========================================
  
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 100 },
          ease: 'expo.inOut'
        });
      }
    });
  });

  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // ========================================
  // MAGNETIC BUTTON EFFECT (Desktop)
  // ========================================
  
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  // ========================================
  // PARALLAX EFFECTS
  // ========================================
  
  gsap.utils.toArray('.parallax-bg').forEach((elem) => {
    gsap.to(elem, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: elem,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // ========================================
  // TEXT SCRAMBLE EFFECT (Optional)
  // ========================================
  
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    
    update() {
      let output = '';
      let complete = 0;
      
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="text-gold-primary">${char}</span>`;
        } else {
          output += from;
        }
      }
      
      this.el.innerHTML = output;
      
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Apply scramble effect to hero headline on load
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline) {
    const phrases = ['Turn Attention', 'Into Revenue', 'Systems'];
    const fx = new TextScramble(heroHeadline);
    let counter = 0;
    
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 3000);
      });
      counter = (counter + 1) % phrases.length;
    };
    
    // Uncomment to enable scramble effect
    // next();
  }
});
