document.addEventListener('DOMContentLoaded', () => {
    // Data for the entertainment content
    const entertainmentData = [
        { title: 'Beyond Earth', year: 2019, type: 'Movie', rating: 'PG', isBookmarked: false, isTrending: true, thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop' },
        { title: 'Bottom Gear', year: 2021, type: 'Movie', rating: 'PG', isBookmarked: false, isTrending: true, thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1470&auto=format&fit=crop' },
        { title: 'Undiscovered Cities', year: 2019, type: 'TV Series', rating: 'E', isBookmarked: false, isTrending: true, thumbnail: 'https://images.unsplash.com/photo-1752517497978-9c30910641af?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8' },
        { title: 'The Great Lands', year: 2021, type: 'Movie', rating: 'E', isBookmarked: true, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1470&auto=format&fit=crop' },
        { title: 'The Diary', year: 2019, type: 'TV Series', rating: 'PG', isBookmarked: false, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1374&auto=format&fit=crop' },
        { title: 'Earth’s Unlocked', year: 2017, type: 'Movie', rating: '18', isBookmarked: true, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1480&auto=format&fit=crop' },
        { title: 'No Land Beyond', year: 2019, type: 'Movie', rating: 'E', isBookmarked: false, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1470&auto=format&fit=crop' },
        { title: 'During the Hunt', year: 2016, type: 'TV Series', rating: 'PG', isBookmarked: false, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1503529368939-9d4285b5d848?q=80&w=1470&auto=format&fit=crop' },
        { title: 'Autosport the Series', year: 2016, type: 'TV Series', rating: '18', isBookmarked: false, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1470&auto=format&fit=crop' },
        { title: 'Same Answer II', year: 2017, type: 'Movie', rating: 'E', isBookmarked: false, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1470&auto=format&fit=crop' },
        { title: 'Below Echo', year: 2016, type: 'TV Series', rating: 'PG', isBookmarked: false, isTrending: false, thumbnail: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=1527&auto=format&fit=crop' },
    ];

    // DOM Elements
    const contentArea = document.getElementById('content-area');
    const searchInput = document.getElementById('search-input');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // App State
    let currentView = 'home';
    
    /**
     * Creates an HTML string for a single content card.
     * @param {object} item - The entertainment data object.
     * @returns {string} - The HTML string for the card.
     */
    const createCard = (item) => {
        const isTrendingCard = item.isTrending && currentView === 'home';
        const cardClass = isTrendingCard 
            ? 'trending-card relative shrink-0 w-60 h-36 md:w-[470px] md:h-[230px] rounded-lg flex flex-col justify-end p-4' 
            : 'card relative';
        const imgClass = isTrendingCard ? '' : 'rounded-lg mb-2';
        const imgHTML = isTrendingCard ? '' : `<img src="${item.thumbnail}" alt="${item.title}" class="${imgClass}" onerror="this.src='https://placehold.co/280x174/10141E/FFFFFF?text=No+Image';">`;
        const bgStyle = isTrendingCard ? `style="background-image: url('${item.thumbnail}')"` : '';

        return `
            <div class="${cardClass}" ${bgStyle} data-title="${item.title}">
                ${imgHTML}
                <div class="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 rounded-full p-2 cursor-pointer z-10 bookmark-btn">
                    <svg class="w-3 h-4" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="m10.518.75.399.399a.562.562 0 0 1 0 .796L6 6.793l-5.084-5.084a.562.562 0 0 1 0-.796L1.316.75a.562.562 0 0 1 .796 0L6 4.934 10.122.354a.562.562 0 0 1 .796 0Z" transform="translate(-.19 -.19)" fill="${item.isBookmarked ? 'white' : 'none'}" stroke="white" stroke-width="1.5"/></svg>
                </div>
                <div class="play-overlay absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg cursor-pointer">
                    <div class="flex items-center gap-4 bg-white/25 p-2 pr-5 rounded-full">
                        <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.713 0 0 6.713 0 15c0 8.288 6.713 15 15 15 8.288 0 15-6.712 15-15 0-8.287-6.712-15-15-15Zm-3 21V9l9 6-9 6Z" fill="#FFF"/></svg>
                        <span class="font-medium">Play</span>
                    </div>
                </div>
                <div class="relative z-5">
                    <div class="card-info flex items-center gap-2 text-xs md:text-sm font-light">
                        <span>${item.year}</span>
                        <span class="w-1 h-1 bg-white/50 rounded-full"></span>
                        <div class="flex items-center gap-1">
                            <svg class="w-3 h-3" width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M10.122.354.916 9.562l-1.414 1.414L10.122.354Z" fill="${item.type === 'Movie' ? '#FC4747' : '#5A698F'}" transform="translate(1 1)"/></svg>
                            <span>${item.type}</span>
                        </div>
                        <span class="w-1 h-1 bg-white/50 rounded-full"></span>
                        <span>${item.rating}</span>
                    </div>
                    <h3 class="text-base md:text-lg font-medium">${item.title}</h3>
                </div>
            </div>
        `;
    };
    
    /**
     * Renders content based on the current view and search filter.
     * @param {string} filter - The search query.
     * @param {string} view - The current view ('home', 'movies', 'tv', 'bookmarked').
     */
    const renderContent = (filter = '', view = 'home') => {
        let dataToRender = entertainmentData;
        let heading = '';
        
        // Filter by view
        if (view === 'movies') {
            dataToRender = entertainmentData.filter(item => item.type === 'Movie');
            heading = 'Movies';
        } else if (view === 'tv') {
            dataToRender = entertainmentData.filter(item => item.type === 'TV Series');
            heading = 'TV Series';
        } else if (view === 'bookmarked') {
            const bookmarkedMovies = entertainmentData.filter(item => item.isBookmarked && item.type === 'Movie');
            const bookmarkedTV = entertainmentData.filter(item => item.isBookmarked && item.type === 'TV Series');
            
            let bookmarkedMoviesHTML = '';
            if (bookmarkedMovies.length > 0) {
                bookmarkedMoviesHTML = `
                    <h2 class="text-2xl lg:text-3xl font-light mb-6">Bookmarked Movies</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
                        ${bookmarkedMovies.map(createCard).join('')}
                    </div>
                `;
            }

            let bookmarkedTVHTML = '';
             if (bookmarkedTV.length > 0) {
                bookmarkedTVHTML = `
                    <h2 class="text-2xl lg:text-3xl font-light mb-6">Bookmarked TV Series</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        ${bookmarkedTV.map(createCard).join('')}
                    </div>
                `;
            }
            contentArea.innerHTML = bookmarkedMoviesHTML + bookmarkedTVHTML;
            if (!bookmarkedMoviesHTML && !bookmarkedTVHTML) {
                 contentArea.innerHTML = `<h2 class="text-2xl lg:text-3xl font-light mb-6">No Bookmarks Yet</h2>`;
            }
            return;
        }

        // Filter by search query
        if (filter) {
            dataToRender = entertainmentData.filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));
            heading = `Found ${dataToRender.length} results for '${filter}'`;
        }

        // Generate HTML for the current view
        if (view === 'home' && !filter) {
            const trending = dataToRender.filter(item => item.isTrending);
            const recommended = dataToRender.filter(item => !item.isTrending);
            contentArea.innerHTML = `
                <h2 class="text-2xl lg:text-3xl font-light mb-6">Trending</h2>
                <div class="trending-container flex gap-4 md:gap-10 overflow-x-auto pb-4 mb-10">
                    ${trending.map(createCard).join('')}
                </div>
                <h2 class="text-2xl lg:text-3xl font-light mb-6">Recommended for you</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    ${recommended.map(createCard).join('')}
                </div>
            `;
        } else {
             contentArea.innerHTML = `
                <h2 class="text-2xl lg:text-3xl font-light mb-6">${heading}</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    ${dataToRender.map(createCard).join('')}
                </div>
            `;
        }
    };

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        renderContent(e.target.value, currentView);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentView = link.dataset.view;
            // Update active state for nav icons
            navLinks.forEach(l => l.querySelector('.nav-icon').classList.remove('active'));
            link.querySelector('.nav-icon').classList.add('active');
            searchInput.value = '';
            renderContent('', currentView);
        });
    });

    contentArea.addEventListener('click', (e) => {
        const bookmarkBtn = e.target.closest('.bookmark-btn');
        if (bookmarkBtn) {
            const card = bookmarkBtn.closest('[data-title]');
            const title = card.dataset.title;
            const item = entertainmentData.find(d => d.title === title);
            if (item) {
                item.isBookmarked = !item.isBookmarked;
                // Re-render the content to reflect the change
                renderContent(searchInput.value, currentView);
            }
        }
    });

    // Initial render on page load
    renderContent('', 'home');
});
