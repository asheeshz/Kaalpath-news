/* ==========================================================================
   Tutorial Page JavaScript (v1.1) - For Copy Buttons & Animations
   Uses tut- prefixed classes.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- कॉपी बटन कार्यक्षमता ---
    // वैश्विक फ़ंक्शन बना रहे हैं ताकि HTML onclick इसे कॉल कर सके
    window.copyCode = function(buttonElement, codeElementId) {
        const codeBlock = document.getElementById(codeElementId);
        if (!codeBlock) {
            console.error("कॉपी करने के लिए कोड ब्लॉक नहीं मिला:", codeElementId);
            return;
        }
        // डमी टेक्स्ट के बजाय वास्तविक कोड प्राप्त करने के लिए आपको यहाँ लॉजिक जोड़ना होगा
        // फिलहाल, हम मान लेते हैं कि कोड ब्लॉक में सही कोड है (या डमी टेक्स्ट है)
        const codeToCopy = codeBlock.textContent || codeBlock.innerText;
        const tooltip = buttonElement.closest('.tut-tooltip'); // Use prefixed class for tooltip container
        const tooltipText = tooltip ? tooltip.querySelector('.tut-tooltiptext') : null; // Use prefixed class for tooltip text

        if (!tooltipText) {
            console.error("टूलटिप टेक्स्ट एलिमेंट नहीं मिला।");
             // Fallback: बिना टूलटिप के कॉपी करें
             navigator.clipboard.writeText(codeToCopy).then(() => {
                // Use tut- prefixed class if button has it, otherwise default
                const buttonClass = buttonElement.classList.contains('tut-copy-button') ? 'tut-copy-button' : 'copy-button';
                buttonElement.innerHTML = '<i class="fas fa-check"></i> कॉपीड!';
                setTimeout(() => {
                    buttonElement.innerHTML = '<i class="fas fa-copy"></i> कॉपी';
                }, 2000);
            }).catch(err => {
                console.error('कोड कॉपी करने में विफल:', err);
                alert('कॉपी करने में विफल!'); // सरल फ़ॉलबैक अलर्ट
            });
            return; // टूलटिप के बिना बाहर निकलें
        }


        navigator.clipboard.writeText(codeToCopy).then(() => {
            // Success! Provide feedback using tooltip.
            tooltipText.innerHTML = "कॉपीड!";
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';

            // Change button text too
            buttonElement.innerHTML = '<i class="fas fa-check"></i> कॉपीड!';

            // Reset after a delay
            setTimeout(() => {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
                tooltipText.innerHTML = "कॉपी करें"; // Reset tooltip text
                buttonElement.innerHTML = '<i class="fas fa-copy"></i> कॉपी'; // Reset button text
            }, 2000); // Reset after 2 seconds

        }).catch(err => {
            // Error handling using tooltip
            console.error('कोड कॉपी करने में विफल:', err);
            tooltipText.innerHTML = "कॉपी विफल!";
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';

             setTimeout(() => {
                 tooltipText.style.visibility = 'hidden';
                 tooltipText.style.opacity = '0';
                 tooltipText.innerHTML = "कॉपी करें"; // Reset tooltip text
             }, 2000);
        });
    }

    // --- फेड-इन एनिमेशन ---
    // Ensure we only target elements within the tutorial container using the class
    document.querySelectorAll('.tut-container .tut-fade-in').forEach((el, index) => { // Use .tut-container and .tut-fade-in
        el.style.animationDelay = `${index * 0.1}s`;
    });

}); // End of DOMContentLoaded
