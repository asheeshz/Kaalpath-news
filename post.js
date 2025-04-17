/* ==========================================================================
   Tutorial Page JavaScript (v1.4) - Fetch code from URL for Copy Button
   Uses tut- prefixed classes. Provides link fallback on error.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- कोड कॉपी फंक्शन (URL से Fetch करके) ---
    window.copyCodeFromUrl = function(buttonElement, fileUrl) {
        const tooltipContainer = buttonElement.closest('.tut-tooltip');
        const tooltipTextElement = tooltipContainer ? tooltipContainer.querySelector('.tut-tooltiptext') : null;

        // लोडिंग फीडबैक दें
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कॉपी हो रहा है...';
        buttonElement.disabled = true; // बटन को अक्षम करें जब तक प्रक्रिया पूरी न हो

        // GitHub Raw URL से कोड Fetch करें
        fetch(fileUrl)
            .then(response => {
                if (!response.ok) {
                    // यदि नेटवर्क एरर है (जैसे 404 Not Found)
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text(); // प्रतिक्रिया को टेक्स्ट के रूप में पढ़ें
            })
            .then(codeToCopy => {
                // सफलतापूर्वक कोड प्राप्त हुआ, अब क्लिपबोर्ड पर कॉपी करें
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
                        setTimeout(() => { tooltipTextElement.innerHTML = "कॉपी करें"; }, 300);
                    }
                    buttonElement.innerHTML = '<i class="fas fa-copy"></i> कॉपी';
                    buttonElement.disabled = false; // बटन पुनः सक्षम करें
                }, 2000);
            })
            .catch(error => {
                // Fetch करने या कॉपी करने में त्रुटि हुई
                console.error('URL से कोड लाने या कॉपी करने में विफल:', fileUrl, error);
                let errorMsg = "कॉपी विफल!";
                if (error.message.includes("404")) {
                    errorMsg = "फ़ाइल नहीं मिली!";
                } else if (!navigator.clipboard) {
                     errorMsg = "असुरक्षित स्रोत?"; // या अन्य क्लिपबोर्ड एरर
                }

                if (tooltipTextElement) {
                    tooltipTextElement.innerHTML = errorMsg + " लिंक से प्रयास करें।";
                    tooltipTextElement.style.width = '150px'; // संदेश के लिए अधिक जगह
                    tooltipTextElement.style.marginLeft = '-75px';
                    tooltipTextElement.style.visibility = 'visible';
                    tooltipTextElement.style.opacity = '1';

                    // थोड़ी देर बाद टूलटिप रीसेट करें
                    setTimeout(() => {
                        tooltipTextElement.style.visibility = 'hidden';
                        tooltipTextElement.style.opacity = '0';
                        setTimeout(() => {
                            tooltipTextElement.innerHTML = "कॉपी करें";
                            tooltipTextElement.style.width = '80px'; // मूल चौड़ाई
                             tooltipTextElement.style.marginLeft = '-40px'; // मूल मार्जिन
                        }, 300);
                    }, 3500); // त्रुटि संदेश थोड़ा अधिक समय तक दिखाएं
                } else {
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

    // --- फेड-इन एनिमेशन ---
    document.querySelectorAll('.tut-container .tut-fade-in').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

}); // End of DOMContentLoaded
