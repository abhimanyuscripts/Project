document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const themeSwitch = document.getElementById('theme-switch');
    const fontSelector = document.getElementById('font-selector');
    const body = document.body;

    // --- Theme and Font Handling ---
    const applyPreferences = () => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        const selectedFont = localStorage.getItem('font') || 'font-sans';
        
        themeSwitch.checked = isDarkMode;
        body.classList.toggle('dark-theme', isDarkMode);
        
        fontSelector.value = selectedFont;
        body.className = body.className.replace(/font-\w+/g, '').trim() + ` ${selectedFont}`;
    };

    themeSwitch.addEventListener('change', () => {
        body.classList.toggle('dark-theme', themeSwitch.checked);
        localStorage.setItem('darkMode', themeSwitch.checked);
    });

    fontSelector.addEventListener('change', (e) => {
        body.className = body.className.replace(/font-\w+/g, '').trim() + ` ${e.target.value}`;
        localStorage.setItem('font', e.target.value);
    });
    
    // --- API and Display Logic ---
    const displayError = (error) => {
        resultsContainer.innerHTML = `
            <div class="error">
                <h2>😕</h2>
                <h3>${error.title}</h3>
                <p>${error.message}</p>
            </div>
        `;
    };

    const playAudio = (audioUrl) => {
        if (audioUrl) {
            new Audio(audioUrl).play();
        }
    };

    const displayResults = (data) => {
        const entry = data[0];
        const phonetic = entry.phonetics.find(p => p.text && p.audio) || entry.phonetics.find(p => p.text);
        const audioUrl = phonetic ? phonetic.audio : null;

        let meaningsHtml = '';
        entry.meanings.forEach(meaning => {
            let definitionsHtml = '';
            meaning.definitions.forEach(def => {
                definitionsHtml += `<li>${def.definition}</li>`;
            });

            meaningsHtml += `
                <div class="part-of-speech">
                    <h2>${meaning.partOfSpeech}</h2>
                </div>
                <h3 class="meaning-header">Meaning</h3>
                <ul>${definitionsHtml}</ul>
                ${meaning.synonyms.length > 0 ? `
                    <div class="synonym-header">Synonyms</div>
                    <div class="synonyms">
                        ${meaning.synonyms.map(s => `<a href="#">${s}</a>`).join('')}
                    </div>
                ` : ''}
            `;
        });

        resultsContainer.innerHTML = `
            <div class="word-header">
                <div>
                    <h1>${entry.word}</h1>
                    <p class="phonetic">${phonetic ? phonetic.text : ''}</p>
                </div>
                ${audioUrl ? `
                    <button class="play-btn" onclick="playAudio('${audioUrl}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g fill="#A445ED" fill-rule="evenodd"><circle cx="37.5" cy="37.5" r="37.5" opacity=".25"/><path d="M29 27v21l21-10.5z"/></g></svg>
                    </button>
                ` : ''}
            </div>
            ${meaningsHtml}
            <div class="source">
                <span>Source</span>
                <a href="${entry.sourceUrls[0]}" target="_blank">${entry.sourceUrls[0]}</a>
            </div>
        `;
    };
    
    const searchWord = async (word) => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw errorData;
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            displayError(error);
        }
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const word = searchInput.value.trim();
        if (word) {
            searchWord(word);
        }
    });
    
    // Make the playAudio function globally accessible for the inline onclick
    window.playAudio = playAudio;

    // Apply saved preferences on load
    applyPreferences();
});