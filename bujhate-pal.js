/* =====================================
   बुझते पल - कस्टम स्क्रिप्ट्स v2.2 (एकीकृत)
   लेखक: आशेष (AI द्वारा सहायता प्राप्त)
   विशेषताएं: स्मूथ स्क्रॉलिंग, स्क्रॉल-टू-टॉप बटन, बाहरी लिंक हैंडलिंग
   ===================================== */

document.addEventListener('DOMContentLoaded', function() {

  console.log('बुझते पल कस्टम स्क्रिप्ट्स v2.2 लोड हो रही हैं...');

  // --- 1. स्मूथ स्क्रॉल फंक्शनलिटी ---
  try {
    const scrollLinks = document.querySelectorAll('.custom-a[href^="#"]');

    scrollLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        const targetId = this.getAttribute('href');

        // सुनिश्चित करें कि यह केवल # वाले लिंक हैं, न कि सिर्फ #
        if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
          event.preventDefault(); // डिफ़ॉल्ट जंप रोकें

          try {
            const targetElement = document.querySelector(targetId); // ID द्वारा तत्व ढूंढें

            if (targetElement) {
              // हेडर की ऊंचाई का ध्यान रखें (यदि आवश्यक हो - मान बदलें)
              // const headerOffset = 0; // अपने फिक्स्ड हेडर की ऊंचाई डालें
              // const elementPosition = targetElement.getBoundingClientRect().top;
              // const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              // window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

              // सरल संस्करण: सीधे तत्व तक स्क्रॉल करें
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // या 'center'
              });
            } else {
              console.warn('Smooth scroll target तत्व नहीं मिला:', targetId);
            }
          } catch (e) {
             // यदि targetId एक मान्य CSS सेलेक्टर नहीं है तो त्रुटि को संभालें
             console.error('Smooth scroll के लिए अमान्य सेलेक्टर:', targetId, e);
          }
        } else if (targetId === '#') {
            // # वाले लिंक को डिफ़ॉल्ट व्यवहार करने दें (पेज टॉप पर जाएं)
            // या उसे भी रोकें यदि आवश्यक हो: event.preventDefault();
        }
      });
    });
    console.log('Smooth scroll तैयार है।');
  } catch (error) {
    console.error('Smooth scroll सेटअप में त्रुटि:', error);
  }


  // --- 2. स्क्रॉल-टू-टॉप बटन फंक्शनलिटी ---
  try {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const scrollThreshold = 300; // पिक्सेल में स्क्रॉल दूरी जब बटन दिखेगा

    // सुनिश्चित करें कि बटन HTML में मौजूद है
    if (scrollToTopBtn) {
        // स्क्रॉल इवेंट सुनें
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > scrollThreshold) {
                // अगर पर्याप्त स्क्रॉल किया गया है, तो बटन दिखाएं (CSS क्लास जोड़कर)
                if (!scrollToTopBtn.classList.contains('show')) {
                   scrollToTopBtn.classList.add('show');
                }
            } else {
                // अन्यथा बटन छिपाएं (CSS क्लास हटाकर)
                 if (scrollToTopBtn.classList.contains('show')) {
                   scrollToTopBtn.classList.remove('show');
                 }
            }
        }, { passive: true }); // परफॉरमेंस के लिए पैसिव लिस्नर

        // बटन क्लिक इवेंट सुनें
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0, // बिल्कुल ऊपर
                behavior: 'smooth' // स्मूथ एनिमेशन के साथ
             });
        });
        console.log('Scroll-to-top बटन तैयार है।');
    } else {
      // console.log('Scroll-to-top बटन HTML में नहीं मिला (ID: scrollToTopBtn)');
    }
  } catch (error) {
    console.error('Scroll-to-top सेटअप में त्रुटि:', error);
  }


  // --- 3. बाहरी लिंक्स को नई टैब में खोलना ---
  try {
    const contentDivs = document.querySelectorAll('.custom-div'); // सभी पोस्ट कंटेंट एरिया चुनें
    const currentHostname = window.location.hostname; // आपकी साइट का होस्टनेम

    contentDivs.forEach(div => {
      const links = div.querySelectorAll('a'); // उस div के अंदर के सभी लिंक

      links.forEach(link => {
        const href = link.getAttribute('href');

        // जांचें कि href मौजूद है और http/https से शुरू होता है
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          try {
            const linkUrl = new URL(href); // URL को पार्स करें

            // जांचें कि क्या लिंक का होस्टनेम वर्तमान साइट के होस्टनेम से अलग है
            if (linkUrl.hostname !== currentHostname) {
              link.setAttribute('target', '_blank'); // नई टैब में खोलें
              link.setAttribute('rel', 'noopener noreferrer'); // सुरक्षा और SEO के लिए

              // वैकल्पिक: बाहरी लिंक को इंगित करने के लिए क्लास या आइकन जोड़ें
              // link.classList.add('external-link');
              // link.title = (link.title ? link.title + ' ' : '') + '(नई टैब में खुलेगा)';
            }
          } catch (e) {
            // अमान्य URL को अनदेखा करें या लॉग करें
            // console.warn('बाहरी लिंक जांच के लिए URL पार्स नहीं किया जा सका:', href, e);
          }
        }
      });
    });
    console.log('बाहरी लिंक हैंडलिंग तैयार है।');
  } catch (error) {
    console.error('बाहरी लिंक सेटअप में त्रुटि:', error);
  }

  console.log('बुझते पल कस्टम स्क्रिप्ट्स v2.2 सफलतापूर्वक लोड हो गईं।');

}); // --- DOMContentLoaded का अंत ---
