/* ==========================================================================
   Tutorial Page JavaScript (v1.5) - Fetches code OR copies from element.
   Uses tut- prefixed classes. Includes both copy functions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * URL से कोड Fetch करके क्लिपबोर्ड पर कॉपी करता है।
     * @param {HTMLButtonElement} buttonElement - क्लिक किया गया बटन एलिमेंट।
     * @param {string} fileUrl - GitHub Raw या Gist Raw URL जहाँ कोड होस्टेड है।
     */
    window.copyCodeFromUrl = function(buttonElement, fileUrl) {
        const tooltipContainer = buttonElement.closest('.tut-tooltip');
        const tooltipTextElement = tooltipContainer ? tooltipContainer.querySelector('.tut-tooltiptext') : null;

        // लोडिंग फीडबैक दें
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कॉपी हो रहा है...';
        buttonElement.disabled = true; // प्रक्रिया के दौरान बटन अक्षम करें

        fetch(fileUrl)
            .then(response => {
                if (!response.ok) {
                    // नेटवर्क या फ़ाइल न मिलने की त्रुटि
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} (URL: ${fileUrl})`);
                }
                return response.text(); // प्रतिक्रिया को टेक्स्ट के रूप में पढ़ें
            })
            .then(codeToCopy => {
                // सफलतापूर्वक कोड प्राप्त हुआ, क्लिपबोर्ड पर लिखें
                if (!navigator.clipboard || !navigator.clipboard.writeText) {
                    throw new Error('Clipboard API not supported.'); // यदि क्लिपबोर्ड API उपलब्ध नहीं है
                }
                return navigator.clipboard.writeText(codeToCopy);
            })
            .then(() => {
                // क्लिपबोर्ड पर सफलतापूर्वक कॉपी हो गया
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
                        // फेड आउट होने के बाद टेक्स्ट रीसेट करें
                        setTimeout(() => { tooltipTextElement.innerHTML = "कॉपी करें"; }, 300);
                    }
                    buttonElement.innerHTML = '<i class="fas fa-copy"></i> कॉपी';
                    buttonElement.disabled = false; // बटन पुनः सक्षम करें
                }, 2000);
            })
            .catch(error => {
                // Fetch करने या कॉपी करने में त्रुटि हुई
                console.error('URL से कोड लाने या कॉपी करने में विफल:', fileUrl, error);
                let errorMsg = "कॉपी विफल!"; // डिफ़ॉल्ट त्रुटि

                // अधिक विशिष्ट त्रुटि संदेश देने का प्रयास करें
                if (error.message && error.message.toLowerCase().includes("failed to fetch")) {
                    errorMsg = "लिंक विफल!";
                } else if (error.message && (error.message.includes("404") || error.message.includes("Not Found"))) {
                   errorMsg = "फ़ाइल नहीं मिली!";
               } else if (error.message && error.message.includes("Clipboard API not supported")) {
                   errorMsg = "ब्राउज़र असमर्थित!";
               } else if (error.message && error.message.toLowerCase().includes("write permission denied")) {
                    errorMsg = "अनुमति आवश्यक!"; // क्लिपबोर्ड अनुमति समस्या
               }

                // उपयोगकर्ता को प्रतिक्रिया दें
                if (tooltipTextElement) {
                    tooltipTextElement.innerHTML = `${errorMsg} लिंक से प्रयास करें।`;
                    tooltipTextElement.style.width = '150px'; // संदेश के लिए अधिक जगह
                    tooltipTextElement.style.marginLeft = '-75px'; // सेंटर करें
                    tooltipTextElement.style.visibility = 'visible';
                    tooltipTextElement.style.opacity = '1';

                    // थोड़ी देर बाद टूलटिप रीसेट करें
                    setTimeout(() => {
                        tooltipTextElement.style.visibility = 'hidden';
                        tooltipTextElement.style.opacity = '0';
                        setTimeout(() => {
                            tooltipTextElement.innerHTML = "कॉपी करें"; // मूल टेक्स्ट
                            tooltipTextElement.style.width = '80px'; // मूल चौड़ाई
                             tooltipTextElement.style.marginLeft = '-40px'; // मूल मार्जिन
                        }, 300);
                    }, 3500); // त्रुटि संदेश थोड़ा अधिक समय तक दिखाएं
                } else {
                     // फॉलबैक अलर्ट यदि टूलटिप नहीं मिलता है
                     alert(`त्रुटि: ${errorMsg} कृपया 'देखें' बटन का उपयोग करके मैन्युअल रूप से कॉपी करें।`);
                }

                // बटन को विफलता स्थिति में रीसेट करें
                buttonElement.innerHTML = '<i class="fas fa-times"></i> विफल';
                buttonElement.disabled = false; // बटन पुनः सक्षम करें
                 // थोड़ी देर बाद मूल टेक्स्ट पर वापस जाएँ
                 setTimeout(() => {
                      buttonElement.innerHTML = '<i class="fas fa-copy"></i> कॉपी';
                 }, 2500);
            });
    }

    /**
     * किसी HTML एलिमेंट (आमतौर पर <pre><code>) के टेक्स्ट कंटेंट को क्लिपबोर्ड पर कॉपी करता है।
     * @param {HTMLButtonElement} buttonElement - क्लिक किया गया बटन एलिमेंट।
     * @param {string} elementId - उस एलिमेंट का ID जिससे टेक्स्ट कॉपी करना है।
     */
    window.copyCodeFromElement = function(buttonElement, elementId) {
       const codeElement = document.getElementById(elementId);
       if (!codeElement) {
            console.error("कॉपी करने के लिए तत्व नहीं मिला:", elementId);
            alert("त्रुटि: कोड तत्व नहीं मिला!");
            return;
       }

       // सुनिश्चित करें कि हम कोड टैग से टेक्स्ट ले रहे हैं यदि यह pre के अंदर है
       let codeToCopy = '';
       if (codeElement.tagName === 'CODE') {
           codeToCopy = codeElement.textContent || codeElement.innerText;
       } else if (codeElement.tagName === 'PRE' && codeElement.querySelector('code')) {
            codeToCopy = codeElement.querySelector('code').textContent || codeElement.querySelector('code').innerText;
       } else {
           // फॉलबैक: सीधे तत्व का टेक्स्ट कंटेंट लें
           codeToCopy = codeElement.textContent || codeElement.innerText;
       }


       const tooltipContainer = buttonElement.closest('.tut-tooltip');
       const tooltipTextElement = tooltipContainer ? tooltipContainer.querySelector('.tut-tooltiptext') : null;

        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            console.warn('Clipboard API समर्थित नहीं है।');
            if (tooltipTextElement){
                 tooltipTextElement.innerHTML = "ब्राउज़र असमर्थित!";
                 tooltipTextElement.style.visibility = 'visible';
                 tooltipTextElement.style.opacity = '1';
                 setTimeout(() => {
                    tooltipTextElement.style.visibility = 'hidden';
                    tooltipTextElement.style.opacity = '0';
                     setTimeout(() => { tooltipTextElement.innerHTML = "कोड कॉपी करें"; }, 300);
                 }, 2500);
            } else {
                alert('आपका ब्राउज़र सीधे कॉपी करने का समर्थन नहीं करता है। कृपया मैन्युअल रूप से कॉपी करें।');
            }
            return;
        }

       navigator.clipboard.writeText(codeToCopy).then(() => {
            // सफलता
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
                    setTimeout(() => { tooltipTextElement.innerHTML = "कोड कॉपी करें"; }, 300);
                }
                // बटन का टेक्स्ट उसके मूल मान पर रीसेट करें (जैसे "कॉपी कोड" या "कॉपी लिंक")
                const originalText = buttonElement.dataset.originalText || '<i class="fas fa-copy"></i> कॉपी'; // Fallback
                buttonElement.innerHTML = originalText;
            }, 2000);
       }).catch(err => {
           // त्रुटि
            console.error('तत्व से कोड कॉपी करने में विफल:', err);
            if (tooltipTextElement) {
                tooltipTextElement.innerHTML = "कॉपी विफल!";
                tooltipTextElement.style.visibility = 'visible';
                tooltipTextElement.style.opacity = '1';
                setTimeout(() => {
                    tooltipTextElement.style.visibility = 'hidden';
                    tooltipTextElement.style.opacity = '0';
                    setTimeout(() => { tooltipTextElement.innerHTML = "कोड कॉपी करें"; }, 300);
                }, 2000);
            } else {
                alert('कॉपी करने में विफल!');
            }
             // बटन को विफलता स्थिति में रीसेट करें (वैकल्पिक)
             const originalText = buttonElement.dataset.originalText || '<i class="fas fa-copy"></i> कॉपी';
             buttonElement.innerHTML = '<i class="fas fa-times"></i> विफल';
             setTimeout(() => {
                  buttonElement.innerHTML = originalText;
             }, 2500);
       });
   }

    // --- फेड-इन एनिमेशन ---
    // DOM तैयार होने पर तत्वों को ढूंढें और एनीमेशन लागू करें
    document.querySelectorAll('.tut-container .tut-fade-in').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // --- कॉपी बटनों के लिए मूल टेक्स्ट स्टोर करें (वैकल्पिक, बेहतर रीसेट के लिए) ---
    document.querySelectorAll('.tut-copy-button').forEach(button => {
        button.dataset.originalText = button.innerHTML; // बटन के मूल HTML को स्टोर करें
    });


}); // End of DOMContentLoaded
