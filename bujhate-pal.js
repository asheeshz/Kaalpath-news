document.addEventListener('DOMContentLoaded', function() {

  console.log('बुझते पल कस्टम स्क्रिप्ट्स v4.0 (थीम सुरक्षित) लोड हो रही हैं...');

  // --- नेम्सपेस और हेल्पर फंक्शन ---
  const BPS = {}; // Namespace for our functions and variables

  BPS.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // --- 1. स्मूथ स्क्रॉल फंक्शनलिटी ---
  try {
    const scrollLinks = document.querySelectorAll('a.custom-a[href^="#"], a.internal-link[href^="#"]');
    if (scrollLinks.length > 0) {
      scrollLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
            event.preventDefault();
            try {
              const cleanTargetId = '#' + CSS.escape(targetId.substring(1));
              const targetElement = document.querySelector(cleanTargetId);
              if (targetElement) {
                // scrollIntoView scroll-padding-top का सम्मान करता है
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                console.warn('[BPS] Smooth scroll target तत्व नहीं मिला:', targetId, cleanTargetId);
              }
            } catch (e) {
              console.error('[BPS] Smooth scroll सेलेक्टर त्रुटि:', targetId, e);
            }
          } else if (targetId === '#') {
            event.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
          }
        });
      });
      console.log('[BPS][OK] Smooth scroll तैयार है।');
    }
  } catch (error) {
    console.error('[BPS][त्रुटि] Smooth scroll सेटअप:', error);
  }

  // --- 2. स्क्रॉल-टू-टॉप बटन फंक्शनलिटी ---
  try {
    const scrollToTopBtn = document.getElementById('bujhate-pal-scroll-top-btn'); // यूनिक ID
    if (scrollToTopBtn && scrollToTopBtn.classList.contains('custom-scroll-top')) {
      const scrollThreshold = 350; // थोड़ा नीचे दिखाने के लिए
      let isVisible = false;

      const toggleVisibility = () => {
        const shouldBeVisible = window.pageYOffset > scrollThreshold;
        if (shouldBeVisible && !isVisible) {
          scrollToTopBtn.classList.add('custom-show'); // प्रीफिक्स्ड क्लास
          isVisible = true;
        } else if (!shouldBeVisible && isVisible) {
          scrollToTopBtn.classList.remove('custom-show'); // प्रीफिक्स्ड क्लास
          isVisible = false;
        }
      };

      // डिबाउंसिंग के साथ स्क्रॉल इवेंट
      window.addEventListener('scroll', BPS.debounce(toggleVisibility, 100), { passive: true });

      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      toggleVisibility(); // Initial check
      console.log('[BPS][OK] Scroll-to-top बटन तैयार है।');
    }
  } catch (error) {
    console.error('[BPS][त्रुटि] Scroll-to-top सेटअप:', error);
  }

  // --- 3. बाहरी लिंक्स को नई टैब में खोलना ---
  try {
    const contentAreas = document.querySelectorAll('.custom-div, .custom-header-description');
    const currentHostname = window.location.hostname;
    let externalLinkCount = 0;

    contentAreas.forEach(area => {
      // केवल उन्हीं a टैग्स को चुनें जिनमें href है और जो हमारे कस्टम बटन/लिंक क्लासेस नहीं हैं
      const links = area.querySelectorAll('a[href]:not(.custom-a):not(.internal-link)');
      links.forEach(link => {
        const href = link.getAttribute('href');
        // पहले से target="_blank" नहीं होना चाहिए और mailto/tel नहीं होना चाहिए
        if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !link.target && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          try {
             const linkUrl = new URL(link.href);
             if ((linkUrl.protocol === "http:" || linkUrl.protocol === "https:") && linkUrl.hostname !== currentHostname && linkUrl.hostname !== '') {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('title', (link.title ? link.title + ' ' : '') + '(नई टैब में खुलेगा)'); // Title जोड़ें
                externalLinkCount++;
             }
          } catch (e) { /* अमान्य URL अनदेखा करें */ }
        }
      });
    });
    if (externalLinkCount > 0) console.log(`[BPS][OK] ${externalLinkCount} बाहरी लिंक हैंडल किए गए।`);
  } catch (error) {
    console.error('[BPS][त्रुटि] बाहरी लिंक सेटअप:', error);
  }

  // --- 4. कोड ब्लॉक कॉपी बटन ---
  try {
    const codeBlocks = document.querySelectorAll('pre.custom-pre');
    if (navigator.clipboard && codeBlocks.length > 0) {
      codeBlocks.forEach(block => {
        const codeElement = block.querySelector('code');
        if (!codeElement || block.querySelector('.custom-copy-btn')) return;

        const copyButton = document.createElement('button');
        copyButton.className = 'custom-copy-btn';
        copyButton.textContent = 'कॉपी';
        copyButton.setAttribute('aria-label', 'कोड कॉपी करें');
        copyButton.type = 'button';
        block.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
          const codeToCopy = codeElement.innerText || codeElement.textContent;
          navigator.clipboard.writeText(codeToCopy).then(() => {
            copyButton.textContent = 'कॉपी हुआ!';
            copyButton.classList.add('custom-copied'); // प्रीफिक्स्ड क्लास
            copyButton.disabled = true;
            setTimeout(() => {
              copyButton.textContent = 'कॉपी';
              copyButton.classList.remove('custom-copied'); // प्रीफिक्स्ड क्लास
              copyButton.disabled = false;
            }, 2200); // थोड़ा लंबा समय
          }).catch(err => {
            console.error('[BPS] कोड कॉपी करने में विफल:', err);
            copyButton.textContent = 'त्रुटि';
            setTimeout(() => { copyButton.textContent = 'कॉपी'; }, 2000);
          });
        });
      });
      console.log(`[BPS][OK] ${codeBlocks.length} कोड ब्लॉक के लिए कॉपी बटन तैयार हैं।`);
    } else if (codeBlocks.length > 0) {
      console.warn('[BPS][सूचना] क्लिपबोर्ड API समर्थित नहीं है, कोड कॉपी बटन अक्षम हैं।');
    }
  } catch (error) {
    console.error('[BPS][त्रुटि] कोड कॉपी बटन सेटअप:', error);
  }

  // --- 5. अलर्ट/नोट डिस्मिस फंक्शनलिटी ---
  try {
    const dismissContainers = document.querySelectorAll('.custom-alert, .custom-note');
    let dismissibleCount = 0;
    dismissContainers.forEach(container => {
      if (!container.querySelector('.custom-dismiss-btn')) {
          const dismissButton = document.createElement('button');
          dismissButton.className = 'custom-dismiss-btn';
          dismissButton.innerHTML = '×';
          dismissButton.setAttribute('aria-label', 'बंद करें');
          dismissButton.type = 'button';
          container.appendChild(dismissButton);
          dismissibleCount++;

          dismissButton.addEventListener('click', (event) => {
            event.preventDefault();
            container.classList.add('custom-dismissed'); // प्रीफिक्स्ड क्लास
             container.addEventListener('transitionend', (e) => {
                 // सुनिश्चित करें कि यह सही ट्रांजीशन है (opacity) और क्लास अभी भी मौजूद है
                 if (e.propertyName === 'opacity' && container.classList.contains('custom-dismissed')) {
                     container.remove();
                 }
             }, { once: true });
          });
      }
    });
    if (dismissibleCount > 0) console.log(`[BPS][OK] ${dismissibleCount} अलर्ट/नोट डिस्मिस बटन तैयार हैं।`);
  } catch (error) {
    console.error('[BPS][त्रुटि] अलर्ट/नोट डिस्मिस सेटअप:', error);
  }

  // --- 6. स्क्रॉल पर प्रकट एनिमेशन ---
  try {
    // लक्ष्य सेलेक्टर को और अधिक विशिष्ट बनाएं
    const revealTargets = document.querySelectorAll('.custom-div > *:not(script):not(style), .custom-figure, .custom-header-description > *:not(script):not(style), .custom-quote, .custom-table-container, .custom-pre, .custom-alert, .custom-note, .custom-ad-placeholder, .custom-version-links, .custom-pagination');

    if ('IntersectionObserver' in window && revealTargets.length > 0) {
      const observerOptions = {
          root: null,
          rootMargin: '0px 0px -10% 0px', // थोड़ा और नीचे से ट्रिगर
          threshold: 0.1
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
             // थोड़ा स्टेगर्ड डिले जोड़ें
             const delay = index * 50; // हर एलिमेंट के लिए 50ms का अंतर
             setTimeout(() => {
                 entry.target.classList.add('custom-is-visible'); // प्रीफिक्स्ड क्लास
             }, delay < 500 ? delay : 500); // अधिकतम 500ms डिले

            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealTargets.forEach(target => {
        // केवल उन्हीं तत्वों पर क्लास लगाएं जो पहले से visible नहीं हैं
        if (!target.classList.contains('custom-is-visible')) {
            target.classList.add('custom-reveal-on-scroll'); // प्रीफिक्स्ड क्लास
            revealObserver.observe(target);
        }
      });
      console.log(`[BPS][OK] ${revealTargets.length} तत्वों के लिए स्क्रॉल एनिमेशन तैयार है।`);
    } else if (revealTargets.length > 0) {
      console.warn('[BPS][सूचना] IntersectionObserver समर्थित नहीं है, स्क्रॉल एनिमेशन अक्षम है।');
      revealTargets.forEach(target => {
          target.classList.add('custom-reveal-on-scroll');
          target.classList.add('custom-is-visible');
      });
    }
  } catch (error) {
    console.error('[BPS][त्रुटि] स्क्रॉल एनिमेशन सेटअप:', error);
  }

  console.log('बुझते पल कस्टम स्क्रिप्ट्स v4.0 (थीम सुरक्षित) सफलतापूर्वक लोड और कॉन्फ़िगर हो गईं।');

}); // --- DOMContentLoaded का अंत ---
