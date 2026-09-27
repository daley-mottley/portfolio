// custom.js

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('#project-list .card-project-container');
    const loadMoreButton = document.getElementById('load-more');
    const spinner = document.getElementById('spinner');

    let itemsPerLoad = 3; // Number of items to load per click
    let visibleItemsCount = itemsPerLoad; // Initial number of visible items

    // Show the initial set of items
    function showInitialItems() {
        let visibleCount = 0;
        projectItems.forEach((item, index) => {
            if (index < itemsPerLoad) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        updateLoadMoreButton(visibleCount);
    }

    // Update the visibility of the Load More button
    function updateLoadMoreButton(visibleCount) {
        const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const filteredItems = Array.from(projectItems).filter(item => filter === 'all' || item.getAttribute('data-category') === filter);
        if (visibleCount < filteredItems.length) {
            loadMoreButton.style.display = 'inline-block';
        } else {
            loadMoreButton.style.display = 'none';
        }
    }

    // Handle the filter button click event
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Remove 'active' class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Filter and reset items
            let visibleCount = 0;
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filter === 'all' || itemCategory === filter) {
                    if (visibleCount < itemsPerLoad) {
                        item.style.display = 'block';
                        item.classList.add('fadeIn');
                        item.classList.remove('fadeOut');
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                } else {
                    item.style.display = 'none';
                }
            });

            // Reset visibleItemsCount and update Load More button
            visibleItemsCount = itemsPerLoad;
            updateLoadMoreButton(visibleCount);
        });
    });

    // Handle the Load More button click event
    loadMoreButton.addEventListener('click', () => {
        const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const filteredItems = Array.from(projectItems).filter(item => filter === 'all' || item.getAttribute('data-category') === filter);

        // Check if there are more items to load
        if (visibleItemsCount >= filteredItems.length) {
            loadMoreButton.style.display = 'none'; // No more items to load
            return;
        }

        loadMoreButton.style.display = 'none'; // Hide Load More button
        let visibleCount = 0;

        filteredItems.forEach((item, index) => {
            if (index < visibleItemsCount + itemsPerLoad && index >= visibleItemsCount) {
                item.style.display = 'block';
                item.classList.add('fadeIn');
                visibleCount++;
            }
        });

        visibleItemsCount += itemsPerLoad;
        updateLoadMoreButton(visibleCount);
    });

    // Initialize the view with the initial set of items
    showInitialItems();
});

// Contact Form

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Show loading spinner and disable the button
    document.getElementById('buttonSpinner').classList.remove('hidden');
    document.getElementById('buttonText').classList.add('hidden');
    document.getElementById('submitButton').disabled = true;

    // Form data
    const formData = new FormData(this);

    // AJAX request
    fetch('https://formspree.io/f/mvgpooel', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        // Hide the loading spinner and enable the button
        document.getElementById('buttonSpinner').classList.add('hidden');
        document.getElementById('buttonText').classList.remove('hidden');
        document.getElementById('submitButton').disabled = false;

        // Handle the placeholder message display
        let messageTextarea = document.getElementById('message');
        if (response.ok) {
            messageTextarea.placeholder = 'Your message has been sent successfully!';
            document.getElementById('contactForm').reset();
        } else {
            response.json().then(data => {
                if (data.errors) {
                    messageTextarea.placeholder = data.errors.map(error => error.message).join('\n');
                } else {
                    messageTextarea.placeholder = 'Oops! Something went wrong. Please try again later.';
                }
            });
        }
    })
    .catch(error => {
        // Hide the loading spinner and enable the button
        document.getElementById('buttonSpinner').classList.add('hidden');
        document.getElementById('buttonText').classList.remove('hidden');
        document.getElementById('submitButton').disabled = false;

        // Display error message in the placeholder
        let messageTextarea = document.getElementById('message');
        messageTextarea.placeholder = 'Oops! There was a problem submitting your form. Please try again.';
    });
});
// Function to insert spaces to adjust line breaks
function adjustPlaceholderText(text, element) {
    // Convert literal \n strings to actual newline characters and non-breaking spaces to standard spaces
    text = text.replace(/\\n/g, '\n').replace(/\u00a0/g, ' ');

    // Preserve intentional line breaks. Only wrap lines that exceed the width.
    const textareaWidth = element ? element.clientWidth : 0;
    const fontSize = element ? parseFloat(window.getComputedStyle(element).fontSize) || 16 : 16;
    const charWidth = fontSize * 0.55;
    const charsPerLine = textareaWidth ? Math.floor(textareaWidth / charWidth) : 40;

    return text.split('\n').map(line => {
        if (!line.trim()) return '';
        if (charsPerLine > 0 && line.length <= charsPerLine) return line.trim();

        let result = '';
        let lineLength = 0;
        line.split(' ').forEach(word => {
            if (lineLength > 0 && charsPerLine > 0 && lineLength + word.length >= charsPerLine) {
                result += '\n';
                lineLength = 0;
            } else if (lineLength > 0) {
                result += ' ';
            }
            result += word;
            lineLength += word.length + 1;
        });
        return result.trim();
    }).join('\n');
}

let typewriterTimeout; // Variable to hold the timeout

// Typewriter effect for placeholder text
function typeWriter(text, element) {
    clearTimeout(typewriterTimeout); // Clear any existing animation
    let index = 0;
    element.placeholder = ''; // Reset placeholder

    function type() {
        if (index < text.length) {
            element.placeholder += text.charAt(index);
            index++;
            typewriterTimeout = setTimeout(type, 50);
        }
    }
    typewriterTimeout = setTimeout(type, 1000); // 1-second delay before starting
}

// Get the stored language from URL parameters or local storage
const getStoredLanguage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    return langFromUrl || localStorage.getItem('language') || 'en';
};

// Fetch translations for the given language
const fetchTranslations = async (lang) => {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return {}; // Return empty object on error
    }
};

// Function to initialize and start the typewriter animation
const startTypewriterAnimation = async () => {
    const textarea = document.getElementById('message');
    if (!textarea) return;

    const lang = getStoredLanguage();
    const translations = await fetchTranslations(lang);
    const originalText = translations['contact.placeholder'] || "Need help overcoming a challenge or bringing your idea to life?\n\nLet’s schedule a call.\n\nMessage me today, and together we’ll find the perfect solution 🤝";

    const adjustedText = adjustPlaceholderText(originalText, textarea);
    typeWriter(adjustedText, textarea); // Start typing animation
};

// Intersection Observer to trigger typewriter effect when textarea is visible
const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            startTypewriterAnimation();
            observer.unobserve(entry.target); // Stop observing once triggered
        }
    }
}, { threshold: 0.5 }); // Trigger when at least 50% is visible

// Listen for the custom event to re-trigger the animation on language change
document.addEventListener('languageChanged', () => {
    startTypewriterAnimation();
});

// Start observing the textarea
const textarea = document.getElementById('message');
if (textarea) {
    observer.observe(textarea);
}
