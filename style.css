document.addEventListener('DOMContentLoaded', () => {
    // Ensures the DOM is fully loaded before executing JavaScript.

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default jump behavior

            // Get the target section's ID from the href attribute (e.g., "#about" -> "about")
            const targetId = e.target.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Scroll smoothly to the target section, adjusting for the fixed navbar height (approx. 64px)
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetSection.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Custom Message Box Functionality (Modern Alert Replacement) ---
    const messageBox = document.getElementById('custom-message-box');
    const messageText = document.getElementById('message-text');
    const messageIcon = document.getElementById('message-icon'); // Icon element
    const closeMessageBoxBtn = document.getElementById('close-message-box');

    /**
     * Displays a custom modal message with an optional icon.
     * @param {string} message - The text content to display.
     * @param {string} type - 'success', 'error', 'info'. Determines icon and color.
     */
    function showCustomMessage(message, type = 'info') {
        messageText.textContent = message; // Set the message text

        // Set icon and color based on message type
        messageIcon.className = ''; // Clear existing classes
        switch (type) {
            case 'success':
                messageIcon.classList.add('fas', 'fa-check-circle', 'text-emerald-500');
                break;
            case 'error':
                messageIcon.classList.add('fas', 'fa-times-circle', 'text-red-500');
                break;
            case 'info':
            default:
                messageIcon.classList.add('fas', 'fa-info-circle', 'text-blue-500');
                break;
        }

        // Show the message box with fade-in and scale-up animation
        messageBox.classList.remove('hidden', 'opacity-0');
        messageBox.classList.add('flex', 'opacity-100'); // Use flex to center content
        messageBox.querySelector('div').classList.remove('scale-95');
        messageBox.querySelector('div').classList.add('scale-100');
    }

    // Event listener to close the message box
    closeMessageBoxBtn.addEventListener('click', () => {
        messageBox.classList.remove('flex', 'opacity-100');
        messageBox.classList.add('hidden', 'opacity-0'); // Hide it with fade-out
        messageBox.querySelector('div').classList.remove('scale-100');
        messageBox.querySelector('div').classList.add('scale-95');
    });

    // --- Handle "Start Quiz" Button Clicks ---
    const startQuizButtons = document.querySelectorAll('.start-quiz-btn');
    startQuizButtons.forEach(button => {
        button.addEventListener('click', () => {
            const topic = button.getAttribute('data-topic');
            // Display a success message using the custom modal
            showCustomMessage(`Great choice! Starting the ${topic.charAt(0).toUpperCase() + topic.slice(1)} quiz now. (This is a demo, actual quiz loading here!)`, 'success');

            // In a real application, you would dynamically load quiz content here or redirect:
            // window.location.href = `/quiz-page.html?topic=${topic}`;
            // loadQuizQuestions(topic);
        });
    });

    // --- Handle Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission (page reload)

        // Simulate form submission (e.g., to an API endpoint)
        // In a real scenario, you'd use fetch() to send data to your backend.
        // For this demo, we'll just show a success message after a small delay.

        showCustomMessage('Sending your message...', 'info'); // Show "sending" message

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Here you would typically send your form data:
            /*
            const formData = new FormData(contactForm);
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            console.log('Form submission successful:', result);
            */

            showCustomMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset(); // Clear the form after successful submission

        } catch (error) {
            console.error('Form submission error:', error);
            showCustomMessage('Oops! Something went wrong. Please try again later.', 'error');
        }
    });
});
