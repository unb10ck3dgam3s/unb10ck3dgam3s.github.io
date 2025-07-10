const gamesData = Array.from(document.querySelectorAll('.game-list .img-link')).map(link => ({
    name: link.querySelector('.img-hover-text').textContent.trim(),
    url: link.getAttribute('href'),
    img: link.querySelector('img').getAttribute('src'),
    alt: link.querySelector('img').getAttribute('alt')
}));

function showSearchResults() {
    const input = document.getElementById('gameSearchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
    if (!input) {
        results.style.display = 'none';
        return;
    }
    let filtered = gamesData.filter(game => game.name.toLowerCase().includes(input));
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (filtered.length === 0) {
        results.style.display = 'none';
        return;
    }
    filtered.forEach(game => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.innerHTML = `<a href="${game.url}"><img src="${game.img}" alt="${game.alt}" class="search-result-icon">${game.name}</a>`;
        results.appendChild(li);
    });
    results.style.display = 'block';
}

// --- Universal Game Progress Save/Load ---
// Usage: saveProgress({level: 2, score: 100});
//        const progress = loadProgress();
(function() {
  if (window.location.pathname.includes('/games/')) {
    const GAME_ID = window.location.pathname.split('/').pop().replace('.html', '');
    window.saveProgress = function(progress) {
      localStorage.setItem('progress-' + GAME_ID, JSON.stringify(progress));
    };
    window.loadProgress = function() {
      const data = localStorage.getItem('progress-' + GAME_ID);
      return data ? JSON.parse(data) : null;
    };
  }
})();