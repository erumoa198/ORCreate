// YouTube Link Functionality
// Opens YouTube videos in new tab to avoid embed restrictions

// Get all elements with YouTube data (album cards and coverflow items)
const albumCards = document.querySelectorAll('.album-card[data-youtube], .coverflow-item[data-youtube]');

// Add click event to album cards with YouTube data
albumCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const videoId = card.getAttribute('data-youtube');
        if (videoId) {
            // Open directly in new tab to avoid embed restrictions (Error 153)
            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            window.open(youtubeUrl, '_blank');
        }
    });
});

console.log('YouTube links loaded ✨');
