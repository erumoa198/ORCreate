// Works Filter Functionality

// Get URL parameter for category
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');

// Filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
const genreSections = document.querySelectorAll('.genre-section');

// Function to filter works by genre section
function filterWorks(category) {
    genreSections.forEach(section => {
        const sectionCategory = section.getAttribute('data-category');

        if (category === 'all' || sectionCategory === category) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });

    // Scroll to first visible section if filtering
    if (category !== 'all') {
        setTimeout(() => {
            const firstVisible = document.querySelector(`.genre-section[data-category="${category}"]`);
            if (firstVisible) {
                firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

// Function to update active button
function updateActiveButton(category) {
    filterButtons.forEach(btn => {
        const btnCategory = btn.getAttribute('data-category');
        if (btnCategory === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Add click event listeners to filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        filterWorks(category);
        updateActiveButton(category);

        // Update URL without reload
        const newUrl = category === 'all'
            ? window.location.pathname
            : `${window.location.pathname}?category=${category}`;
        window.history.pushState({}, '', newUrl);
    });
});

// Initialize filter based on URL parameter
if (categoryParam) {
    filterWorks(categoryParam);
    updateActiveButton(categoryParam);
} else {
    filterWorks('all');
}

console.log('Works filter loaded ✨');
