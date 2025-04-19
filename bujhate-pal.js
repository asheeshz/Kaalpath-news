// Wait for the DOM content to load before executing the code
document.addEventListener("DOMContentLoaded", function() {

    // Handle the "Next Part" button animation (scale effect)
    const nextPartButtons = document.querySelectorAll(".custom-a");
    nextPartButtons.forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.1)";
            button.style.transition = "all 0.3s ease";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
        });
    });

    // Shimmer Effect for Header
    const shimmerEffect = () => {
        const shimmerElements = document.querySelectorAll(".custom-h2");
        shimmerElements.forEach(element => {
            element.style.animation = "custom-shimmer 2s infinite";
        });
    }
    shimmerEffect();

    // Text Hover Effect for Paragraph
    const paragraphElements = document.querySelectorAll(".custom-p");
    paragraphElements.forEach(paragraph => {
        paragraph.addEventListener("mouseover", () => {
            paragraph.style.color = "#7b3f00";
            paragraph.style.textShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
        });

        paragraph.addEventListener("mouseout", () => {
            paragraph.style.color = "#5a3c20";
            paragraph.style.textShadow = "none";
        });
    });

    // SlideUp Animation for Post Containers
    const postContainers = document.querySelectorAll(".custom-div");
    postContainers.forEach(container => {
        container.style.animation = "custom-slideUp 1.5s ease-in-out";
    });

    // Hover Effects for Images
    const images = document.querySelectorAll(".custom-image");
    images.forEach(image => {
        image.addEventListener("mouseenter", () => {
            image.style.transform = "scale(1.05)";
            image.style.transition = "all 0.3s ease";
        });

        image.addEventListener("mouseleave", () => {
            image.style.transform = "scale(1)";
        });
    });

    // Smooth Scroll to Next Part
    const nextPartLink = document.querySelectorAll(".custom-a");
    nextPartLink.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const nextSection = document.querySelector(link.getAttribute("href"));
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop - 50, // Adjust the scroll position
                    behavior: 'smooth'
                });
            }
        });
    });

    // Automatic Scroll for Shlokas (If any)
    const shlokaSections = document.querySelectorAll(".custom-strong");
    shlokaSections.forEach(shloka => {
        shloka.addEventListener("mouseover", () => {
            window.scrollBy(0, 50); // Scroll a little on hover
        });
    });

    // TTS (Text-to-Speech) Functionality for Shlokas
    const ttsButtons = document.querySelectorAll(".custom-strong");
    ttsButtons.forEach(button => {
        button.addEventListener("click", () => {
            const speech = new SpeechSynthesisUtterance(button.textContent);
            speech.lang = "hi-IN"; // Set the language to Hindi
            window.speechSynthesis.speak(speech);
        });
    });

    // Mobile View Adjustments
    if (window.innerWidth <= 768) {
        const mobileButtons = document.querySelectorAll(".custom-a");
        mobileButtons.forEach(button => {
            button.style.fontSize = "16px";
        });
    }

});
