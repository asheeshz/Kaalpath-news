/* =====================================
   बुझते पल - कस्टम स्क्रिप्ट्स v3.2 (विस्तारित और जीवंत)
   लेखक: आशेष (AI द्वारा सहायता प्राप्त)
   विशेषताएं: स्मूथ स्क्रॉल, स्क्रॉल-टू-टॉप, बाहरी लिंक, कोड कॉपी,
             अलर्ट/नोट डिस्मिस, स्क्रॉल पर प्रकट एनिमेशन
   ===================================== */

document.addEventListener('DOMContentLoaded', function() {

  console.log('बुझते पल कस्टम स्क्रिप्ट्स v3.2 लोड हो रही हैं...');

  // --- 1. स्मूथ स्क्रॉल फंक्शनलिटी ---
  try {
    const scrollLinks = document.querySelectorAll('.custom-a[href^="#"], a.internal-link[href^="#"]'); // आंतरिक लिंक भी शामिल करें
    scrollLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
          event.preventDefault();
          try {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else { console.warn('Smooth scroll target तत्व नहीं मिला:', targetId); }
          } catch (e) { console.error('Smooth scroll के लिए अमान्य सेलेक्टर:', targetId, e); }
        } else if (targetId === '#') { /* # वाले लिंक को डिफ़ॉल्ट व्यवहार करने दें */ }
      });
    });
    console.log('[OK] Smooth scroll तैयार है।');
  } catch (error) { console.error('[त्रुटि] Smooth scroll सेटअप:', error); }

  // --- 2. स्क्रॉल-टू-टॉप बटन फंक्शनलिटी ---
  try {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn && scrollToTopBtn.classList.contains('custom-scroll-top')) { // सुनिश्चित करें कि सही बटन है
      const scrollThreshold = 300;
      let isVisible = false;
      const toggleVisibility = () => {
        if (window.pageYOffset > scrollThreshold && !isVisible) {
          scrollToTopBtn.classList.add('show');
          isVisible = true;
        } else if (window.pageYOffset <= scrollThreshold && isVisible) {
          scrollToTopBtn.classList.remove('show');
          isVisible = false;
        }
      };
      window.addEventListener('scroll', toggleVisibility, { passive: true });
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      toggleVisibility(); // पेज लोड पर प्रारंभिक जांच
      console.log('[OK] Scroll-to-top बटन तैयार है।');
    } else { /* बटन नहीं मिला या सही क्लास नहीं है */ }
  } catch (error) { console.error('[त्रुटि] Scroll-to-top सेटअप:', error); }

  // --- 3. बाहरी लिंक्स को नई टैब में खोलना ---
  try {
    const contentAreas = document.querySelectorAll('.custom-div, .custom-header-description'); // विवरण बॉक्स भी शामिल करें
    const currentHostname = window.location.hostname;
    contentAreas.forEach(area => {
      const links = area.querySelectorAll('a[href^="http"]'); // केवल http/https लिंक चुनें
      links.forEach(link => {
        try {
          // सुनिश्चित करें कि यह इंटरनल स्मूथ स्क्रॉल लिंक नहीं है और target पहले से सेट नहीं है
          if (!link.getAttribute('href').startsWith('#') && !link.target) {
            const linkUrl = new URL(link.href); // href का उपयोग करें ताकि रिलेटिव URL भी ठीक से काम करें
            if (linkUrl.hostname !== currentHostname) {
              link.setAttribute('target', '_blank');
              link.setAttribute('rel', 'noopener noreferrer');
            }
          }
        } catch (e) { /* अमान्य URL अनदेखा करें */ }
      });
    });
    console.log('[OK] बाहरी लिंक हैंडलिंग तैयार है।');
  } catch (error) { console.error('[त्रुटि] बाहरी लिंक सेटअप:', error); }

  // --- 4. कोड ब्लॉक कॉपी बटन ---
  try {
    const codeBlocks = document.querySelectorAll('pre.custom-pre');
    if (navigator.clipboard) { // जांचें कि क्लिपबोर्ड API समर्थित है या नहीं
      codeBlocks.forEach(block => {
        const codeElement = block.querySelector('code');
        if (!codeElement) return; // यदि अंदर code टैग नहीं है तो छोड़ दें

        const copyButton = document.createElement('button');
        copyButton.className = 'custom-copy-btn';
        copyButton.textContent = 'कॉपी';
        copyButton.setAttribute('aria-label', 'कोड कॉपी करें');
        block.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
          const codeToCopy = codeElement.innerText || codeElement.textContent;
          navigator.clipboard.writeText(codeToCopy).then(() => {
            copyButton.textContent = 'कॉपी हुआ!';
            copyButton.classList.add('copied');
            setTimeout(() => {
              copyButton.textContent = 'कॉपी';
              copyButton.classList.remove('copied');
            }, 2000); // 2 सेकंड बाद वापस बदलें
          }).catch(err => {
            console.error('कोड कॉपी करने में विफल:', err);
            copyButton.textContent = 'त्रुटि';
            setTimeout(() => { copyButton.textContent = 'कॉपी'; }, 2000);
          });
        });
      });
      if (codeBlocks.length > 0) console.log('[OK] कोड कॉपी बटन तैयार हैं।');
    } else {
      console.warn('[सूचना] क्लिपबोर्ड API समर्थित नहीं है, कोड कॉपी बटन अक्षम हैं।');
    }
  } catch (error) { console.error('[त्रुटि] कोड कॉपी बटन सेटअप:', error); }

  // --- 5. अलर्ट/नोट डिस्मिस फंक्शनलिटी ---
  try {
    const dismissContainers = document.querySelectorAll('.custom-alert, .custom-note');
    let dismissibleCount = 0;
    dismissContainers.forEach(container => {
      // डिस्मिस बटन जोड़ें (यदि पहले से नहीं है)
      if (!container.querySelector('.custom-dismiss-btn')) {
        const dismissButton = document.createElement('button');
        dismissButton.className = 'custom-dismiss-btn';
        dismissButton.innerHTML = '×'; // 'x' चिह्न
        dismissButton.setAttribute('aria-label', 'बंद करें');
        container.appendChild(dismissButton);
        dismissibleCount++;

        dismissButton.addEventListener('click', (event) => {
          event.preventDefault();
          // फेड-आउट और फिर हटाएं
          container.classList.add('dismissed');
          // CSS ट्रांजीशन खत्म होने के बाद एलिमेंट को DOM से हटा दें (वैकल्पिक)
          // setTimeout(() => {
          //   container.remove();
          // }, 400); // CSS ट्रांजीशन अवधि से मेल खाए
        });
      }
    });
    if (dismissibleCount > 0) console.log('[OK] अलर्ट/नोट डिस्मिस बटन तैयार हैं।');
  } catch (error) { console.error('[त्रुटि] अलर्ट/नोट डिस्मिस सेटअप:', error); }

  // --- 6. स्क्रॉल पर प्रकट एनिमेशन ---
  try {
    const revealTargets = document.querySelectorAll('.custom-div, .custom-figure, .custom-h1, .custom-h2:not(.custom-header-container .custom-h2), .custom-h3, .custom-h4, .custom-h5, .custom-h6, .custom-quote, .custom-table-container, .custom-pre, .custom-alert, .custom-note, .custom-ad-placeholder, .custom-version-links, .custom-pagination, .custom-header-description');

    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null, // व्यूपोर्ट के सापेक्ष
        rootMargin: '0px',
        threshold: 0.1 // 10% दिखने पर ट्रिगर
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // एक बार प्रकट होने के बाद निरीक्षण बंद करें
          }
        });
      }, observerOptions);

      revealTargets.forEach(target => {
        target.classList.add('reveal-on-scroll'); // CSS क्लास लगाएं
        revealObserver.observe(target);
      });
      console.log('[OK] स्क्रॉल पर प्रकट एनिमेशन तैयार है।');
    } else {
      // यदि IntersectionObserver समर्थित नहीं है, तो सभी को तुरंत दिखा दें
      console.warn('[सूचना] IntersectionObserver समर्थित नहीं है, स्क्रॉल एनिमेशन अक्षम है।');
      revealTargets.forEach(target => target.classList.add('is-visible'));
    }
  } catch (error) { console.error('[त्रुटि] स्क्रॉल एनिमेशन सेटअप:', error); }


  console.log('बुझते पल कस्टम स्क्रिप्ट्स v3.2 सफलतापूर्वक लोड और कॉन्फ़िगर हो गईं।');

}); // --- DOMContentLoaded का अंत ---
