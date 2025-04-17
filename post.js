/* ==========================================================================
   Tutorial Page JavaScript (v1.2) - For Copy Buttons & Animations
   Uses tut- prefixed classes. Corrected tooltip selectors.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- कॉपी बटन कार्यक्षमता ---
    // वैश्विक फ़ंक्शन बना रहे हैं ताकि HTML onclick इसे कॉल कर सके
    window.copyCode = function(buttonElement, codeElementId) {
        const codeBlock = document.getElementById(codeElementId);
        if (!codeBlock) {
            console.error("कॉपी करने के लिए कोड ब्लॉक नहीं मिला:", codeElementId);
            // उपयोगकर्ता को प्रतिक्रिया दें (वैकल्पिक)
            alert("त्रुटि: कोड ब्लॉक नहीं मिला!");
            return;
        }

        // वास्तविक कोड प्राप्त करें (डमी टेक्स्ट के बजाय)
        // आदर्श रूप से, कोड <pre><code> के अंदर होना चाहिए
        let codeToCopy = '';
        // यदि आईडी सीधे कोड टैग पर है
         if (codeBlock.tagName === 'CODE') {
             codeToCopy = codeBlock.textContent || codeBlock.innerText;
         }
         // यदि आईडी <pre> टैग पर है और अंदर <code> है
         else if (codeBlock.tagName === 'PRE' && codeBlock.querySelector('code')) {
              codeToCopy = codeBlock.querySelector('code').textContent || codeBlock.querySelector('code').innerText;
         }
          // यदि आईडी किसी अन्य कंटेनर पर है और अंदर pre > code है
         else {
             const nestedCode = codeBlock.querySelector('pre code');
             if (nestedCode) {
                codeToCopy = nestedCode.textContent || nestedCode.innerText;
             } else {
                 // Fallback to the direct text content of the element with the ID
                 codeToCopy = codeBlock.textContent || codeBlock.innerText;
                 // यदि "राम राम सीता राम" ही कॉपी हो रहा है, तो सुनिश्चित करें कि वास्तविक कोड
                 // <pre><code> टैग्स के अंदर है और आईडी सही तत्व पर है।
                 if (codeToCopy.trim() === "राम राम सीता राम") {
                     console.warn("चेतावनी: डमी टेक्स्ट कॉपी किया जा रहा है। सुनिश्चित करें कि वास्तविक कोड कोड ब्लॉक में मौजूद है। ID:", codeElementId);
                 }
             }
         }


        // --- टूलटिप सेलेक्टर को सही करें ---
        const tooltipContainer = buttonElement.closest('.tut-tooltip'); // Find parent tooltip container with the correct class
        const tooltipTextElement = tooltipContainer ? tooltipContainer.querySelector('.tut-tooltiptext') : null; // Find tooltip text inside using the correct class

        // क्लिपबोर्ड API का उपयोग करें
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codeToCopy).then(() => {
                // सफलता!
                if (tooltipTextElement) {
                    tooltipTextElement.innerHTML = "कॉपीड!";
                    tooltipTextElement.style.visibility = 'visible';
                    tooltipTextElement.style.opacity = '1';
                }
                buttonElement.innerHTML = '<i class="fas fa-check"></i> कॉपीड!';

                // 2 सेकंड बाद रीसेट करें
                setTimeout(() => {
                    if (tooltipTextElement) {
                        tooltipTextElement.style.visibility = 'hidden';
                        tooltipTextElement.style.opacity = '0';
                        // थोड़ी देर बाद टेक्स्ट रीसेट करें ताकि फेड आउट हो सके
                        setTimeout(() => {
                             tooltipTextElement.innerHTML = "कॉपी करें";
                        }, 300); // transition समय से मेल खाना चाहिए
                    }
                    buttonElement.innerHTML = '<i class="fas fa-copy"></i> कॉपी';
                }, 2000);

            }).catch(err => {
                // त्रुटि!
                console.error('कोड कॉपी करने में विफल:', err);
                if (tooltipTextElement) {
                    tooltipTextElement.innerHTML = "त्रुटि!";
                    tooltipTextElement.style.visibility = 'visible';
                    tooltipTextElement.style.opacity = '1';
                    setTimeout(() => {
                        tooltipTextElement.style.visibility = 'hidden';
                        tooltipTextElement.style.opacity = '0';
                         setTimeout(() => {
                             tooltipTextElement.innerHTML = "कॉपी करें";
                        }, 300);
                    }, 2000);
                } else {
                    alert('कॉपी करने में विफल!'); // Fallback alert
                }
            });
        } else {
            // पुराना तरीका (यदि क्लिपबोर्ड API समर्थित नहीं है) - कम विश्वसनीय
            console.warn("Clipboard API समर्थित नहीं है। पुराने तरीके का उपयोग किया जा रहा है।");
            const textArea = document.createElement("textarea");
            textArea.value = codeToCopy;
            textArea.style.position = "fixed"; // अदृश्य बनाएं
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                // सफलता! (पुराने तरीके से)
                 if (tooltipTextElement) {
                    tooltipTextElement.innerHTML = "कॉपीड!";
                    tooltipTextElement.style.visibility = 'visible';
                    tooltipTextElement.style.opacity = '1';
                }
                buttonElement.innerHTML = '<i class="fas fa-check"></i> कॉपीड!';
                 setTimeout(() => {
                    if (tooltipTextElement) {
                        tooltipTextElement.style.visibility = 'hidden';
                        tooltipTextElement.style.opacity = '0';
                         setTimeout(() => {
                             tooltipTextElement.innerHTML = "कॉपी करें";
                        }, 300);
                    }
                    buttonElement.innerHTML = '<i class="fas fa-copy"></i> कॉपी';
                }, 2000);
            } catch (err) {
                // त्रुटि! (पुराने तरीके से)
                console.error('पुराने तरीके से कॉपी करने में विफल:', err);
                 if (tooltipTextElement) {
                    tooltipTextElement.innerHTML = "त्रुटि!";
                    tooltipTextElement.style.visibility = 'visible';
                    tooltipTextElement.style.opacity = '1';
                    setTimeout(() => {
                        tooltipTextElement.style.visibility = 'hidden';
                        tooltipTextElement.style.opacity = '0';
                         setTimeout(() => {
                             tooltipTextElement.innerHTML = "कॉपी करें";
                        }, 300);
                    }, 2000);
                } else {
                    alert('कॉपी करने में विफल!'); // Fallback alert
                }
            }
            document.body.removeChild(textArea);
        }
    }

    // --- फेड-इन एनिमेशन ---
    // सुनिश्चित करें कि सेलेक्टर सही प्रीफिक्स्ड क्लास का उपयोग कर रहे हैं
    document.querySelectorAll('.tut-container .tut-fade-in').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

}); // End of DOMContentLoaded
